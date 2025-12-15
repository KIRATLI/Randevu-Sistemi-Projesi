from datetime import datetime, timezone
from django.db import models

class AvailabilityManager(models.Manager):
    def available(self, date):
        return self.appointment_set.exclude(
            start_time__lte=date,
            end_time__gt=date
            )
    
    def booked(self, date):
        return self.appointment_set.filter(
            start_time__lte=date,
            end_time__gt=date
            )
    
    def upcoming(self):
        today = timezone.now().date()
        return self.filter(date__gte=today)

    def past(self):
        today = timezone.now().date()
        return self.filter(date__lt=today)
    
    def for_teacher(self, teacher):
        return self.filter(academician=teacher)
    
    def available_upcoming(self):
        return self.available().upcoming()

#===

# also known as 'slot'
class Availability(models.Model):
    # ForeignKey explanation:
    # Like a reference to another object
    # In Django: academician = models.ForeignKey(AbstractCustomUser) (stores reference to a user)
    # on_delete=models.CASCADE means: if teacher is deleted, delete their time slots too
    #
    # Foreign key also makes the AbstractCustomUser to get a appointment_set ({modelname_lowercase}_set)
    # or just change this by adding 'related_name="appointments"'
    # This is valid for OneToOneField as well.
    academician = models.ForeignKey(
        'core.AbstractCustomUser',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'academician'}
        )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    #is_booked = models.BooleanField(default=False)

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
        # make it aware of the timezone. (E.g. Istanbul 3:30 PM (UTC+3, the time zone))
        slot_datetime = timezone.make_aware(slot_datetime)
        return slot_datetime < now
    
    def is_available(self, date):
        if self.is_past():
            return False

        return not self.appointment_set.filter(
            start_time__lte=date,
            end_time__gt=date
            ).exists()
        #return not self.is_booked and not self.is_past()
    
    def get_time_range(self):
        return f"{self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')}"
    
    class Meta:
        verbose_name="Musaitlik"
        verbose_name_plural="Musaitlikler"
        ordering = ['date', 'start_time']