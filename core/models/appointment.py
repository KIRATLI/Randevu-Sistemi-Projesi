from django.db import models
from .user import CustomUser
from .availability import Availability

class Appointment(models.Model):
    # ForeignKey
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    # OneToOneField explanation:
    # - Each appointment can only book ONE time slot
    # - Each time slot can only have ONE appointment
    availability = models.OneToOneField(Availability, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    note_message = models.TextField(blank=True, null=True)
    approved = models.BooleanField(default=True)

    def __str__(self):
        return f"Appointment: {self.student.first_name} -> {self.availability.academician.first_name}"