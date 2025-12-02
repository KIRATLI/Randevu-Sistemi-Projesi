from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('akademisyen', 'Akademisyen'),
        ('ogrenci', 'Öğrenci'),
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='ogrenci')
    numara = models.CharField(max_length=20, unique=True, null=True, blank=True)
    unvan = models.CharField(max_length=50, blank=True, null=True)
    
    # YENİ EKLENEN: Bölüm Bilgisi (Filtreleme için şart)
    bolum = models.CharField(max_length=100, blank=True, null=True, verbose_name="Bölüm")

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

class Musaitlik(models.Model):
    akademisyen = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'akademisyen'})
    tarih = models.DateField()
    baslangic = models.TimeField()
    bitis = models.TimeField()
    dolu_mu = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.akademisyen.first_name} - {self.tarih} {self.baslangic}"

class Randevu(models.Model):
    ogrenci = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'ogrenci'})
    musaitlik = models.OneToOneField(Musaitlik, on_delete=models.CASCADE)
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True)
    not_mesaji = models.TextField(blank=True, null=True)
    
    # YENİ EKLENEN: Onay Durumu (Hocanın onaylaması için)
    onaylandi = models.BooleanField(default=True, verbose_name="Onaylandı mı?")

    def __str__(self):
        return f"Randevu: {self.ogrenci.first_name} -> {self.musaitlik.akademisyen.first_name}"