from django.contrib import admin
from django.urls import path
# Views dosyasındaki tüm fonksiyonları (hem senin hem diğerlerinin) içeri alıyoruz
from core.views import (
    giris_yap, 
    ana_sayfa, 
    akademisyen_panel, 
    ogrenci_panel
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # --- SENİN YAPTIĞIN KISIM (GİRİŞ SİSTEMİ) ---
    path('', ana_sayfa, name='ana_sayfa'),       # Site açılınca direkt ana sayfa
    path('giris/', giris_yap, name='giris_yap'), # /giris yazınca giriş ekranı

    # --- DİĞER EKİP ÜYELERİNİN ALANLARI (YER TUTUCULAR) ---
    # Bu adresler şimdilik boş panellere gidecek ama sistem çökmez
    path('akademisyen/', akademisyen_panel, name='akademisyen_panel'),
    path('ogrenci/', ogrenci_panel, name='ogrenci_panel'),
]