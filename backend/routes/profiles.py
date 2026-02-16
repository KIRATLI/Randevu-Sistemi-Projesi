import json

from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from backend.core.models import AbstractCustomUser
from backend.core.utils.decorators import token_required
from backend.core.utils.response_helpers import api_error, api_success


@csrf_exempt
@token_required
def profile_view(request):
    if request.method == "GET":
        return get_profile_view(request)
    elif request.method == "PUT":
        return update_profile_view(request)
    return api_error("Yalnızca GET ve PUT kabul edilir", "METHOD_NOT_ALLOWED", status=405)


# Get profile

def get_profile_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    user_id = request.GET.get('userId')
    # select_related ile profile ve academician bilgilerini tek seferde çekmeye çalışıyoruz
    user = get_object_or_404(AbstractCustomUser, id=user_id)
    profile = user.profile # Profile her zaman var (Signals ile oluşturduğumuzu varsayıyoruz)

    # Her iki rol için ortak veriler
    data = {
        "id": profile.id,
        "userId": user.id,
        "name": user.get_full_name() or user.username,
        "email": user.email,
        "role": user.role,
        "department": user.department,
        "faculty": user.faculty,
        "phone": profile.phone,
        "avatar": profile.avatar.url if profile.avatar else None,
        "bio": profile.bio,
    }

    # Akademisyen özel verileri
    # hasattr kontrolü ile 'academician' linkinin var olup olmadığını güvenle kontrol ediyoruz
    if user.role == 'academician' and hasattr(user, 'academician'):
        aca = user.academician

        # Schedule üzerinden summary_text çekme
        office_hours_text = "Henüz tanımlanmadı"
        if hasattr(aca, 'schedule'):
            office_hours_text = aca.schedule.summary_text

        data.update({
            "title": aca.title,
            "registrationNo": user.number,
            "office": aca.office,
            "officeHours": office_hours_text, # Dinamik generate ettiğimiz metin!
            "specializations": list(aca.specializations.all().values_list('name', flat=True))
        })

    # Öğrenci özel verileri
    elif user.role == 'student':
        data.update({
            "studentNo": user.number,
            "enrollmentYear": getattr(profile, 'enrollment_year', None),
            "birthDate": profile.birth_date,
            "address": profile.address,
            "emergencyContact": getattr(profile, 'emergency_contact', None),
        })

    return api_success(data)


# Update profile (and user properties)

def update_profile_view(request):
    if request.method != "PUT":
        return api_error("Yalnızca PUT kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        data = json.loads(request.body)
        target_user_id = data.get('userId')
        # if not user_id:
        #     return api_error("userId gerekli", "REQUIRED_FIELD_MISSING", status=400)

        if str(target_user_id) != str(requester_id) and requester_role != 'admin':
            return api_error("Bu profili güncellemek için yetkiniz yok", "PROFILE_PERMISSION_DENIED", status=403)

        # 1. Kullanıcıyı ve Profili getir
        user = get_object_or_404(AbstractCustomUser, id=target_user_id)
        profile = user.profile

        # 2. User tablosundaki 'name' (isim-soyisim) güncelleme
        name = data.get('name')
        if name:
            parts = name.split(' ', 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ""
            user.save()

        # 3. Profile tablosundaki alanları güncelle (gelen varsa güncelle, yoksa eskiyi tut)
        profile.avatar = data.get('avatar', profile.avatar)
        profile.phone = data.get('phone', profile.phone)
        profile.bio = data.get('bio', profile.bio)
        profile.birth_date = data.get('birthDate', profile.birth_date)
        profile.emergency_contact = data.get('emergencyContact', profile.emergency_contact)
        profile.address = data.get('address', profile.address)

        profile.save()

        # 4. Güncel veriyi döndür (Response formatına uygun)
        return api_success(
            {
                "id": profile.id,
                "userId": user.id,
                "name": user.get_full_name() or user.username,
                "email": user.email,
                "role": user.role,
                "phone": profile.phone,
                "bio": profile.bio,
                "address": profile.address,
                "department": user.department,
                "faculty": user.faculty
            },
            "Profile başarıyla güncellendi"
        )

    except Exception as e:
        return api_error(f"Profil güncellenirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Upload avatar

@csrf_exempt
@token_required
def upload_avatar_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        # FormData'dan gelen userId ve file'ı alıyoruz
        target_user_id = request.POST.get('userId')
        avatar_file = request.FILES.get('file')

        if not avatar_file:
            return api_error("dosya gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        if str(target_user_id) != str(requester_id) and requester_role != 'admin':
            return api_error("Avatar yüklemek için yetkiniz yok", "PROFILE_PERMISSION_DENIED", status=403)

        # Dosya tipi kontrolü
        allowed_types = ['image/jpeg', 'image/png', 'image/gif']
        if avatar_file.content_type not in allowed_types:
            return api_error("Sadece JPEG, PNG ve GIF formatları kabul edilir.", "INVALID_FILE_TYPE", status=400)

        # Dosya boyutu kontrolü
        max_size = 5 * 1024 * 1024
        if avatar_file.size > max_size:
            return api_error("Dosya boyutu çok büyük. Maksimum limit: 5MB", "FILE_TOO_LARGE", status=400)

        # 1. Kullanıcıyı ve Profili bul
        user = get_object_or_404(AbstractCustomUser, id=target_user_id)
        profile = user.profile

        # 2. Eski Dosyayı Sil (Eğer bulunuyorsa)
        if profile.avatar:
            profile.avatar.delete(save=False)

        # 3. Dosyayı kaydet
        profile.avatar = avatar_file
        profile.save()

        # 4. Full URL'i oluştur
        # request.build_absolute_uri() kullanarak tam adresi (http://...) döndürebiliriz
        avatar_url = request.build_absolute_uri(profile.avatar.url)

        return api_success(message="Profil fotoğrafı güncellendi", avatarUrl=avatar_url)

    except Exception as e:
        return api_error(f"Profil avatarı yüklenirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Change password

@csrf_exempt
@token_required
def change_password_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        data = json.loads(request.body)
        user_id = data.get('userId')
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')

        # Gerekli alanların kontrolü
        if not all([old_password, new_password]):
            return api_error("oldPassword ve newPassword gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        if str(requester_id) != str(user_id) and requester_role != 'admin':
            return api_error("Bu işlemi yapmak için yetkiniz yok", "PROFILE_PERMISSION_DENIED", status=403)

        # 1. Kullanıcıyı getir
        user = get_object_or_404(AbstractCustomUser, id=user_id)

        # 2. Eski şifreyi doğrula
        # Django'nun check_password metodu hashlenmiş şifre ile düz metni karşılaştırır
        if not user.check_password(old_password):
            return api_error("Mevcut şifre hatalı", "WRONG_PASSWORD", status=400)

        # 3. Yeni şifreyi belirle ve kaydet
        # set_password şifreyi otomatik olarak hashler
        user.set_password(new_password)
        user.save()

        return api_success(message="Şifre başarıyla değiştirildi")

    except Exception as e:
        return api_error(f"Şifre değiştirilirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)