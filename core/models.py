# Separated models into their own file at 'core/models/' for better organization.


# from django.db import models
# from django.contrib.auth.models import AbstractUser

# class CustomUser(AbstractUser):
#     ROLE_CHOICES = (
#         ('akademisyen', 'Akademisyen'),
#         ('ogrenci', 'Öğrenci'),
#     )
#     role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='ogrenci')
#     numara = models.CharField(max_length=20, unique=True, blank=True, null=True)
#     unvan = models.CharField(max_length=50, blank=True, null=True)
#     bolum = models.CharField(max_length=100, blank=True, null=True, verbose_name="Bölüm")

#     def __str__(self):
#         return f"{self.first_name} {self.last_name} ({self.role})"

# class Musaitlik(models.Model):
#     # ForeignKey explanation:
#     # Like a reference to another object
#     # In Django: akademisyen = models.ForeignKey(CustomUser) (stores reference to a user)
#     # on_delete=models.CASCADE means: if teacher is deleted, delete their time slots too
#     akademisyen = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'akademisyen'})
#     tarih = models.DateField()
#     baslangic = models.TimeField()
#     bitis = models.TimeField()
#     dolu_mu = models.BooleanField(default=False)

#     def __str__(self):
#         return f"{self.akademisyen.first_name} - {self.tarih} {self.baslangic}"

# class Randevu(models.Model):
#     ogrenci = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'ogrenci'})
#     # OneToOneField explanation:
#     # - Each appointment can only book ONE time slot
#     # - Each time slot can only have ONE appointment
#     musaitlik = models.OneToOneField(Musaitlik, on_delete=models.CASCADE)
#     olusturulma_tarihi = models.DateTimeField(auto_now_add=True)
#     not_mesaji = models.TextField(blank=True, null=True)
#     onaylandi = models.BooleanField(default=True, verbose_name="Onaylandı mı?")

#     def __str__(self):
#         return f"Randevu: {self.ogrenci.first_name} -> {self.musaitlik.akademisyen.first_name}"