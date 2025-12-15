# Ankara Üniversitesi Randevu Sistemi - Backend API Dokümantasyonu

> **Not:** Frontend entegrasyonu için [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) dosyasına bakın.

## 📋 İçindekiler
1. [Genel Bilgiler](#genel-bilgiler)
2. [Authentication](#authentication)
3. [API Endpoint'leri](#api-endpointleri)
4. [Error Handling](#error-handling)
5. [Önemli Notlar](#önemli-notlar)

---

## Genel Bilgiler

### Base URL
```
https://your-backend-api.com/api
```
*Not: Backend URL'inizi buraya yazın*

### Authentication
- **JWT Token** kullanılıyor
- Login sonrası token döndürülmeli
- Tüm protected endpoint'lerde `Authorization: Bearer <token>` header'ı bekleniyor
- Token frontend'de localStorage'da saklanıyor

### Response Format
Tüm API response'ları şu formatta olmalıdır:

```json
{
  "success": true,
  "data": {},
  "message": "İşlem mesajı",
  "error": "Hata mesajı (varsa)"
}
```

**Not:** 
- `success`: `true` veya `false` boolean değeri
- `data`: Object veya Array olabilir
- `error`: Sadece hata durumunda gönderilir

### Kullanıcı Rolleri
- `student` - Öğrenci
- `academician` - Akademisyen
- `admin` - Admin

---

## Authentication

### POST `/api/login`
Kullanıcı girişi yapar ve JWT token döndürür.

**Request:**
```json
{
  "email": "ahmet@ankara.edu.tr",
  "password": "password123",
  "role": "student"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "Ahmet Yılmaz",
    "email": "ahmet@ankara.edu.tr",
    "role": "student"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "E-posta veya şifre hatalı"
}
```

---

### POST `/api/register`
Yeni kullanıcı kaydı oluşturur.

**Request:**
```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@ankara.edu.tr",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "student",
  "studentNo": "12345678",
  "registrationNo": "AKD-2024-001",
  "department": "Bilgisayar Mühendisliği",
  "faculty": "Mühendislik Fakültesi"
}
```

**Notlar:**
- `role` = "student" ise `studentNo` zorunlu
- `role` = "academician" ise `registrationNo` zorunlu
- Şifre gereksinimleri: min 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam, 1 özel karakter

**Response:**
```json
{
  "success": true,
  "message": "Kayıt başarılı"
}
```

---

## Akademisyenler

### GET `/api/academicians`
Tüm akademisyenlerin listesini döndürür.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Prof. Dr. Ayşe Demir",
      "department": "Bilgisayar Mühendisliği",
      "office": "A-204",
      "available": true
    }
  ]
}
```

---

### GET `/api/academicians/:id`
Belirli bir akademisyenin detaylı bilgilerini döndürür.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Prof. Dr. Ayşe Demir",
    "email": "ayse@ankara.edu.tr",
    "title": "Profesör",
    "department": "Bilgisayar Mühendisliği",
    "faculty": "Mühendislik Fakültesi",
    "office": "A-204",
    "phone": "+90 312 XXX XX XX",
    "bio": "Yapay Zeka ve Makine Öğrenmesi alanında çalışmalar yürütmekteyim...",
    "specializations": ["Yapay Zeka", "Makine Öğrenmesi", "Derin Öğrenme"],
    "available": true
  }
}
```

---

## Randevular

### GET `/api/appointments`
Randevu listesini döndürür. Filtreleme için query parametreleri kullanılabilir.

**Query Parameters:**
- `userId` (optional) - Kullanıcı ID'si
- `academicianId` (optional) - Akademisyen ID'si
- `status` (optional) - Durum: `pending`, `confirmed`, `rejected`, `cancelled`, `completed`
- `date` (optional) - Tarih: `YYYY-MM-DD`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "studentId": 1,
      "studentName": "Ahmet Yılmaz",
      "studentNo": "12345678",
      "academicianId": 1,
      "academicianName": "Prof. Dr. Ayşe Demir",
      "date": "2025-12-15",
      "time": "14:00",
      "duration": 30,
      "status": "confirmed",
      "subject": "Proje danışmanlığı hakkında görüşme",
      "notes": "Bitirme projesi için görüşme",
      "createdAt": "2025-12-10T10:00:00Z"
    }
  ]
}
```

---

### GET `/api/appointments/:id`
Belirli bir randevunun detaylarını döndürür.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": 1,
    "studentName": "Ahmet Yılmaz",
    "academicianId": 1,
    "academicianName": "Prof. Dr. Ayşe Demir",
    "date": "2025-12-15",
    "time": "14:00",
    "duration": 30,
    "status": "confirmed",
    "subject": "Proje danışmanlığı hakkında görüşme",
    "notes": "...",
    "createdAt": "2025-12-10T10:00:00Z"
  }
}
```

