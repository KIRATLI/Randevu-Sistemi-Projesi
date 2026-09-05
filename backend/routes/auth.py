from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import logout
from django_ratelimit.decorators import ratelimit

from core.models.user import AbstractCustomUser
from core.security import create_access_token, create_refresh_token, verify_token
from django.views.decorators.csrf import csrf_exempt
import json
import re
from django.db import IntegrityError

from core.utils.email_service import send_templated_email
from core.utils.response_helpers import api_error, api_success


@csrf_exempt
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
def login_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        #role = data.get('role')

        if not email or not password:
            return api_error("email ve password gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Kullanıcıyı e-posta adresine göre bul
        user = AbstractCustomUser.objects.filter(email=email).first()

        # 2. Kullanıcı var mı ve şifre doğru mu kontrol et
        # user.check_password() Django'nun hashli şifreleri kontrol eden güvenli fonksiyonudur
        if user is not None and user.check_password(password):
            
            if not user.is_active:
                return api_error("Bu hesap dondurulmuş", "USER_INACTIVE", status=403)

            # Token verilerini hazırla
            token_payload = {
                "id": user.id,
                "name": user.username,
                "email": user.email,
                "role": user.role
            }
            
            token = create_access_token(data=token_payload)
            refresh_token = create_refresh_token(data=token_payload)


            return api_success(
                message="Giriş başarılı",
                token=token,
                refreshToken=refresh_token,
                user={
                    "id": user.id,
                    "name": user.username,
                    "email": user.email,
                    "role": user.role
                })
        else:
            return api_error("E posta veya şifre hatalı", "INVALID_CREDENTIALS", status=401)

    except Exception as e:
        return api_error(f"Giriş yapılırken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)



# Register

# Şifre karmaşıklık kontrolü için yardımcı fonksiyon
def is_password_strong(password):
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password): # En az bir büyük harf
        return False
    if not re.search(r"[a-z]", password): # En az bir küçük harf
        return False
    if not re.search(r"\d", password):    # En az bir rakam
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password): # En az bir özel karakter
        return False
    return True

def is_email_valid(email):
    try:
        validate_email(email)
        return email.endswith("@ankara.edu.tr")
    except ValidationError:
        return False

