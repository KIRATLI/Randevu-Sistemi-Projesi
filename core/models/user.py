from django.db import models
from django.contrib.auth.models import AbstractUser

# Later separate to 2 objects; academician and student
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('academician', 'Akademisyen'),
        ('student', 'Öğrenci'),
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='student')
    number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    title = models.CharField(max_length=50, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"