---

### POST `/api/appointments`
Yeni randevu talebi oluşturur.

**Request:**
```json
{
  "academicianId": 1,
  "date": "2025-12-20",
  "time": "14:00",
  "subject": "Proje danışmanlığı",
  "notes": "Bitirme projesi hakkında"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Randevu talebi oluşturuldu",
  "data": {
    "id": 5,
    "status": "pending",
    "academicianId": 1,
    "date": "2025-12-20",
    "time": "14:00",
    "subject": "Proje danışmanlığı",
    "createdAt": "2025-12-09T10:00:00Z"
  }
}
```

---

### POST `/api/appointments/approve`
Randevuyu onaylar (Akademisyen için).

**Request:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Randevu onaylandı"
}
```

---

### POST `/api/appointments/reject`
Randevuyu reddeder (Akademisyen için).

**Request:**
```json
{
  "id": 1,
  "reason": "Müsait değilim"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Randevu reddedildi"
}
```

---

### POST `/api/appointments/cancel`
Randevuyu iptal eder.

**Request:**
```json
{
  "id": 1,
  "reason": "İptal nedeni"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Randevu iptal edildi"
}
```

---

## Mesajlaşma

### GET `/api/messages`
Kullanıcının mesajlarını döndürür.

**Query Parameters:**
- `userId` (required) - Kullanıcı ID'si

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "senderId": 1,
      "senderName": "Prof. Dr. Ayşe Demir",
      "senderRole": "academician",
      "receiverId": 1,
      "receiverName": "Ahmet Yılmaz",
      "receiverRole": "student",
      "subject": "Randevu Onayı",
      "content": "Merhaba Ahmet, 15 Aralık tarihli randevunuz onaylanmıştır...",
      "date": "2025-12-09T10:30:00Z",
      "read": false,
      "threadId": 1,
      "replyTo": null
    }
  ]
}
```

---

### GET `/api/messages/thread`
Mesaj thread'ini döndürür.

**Query Parameters:**
- `threadId` (required) - Thread ID'si

**Response:**
```json
{
  "success": true,
  "data": [
    // Thread içindeki tüm mesajlar (kronolojik sırada)
  ]
}
```

---

### POST `/api/messages`
Yeni mesaj gönderir.

**Request:**
```json
{
  "receiverId": 1,
  "subject": "Mesaj konusu",
  "content": "Mesaj içeriği",
  "threadId": 1
}
```

**Not:** `threadId` reply için kullanılır, yeni mesaj için gönderilmeyebilir.

**Response:**
```json
{
  "success": true,
  "message": "Mesaj gönderildi",
  "data": {
    "id": 10,
    "senderId": 1,
    "receiverId": 1,
    "subject": "Mesaj konusu",
    "content": "Mesaj içeriği",
    "date": "2025-12-09T12:00:00Z",
    "read": false,
    "threadId": 1
  }
}
```

---

### POST `/api/messages/mark-read`
Mesajı okundu olarak işaretler.

**Request:**
```json
{
  "messageId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mesaj okundu olarak işaretlendi"
}
```

---

