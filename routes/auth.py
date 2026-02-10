from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.contrib.auth import logout
from core.models.user import AbstractCustomUser
from core.security import create_access_token, create_refresh_token, verify_token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import re
from django.db import IntegrityError

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Sadece POST isteği kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({"success": False, "error": "E-posta ve şifre gereklidir"}, status=400)

        # 1. Kullanıcıyı e-posta adresine göre bul
        user = AbstractCustomUser.objects.filter(email=email).first()

        # 2. Kullanıcı var mı ve şifre doğru mu kontrol et
        # user.check_password() Django'nun hashli şifreleri kontrol eden güvenli fonksiyonudur
        if user is not None and user.check_password(password):
            
            if not user.is_active:
                return JsonResponse({"success": False, "error": "Bu hesap dondurulmuştur"}, status=403)

            # Token verilerini hazırla
            token_payload = {
                "id": user.id,
                "name": user.username,
                "email": user.email,
                "role": user.role
            }
            
            token = create_access_token(data=token_payload)
            refresh_token = create_refresh_token(data=token_payload)

            return JsonResponse({
                "success": True,
                "message": "Giriş başarılı",
                "token": token,
                "refreshToken": refresh_token,
                "user": {
                    "id": user.id,
                    "name": user.username,
                    "email": user.email,
                    "role": user.role
                }
            }, status=200)
        else:
            return JsonResponse({"success": False, "error": "E-posta veya şifre hatalı"}, status=401)

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)



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

@csrf_exempt
def register_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Sadece POST isteği kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        
        # 1. Temel Verileri Al
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')
        role = data.get('role')
        
        # 2. Şifre Eşleşme ve Güç Kontrolü
        if password != confirm_password:
            return JsonResponse({"success": False, "message": "Şifreler eşleşmiyor"}, status=400)
        
        if not is_password_strong(password):
            return JsonResponse({
                "success": False, 
                "message": "Şifre en az 8 karakter olmalı; büyük harf, küçük harf, rakam ve özel karakter içermelidir."
            }, status=400)

        # 3. Role Bazlı Zorunlu Alan Kontrolü
        student_no = data.get('studentNo')
        registration_no = data.get('registrationNo')

        if role == "student" and not student_no:
            return JsonResponse({"success": False, "message": "Öğrenci numarası zorunludur"}, status=400)
        
        if role == "academician" and not registration_no:
            return JsonResponse({"success": False, "message": "Sicil numarası zorunludur"}, status=400)

        # Use Python conditional expression instead of JavaScript ternary operator
        number = student_no if role == "student" else (registration_no if role == "academician" else "admin")

        # 4. Kullanıcı Oluşturma
        # Django'da create_user şifreyi otomatik hashler
        AbstractCustomUser.objects.create_user(
            username=email, # E-postayı kullanıcı adı olarak kullanıyoruz
            email=email,
            password=password,
            first_name=name,
            role=role,
            number=number,
            department=data.get('department'),
            faculty=data.get('faculty')
        )

        return JsonResponse({
            "success": True,
            "message": "Kayıt başarılı"
        }, status=201)

    except IntegrityError:
        return JsonResponse({"success": False, "message": "Bu e-posta adresi zaten kayıtlı"}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=400)


# Logout

@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Sadece POST isteği kabul edilir"}, status=405)

    try:
        # 1. Django'nun kendi logout fonksiyonunu çağırıyoruz.
        # Bu, eğer varsa sunucu tarafındaki session'ı temizler.
        logout(request)

        # NOT: Eğer Refresh Token Blacklist sistemi kullanıyorsan 
        # burada token'ı kara listeye alma işlemi yapılır. 
        # Şimdilik temel yapıyı kuruyoruz.

        return JsonResponse({
            "success": True,
            "message": "Başarıyla çıkış yapıldı"
        }, status=200)

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


# Forgot password and Reset password

# 1. Şifremi Unuttum (E-posta Gönderme)
@csrf_exempt
def forgot_password_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Sadece POST isteği kabul edilir"}, status=405)

    data = json.loads(request.body)
    email = data.get('email')
    user = AbstractCustomUser.objects.filter(email=email).first()

    if user:
        # Güvenli bir token ve kullanıcı ID'si oluşturuyoruz
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Frontend linkini hazırla (Frontend adresine göre ayarla)
        reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"

        send_mail(
            'Şifre Sıfırlama Talebi - Ankara Üniversitesi',
            f'Şifrenizi sıfırlamak için şu linke tıklayın: {reset_url}',
            'noreply@ankara.edu.tr',
            [email],
            fail_silently=False,
        )

    # Güvenlik gereği kullanıcı yoksa bile "Gönderildi" diyoruz
    # (E-posta adreslerinin ifşa olmaması için)
    return JsonResponse({"success": True, "message": "Eğer hesap mevcutsa sıfırlama linki gönderildi."})

# 2. Yeni Şifreyi Kaydetme
@csrf_exempt
def reset_password_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Sadece POST isteği kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        uid = data.get('uid')
        token = data.get('token')
        new_password = data.get('newPassword')

        # ID'yi geri çözüyoruz
        user_id = urlsafe_base64_decode(uid).decode()
        user = AbstractCustomUser.objects.get(pk=user_id)

        # Token hala geçerli mi? (Django bunu otomatik kontrol eder)
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return JsonResponse({"success": True, "message": "Şifreniz başarıyla güncellendi."})
        else:
            return JsonResponse({"success": False, "message": "Geçersiz veya süresi dolmuş link."}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "message": "Bir hata oluştu. " + str(e)}, status=400)


# Refresh token

@csrf_exempt
def refresh_token_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "error": "Sadece POST isteği kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        refresh_token = data.get('refreshToken')

        if not refresh_token:
            return JsonResponse({"success": False, "message": "Refresh token gerekli"}, status=400)

        # 1. Token'ı doğrula
        payload = verify_token(refresh_token)
        
        # 2. Token geçersizse veya tipi "refresh" değilse hata dön
        if payload is None or payload.get("type") != "refresh":
            return JsonResponse({"success": False, "message": "Geçersiz veya süresi dolmuş refresh token"}, status=401)

        # 3. Payload içindeki verilerle yeni bir Access Token üret
        # Sadece gerekli verileri alıyoruz (user_id, email vb.)
        new_payload = {
            "id": payload.get("id"),
            "email": payload.get("email"),
            "role": payload.get("role")
        }
        
        new_access_token = create_access_token(data=new_payload)

        return JsonResponse({
            "success": True,
            "accessToken": new_access_token,
            "message": "Token yenilendi"
        }, status=200)

    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)