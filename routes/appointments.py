import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from core.models import Appointment, Availability

# Appointments view (separating GET and POST)
@csrf_exempt
def appointments_view(request):
    if request.method == "GET":
        return list_appointments_view(request)
    elif request.method == "POST":
        return create_appointment_view(request)
    return JsonResponse({"success": False, "message": "Sadece GET ve POST istekleri kabul edilir"}, status=405)

# Academician List

def list_appointments_view(request):
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Sadece GET kabul edilir"}, status=405)

    # 1. Query Parametrelerini Al
    user_id = request.GET.get('userId')
    aca_id = request.GET.get('academicianId')
    status = request.GET.get('status')
    date = request.GET.get('date')

    # 2. Dinamik Filtreleme Sözlüğü Oluştur
    filters = {}
    if user_id:
        filters['student_id'] = user_id
    if aca_id:
        filters['academician_id'] = aca_id
    if status:
        filters['status'] = status
    if date:
        # Availability üzerinden tarihe ulaşıyoruz
        filters['availability__date'] = date

    # 3. Sorguyu Çalıştır (select_related kullanarak performansı artırıyoruz)
    appointments = Appointment.objects.filter(**filters).select_related('student', 'academician', 'availability')

    data = []
    for app in appointments:
        data.append({
            "id": app.id,
            "studentId": app.student.id,
            "studentName": app.student.get_full_name() or app.student.username,
            "studentNo": app.student.number,
            "academicianId": app.availability.academician.id,
            "academicianName": app.availability.academician.get_full_name() or app.availability.academician.username,
            "date": app.availability.date.strftime('%Y-%m-%d'),
            "time": app.availability.start_time.strftime('%H:%M'),
            "duration": app.availability.get_duration_minutes(),
            "status": app.status,
            "subject": app.subject,
            "notes": app.note_message,
            "createdAt": app.creation_date.isoformat()
        })

    return JsonResponse({
        "success": True,
        "data": data
    })

# Appointment Details

def appointment_detail_view(request, appointment_id):
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Sadece GET kabul edilir"}, status=405)

    # 1. Randevuyu bul, yoksa 404 dön
    # select_related kullanarak öğrenci, hoca ve slot verilerini tek seferde çekiyoruz
    app = get_object_or_404(
        Appointment.objects.select_related('student', 'academician', 'availability'),
        id=appointment_id
    )

    # 2. Response verisini hazırla
    data = {
        "id": app.id,
        "studentId": app.student.id,
        "studentName": app.student.get_full_name() or app.student.username,
        "academicianId": app.availability.academician.id,
        "academicianName": app.availability.academician.get_full_name() or app.availability.academician.username,
        "date": app.availability.date.strftime('%Y-%m-%d'),
        "time": app.availability.start_time.strftime('%H:%M'),
        "duration": app.availability.get_duration_minutes(),
        "status": app.status,
        "statusLabel": app.status,
        "subject": app.subject,
        "notes": app.note_message,
        "createdAt": app.creation_date.isoformat()
    }

    return JsonResponse({
        "success": True,
        "data": data
    })

# Create Appointment

def create_appointment_view(request):
    # Bu metot sadece POST kabul eder
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Yalnızca POST kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)

        # 1. Gelen Verileri Al
        aca_id = data.get('academicianId')
        req_date = data.get('date')
        req_time = data.get('time')
        subject = data.get('subject')
        notes = data.get('notes', "")

        # 2. Uygun Slotu Bul
        slot = Availability.objects.filter(
            academician_id=aca_id,
            date=req_date,
            start_time=req_time
        ).first()

        if not slot:
            return JsonResponse({"success": False, "message": "Seçilen hoca, gün ve saat için uygun müsaitlik bulunamadı."}, status=404)

        # 3. Müsaitlik Kontrolü
        if not slot.is_available():
            return JsonResponse({"success": False, "message": "Maalesef bu randevu saati az önce doldu."}, status=400)

        # 4. Randevuyu Kaydet
        # NOT: request.user'ın dolu olması için login olunmuş olmalı.
        # Eğer test yapıyorsan request.user yerine geçici bir User objesi verebilirsin.
        appointment = Appointment.objects.create(
            student=request.user,
            academician_id=aca_id,
            availability=slot,
            subject=subject,
            notes=notes
        )

        return JsonResponse({
            "success": True,
            "message": "Randevu talebi oluşturuldu",
            "data": {
                "id": appointment.id,
                "status": appointment.status,
                "academicianId": aca_id,
                "date": req_date,
                "time": req_time,
                "subject": subject,
                "createdAt": appointment.creation_date.isoformat()
            }
        }, status=201)

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Bir hata oluştu: {str(e)}"}, status=400)


