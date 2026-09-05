# Frontend-Backend Entegrasyon Kılavuzu

Bu kılavuz, backend geliştiricisinin frontend'i gerçek API'ye entegre etmesi için gerekli adımları içerir.

## 📋 İçindekiler
1. [Frontend Teknolojileri](#frontend-teknolojileri)
2. [API Entegrasyonu](#api-entegrasyonu)
3. [Environment Variables](#environment-variables)
4. [Mock API'den Gerçek API'ye Geçiş](#mock-apiden-gerçek-apiye-geçiş)
5. [Authentication Flow](#authentication-flow)
6. [CORS Ayarları](#cors-ayarları)

---

## Frontend Teknolojileri

### Kullanılan Teknolojiler ve Versiyonları

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "vite": "^6.0.1",
  "tailwindcss": "^3.4.15",
  "zustand": "^5.0.9",
  "@tanstack/react-query": "^5.90.12"
}
```

### Proje Yapısı

```
src/
├─ pages/              # Sayfa componentleri
│   ├─ Login/
│   ├─ Register/
│   ├─ Student/        # Öğrenci sayfaları
│   ├─ Academician/    # Akademisyen sayfaları
│   └─ Admin/          # Admin sayfaları
├─ components/         # Yeniden kullanılabilir componentler
├─ layouts/            # Layout componentleri
├─ hooks/              # Custom hooks
├─ utils/              # Yardımcı fonksiyonlar ve API
│   └─ api.js          # ⚠️ API çağrıları burada yapılıyor
├─ contexts/           # React Context'ler
│   ├─ AuthContext.jsx # Authentication context
│   └─ ThemeContext.jsx # Tema yönetimi
└─ stores/             # Zustand state management
    └─ authStore.js    # Authentication store
```

---

## API Entegrasyonu

### Mevcut Durum

Frontend şu anda **mock API** kullanıyor. `src/utils/api.js` dosyasında `fakeFetch` fonksiyonu ile simüle edilmiş API çağrıları yapılıyor.

### Yapılması Gerekenler

1. **Environment Variable Ekleme**
2. **API Base URL Konfigürasyonu**
3. **Mock API'yi Gerçek API ile Değiştirme**
4. **Token Yönetimi**

---

## Environment Variables

### 1. `.env` Dosyası Oluşturma

Proje root dizininde (package.json'un olduğu yerde) `.env` dosyası oluşturun:

```env
# Backend API Base URL
VITE_API_BASE_URL=https://your-backend-api.com/api

# Development için local backend
# VITE_API_BASE_URL=http://localhost:3000/api
```

**Önemli:** Vite'da environment variable'lar `VITE_` prefix'i ile başlamalıdır!

### 2. `.env.example` Dosyası Oluşturma

```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

### 3. `.gitignore` Kontrolü

`.env` dosyasının `.gitignore`'da olduğundan emin olun:

```
.env
.env.local
.env.production
```

---

## Mock API'den Gerçek API'ye Geçiş

### Adım 1: `src/utils/api.js` Dosyasını Güncelleme

Mevcut `fakeFetch` fonksiyonunu gerçek `fetch` ile değiştirin:

```javascript
// src/utils/api.js

// API Base URL - Environment variable'dan al
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Gerçek API çağrısı yapan fonksiyon
const apiFetch = async (endpoint, data = null, method = 'GET') => {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Token'ı localStorage'dan al
  const token = localStorage.getItem('token')
  
  // Request options
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  }
  
  // Token varsa Authorization header'ı ekle
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }
  
  // GET dışındaki methodlar için body ekle
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data)
  }
  
  // GET istekleri için query parametreleri ekle
  if (data && method === 'GET') {
    const queryParams = new URLSearchParams(data).toString()
    const fullUrl = queryParams ? `${url}?${queryParams}` : url
    
    try {
      const response = await fetch(fullUrl, options)
      const result = await response.json()
      
      // 401 Unauthorized hatası - token geçersiz
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return { success: false, error: 'Oturum süresi doldu' }
      }
      
      return result
    } catch (error) {
      console.error('API Error:', error)
      return {
        success: false,
        error: 'Bağlantı hatası. Lütfen tekrar deneyin.'
      }
    }
  } else {
    // POST, PUT, DELETE istekleri
    try {
      const response = await fetch(url, options)
      const result = await response.json()
      
      // 401 Unauthorized hatası
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return { success: false, error: 'Oturum süresi doldu' }
      }
      
      return result
    } catch (error) {
      console.error('API Error:', error)
      return {
        success: false,
        error: 'Bağlantı hatası. Lütfen tekrar deneyin.'
      }
    }
  }
}

// Eski fakeFetch fonksiyonunu kaldırın ve apiFetch kullanın
export const api = {
  // Auth
  login: (data) => apiFetch('/login', data, 'POST'),
  register: (data) => apiFetch('/register', data, 'POST'),
  
  // Academicians
  getAcademicians: () => apiFetch('/academicians'),
  getAcademician: (id) => apiFetch(`/academicians/${id}`),
  
  // Appointments
  getAppointments: (filters) => apiFetch('/appointments', filters, 'GET'),
  getAppointment: (id) => apiFetch(`/appointments/${id}`),
  createAppointment: (data) => apiFetch('/appointments', data, 'POST'),
  updateAppointment: (id, data) => apiFetch(`/appointments/${id}`, data, 'PUT'),
  approveAppointment: (id) => apiFetch('/appointments/approve', { id }, 'POST'),
  rejectAppointment: (id, reason) => apiFetch('/appointments/reject', { id, reason }, 'POST'),
  cancelAppointment: (id, reason) => apiFetch('/appointments/cancel', { id, reason }, 'POST'),
  
  // Messages
  getMessages: (userId) => apiFetch('/messages', { userId }, 'GET'),
  getMessageThread: (threadId) => apiFetch('/messages/thread', { threadId }, 'GET'),
  sendMessage: (data) => apiFetch('/messages', data, 'POST'),
  markMessageAsRead: (messageId) => apiFetch('/messages/mark-read', { messageId }, 'POST'),
  deleteMessage: (messageId) => apiFetch('/messages/delete', { messageId }, 'DELETE'),
  getUnreadCount: (userId) => apiFetch('/messages/unread-count', { userId }, 'GET'),
  
  // Schedule (for academicians)
  getSchedule: (academicianId) => apiFetch('/schedule', { academicianId }, 'GET'),
  updateSchedule: (data) => apiFetch('/schedule', data, 'POST'),
  getAvailableSlots: (date, academicianId) => apiFetch('/schedule/available-slots', { date, academicianId }, 'GET'),
  getAvailableDates: (academicianId, month, year) => apiFetch('/schedule/available-dates', { academicianId, month, year }, 'GET'),
  
  // Students (for academicians)
  getStudents: () => apiFetch('/students'),
  getStudentDetail: (studentId) => apiFetch('/students/detail', { studentId }, 'GET'),
  
  // Admin
  getUsers: () => apiFetch('/users'),
  getUserStats: () => apiFetch('/users/stats'),
  createUser: (data) => apiFetch('/users', data, 'POST'),
  updateUser: (userId, data) => apiFetch('/users/update', { userId, ...data }, 'PUT'),
  deleteUser: (userId) => apiFetch('/users/delete', { userId }, 'DELETE'),
  searchUsers: (query) => apiFetch('/users/search', { query }, 'GET'),
  getReports: () => apiFetch('/reports'),
  getAppointmentStats: () => apiFetch('/reports/appointments'),
  getSystemLogs: () => apiFetch('/reports/logs'),
  getAnnouncements: () => apiFetch('/announcements'),
  createAnnouncement: (data) => apiFetch('/announcements/create', data, 'POST'),
  updateAnnouncement: (id, data) => apiFetch('/announcements/update', { id, ...data }, 'PUT'),
  deleteAnnouncement: (id) => apiFetch('/announcements/delete', { id }, 'DELETE'),
  sendBulkMessage: (data) => apiFetch('/messages/bulk', data, 'POST'),
  
  // Profile
  getProfile: (userId) => apiFetch('/profile', { userId }, 'GET'),
  updateProfile: (userId, data) => apiFetch('/profile', { userId, ...data }, 'PUT'),
  uploadAvatar: (userId, file) => {
    // File upload için FormData kullan
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    
    const token = localStorage.getItem('token')
    const url = `${API_BASE_URL}/profile/avatar`
    
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }).then(res => res.json())
  },
  changePassword: (userId, oldPassword, newPassword) => apiFetch('/profile/change-password', { userId, oldPassword, newPassword }, 'POST'),
  
  // Notifications
  getNotifications: (userId) => apiFetch('/notifications', { userId }, 'GET'),
  getNotificationUnreadCount: (userId) => apiFetch('/notifications/unread-count', { userId }, 'GET'),
  markNotificationAsRead: (notificationId) => apiFetch('/notifications/mark-read', { notificationId }, 'POST'),
  markAllNotificationsAsRead: (userId) => apiFetch('/notifications/mark-all-read', { userId }, 'POST'),
  deleteNotification: (notificationId) => apiFetch('/notifications/delete', { notificationId }, 'DELETE'),
  getNotificationSettings: (userId) => apiFetch('/notifications/settings', { userId }, 'GET'),
  updateNotificationSettings: (userId, settings) => apiFetch('/notifications/settings', { userId, ...settings }, 'POST'),
}

export default api
```

### Adım 2: Login İşleminde Token Kaydetme

`src/pages/Login/Login.jsx` dosyasında login başarılı olduğunda token'ı kaydedin:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  const response = await api.login({ ...formData, role: activeTab })
  
  if (response.success) {
    // Token'ı localStorage'a kaydet
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    
    // Auth context'i güncelle
    login(response.user)
    
    // Redirect
    if (activeTab === 'student') navigate('/student/dashboard')
    else if (activeTab === 'academician') navigate('/academician/dashboard')
  }
}
```

---

## Authentication Flow

### Token Yönetimi

1. **Login:** Token backend'den alınır ve `localStorage.setItem('token', token)` ile kaydedilir
2. **API Çağrıları:** Her istekte `Authorization: Bearer <token>` header'ı gönderilir
3. **Token Süresi Doldu:** 401 hatası alındığında kullanıcı login sayfasına yönlendirilir
4. **Logout:** `localStorage.removeItem('token')` ile token silinir

### Protected Routes

`src/components/ProtectedRoute/ProtectedRoute.jsx` dosyası zaten mevcut ve çalışıyor. Token kontrolü için ek bir şey yapmanıza gerek yok.

---

## CORS Ayarları

Backend'de CORS ayarları yapılmalıdır. Örnek (Express.js):

```javascript
const cors = require('cors')

app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'https://your-frontend.vercel.app', // Production frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### Önemli CORS Header'ları

Backend response'larında şu header'lar olmalı:

```
Access-Control-Allow-Origin: https://your-frontend.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Test Etme

### 1. Development Ortamında Test

```bash
# .env dosyasını oluşturun
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Frontend'i başlatın
npm run dev
```

### 2. Production Build Test

```bash
# Production build
npm run build

# Preview
npm run preview
```

---

## Sorun Giderme

### Problem: CORS Hatası

**Çözüm:** Backend'de CORS ayarlarını kontrol edin. Frontend URL'ini `Access-Control-Allow-Origin` header'ına ekleyin.

### Problem: 401 Unauthorized

**Çözüm:** 
- Token'ın doğru gönderildiğini kontrol edin
- Token formatını kontrol edin: `Bearer <token>`
- Token'ın süresinin dolmadığını kontrol edin

### Problem: Network Error

**Çözüm:**
- Backend'in çalıştığını kontrol edin
- `VITE_API_BASE_URL` environment variable'ının doğru olduğunu kontrol edin
- Browser console'da network tab'ını kontrol edin

### Problem: Environment Variable Çalışmıyor

**Çözüm:**
- Vite'da environment variable'lar `VITE_` ile başlamalı
- `.env` dosyası proje root'unda olmalı
- Değişikliklerden sonra dev server'ı yeniden başlatın

---

## Özet Checklist

- [ ] `.env` dosyası oluşturuldu ve `VITE_API_BASE_URL` ayarlandı
- [ ] `src/utils/api.js` dosyasında `fakeFetch` yerine gerçek `fetch` kullanılıyor
- [ ] Token yönetimi doğru yapılıyor (localStorage'a kaydetme/okuma)
- [ ] Login sonrası token kaydediliyor
- [ ] Tüm API çağrılarında `Authorization` header'ı gönderiliyor
- [ ] 401 hatası durumunda kullanıcı login sayfasına yönlendiriliyor
- [ ] Backend'de CORS ayarları yapıldı
- [ ] File upload (avatar) için FormData kullanılıyor
- [ ] Development ve production ortamlarında test edildi

---

**Son Güncelleme:** 15 Aralık 2025  
**Versiyon:** 1.0.0

