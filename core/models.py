from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. KULLANICI TABLOSU (Inheritance / Kalıtım Kullanıyoruz)
# Django'nun hazır User sınıfını genişletiyoruz.
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('akademisyen', 'Akademisyen'),
        ('ogrenci', 'Öğrenci'),
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='ogrenci')
    # Akademisyen ise sicil no, öğrenci ise okul no
    numara = models.CharField(max_length=20, unique=True, null=True, blank=True)
    unvan = models.CharField(max_length=50, blank=True, null=True) # Sadece hocalar için

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

# 2. MÜSAİTLİK TABLOSU (Hocanın boş saatleri)
class Musaitlik(models.Model):
    # İlişki: Bir saati bir hoca açabilir (ForeignKey)
    akademisyen = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'akademisyen'})
    tarih = models.DateField()
    baslangic = models.TimeField()
    bitis = models.TimeField()
    dolu_mu = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.akademisyen.first_name} - {self.tarih} {self.baslangic}"

# 3. RANDEVU TABLOSU
class Randevu(models.Model):
    # İlişki: Randevuyu bir öğrenci alır
    ogrenci = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'ogrenci'})
    # İlişki: Randevu bir müsaitlik saatine bağlanır (OneToOne - Bir saat tek randevu)
    musaitlik = models.OneToOneField(Musaitlik, on_delete=models.CASCADE)
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True)
    not_mesaji = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Randevu: {self.ogrenci.first_name} -> {self.musaitlik.akademisyen.first_name}"