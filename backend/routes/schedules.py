import calendar
import json
from datetime import datetime, timedelta, date

from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from core.models import AbstractCustomUser, Appointment
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
                "maxAppointmentsPerDay": 0
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
            "maxAppointmentsPerDay": schedule.max_appointments_per_day
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
        return api_error("date_str ve academician_id gereklidir.", "REQUIRED_FIELD_MISSING", status=400)

    # 1. Genel Ayarları Getir
    schedule = Schedule.objects.filter(academician_id=academician_id).first()
    if not schedule:
        return api_error("Program bulunamadı", "SCHEDULE_NOT_FOUND", status=404)

    # 2. Tarih ve Gün İsmi Tespiti
    target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    day_name = target_date.strftime("%A").lower() # monday, tuesday...

    # 3. O güne ait TÜM aktif çalışma bloklarını getir
    working_slots = WorkingSlot.objects.filter(
        schedule=schedule,
        day=day_name,
        is_enabled=True
    ).order_by('start_time')

    if not working_slots.exists():
        return api_success(data=[])

    # 4. Mevcut Randevuları ve Şimdiki Zamanı Çek
    existing_apps = Appointment.objects.filter(
        academician_id=academician_id,
        date=target_date,
        status__in=['pending', 'confirmed']
    ).values_list('start_time', flat=True)

    now = timezone.now()
    all_generated_slots = []

    # 5. Her Bir Blok İçin Slot Üret (Örn: Önce 09-12, sonra 15-18)
    slot_delta = timedelta(minutes=schedule.slot_duration)
    break_delta = timedelta(minutes=schedule.break_duration)
    total_step = slot_delta + break_delta

    for block in working_slots:
        current_time = datetime.combine(target_date, block.start_time)
        block_end = datetime.combine(target_date, block.end_time)

        # Blok içindeki her bir randevu dilimini hesapla
        while current_time + slot_delta <= block_end:
            slot_start_time = current_time.time()

            # Müsaitlik kuralları
            is_booked = slot_start_time in existing_apps
            is_past = current_time < now if target_date == now.date() else False

            all_generated_slots.append({
                "time": slot_start_time.strftime("%H:%M"),
                "available": not (is_booked or is_past)
            })

            # Adım at (Slot + Mola)
            current_time += total_step

    return api_success(data=all_generated_slots)


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

        # 1. Akademisyenin aktif mesai günlerini (pzt, salı vb.) bulalım
        # related_name='working_hours' demiştin modelde
        enabled_days = WorkingSlot.objects.filter(
            schedule__academician_id=academician_id,
            is_enabled=True
        ).values_list('day', flat=True).distinct()

        if not enabled_days:
            return api_success(data=[])

        # 2. O ayın günlerini iterate edelim
        available_dates = []
        today = timezone.now().date()

        # calendar.monthrange o ayın kaç gün çektiğini döner (örn: 28, 30, 31)
        _, num_days = calendar.monthrange(year, month)

        # 3. Ayın her günü için basit bir kontrol yapalım
        for day in range(1, num_days + 1):
            current_date = date(year, month, day)

            # Kural 1: Geçmiş tarihlerde randevu alınamaz
            if current_date < today:
                continue

            # Kural 2: Hocanın o gün mesaisi var mı?
            day_name = current_date.strftime("%A").lower() # monday, tuesday...
            if day_name not in enabled_days:
                continue

            # (Opsiyonel) Kural 3: O gün tamamen dolmuş mu?
            # Not: Bu kontrolü çok derin yaparsak (slot slot hesaplarsak) işlem yavaşlar.
            # Şimdilik sadece mesaisi olan ve gelecekteki günleri dönmek yeterlidir.
            # Frontend zaten güne tıklayınca /available-slots/ çağırıp boşluk yoksa uyarı verecektir.

            available_dates.append(current_date.strftime('%Y-%m-%dT%H:%M:%SZ'))

        return api_success(data=available_dates)

    except Exception as e:
        return api_error(f"Müsait tarihleri getirilirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)