from django.db import models

from core.utils.text_helpers import generate_schedule_text


# Schedule

class Schedule(models.Model):
    academician = models.OneToOneField('core.Academician', on_delete=models.CASCADE, related_name='schedule')

    slot_duration = models.PositiveIntegerField(default=30, help_text="Dakika cinsinden her randevu süresi")
    break_duration = models.PositiveIntegerField(default=15, help_text="Randevular arası mola süresi")
    max_appointments_per_day = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"{self.academician.username} - Genel Çalışma Planı"

    @property
    def summary_text(self):
        return generate_schedule_text(self)


# Working Slot

class WorkingSlot(models.Model):
    DAYS = (
        ('monday', 'Pazartesi'),
        ('tuesday', 'Salı'),
        ('wednesday', 'Çarşamba'),
        ('thursday', 'Perşembe'),
        ('friday', 'Cuma'),
        ('saturday', 'Cumartesi'),
        ('sunday', 'Pazar'),
    )

    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='working_hours')

    day = models.CharField(max_length=10, choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.day}: {self.start_time} - {self.end_time}"