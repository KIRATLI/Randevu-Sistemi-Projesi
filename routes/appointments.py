import json

from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from core.models import Appointment, Availability
from core.utils.decorators import token_required, role_required
from core.utils.response_helpers import api_error, api_success


# Appointments view (separating GET and POST)
@csrf_exempt
@token_required
def appointments_view(request):
    if request.method == "GET":
        return list_appointments_view(request)
    elif request.method == "POST":
        return create_appointment_view(request)
    return api_error("Yalnızca GET ve POST kabul edilir.", "METHOD_NOT_ALLOWED", status=405)

# Academician List

def list_appointments_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir.", "METHOD_NOT_ALLOWED", status=405)

    # Requester info
    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    # 1. Query Parametrelerini Al
    user_id = request.GET.get('userId')
    aca_id = request.GET.get('academicianId')
    status = request.GET.get('status')
    date = request.GET.get('date')

    # 2. Dinamik Filtreleme Sözlüğü Oluştur
    filters = {}

    # 2.1. Güvenlik ve Yetki Kontrolü
    if requester_role == 'admin':
        if user_id: filters['student_id'] = user_id
        if aca_id: filters['academician_id'] = aca_id
    elif requester_role == 'student':
        filters['student_id'] = requester_id
        if aca_id: filters['academician_id'] = aca_id
    elif requester_role == 'academician':
        filters['academician_id'] = requester_id
        if user_id: filters['student_id'] = user_id
    else:
        return api_error("Bilinmeyen rol erişimi engellendi.", "INVALID_ROLE", status=403)

    if status:
        filters['status'] = status
    if date:
        # Availability üzerinden tarihe ulaşıyoruz
        filters['availability__date'] = date

    # 3. Sorguyu Çalıştır (select_related kullanarak performansı artırıyoruz)
    appointments = Appointment.objects.filter(**filters).select_related('student', 'academician', 'availability')

    data = []
    for app in appointments:
        academician = app.academician

        data.append({
            "id": app.id,
            "studentId": app.student.id,
            "studentName": app.student.get_full_name() or app.student.username,
            "studentNo": app.student.number,
            "academicianId": academician.id,
            "academicianName": academician.get_full_name() or academician.username,
            "date": app.availability.date.strftime('%Y-%m-%d'),
            "time": app.availability.start_time.strftime('%H:%M'),
            "duration": app.availability.get_duration_minutes(),
            "status": app.status,
            "subject": app.subject,
            "notes": app.note_message,
            "createdAt": app.creation_date.strftime('%Y-%m-%dT%H:%M:%SZ')
        })

    return api_success(data)


# Appointment Details

@token_required
def appointment_detail_view(request, appointment_id):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir.", "METHOD_NOT_ALLOWED", status=405)

    # 1. Randevuyu bul, yoksa 404 dön
    # select_related kullanarak öğrenci, hoca ve slot verilerini tek seferde çekiyoruz
    app = get_object_or_404(
        Appointment.objects.select_related('student', 'academician', 'availability'),
        id=appointment_id
    )

    # 2. Yetki kontrolü
    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    if requester_role != 'admin':
        if requester_id != app.student_id and requester_id != app.academician_id:
            return api_error("Bu randevu detaylarını görme yetkiniz yok.", "PERMISSION_DENIED", status=403)

    academician = app.academician

    # 3. Response verisini hazırla
    data = {
        "id": app.id,
        "studentId": app.student.id,
        "studentName": app.student.get_full_name() or app.student.username,
        "academicianId": academician.id,
        "academicianName": academician.get_full_name() or academician.username,
        "date": app.availability.date.strftime('%Y-%m-%d'),
        "time": app.availability.start_time.strftime('%H:%M'),
        "duration": app.availability.get_duration_minutes(),
        "status": app.status,
        "statusLabel": app.status,
        "subject": app.subject,
        "notes": app.note_message,
        "createdAt": app.creation_date.strftime('%Y-%m-%dT%H:%M:%SZ')
    }

    return api_success(data)


# Create Appointment

