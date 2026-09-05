import calendar
import json
import traceback
from datetime import datetime, timezone, timedelta, date

from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from core.models import AbstractCustomUser, Appointment, Availability
from core.models.schedule import Schedule, WorkingSlot
from core.utils.decorators import token_required
from core.utils.response_helpers import api_error, api_success


# Schedule

@csrf_exempt
@token_required
def schedule_view(request):
    if request.method == "GET":
        return get_schedule_view(request)
    elif request.method == "POST":
        return update_schedule_view(request)
    return api_error("Yalnızca GET ve POST kabul edilir.", "METHOD_NOT_ALLOWED", status=405)


# Get schedule

def get_schedule_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    academician_id = request.GET.get('academicianId')
    if not academician_id:
        return api_error("academicianId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

    # 1. Akademisyeni getir
    academician = get_object_or_404(AbstractCustomUser, id=academician_id, role='academician')

    # 2. Akademisyene ait Schedule ayarlarını getir
    # Eğer henüz ayar yapmamışsa hata yerine boş bir şablon dönebiliriz
    schedule = Schedule.objects.filter(academician=academician).first()

    if not schedule:
        return api_success(
            {
                "workingHours": [],
                "slotDuration": 30,
                "breakDuration": 0,
                "maxAppointmentsPerDay": 0,
                "summary_text": ""
            },
            "Program başarıyla görüntülendi"
        )

    # 3. Günlük çalışma saatlerini listele
    working_hours_qs = WorkingSlot.objects.filter(schedule=schedule).order_by('id')
    working_hours_list = []

    for wh in working_hours_qs:
        working_hours_list.append({
            "day": wh.day,        # 'monday', 'tuesday' vb.
            "enabled": wh.is_enabled,
            "start": wh.start_time.strftime("%H:%M") if wh.start_time else "??:??",
            "end": wh.end_time.strftime("%H:%M") if wh.end_time else "??:??"
        })

    return api_success(
        {
            "workingHours": working_hours_list,
            "slotDuration": schedule.slot_duration,
            "breakDuration": schedule.break_duration,
            "maxAppointmentsPerDay": schedule.max_appointments_per_day,
            "summary_text": schedule.summary_text
        },
        "Program başarıyla görüntülendi"
    )


# Update schedule

def update_schedule_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        data = json.loads(request.body)
        academician_id = data.get('academicianId')

        if not academician_id:
            return api_error("academicianId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        if str(academician_id) != str(requester_id) and requester_role != 'admin':
            return api_error("Programı güncellemek için yetkiniz yok", "SCHEDULE_PERMISSION_DENIED", status=403)

        # 1. Akademisyeni doğrula
        academician = get_object_or_404(AbstractCustomUser, id=academician_id, role='academician')

        # 2. Genel Schedule ayarlarını güncelle veya oluştur
        schedule, created = Schedule.objects.update_or_create(
            academician=academician,
            defaults={
                'slot_duration': data.get('slotDuration', 30),
                'break_duration': data.get('breakDuration', 15),
                'max_appointments_per_day': data.get('maxAppointmentsPerDay', 10)
            }
        )

        # 3. Günlük Çalışma Saatlerini İşle
        working_hours_data = data.get('workingHours', [])
        for wh_item in working_hours_data:
            # String zamanı Python time objesine çevirelim (Örn: "09:00" -> time(9,0))
            start_time = datetime.strptime(wh_item['start'], "%H:%M").time() if wh_item.get('start') else None
            end_time = datetime.strptime(wh_item['end'], "%H:%M").time() if wh_item.get('end') else None

            WorkingSlot.objects.update_or_create(
                schedule=schedule,
                day=wh_item['day'].lower(), # 'monday', 'tuesday' vb.
                defaults={
                    'enabled': wh_item.get('enabled', False),
                    'start_time': start_time,
                    'end_time': end_time
                }
            )

        return api_success(message="Program ayarları başarıyla güncellendi")

    except Exception as e:
        return api_error(f"Program güncellenirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Available slots on a day

@token_required
def get_available_slots_view(request):
    date_str = request.GET.get('date')
    academician_id = request.GET.get('academicianId')

    if not all([date_str, academician_id]):
        return api_error("date ve academician_id gereklidir.", "REQUIRED_FIELD_MISSING", status=400)

    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()

        slots = Availability.objects.filter(
            academician_id=academician_id,
            date=target_date,
            appointment__isnull=True,
            date__gte=date.today()
        ).order_by('start_time')

        now_naive = now_naive = datetime.now(timezone(timedelta(hours=3))).replace(tzinfo=None)
        if target_date == date.today():
            slots = [s for s in slots if datetime.combine(
                target_date, s.start_time
            ) > now_naive]

        print(f"now_naive: {now_naive}")
        print(f"target_date: {target_date}, today: {date.today()}")
        print(f"tarih eşit mi: {target_date == date.today()}")

        data = [{
            "id": slot.id,
            "time": slot.start_time.strftime("%H:%M"),
            "available": True
        } for slot in slots]

        return api_success(data=data)

    except Exception as e:
        traceback.print_exc()
        return api_error(f"Müsait slotlar getirilirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Available dates

@token_required
def get_available_dates_view(request):
    academician_id = request.GET.get('academicianId')
    month = request.GET.get('month') # 1-12
    year = request.GET.get('year')   # YYYY

    if not all([academician_id, month, year]):
        return api_error("academicianId, month ve year gereklidir.", "REQUIRED_FIELD_MISSING", status=400)

    try:
        month = int(month)
        year = int(year)

        dates = Availability.objects.filter(
            academician_id=academician_id,
            date__month=month,
            date__year=year,
            appointment__isnull=True,       # randevusuz
            date__gte=date.today()          # geçmemiş
        ).values_list('date', flat=True).distinct()

        return api_success(data=[d.isoformat() for d in dates])

    except Exception as e:
        return api_error(f"Müsait tarihler getirilirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)