### DELETE `/api/messages/delete`
Mesajı siler.

**Request:**
```json
{
  "messageId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mesaj silindi"
}
```

---

### GET `/api/messages/unread-count`
Okunmamış mesaj sayısını döndürür.

**Query Parameters:**
- `userId` (required) - Kullanıcı ID'si

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

---

## Program/Schedule (Akademisyenler için)

### GET `/api/schedule`
Akademisyenin program ayarlarını döndürür.

**Query Parameters:**
- `academicianId` (required) - Akademisyen ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "workingHours": [
      {
        "day": "monday",
        "enabled": true,
        "start": "09:00",
        "end": "17:00"
      },
      {
        "day": "tuesday",
        "enabled": true,
        "start": "09:00",
        "end": "17:00"
      }
    ],
    "slotDuration": 30,
    "breakDuration": 15,
    "maxAppointmentsPerDay": 10
  }
}
```

---

### POST `/api/schedule`
Akademisyenin program ayarlarını günceller.

**Request:**
```json
{
  "academicianId": 1,
  "workingHours": [
    {
      "day": "monday",
      "enabled": true,
      "start": "09:00",
      "end": "17:00"
    }
  ],
  "slotDuration": 30,
  "breakDuration": 15,
  "maxAppointmentsPerDay": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Program ayarları güncellendi"
}
```

---

### GET `/api/schedule/available-slots`
Belirli bir tarih için müsait saatleri döndürür.

**Query Parameters:**
- `date` (required) - Tarih: `YYYY-MM-DD`
- `academicianId` (required) - Akademisyen ID'si

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": "09:00",
      "available": true
    },
    {
      "time": "09:30",
      "available": false
    }
  ]
}
```

---

### GET `/api/schedule/available-dates`
Belirli bir ay için müsait tarihleri döndürür.

**Query Parameters:**
- `academicianId` (required) - Akademisyen ID'si
- `month` (required) - Ay: 1-12
- `year` (required) - Yıl: YYYY

**Response:**
```json
{
  "success": true,
  "data": [
    "2025-12-15",
    "2025-12-16",
    "2025-12-17"
  ]
}
```

---

## Öğrenciler (Akademisyenler için)

### GET `/api/students`
Tüm öğrencilerin listesini döndürür.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ahmet Yılmaz",
      "studentNo": "12345678",
      "email": "ahmet@ankara.edu.tr",
      "department": "Bilgisayar Mühendisliği",
      "faculty": "Mühendislik Fakültesi",
      "year": 4,
      "gpa": 3.45,
      "phone": "+90 555 123 4567",
      "totalAppointments": 8,
      "completedAppointments": 6,
      "cancelledAppointments": 2,
      "lastAppointment": "2025-12-05T14:00:00Z",
      "nextAppointment": "2025-12-15T10:00:00Z",
      "status": "active"
    }
  ]
}
```

---

### GET `/api/students/detail`
Belirli bir öğrencinin detaylı bilgilerini döndürür.

**Query Parameters:**
- `studentId` (required) - Öğrenci ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ahmet Yılmaz",
    "studentNo": "12345678",
    "email": "ahmet@ankara.edu.tr",
    "department": "Bilgisayar Mühendisliği",
    "year": 4,
    "gpa": 3.45,
    "totalAppointments": 8,
    "appointments": [
      {
        "id": 1,
        "date": "2025-12-15",
        "time": "10:00",
        "subject": "Proje Danışmanlığı",
        "status": "confirmed"
      }
    ],
    "notes": "Başarılı bir öğrenci...",
    "registrationDate": "2019-09-15"
  }
}
```

---

## Admin - Kullanıcı Yönetimi

