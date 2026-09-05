# 🎓 Ankara Üniversitesi Randevu Sistemi

Modern, kullanıcı dostu ve kapsamlı bir akademik randevu yönetim platformu.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.15-38B2AC?logo=tailwind-css)

---

## 🚀 Teknolojiler

### Core
- **React 18.3.1** - Modern UI Framework
- **Vite 6.0.1** - Next Generation Frontend Tooling
- **React Router v6** - Client-side Routing
- **Zustand** - Lightweight State Management

### UI & Styling
- **TailwindCSS 3.4** - Utility-first CSS Framework
- **React Hot Toast** - Beautiful Notifications
- Dark Mode Support 🌙

### Data & Charts
- **Recharts** - Composable Charting Library (5 chart types)
- **React Big Calendar** - Events Calendar
- **React Quill** - Rich Text Editor
- **React Query** - Data Fetching & Caching

### Dev Tools
- **ESLint** - Code Quality
- **PostCSS** - CSS Processing
- **Autoprefixer** - CSS Vendor Prefixes

---

## 📁 Proje Yapısı

```
src/
├── pages/                    # Sayfa Componentleri (33 sayfa)
│   ├── Login/               # Giriş sayfası
│   ├── Register/            # Kayıt sayfası
│   ├── TwoFactor/           # 2FA doğrulama
│   ├── ForgotPassword/      # Şifremi unuttum
│   ├── ResetPassword/       # Şifre sıfırlama
│   ├── Student/             # Öğrenci Paneli (9 sayfa)
│   │   ├── Dashboard/       # Dashboard
│   │   ├── AcademicianList/ # Akademisyen listesi
│   │   ├── AcademicianProfile/ # Akademisyen profili
│   │   ├── Appointments/    # Randevularım
│   │   ├── History/         # Randevu geçmişi & istatistikler
│   │   ├── NotificationSettings/ # Bildirim tercihleri
│   │   ├── Support/         # Destek & Şikayet
│   │   ├── Messages/        # Mesajlaşma
│   │   └── Settings/        # Ayarlar
│   ├── Academician/         # Akademisyen Paneli (7 sayfa)
│   │   ├── Dashboard/       # Dashboard
│   │   ├── ScheduleSettings/ # Çalışma saatleri
│   │   ├── Appointments/    # Randevu yönetimi (toplu işlemler)
│   │   ├── Students/        # Öğrenci listesi
│   │   ├── Support/         # Destek & İstek
│   │   ├── Messages/        # Mesajlaşma
│   │   └── Settings/        # Ayarlar
│   └── Admin/               # Admin Paneli (13 sayfa)
│       ├── Dashboard/       # Gelişmiş dashboard (charts)
│       ├── Users/           # Kullanıcı yönetimi
│       ├── Faculties/       # Fakülte yönetimi
│       ├── Departments/     # Bölüm yönetimi
│       ├── Appointments/    # Randevu yönetimi
│       ├── Settings/        # Sistem ayarları
│       ├── Announcements/   # Duyurular
│       ├── Notifications/   # Toplu bildirim
│       ├── Calendar/        # Takvim görünümü
│       ├── EmailTemplates/  # Email şablon yönetimi
│       ├── Tickets/         # Destek talepleri
│       ├── Reports/         # Raporlar & Analiz (5 grafik)
│       └── Messages/        # Mesajlaşma
├── components/              # Reusable Components
│   ├── AppointmentCard/
│   ├── AppointmentCalendar/
│   ├── ErrorBoundary/
│   └── ...
├── layouts/                 # Layout Components
│   └── DashboardLayout/     # Ana dashboard layout
├── contexts/                # React Contexts
│   ├── AuthContext/         # Authentication
│   └── ThemeContext/        # Theme (Dark/Light)
├── hooks/                   # Custom React Hooks
├── utils/                   # Utility Functions
│   └── api.js              # API Mock (Backend hazır olana kadar)
└── assets/                  # Static Assets

```

---

## 🎯 Özellikler

### 👨‍🎓 Öğrenci Paneli
- ✅ Akademisyen listesi ve profil görüntüleme
- ✅ Randevu oluşturma ve takibi
- ✅ **Randevu geçmişi ve istatistikler** (Yeni!)
- ✅ **Bildirim tercihleri yönetimi** (Yeni!)
- ✅ **Destek ve şikayet sistemi** (Yeni!)
- ✅ Mesajlaşma sistemi
- ✅ Profil ayarları

### 👨‍🏫 Akademisyen Paneli
- ✅ Çalışma saatleri ve program ayarlama
- ✅ **Toplu randevu işlemleri** (Yeni!)
  - Çoklu seçim
  - Toplu onaylama/reddetme
  - Hızlı yanıt şablonları
- ✅ Öğrenci listesi ve profil görüntüleme
- ✅ **Destek ve istek sistemi** (Yeni!)
- ✅ Mesajlaşma sistemi
- ✅ Profil ayarları

