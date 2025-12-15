from datetime import datetime, timezone
from django.db import models
from .availability import Availability

# OneToOneField explanation:
# - Each appointment can only book ONE time slot
# - Each time slot can only have ONE appointment

class Appointment(models.Model):
    # ForeignKey
    student = models.ForeignKey(
        'core.AbstractCustomUser',
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'student'}
        )
    availability = models.ForeignKey(
        Availability,
        on_delete=models.CASCADE
        )
    start_time = models.TimeField();
    end_time = models.TimeField();
    creation_date = models.DateTimeField(auto_now_add=True)
    note_message = models.TextField(blank=True, null=True)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Appointment: {self.student.first_name} -> {self.availability.academician.first_name}"

    def approve(self):
        self.approved = True
        self.save(update_fields=['approved'])
    
    def reject(self):
        self.approved = False
        self.save(update_fields=['approved'])
    
    def cancel(self):
        self.delete()
    
    def is_upcoming(self):
        return not self.availability.is_past()
    
    def get_teacher(self):
        return self.availability.academician
    
    def get_datetime(self):
        dt = datetime.combine(self.availability.date, self.availability.start_time)
        return timezone.make_aware(dt)
    
    class Meta:
        verbose_name = "Randevu"
        verbose_name_plural = "Randevular"
        ordering = ['-creation_date']