### GET `/api/users`
Tüm kullanıcıların listesini döndürür.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ahmet Yılmaz",
      "email": "ahmet@ankara.edu.tr",
      "role": "student",
      "studentNo": "12345678",
      "department": "Bilgisayar Mühendisliği",
      "status": "active",
      "createdAt": "2024-09-01",
      "lastLogin": "2025-12-09T10:30:00Z"
    }
  ],
  "total": 100
}
```

---

### POST `/api/users`
Yeni kullanıcı oluşturur.

**Request:**
```json
{
  "name": "Yeni Kullanıcı",
  "email": "yeni@ankara.edu.tr",
  "password": "Password123!",
  "role": "student",
  "studentNo": "12345678",
  "department": "Bilgisayar Mühendisliği",
  "faculty": "Mühendislik Fakültesi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kullanıcı oluşturuldu",
  "data": {
    "id": 10,
    "name": "Yeni Kullanıcı",
    "email": "yeni@ankara.edu.tr",
    "role": "student",
    "status": "active"
  }
}
```

---

### PUT `/api/users/update`
Kullanıcı bilgilerini günceller.

**Request:**
```json
{
  "userId": 1,
  "name": "Güncellenmiş İsim",
  "email": "guncel@ankara.edu.tr",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kullanıcı güncellendi"
}
```

---

### DELETE `/api/users/delete`
Kullanıcıyı siler.

**Request:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kullanıcı silindi"
}
```

---

### GET `/api/users/search`
Kullanıcı arama yapar.

**Query Parameters:**
- `query` (required) - Arama terimi

**Response:**
```json
{
  "success": true,
  "data": [
    // Arama sonuçları
  ]
}
```

---

### GET `/api/users/stats`
Kullanıcı istatistiklerini döndürür.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "students": 80,
    "academicians": 18,
    "admins": 2,
    "active": 95,
    "inactive": 5
  }
}
```

---

## Admin - Raporlar

### GET `/api/reports`
Sistem raporlarını döndürür.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAppointments": 1542,
    "completedAppointments": 987,
    "cancelledAppointments": 342,
    "pendingAppointments": 213,
    "monthlyTrend": [
      {
        "month": "Ocak",
        "value": 120
      }
    ],
    "topAcademicians": [
      {
        "name": "Prof. Dr. Ayşe Demir",
        "appointments": 145
      }
    ],
    "departmentStats": [
      {
        "name": "Bilgisayar Mühendisliği",
        "count": 456
      }
    ]
  }
}
```

---

### GET `/api/reports/logs`
Sistem loglarını döndürür.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "action": "Kullanıcı Girişi",
      "user": "Admin User",
      "timestamp": "2025-12-09T12:00:00Z",
      "details": "Admin paneline başarılı giriş"
    }
  ]
}
```

---

## Duyurular

### GET `/api/announcements`
Tüm duyuruları döndürür.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Sistem Bakım Bildirimi",
      "content": "Randevu sistemi bakım çalışması...",
      "type": "warning",
      "targetAudience": "all",
      "author": "Admin User",
      "createdAt": "2025-12-08T10:00:00Z",
      "status": "active",
      "priority": "high",
      "views": 245,
      "expiresAt": "2025-12-16T00:00:00Z"
    }
  ]
}
```

**Not:** `type` değerleri: `info`, `success`, `warning`, `error`  
**Not:** `targetAudience` değerleri: `all`, `student`, `academician`  
**Not:** `priority` değerleri: `low`, `medium`, `high`  
**Not:** `status` değerleri: `active`, `archived`

---

### POST `/api/announcements/create`
Yeni duyuru oluşturur (Admin için).

**Request:**
```json
{
  "title": "Yeni Duyuru",
  "content": "Duyuru içeriği...",
  "type": "info",
  "targetAudience": "all",
  "priority": "medium",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Duyuru oluşturuldu",
  "data": {
    "id": 10,
    "title": "Yeni Duyuru",
    "createdAt": "2025-12-09T12:00:00Z",
    "views": 0,
    "status": "active"
  }
}
```

---

### PUT `/api/announcements/update`
Duyuruyu günceller (Admin için).

**Request:**
```json
{
  "id": 1,
  "title": "Güncellenmiş Başlık",
  "content": "Güncellenmiş içerik...",
  "type": "info",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Duyuru güncellendi"
}
```

