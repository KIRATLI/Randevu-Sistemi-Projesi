# 🚀 BACKEND ENTEGRASYON - KAPSAMLI REHBER

**Proje:** Ankara Üniversitesi Randevu Sistemi  
**Frontend Versiyon:** 1.0.0 (Production Ready)  
**Tarih:** 24 Aralık 2025

---

## 📋 TESLİMAT KONTROL LİSTESİ

### ✅ Frontend Tarafında Tamamlananlar

- [x] **33 Sayfa** - Tüm UI sayfaları tamamlandı
- [x] **50+ Component** - Reusable component'ler hazır
- [x] **Error Boundary** - Hata yakalama mekanizması
- [x] **Toast Notifications** - Kullanıcı bildirimleri
- [x] **Loading States** - Spinner ve Skeleton loader'lar
- [x] **Form Validation** - React Hook Form + Yup (7 hazır şema)
- [x] **API Error Handling** - Merkezi hata yönetimi
- [x] **Retry Mechanism** - Otomatik yeniden deneme
- [x] **Dark Mode** - Tema desteği
- [x] **Responsive Design** - Mobil uyumlu
- [x] **Mock API** - Geliştirme için test verileri

### ❌ Backend Tarafında Yapılması Gerekenler

- [ ] API Endpoint'lerinin geliştirilmesi
- [ ] Database schema oluşturulması
- [ ] JWT Authentication
- [ ] Role-based Authorization
- [ ] File upload (profil fotoğrafı)
- [ ] Email sending service
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Data validation
- [ ] Error logging

---

## 🔧 BACKEND EKİBİ İÇİN KRİTİK DOSYALAR

### 1. API Dökümanı
**Dosya:** `API_DOCUMENTATION.md`  
**İçerik:** 50+ endpoint detayı, request/response formatları, authentication

### 2. Entegrasyon Kılavuzu
**Dosya:** `INTEGRATION_GUIDE.md`  
**İçerik:** Frontend-Backend bağlantı adımları

### 3. Gizlilik ve Güvenlik Kuralları
**Dosya:** `GIZLILIK_KURALLARI.md`  
**İçerik:** User isolation, access control, security best practices

### 4. Environment Variables
**Dosya:** `.env.example`  
**İçerik:** Gerekli environment değişkenleri

---

## 🌐 ENVIRONMENT VARIABLES

Backend ekibi `.env` dosyasına şunları eklemelidir:

```env
# Backend API URL (Frontend'in bağlanacağı adres)
VITE_API_BASE_URL=https://api.ankara.edu.tr/v1
# veya development için
VITE_API_BASE_URL=http://localhost:3000/api

# Timeout ayarları
VITE_API_TIMEOUT=30000

# Feature flags
VITE_ENABLE_2FA=true
VITE_ENABLE_EMAIL_VERIFICATION=true

# File upload limitleri
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf
```

---

## 📡 ÖNCELİKLİ API ENDPOINT'LER

### 🔴 Yüksek Öncelik (Uygulama çalışması için kritik)

#### Authentication
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/verify-2fa
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

#### Appointments
```
GET    /api/appointments              (Role-based filtering)
GET    /api/appointments/:id
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
PUT    /api/appointments/:id/approve  (Akademisyen/Admin)
PUT    /api/appointments/:id/reject   (Akademisyen/Admin)
PUT    /api/appointments/:id/cancel   (Öğrenci/Admin)
```

#### Users
```
GET    /api/users/profile             (Kendi profili)
PUT    /api/users/profile
GET    /api/users                     (Admin only)
POST   /api/users                     (Admin only)
PUT    /api/users/:id                 (Admin only)
DELETE /api/users/:id                 (Admin only)
```

### 🟡 Orta Öncelik

#### Tickets (Destek Sistemi)
```
GET    /api/tickets/my-tickets        (Sadece kendi ticket'ları)
GET    /api/tickets/:id
POST   /api/tickets
POST   /api/tickets/:id/reply
PUT    /api/tickets/:id/status        (Admin only)
```

#### Messages
```
GET    /api/messages                  (Gönderen veya alıcı olan)
GET    /api/messages/:id
POST   /api/messages
PUT    /api/messages/:id/read
```

#### Faculties & Departments
```
GET    /api/faculties
POST   /api/faculties                 (Admin only)
PUT    /api/faculties/:id             (Admin only)
DELETE /api/faculties/:id             (Admin only)

GET    /api/departments
POST   /api/departments               (Admin only)
PUT    /api/departments/:id           (Admin only)
DELETE /api/departments/:id           (Admin only)
```

---

## 🔐 GÜVENLİK GEREKSİNİMLERİ

### 1. JWT Authentication
```javascript
// Header'da gönderilmesi gereken format
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// JWT payload'da olması gerekenler
{
  "id": 123,
  "email": "user@ankara.edu.tr",
  "role": "student", // student | academician | admin
  "iat": 1640000000,
  "exp": 1640086400
}
```

### 2. Rol Bazlı Erişim

**Student:**
- Sadece kendi randevularını görebilir/yönetebilir
- Sadece kendi ticket'larını görebilir
- Sadece kendi mesajlarını görebilir

