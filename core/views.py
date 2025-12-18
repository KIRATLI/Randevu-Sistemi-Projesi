from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages

# --- MEVCUT KODLAR (DOKUNMUYORUZ) ---

# HOCALAR İÇİN BOŞ FONKSİYONLAR
def akademisyen_panel(request):
    return render(request, 'akademisyen_panel.html')

def musaitlik_ekle(request):
    # Backendci arkadaş burayı dolduracak
    pass  # C++'taki boş süslü parantez {} demektir.

# ÖĞRENCİLER İÇİN BOŞ FONKSİYONLAR
def ogrenci_panel(request):
    return render(request, 'ogrenci_panel.html')

def randevu_al(request):
    # Backendci arkadaş burayı dolduracak
    pass

# --- YENİ EKLENEN KISIM (SENİN GÖREVİN) ---

def giris_yap(request):
    # Eğer butona basıldıysa (POST isteği)
    if request.method == 'POST':
        kullanici = request.POST.get('username')
        sifre = request.POST.get('password')

        # Veritabanı kontrolü
        user = authenticate(request, username=kullanici, password=sifre)

        if user is not None:
            login(request, user) # Giriş başarılı
            return redirect('ana_sayfa')
        else:
            messages.error(request, "Hatalı kullanıcı adı veya şifre!")
            return redirect('giris_yap')
    
    # Sayfa ilk açılıyorsa
    return render(request, 'login.html')

def ana_sayfa(request):
    return render(request, 'index.html')