---

### DELETE `/api/announcements/delete`
Duyuruyu siler (Admin için).

**Request:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Duyuru silindi"
}
```

---

## Profil

### GET `/api/profile`
Kullanıcı profil bilgilerini döndürür.

**Query Parameters:**
- `userId` (required) - Kullanıcı ID'si

**Response (Öğrenci):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "name": "Ahmet Yılmaz",
    "email": "ahmet@ankara.edu.tr",
    "role": "student",
    "studentNo": "12345678",
    "department": "Bilgisayar Mühendisliği",
    "faculty": "Mühendislik Fakültesi",
    "phone": "+90 555 123 4567",
    "avatar": null,
    "bio": "",
    "birthDate": "2002-05-15",
    "address": "Ankara, Türkiye",
    "emergencyContact": "+90 555 999 8888",
    "enrollmentYear": 2020
  }
}
```

**Response (Akademisyen):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "userId": 2,
    "name": "Prof. Dr. Ayşe Demir",
    "email": "ayse@ankara.edu.tr",
    "role": "academician",
    "title": "Profesör",
    "registrationNo": "AKD-2024-001",
    "department": "Bilgisayar Mühendisliği",
    "office": "A-204",
    "phone": "+90 312 XXX XX XX",
    "avatar": null,
    "bio": "Yapay Zeka ve Makine Öğrenmesi alanında çalışmalar yürütmekteyim...",
    "specializations": ["Yapay Zeka", "Makine Öğrenmesi"],
    "officeHours": "Pazartesi-Cuma 09:00-17:00"
  }
}
```

---

### PUT `/api/profile`
Profil bilgilerini günceller.

**Request:**
```json
{
  "userId": 1,
  "name": "Güncellenmiş İsim",
  "phone": "+90 555 123 4567",
  "bio": "Güncellenmiş bio...",
  "address": "Yeni adres"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profil güncellendi",
  "data": {
    // Güncellenmiş profil bilgileri
  }
}
```

---

### POST `/api/profile/avatar`
Profil fotoğrafı yükler.

**Request:** FormData
```
userId: 1
file: [File]
```

**Response:**
```json
{
  "success": true,
  "message": "Profil fotoğrafı güncellendi",
  "avatarUrl": "https://your-cdn.com/avatars/user-1.jpg"
}
```

---

### POST `/api/profile/change-password`
Şifre değiştirir.

**Request:**
```json
{
  "userId": 1,
  "oldPassword": "oldpass123",
  "newPassword": "NewPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Şifre başarıyla değiştirildi"
}
```

---

## Bildirimler

### GET `/api/notifications`
Kullanıcının bildirimlerini döndürür.

**Query Parameters:**
- `userId` (required) - Kullanıcı ID'si

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "type": "appointment_confirmed",
      "title": "Randevu Onaylandı",
      "message": "Prof. Dr. Ayşe Demir ile 15 Aralık 14:00 randevunuz onaylandı.",
      "date": "2025-12-09T11:30:00Z",
      "read": false,
      "actionUrl": "/student/appointments",
      "relatedId": 1
    }
  ]
}
```

**Bildirim Tipleri:**
- `appointment_confirmed` - Randevu onaylandı
- `appointment_rejected` - Randevu reddedildi
- `appointment_cancelled` - Randevu iptal edildi
- `appointment_reminder` - Randevu hatırlatması
- `appointment_request` - Yeni randevu talebi (akademisyen için)
- `new_message` - Yeni mesaj
- `system` - Sistem bildirimi
- `announcement` - Duyuru

---

### GET `/api/notifications/unread-count`
Okunmamış bildirim sayısını döndürür.

**Query Parameters:**
- `userId` (required) - Kullanıcı ID'si

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

---

### POST `/api/notifications/mark-read`
Bildirimi okundu olarak işaretler.

**Request:**
```json
{
  "notificationId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bildirim okundu olarak işaretlendi"
}
```

