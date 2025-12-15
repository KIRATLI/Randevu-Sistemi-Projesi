# Ankara Üniversitesi Randevu Sistemi

Modern ve kullanıcı dostu bir randevu yönetim sistemi.

## 🚀 Teknolojiler

- **React** - UI Framework
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Context API** - State Management

## 📁 Proje Yapısı

```
src/
├─ pages/              # Sayfa componentleri
│   ├─ Login/
│   ├─ Register/
│   ├─ TwoFactor/
│   ├─ Student/        # Öğrenci sayfaları
│   ├─ Academician/    # Akademisyen sayfaları
│   └─ Admin/          # Admin sayfaları
├─ components/         # Yeniden kullanılabilir componentler
├─ layouts/            # Layout componentleri
├─ hooks/              # Custom hooks
├─ utils/              # Yardımcı fonksiyonlar ve API
├─ contexts/           # React Context'ler
├─ mocks/              # Mock data
└─ assets/             # Statik dosyalar
```

## 🎯 Özellikler

### Öğrenci Paneli
- ✅ Akademisyen listesini görüntüleme
- ✅ Randevu oluşturma
- ✅ Randevu takibi
- ✅ Mesajlaşma

### Akademisyen Paneli
- ✅ Program ayarlama
- ✅ Randevu yönetimi
- ✅ Öğrenci listesi
- ✅ Mesajlaşma

### Admin Paneli
- ✅ Kullanıcı yönetimi
- ✅ Sistem raporları
- ✅ Genel ayarlar

## 🌙 Tema Desteği

Projeye Light/Dark mode desteği eklenmiştir. Kullanıcılar tema tercihlerini değiştirebilir ve tercihleri localStorage'da saklanır.

## 🔧 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## 🎨 Mock API

Backend henüz hazır olmadığı için, `src/utils/api.js` dosyasında mock API fonksiyonları bulunmaktadır. Gerçek backend hazır olduğunda bu dosya güncellenecektir.

**Backend entegrasyonu için:** `INTEGRATION_GUIDE.md` dosyasına bakın.

## 📝 Notlar

- Bu proje şu an frontend skeleton olarak hazırlanmıştır
- Tüm sayfalar temel yapı olarak eklenmiştir
- Mock data kullanılmaktadır
- Backend entegrasyonu için hazırdır

## 📚 Dokümantasyon

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Backend API dokümantasyonu (tüm endpoint'ler, request/response formatları)
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Frontend-Backend entegrasyon kılavuzu
- **[DEPLOY.md](./DEPLOY.md)** - Vercel deployment kılavuzu

## 🔐 Örnek Kullanıcılar (Mock)

```javascript
// Öğrenci
Email: student@ankara.edu.tr
Şifre: herhangi bir şey

// Akademisyen
Email: academician@ankara.edu.tr
Şifre: herhangi bir şey

// Admin
Email: admin@ankara.edu.tr
Şifre: herhangi bir şey
```

## 📞 İletişim

Proje hakkında sorularınız için lütfen iletişime geçin.


