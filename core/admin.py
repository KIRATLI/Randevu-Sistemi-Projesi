from django.contrib import admin
from .models import CustomUser, Musaitlik, Randevu

# Oluşturduğumuz tabloları admin panelinde görünür yapıyoruz
admin.site.register(CustomUser)
admin.site.register(Musaitlik)
admin.site.register(Randevu)