# Approve Appointment (by Academician)

@csrf_exempt
def approve_appointment_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Yalnızca POST kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        appointment_id = data.get('id')

        if not appointment_id:
            return JsonResponse({"success": False, "message": "Randevu ID'si gerekli"}, status=400)

        # 1. Randevuyu bul (select_related ile hocayı da çekebiliriz güvenlik kontrolü için)
        appointment = Appointment.objects.filter(id=appointment_id).first()

        if not appointment:
            return JsonResponse({"success": False, "message": "Randevu bulunamadı"}, status=404)

        if appointment.availability.academician != request.user:
            return JsonResponse({"success": False, "message": "Bu randevuyu onaylama yetkiniz yok"}, status=403)

        # 2. Durumu güncelle
        if appointment.status != 'pending':
            return JsonResponse({"success": True, "message": "Bu randevu onay beklemiyor"})

        appointment.status = 'confirmed'
        appointment.save()

        return JsonResponse({
            "success": True,
            "message": "Randevu onaylandı"
        })

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Hata: {str(e)}"}, status=400)


# Reject Appointment (by Academician)

@csrf_exempt
def reject_appointment_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Yalnızca POST kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        appointment_id = data.get('id')
        reason = data.get('reason', "Gerekçe belirtilmedi")

        if not appointment_id:
            return JsonResponse({"success": False, "message": "Randevu ID'si gerekli"}, status=400)

        # 1. Randevuyu bul
        appointment = Appointment.objects.filter(id=appointment_id).first()

        if not appointment:
            return JsonResponse({"success": False, "message": "Randevu bulunamadı"}, status=404)

        if appointment.availability.academician != request.user:
            return JsonResponse({"success": False, "message": "Bu randevuyu reddetme yetkiniz yok"}, status=403)

        # 2. Durumu güncelle ve gerekçeyi notlara/reason alanına işle
        appointment.status = 'rejected'

        # Reddetme bilgisini notların başına ekleyelim ki kaybolmasın
        rejection_text = f"--- REDDEDİLDİ ---\nGerekçe: {reason}\n------------------\n"
        if appointment.note_message:
            appointment.note_message = rejection_text + appointment.note_message
        else:
            appointment.note_message = rejection_text

        appointment.save()

        return JsonResponse({
            "success": True,
            "message": "Randevu reddedildi"
        })

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Hata: {str(e)}"}, status=400)


# Cancel Appointment

@csrf_exempt
def cancel_appointment_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Yalnızca POST kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        appointment_id = data.get('id')
        reason = data.get('reason', "İptal nedeni belirtilmedi")

        if not appointment_id:
            return JsonResponse({"success": False, "message": "Randevu ID'si gerekli"}, status=400)

        # 1. Randevuyu bul
        appointment = Appointment.objects.filter(id=appointment_id).first()

        if not appointment:
            return JsonResponse({"success": False, "message": "Randevu bulunamadı"}, status=404)

        if appointment.availability.academician != request.user:
            return JsonResponse({"success": False, "message": "Bu randevuyu iptal etme yetkiniz yok"}, status=403)

        # 2. Daha önce iptal edilmiş veya tamamlanmış mı kontrolü
        if appointment.status in ['cancelled', 'completed']:
            return JsonResponse({"success": False, "message": f"Bu randevu zaten {appointment.get_status_display()}"}, status=400)

        # 3. Durumu güncelle ve iptal nedenini işle
        appointment.status = 'cancelled'

        cancel_text = f"--- İPTAL EDİLDİ ---\nNeden: {reason}\n------------------\n"
        if appointment.note_message:
            appointment.note_message = cancel_text + appointment.note_message
        else:
            appointment.note_message = cancel_text

        appointment.save()

        return JsonResponse({
            "success": True,
            "message": "Randevu iptal edildi"
        })

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Hata: {str(e)}"}, status=400)