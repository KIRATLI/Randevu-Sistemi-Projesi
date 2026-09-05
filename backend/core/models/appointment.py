from datetime import datetime
from django.utils import timezone
from django.db import models
from .availability import Availability

# OneToOneField explanation:
# - Each appointment can only book ONE time slot
# - Each time slot can only have ONE appointment

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Bekliyor'),
        ('confirmed', 'Onaylandı'),
        ('rejected', 'Reddedildi'),
        ('canceled', 'İptal edildi'),
        ('completed', 'Tamamlandı')
    )

    # ForeignKey
    student = models.ForeignKey(
        'core.AbstractCustomUser',
        on_delete=models.CASCADE,
        related_name='student_appointments',
        limit_choices_to={'role': 'student'}
        )
    academician = models.ForeignKey(
        'core.AbstractCustomUser',
        on_delete=models.CASCADE,
        related_name='academician_appointments',
        limit_choices_to={'role': 'academician'}
    )
    availability = models.ForeignKey(
        Availability,
        on_delete=models.CASCADE
        )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    creation_date = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=255, blank=False, null=False)
    note_message = models.TextField(blank=True, null=True)
    #approved = models.BooleanField(default=False) for removal, use field 'status' instead
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', blank=True, null=True)



    def __str__(self):
        return f"Appointment: {self.student.first_name} -> {self.academician.first_name}"

    # def approve(self):
    #     self.approved = True
    #     self.save(update_fields=['approved'])
    #
    # def reject(self):
    #     self.approved = False
    #     self.save(update_fields=['approved'])

    # Status updates - start
    def confirm(self):
        self.status = 'confirmed'
        self.save(update_fields=['status'])

    def reject(self):
        self.status = 'rejected'
        self.save(update_fields=['status'])

    def cancel(self):
        self.status = 'canceled'
        self.save(update_fields=['status'])

    def complete(self):
        self.status = 'completed'
        self.save(update_fields=['status'])
    # Status updates - end

    def destroy(self):
        self.delete()

    def get_duration_minutes(self):
        start = datetime.combine(self.date, self.start_time)
        end = datetime.combine(self.date, self.end_time)
        return int((end - start).total_seconds() / 60)
    
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