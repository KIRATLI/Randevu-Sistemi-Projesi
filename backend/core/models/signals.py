from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from datetime import date, timedelta, datetime
from core.models import Availability, WorkingSlot
from datetime import datetime, time

def generate_availabilities_for_slot(slot, days_ahead=60):
    """Bir WorkingSlot için önümüzdeki X gün içindeki Availability'leri oluştur"""
    schedule = slot.schedule
    academician = schedule.academician

    today = date.today()

    # Gün adını rakama çevir (monday=0)
    DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    target_weekday = DAYS.index(slot.day)

    created = []
    for i in range(days_ahead):
        current_date = today + timedelta(days=i)
        if current_date.weekday() != target_weekday:
            continue

        # slot_duration adımlarıyla slotları üret
        slot_duration = schedule.slot_duration
        break_duration = schedule.break_duration

        start_time = None
        end_time = None
        if isinstance(slot.start_time, str):
            start_time = datetime.strptime(slot.start_time, '%H:%M').time()
        else:
            start_time = slot.start_time

        if isinstance(slot.end_time, str):
            end_time = datetime.strptime(slot.end_time, '%H:%M').time()
        else:
            end_time = slot.end_time

        current_time = datetime.combine(current_date, start_time)
        end_time = datetime.combine(current_date, end_time)
        step = timedelta(minutes=slot_duration + break_duration)

        while current_time + timedelta(minutes=slot_duration) <= end_time:
            # Zaten varsa oluşturma
            Availability.objects.get_or_create(
                academician=academician,
                date=current_date,
                start_time=current_time.time(),
                defaults={
                    'end_time': (current_time + timedelta(minutes=slot_duration)).time()
                }
            )
            current_time += step


@receiver(post_save, sender=WorkingSlot)
def on_working_slot_saved(sender, instance, **kwargs):
    today = date.today()
    academician = instance.schedule.academician

    if not instance.is_enabled:
        # 1. Randevusuz availability'leri sil
        Availability.objects.filter(
            academician=academician,
            date__gte=today,
            appointment__isnull=True
        ).delete()

        # 2. Randevusu olan availability'leri bul ve randevuları iptal et
        affected = Availability.objects.filter(
            academician=academician,
            date__gte=today,
            appointment__isnull=False
        )
        for av in affected:
            av.appointment.status = 'cancelled'
            av.appointment.save()
            # İsteğe bağlı: öğrenciye bildirim gönder
            # Notification.objects.create(
            #     user=av.appointment.student,
            #     message=f"Randevunuz iptal edildi: {av.date} {av.start_time}"
            # )
    else:
        generate_availabilities_for_slot(instance)


@receiver(post_delete, sender=WorkingSlot)
def on_working_slot_deleted(sender, instance, **kwargs):
    today = date.today()
    Availability.objects.filter(
        academician=instance.schedule.academician,
        date__gte=today,
        appointment__isnull=True
    ).delete()