---

### POST `/api/notifications/mark-all-read`
Tüm bildirimleri okundu olarak işaretler.

**Request:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tüm bildirimler okundu olarak işaretlendi"
}
```

---

### DELETE `/api/notifications/delete`
Bildirimi siler.

**Request:**
```json
{
  "notificationId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bildirim silindi"
}
```

---

### GET `/api/notifications/settings`
Bildirim ayarlarını döndürür.

**Query Parameters:**
- `userId` (required) - Kullanıcı ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "emailNotifications": true,
    "pushNotifications": true,
    "appointmentReminders": true,
    "messageNotifications": true,
    "systemNotifications": true
  }
}
```

---

### POST `/api/notifications/settings`
Bildirim ayarlarını günceller.

**Request:**
```json
{
  "userId": 1,
  "emailNotifications": true,
  "pushNotifications": false,
  "appointmentReminders": true,
  "messageNotifications": true,
  "systemNotifications": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bildirim ayarları güncellendi"
}
```

---

## Toplu Mesaj (Admin için)

### POST `/api/messages/bulk`
Toplu mesaj gönderir (Admin için).

**Request:**
```json
{
  "subject": "Toplu Mesaj",
  "content": "Mesaj içeriği...",
  "targetAudience": "all"
}
```

**Not:** `targetAudience` değerleri: `all`, `student`, `academician`

**Response:**
```json
{
  "success": true,
  "message": "Mesaj tüm kullanıcılara gönderildi",
  "sentCount": 250
}
```

---

## Error Handling

Tüm hata durumlarında response şu formatta olmalıdır:

```json
{
  "success": false,
  "error": "Hata mesajı",
  "code": "ERROR_CODE"
}
```

### HTTP Status Kodları
- `200` - Başarılı
- `201` - Oluşturuldu
- `400` - Bad Request (Geçersiz istek)
- `401` - Unauthorized (Yetkisiz erişim)
- `403` - Forbidden (Yasak)
- `404` - Not Found (Bulunamadı)
- `500` - Internal Server Error (Sunucu hatası)

### Örnek Hata Response'ları

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Token geçersiz veya süresi dolmuş",
  "code": "INVALID_TOKEN"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": "E-posta adresi zaten kullanılıyor",
  "code": "EMAIL_EXISTS"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Randevu bulunamadı",
  "code": "APPOINTMENT_NOT_FOUND"
}
```

---

## Önemli Notlar

### 1. Şifre Gereksinimleri
- Minimum 8 karakter
- En az 1 büyük harf (A-Z)
- En az 1 küçük harf (a-z)
- En az 1 rakam (0-9)
- En az 1 özel karakter (!@#$%^&*...)

### 2. Tarih ve Zaman Formatları
- **Tarih:** `YYYY-MM-DD` formatında (örn: "2025-12-15")
- **Zaman:** `HH:MM` formatında (örn: "14:00")
- **DateTime:** ISO 8601 formatında (örn: "2025-12-09T10:30:00Z")

### 3. CORS Ayarları
Backend'de CORS ayarları yapılmalı. Frontend Vercel'de deploy edildiği için:
- `Access-Control-Allow-Origin: *` veya frontend domain'i
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

### 4. Authentication
- Tüm protected endpoint'lerde JWT token kontrolü yapılmalı
- Token `Authorization: Bearer <token>` header'ında gönderilir
- Token süresi dolduğunda 401 döndürülmeli

### 5. File Upload
Profil fotoğrafı yükleme için:
- Content-Type: `multipart/form-data`
- Max file size: 5MB
- Allowed types: `image/jpeg`, `image/png`, `image/gif`

### 6. Validation
Tüm input'lar backend'de validate edilmeli:
- Email format kontrolü
- Required field kontrolü
- Data type kontrolü
- Business logic kontrolü (örn: randevu çakışması)

---

**Son Güncelleme:** 15 Aralık 2025  
**Versiyon:** 1.0.0
