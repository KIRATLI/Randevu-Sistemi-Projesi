from django.db import models

class Profile(models.Model):
    user = models.OneToOneField('core.AbstractCustomUser', on_delete=models.CASCADE, related_name='profile')

    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=255, blank=True, default='')
    phone = models.CharField(max_length=15, blank=True, default='')
    birth_date = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True, default='')
    emergency_contact = models.CharField(max_length=15, blank=True, default='')
    enrollment_year = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"