### 👨‍💼 Admin Paneli
- ✅ **Gelişmiş Dashboard** (Charts & Analytics)
- ✅ Kullanıcı yönetimi (CRUD)
- ✅ **Fakülte & Bölüm yönetimi** (Yeni!)
- ✅ Randevu yönetimi ve manuel oluşturma
- ✅ **Takvim görünümü** (React Big Calendar)
- ✅ **Email şablon yönetimi** (Rich Text Editor)
- ✅ **Destek talepleri yönetimi** (Yeni!)
- ✅ **Gelişmiş raporlar ve analiz**
  - Line Chart (Aylık trend)
  - Area Chart (Yıllık trend)
  - Bar Chart (Bölüm performansı)
  - Pie Chart (Durum dağılımı)
  - Radar Chart (Performans analizi)
- ✅ Duyuru yönetimi
- ✅ Toplu bildirim gönderimi
- ✅ Sistem ayarları
- ✅ Mesajlaşma

### 🎨 Genel Özellikler
- ✅ **Dark/Light Mode** - Tema desteği
- ✅ **Responsive Design** - Mobil uyumlu
- ✅ **2FA Support** - İki faktörlü doğrulama
- ✅ **Role-based Access** - Rol tabanlı erişim
- ✅ Modern ve kullanıcı dostu arayüz
- ✅ Animasyonlu geçişler

---

## 🔧 Kurulum

### Gereksinimler
- Node.js 18+ ve npm

### Adımlar

```bash
# 1. Repository'yi klonlayın
git clone <repository-url>
cd ankara-universitesi-randevu-sistemi

# 2. Bağımlılıkları yükleyin
npm install

# 3. Environment variables ayarlayın
cp .env.example .env
# .env dosyasını düzenleyin

# 4. Geliştirme sunucusunu başlatın
npm run dev

# Tarayıcıda açın: http://localhost:5173
```

### Production Build

```bash
# Build oluştur
npm run build

# Preview
npm run preview
```

---

## 🎨 Mock API

**Not:** Backend henüz hazır olmadığı için, tüm API çağrıları `src/utils/api.js` dosyasındaki mock fonksiyonlar tarafından simüle edilmektedir.

### Gerçek Backend Entegrasyonu

Backend hazır olduğunda:
1. `.env` dosyasında API URL'ini ayarlayın
2. `src/utils/api.js` dosyasını güncelleyin
3. Detaylı rehber için: **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)**

---

## 📚 Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | Backend API dökümanı (50+ endpoint) |
| **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** | Frontend-Backend entegrasyon kılavuzu |
| **[GIZLILIK_KURALLARI.md](./GIZLILIK_KURALLARI.md)** | Güvenlik ve gizlilik kuralları |
| **[BACKEND_TESLIM_RAPORU.md](./BACKEND_TESLIM_RAPORU.md)** | Backend teslim öncesi kontrol raporu |

---

## 🔐 Demo Kullanıcıları (Mock Data)

### Öğrenci
```
Email: student@ankara.edu.tr
Şifre: herhangi bir şey (mock auth)
```

### Akademisyen
```
Email: academician@ankara.edu.tr
Şifre: herhangi bir şey (mock auth)
```

### Admin
```
Email: admin@ankara.edu.tr
Şifre: herhangi bir şey (mock auth)
```

**Not:** Mock authentication kullanılmaktadır. Backend hazır olduğunda gerçek kimlik doğrulama çalışacaktır.

---

## 📦 Kurulu Paketler

### Production Dependencies
```json
{
  "@tanstack/react-query": "^5.90.12",
  "moment": "^2.30.1",
  "react": "^18.3.1",
  "react-big-calendar": "^1.19.4",
  "react-quill": "^2.0.0",
  "react-router-dom": "^6.28.0",
  "recharts": "^3.6.0",
  "zustand": "^5.0.9"
}
```

---

## � Deployment

### Vercel (Önerilen)
Proje Vercel için yapılandırılmıştır. `vercel.json` dosyası mevcuttur.

```bash
# Vercel CLI ile deploy
npm i -g vercel
vercel
```

### Diğer Platformlar
- Netlify
- AWS Amplify
- GitHub Pages (build ile)

---

## 📊 Proje İstatistikleri

- **Toplam Sayfa:** 33
- **Admin Sayfası:** 13
- **Student Sayfası:** 9
- **Academician Sayfası:** 7
- **Auth Sayfası:** 5
- **Component Sayısı:** 50+
- **API Endpoint:** 50+
- **Grafik Türü:** 5

---

## 🐛 Bilinen Sorunlar

1. **Mock Data:** Tüm veriler şu an mock - Backend bağlandığında güncellenecek
2. **Error Handling:** Daha gelişmiş error handling eklenecek
3. **Performance:** Code splitting ve lazy loading artırılacak

---

## 🛠️ Geliştirme

### Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Lint code
```

### Kod Standartları
- ESLint configured
- Prettier recommended
- TailwindCSS conventions

---

## 🤝 Katkıda Bulunma

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 İletişim

**Proje Sahibi:** Ankara Üniversitesi  
**Email:** development@ankara.edu.tr  
**Döküman:** [/docs](./docs)

---

## 📄 Lisans

Bu proje Ankara Üniversitesi'ne aittir.

---

## 🙏 Teşekkürler

Bu projeyi geliştirirken kullanılan tüm açık kaynak kütüphanelere teşekkürler:
- React Team
- Vite Team
- TailwindCSS Team
- Recharts, React Big Calendar, React Quill ve diğer tüm katkıda bulunanlara

---

**Son Güncelleme:** 24 Aralık 2025  
**Versiyon:** 1.0.0  
**Durum:** ✅ Backend Entegrasyonuna Hazır
