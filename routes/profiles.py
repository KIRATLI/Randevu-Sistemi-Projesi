import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from core.models import AbstractCustomUser


@csrf_exempt
def profile_view(request):
    if request.method == "GET":
        return get_profile_view(request)
    elif request.method == "PUT":
        return update_profile_view(request)
    return JsonResponse({"success": False, "message": "Sadece GET ve PUT kabul edilir"}, status=405)


# Get profile

def get_profile_view(request):
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Sadece GET kabul edilir"}, status=405)

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

    return JsonResponse({"success": True, "data": data})


# Update profile (and user properties)

def update_profile_view(request):
    if request.method != "PUT":
        return JsonResponse({"success": False, "message": "Yalnızca PUT kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        user_id = data.get('userId')

        if not user_id:
            return JsonResponse({"success": False, "message": "userId gereklidir"}, status=400)

        # 1. Kullanıcıyı ve Profili getir
        user = get_object_or_404(AbstractCustomUser, id=user_id)
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
        return JsonResponse({
            "success": True,
            "message": "Profil başarıyla güncellendi",
            "data": {
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
            }
        })

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Güncelleme sırasında hata: {str(e)}"}, status=400)