def create_appointment_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir.", "METHOD_NOT_ALLOWED", status=405)

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
            return api_error("Seçilen hoca, gün ve saat için uygun müsaitlik bulunamadı", "SLOT_NOT_FOUND", status=404)

        # 3. Müsaitlik Kontrolü
        if not slot.is_available():
            return api_error("Maalesef bu randevu az önce doldu", "SLOT_OCCUPIED", status=400)

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

        return api_success(
            {
                "id": appointment.id,
                "status": appointment.status,
                "academicianId": aca_id,
                "date": req_date,
                "time": req_time,
                "subject": subject,
                "createdAt": appointment.creation_date.strftime('%Y-%m-%dT%H:%M:%SZ')
            },
            "Randevu talebi oluşturuldu",
            status=201
        )

    except Exception as e:
        return api_error(f"Randevu oluşturulurken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Approve Appointment (by Academician)

@csrf_exempt
@token_required
@role_required(['academician','admin'])
def approve_appointment_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir.", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        appointment_id = data.get('id')

        if not appointment_id:
            return api_error("id gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Randevuyu bul (select_related ile hocayı da çekebiliriz güvenlik kontrolü için)
        appointment = Appointment.objects.filter(id=appointment_id).first()

        if not appointment:
            return api_error("Randevu bulunamadı", "APPOINTMENT_NOT_FOUND", status=404)

        if appointment.academician != request.user:
            return api_error("Bu randevuyu onaylama yetkiniz yok", "APPOINTMENT_NO_PERMISSION", status=403)

        # 2. Durumu güncelle
        if appointment.status != 'pending':
            return api_success(message="Bu randevu onay beklemiyor")

        appointment.status = 'confirmed'
        appointment.save()

        return api_success(message="Randevu onaylandı")

    except Exception as e:
        return api_error(f"Randevu onaylanırken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Reject Appointment (by Academician)

@csrf_exempt
@token_required
@role_required(['academician','admin'])
def reject_appointment_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir.", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        appointment_id = data.get('id')
        reason = data.get('reason', "Gerekçe belirtilmedi")

        if not appointment_id:
            return api_error("id gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Randevuyu bul
        appointment = Appointment.objects.filter(id=appointment_id).first()

        if not appointment:
            return api_error("Randevu bulunamadı", "APPOINTMENT_NOT_FOUND", status=404)

        if appointment.academician != request.user:
            return api_error("Bu randevuyu reddetme yetkiniz yok", "APPOINTMENT_NO_PERMISSION", status=403)

        # 2. Durumu güncelle ve gerekçeyi notlara/reason alanına işle
        appointment.status = 'rejected'

        # Reddetme bilgisini notların başına ekleyelim ki kaybolmasın
        rejection_text = f"--- REDDEDİLDİ ---\nGerekçe: {reason}\n------------------\n"
        if appointment.note_message:
            appointment.note_message = rejection_text + appointment.note_message
        else:
            appointment.note_message = rejection_text

        appointment.save()

        return api_success(message="Randevu reddedildi")

    except Exception as e:
        return api_error(f"Randevu reddedilirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Cancel Appointment

@csrf_exempt
@token_required
@role_required(['academician', 'admin'])
def cancel_appointment_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir.", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        appointment_id = data.get('id')
        reason = data.get('reason', "İptal nedeni belirtilmedi")

        if not appointment_id:
            return api_error("id gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Randevuyu bul
        appointment = Appointment.objects.filter(id=appointment_id).first()

        if not appointment:
            return api_error("Randevu bulunamadı", "APPOINTMENT_NOT_FOUND", status=404)

        if appointment.academician != request.user:
            return api_error("Bu randevuyu iptal etme yetkiniz yok", "APPOINTMENT_NO_PERMISSION", status=403)

        # 2. Daha önce iptal edilmiş veya tamamlanmış mı kontrolü
        if appointment.status in ['cancelled', 'completed']:
            return api_error(f"Bu randevu zaten {appointment.get_status_display()}", "APPOINTMENT_IS_ARCHIVED", status=400)

        # 3. Durumu güncelle ve iptal nedenini işle
        appointment.status = 'cancelled'

        cancel_text = f"--- İPTAL EDİLDİ ---\nNeden: {reason}\n------------------\n"
        if appointment.note_message:
            appointment.note_message = cancel_text + appointment.note_message
        else:
            appointment.note_message = cancel_text

        appointment.save()

        return api_success(message="Randevu iptal edildi")

    except Exception as e:
        return api_error(f"Randevu iptal edilirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)
