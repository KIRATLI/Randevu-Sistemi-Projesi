from django.db import models
from .user import CustomUser

class Availability(models.Model):
    # ForeignKey explanation:
    # Like a reference to another object
    # In Django: akademisyen = models.ForeignKey(CustomUser) (stores reference to a user)
    # on_delete=models.CASCADE means: if teacher is deleted, delete their time slots too
    academician = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'akademisyen'})
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.akademisyen.first_name} - {self.tarih} {self.baslangic}"