**Academician:**
- Sadece kendisiyle olan randevuları görebilir/yönetebilir
- Sadece kendi ticket'larını görebilir
- Sadece kendi öğrencileriyle mesajlaşabilir

**Admin:**
- Tüm verilere erişebilir
- Tüm işlemleri yapabilir

### 3. Data Validation

**Backend'de mutlaka kontrol edilmeli:**
- Email formatı: `@ankara.edu.tr` ile bitmeli
- Öğrenci numarası: 8 haneli olmalı
- Şifre: Min 8 karakter, büyük/küçük harf, rakam, özel karakter
- Randevu tarihi: Geçmiş tarih olmamalı
- Çalışma saatleri: 09:00-17:00 arası

---

## 📊 DATABASE SCHEMA ÖNERİLERİ

### Kritik Tablolar

```sql
-- Users tablosu
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL, -- student, academician, admin
  student_no VARCHAR(8),
  phone VARCHAR(10),
  faculty_id INTEGER,
  department_id INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments tablosu
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES users(id),
  academician_id INTEGER NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  status VARCHAR(20) NOT NULL, -- pending, confirmed, rejected, cancelled, completed
  subject TEXT NOT NULL,
  description TEXT,
  reject_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_appointment UNIQUE(academician_id, date, time)
);

-- Tickets tablosu
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  ticket_no VARCHAR(20) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL, -- low, medium, high
  status VARCHAR(20) NOT NULL, -- open, in_progress, resolved, closed
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 CORS CONFIGURATION

Backend'de şu ayarlar yapılmalı:

```javascript
// Node.js/Express örneği
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',           // Development
    'https://randevu.ankara.edu.tr'    // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📧 EMAIL SERVICE

### Gerekli Email Şablonları

1. **Randevu Onayı** - Akademisyen randevuyu onayladığında
2. **Randevu Reddi** - Akademisyen randevuyu reddeddiğinde  
3. **Randevu İptali** - Randevu iptal edildiğinde
4. **Randevu Hatırlatma** - Randevudan 1 gün önce
5. **Hoş Geldiniz** - Yeni kayıt
6. **Şifre Sıfırlama** - Şifre unutulduğunda

---

## 🚀 DEPLOYMENT HAZIRLIĞI

### Frontend Build

```bash
# Production build
npm run build

# Build çıktısı: dist/ klasörü
```

### Environment Variables (Production)

```env
VITE_API_BASE_URL=https://api.ankara.edu.tr/v1
VITE_API_TIMEOUT=30000
VITE_ENABLE_2FA=true
```

---

## 📝 ENTEGRASYON ADIMLARI

### Adım 1: Backend API'yi Hazırlayın
- [ ] Database schema oluşturun
- [ ] Authentication endpoint'lerini yazın
- [ ] CRUD endpoint'lerini yazın
- [ ] Test kullanıcılarını oluşturun

### Adım 2: CORS ve Environment
- [ ] CORS ayarlarını yapın
- [ ] Environment variables'ları ayarlayın
- [ ] API base URL'i test edin

### Adım 3: Frontend'i Güncelleyin
- [ ] `src/utils/api.js` dosyasındaki mock fonksiyonları gerçek API çağrılarıyla değiştirin
- [ ] `.env` dosyasını oluşturup API URL'i ekleyin
- [ ] Test edin

### Adım 4: Authentication Flow
- [ ] Login endpoint'ini test edin
- [ ] JWT token alımını test edin
- [ ] Token refresh mekanizmasını test edin

### Adım 5: Ana Özellikler
- [ ] Randevu oluşturma/onaylama/reddetme
- [ ] Kullanıcı yönetimi
- [ ] Mesajlaşma
- [ ] Destek talepleri

---

## ⚠️ KRİTİK NOTLAR

### 1. User Isolation (ÇOK ÖNEMLİ!)
```javascript
// ❌ YANLIŞ - Tüm randevuları döner
GET /api/appointments

// ✅ DOĞRU - Sadece kullanıcının randevularını döner
// Backend'de:
if (user.role === 'student') {
  return appointments.where({ student_id: user.id })
} else if (user.role === 'academician') {
  return appointments.where({ academician_id: user.id })
}
```

### 2. Password Hashing
```javascript
// Asla plain text şifre saklamayın!
// bcrypt kullanın (min 10 rounds)
const hashedPassword = await bcrypt.hash(password, 10)
```

### 3. Rate Limiting
```javascript
// Brute force saldırılarını engelleyin
// Max 5 başarısız deneme / 15 dakika
```

---

## ✅ SON KONTROL LİSTESİ

Backend ekibi başlamadan önce:
- [ ] `API_DOCUMENTATION.md` okudum
- [ ] `INTEGRATION_GUIDE.md` okudum
- [ ] `GIZLILIK_KURALLARI.md` okudum
- [ ] `.env.example` inceledim
- [ ] Database schema önerilerini inceledim
- [ ] Güvenlik gereksinimlerini okudum
- [ ] CORS configuration'ı anladım

**Hazırsanız, başlayalım! 🚀**
