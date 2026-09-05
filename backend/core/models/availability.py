from datetime import datetime
from django.utils import timezone
from django.db import models

class AvailabilityQuerySet(models.QuerySet):
    def available(self):
        return self.filter(appointment__isnull=True)

    def booked(self):
        return self.filter(appointment__isnull=False)

    def upcoming(self):
        return self.filter(date__gte=timezone.now().date())

    def past(self):
        return self.filter(date__lt=timezone.now().date())

    def for_teacher(self, teacher):
        return self.filter(academician=teacher)

    def available_upcoming(self):
        return self.available().filter(date__gte=timezone.now().date())

class AvailabilityManager(models.Manager):
    def get_queryset(self):
        return AvailabilityQuerySet(self.model, using=self._db)

    def available(self):
        return self.get_queryset().filter(appointment__isnull=True)
    
    def booked(self):
        return self.get_queryset().filter(appointment__isnull=False)
    
    def upcoming(self):
        return self.get_queryset().filter(date__gte=timezone.now().date())

    def past(self):
        return self.get_queryset().filter(date__lt=timezone.now().date())
    
    def for_teacher(self, teacher):
        return self.get_queryset().filter(academician=teacher)
    
    def available_upcoming(self):
        return self.get_queryset().available().filter(date__gte=timezone.now().date())

#===

# also known as 'slot'
class Availability(models.Model):
    DAYS = (
        ('monday', 'Pazartesi'),
        ('tuesday', 'Salı'),
        ('wednesday', 'Çarşamba'),
        ('thursday', 'Perşembe'),
        ('friday', 'Cuma'),
        ('saturday', 'Cumartesi'),
        ('sunday', 'Pazar')
    )

    academician = models.ForeignKey(
        'core.AbstractCustomUser',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'academician'}
        )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    
    objects = AvailabilityManager()

    def __str__(self):
        return f"{self.academician.get_full_name()} - {self.date} {self.start_time}"

    def get_duration_minutes(self):
        start = datetime.combine(self.date, self.start_time)
        end = datetime.combine(self.date, self.end_time)
        return int((end - start).total_seconds() / 60)
    
    def is_past(self):
        now = timezone.now()
        slot_datetime = datetime.combine(self.date, self.start_time)
        # make it aware of the timezone. (E.g., Istanbul 3:30 PM (UTC+3, the time zone))
        if timezone.is_naive(slot_datetime):
            slot_datetime = timezone.make_aware(slot_datetime)
        return slot_datetime < now

    @property
    def is_booked(self):
        # Check if this object has attribute 'appointment' because Appointment has a ForeignKey to an Availability
        return hasattr(self, 'appointment')
    
    def is_available(self):
        if self.is_past():
            return False

        return not self.is_booked

    def get_time_range(self):
        return f"{self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')}"
    
    class Meta:
        verbose_name="Musaitlik"
        verbose_name_plural="Musaitlikler"
        ordering = ['date', 'start_time']