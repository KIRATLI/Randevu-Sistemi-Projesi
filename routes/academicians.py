from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from core.models import Availability, Academician


# Academician List

def list_academicians_view(request):
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Yalnızca GET kabul edilir"}, status=405)

    # 1. Sadece akademisyen olan kullanıcıları filtrele
    academicians = Academician.objects.all()

    data = []
    for aca in academicians:
        # Basit bir "müsaitlik" kontrolü (Gelecekte boş slotu var mı?)
        has_availability = Availability.objects.for_teacher(aca).available_upcoming().exists()

        data.append({
            "id": aca.id,
            "name": aca.get_full_name() or aca.username,
            "department": aca.department,
            "faculty": aca.faculty,
            "office": aca.office,
            "available": has_availability
        })

    return JsonResponse({
        "success": True,
        "data": data
    }, safe=False)


# Academician Details

def academician_detail_view(request, aca_id): # URL'den gelen 'id' burada parametre olarak alınır
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Sadece GET kabul edilir"}, status=405)

    # 1. Akademisyeni bul, yoksa 404 döndür
    aca = get_object_or_404(Academician, id=aca_id)

    # 2. ManyToMany olan uzmanlık alanlarını bir liste olarak alalım
    # values_list('name', flat=True) bize sadece isimlerden oluşan bir liste ['AI', 'ML'] döner
    specs = list(aca.specializations.all().values_list('name', flat=True))

    # 3. Müsaitlik kontrolü (Manager metodunla)
    has_availability = Availability.objects.for_teacher(aca).available_upcoming().exists()

    # 4. JSON Formatını oluştur
    data = {
        "id": aca.id,
        "name": aca.get_full_name() if aca.get_full_name() else aca.username,
        "email": aca.email,
        "title": aca.title,
        "department": aca.department,
        "faculty": aca.faculty,
        "office": aca.office,
        "phone": aca.profile.phone,
        "bio": aca.profile.bio,
        "specializations": specs,
        "available": has_availability
    }

    return JsonResponse({
        "success": True,
        "data": data
    })