@csrf_exempt
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
def register_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        
        # 1. Temel Verileri Al
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')
        role = data.get('role')
        student_no = data.get('studentNo')
        registration_no = data.get('registrationNo')
        department = data.get('department')
        faculty = data.get('faculty')

        if not all([name, email, password, confirm_password, role]):
            return api_error("name, email, password, confirmPassword ve role gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 2. Email Kontrolü
        if not is_email_valid(email):
            return api_error("Geçersiz e-posta adresi", "INVALID_EMAIL", status=400)
        
        # 2. Şifre Eşleşme ve Güç Kontrolü
        if password != confirm_password:
            return api_error("Şifreler eşleşmiyor", "PASSWORDS_NOT_MATCHING", status=400)

        if not is_password_strong(password):
            return api_error("Şifre en az 8 karakter olmalı; büyük harf, küçük harf, rakam ve özel karakter içermelidir.", "PASSWORD_TOO_WEAK", status=400)

        #3. Rol Bazlı Zorunlu Fieldlar
        if role == "student" and not student_no:
            return api_error("studentNo gereklidir", "REQUIRED_FIELD_MISSING", status=400)
        if role == "academician" and not registration_no:
            return api_error("registrationNo gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # Use Python conditional expression instead of JavaScript ternary operator
        number = student_no if role == "student" else (registration_no if role == "academician" else "admin")

        # 4. Kullanıcı Oluşturma
        # Django'da create_user şifreyi otomatik hashler
        user = AbstractCustomUser.objects.create_user(
            username=email, # E-postayı kullanıcı adı olarak kullanıyoruz
            email=email,
            password=password,
            first_name=name,
            role=role,
            number=number,
            department=department,
            faculty=faculty
        )

        context = {
            'user_name': user.get_full_name() or user.username,
            'user_role': user.get_role_display(), # 'Öğrenci', 'Akademisyen' gibi okunabilir hali
            'email': user.email,
            'login_url': "https://randevu.ankara.edu.tr/login", # Örnek frontend linki
            'support_email': "destek@ankara.edu.tr"
        }
        send_templated_email('welcome', user.email, context)

        return api_success(message="Kayıt başarılı", status=201)

    except IntegrityError:
        return api_error("Bu e-posta adresi zaten kayıtlı", "EMAIL_ALREADY_IN_USE", status=400)
    except Exception as e:
        return api_error(f"Kayıt olunurken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Logout

@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        # 1. Django'nun kendi logout fonksiyonunu çağırıyoruz.
        # Bu, eğer varsa sunucu tarafındaki session'ı temizler.
        logout(request)

        # NOT: Eğer Refresh Token Blacklist sistemi kullanıyorsan 
        # burada token'ı kara listeye alma işlemi yapılır. 
        # Şimdilik temel yapıyı kuruyoruz.

        return api_success(message="Başarıyla çıkış yapıldı.")

    except Exception as e:
        return api_error(f"Çıkış yapılırken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Forgot password and Reset password

# 1. Şifremi Unuttum (E-posta Gönderme)
@csrf_exempt
def forgot_password_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    data = json.loads(request.body)
    email = data.get('email')

    if not email:
        return api_error("email gereklidir", "REQUIRED_FIELD_MISSING", status=400)

    user = AbstractCustomUser.objects.filter(email=email).first()

    if user:
        # Güvenli bir token ve kullanıcı ID'si oluşturuyoruz
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Frontend linkini hazırla (Frontend adresine göre ayarla)
        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"

        context = {
            'user_name': user.get_full_name(),
            'reset_link': reset_link
        }
        send_templated_email('password-reset', email, context)

    # Güvenlik gereği kullanıcı yoksa bile "Gönderildi" diyoruz
    # (E-posta adreslerinin ifşa olmaması için)
    return api_success(message="Eğer hesap mevcutsa sıfırlama linki gönderildi")

# 2. Yeni Şifreyi Kaydetme
@csrf_exempt
def reset_password_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        uid = data.get('uid')
        token = data.get('token')
        new_password = data.get('newPassword')

        if not all([uid, token, new_password]):
            return api_error("uid, token ve newPassword gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # ID'yi geri çözüyoruz
        user_id = urlsafe_base64_decode(uid).decode()
        user = AbstractCustomUser.objects.get(pk=user_id)

        # Token hala geçerli mi? (Django bunu otomatik kontrol eder)
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return api_success(message="Şifreniz başarıyla güncellendi")
        else:
            return api_error("Geçersiz veya süresi dolmuş link.", "INVALID_TOKEN", status=400)
    except Exception as e:
        return api_error(f"Şifre sıfırlanırken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Refresh token

@csrf_exempt
def refresh_token_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        refresh_token = data.get('refreshToken')

        if not refresh_token:
            return api_error("refreshToken gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Token'ı doğrula
        payload = verify_token(refresh_token)
        
        # 2. Token geçersizse veya tipi "refresh" değilse hata dön
        if payload is None or payload.get("type") != "refresh":
            return api_error("Geçersiz veya süresi dolmuş refresh token", "INVALID_TOKEN", status=401)

        # 3. Payload içindeki verilerle yeni bir Access Token üret
        # Sadece gerekli verileri alıyoruz (user_id, email vb.)
        new_payload = {
            "id": payload.get("id"),
            "email": payload.get("email"),
            "role": payload.get("role")
        }
        
        new_access_token = create_access_token(data=new_payload)

        return api_success(message="Token yenilendi", accessToken=new_access_token)

    except Exception as e:
        return api_error(f"Token yenilenirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)
