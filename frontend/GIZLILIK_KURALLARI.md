# GİZLİLİK ve GÜVENLİK KURALLARI

## ⚠️ ÖNEMLİ GİZLİLİK KURALLARI

Bu dosya, Ankara Üniversitesi Randevu Sisteminde uygulanması gereken **kritik gizlilik ve güvenlik kurallarını** içerir. Backend geliştirme sırasında bu kurallar **mutlaka** uygulanmalıdır.

---

## 🎫 DESTEK TALEPLERİ (TICKETS) SİSTEMİ

### 1. Kullanıcı Ticket Erişimi

**KURAL:** Her kullanıcı (Öğrenci/Akademisyen) **SADECE KENDI** oluşturduğu destek taleplerini görebilir.

#### Backend API Endpoint'leri:

```javascript
// ✅ DOĞRU - Sadece giriş yapmış kullanıcının ticket'larını döner
GET /api/tickets/my-tickets
Authorization: Bearer {user_token}

Response:
{
  success: true,
  data: [
    // Sadece giriş yapmış kullanıcının ticket'ları
  ]
}
```

```javascript
// ❌ YANLIŞ - Tüm ticket'ları döndürmemelidir
GET /api/tickets/all  // Bu endpoint öğrenci/akademisyen için OLMAMALIDIR
```

#### Backend Kontrolü (Örnek - Node.js/Express):

```javascript
router.get('/my-tickets', authenticateUser, async (req, res) => {
  const userId = req.user.id; // Token'dan kullanıcı ID'si
  
  // Sadece bu kullanıcının ticket'larını getir
  const tickets = await Ticket.find({ userId: userId });
  
  res.json({ success: true, data: tickets });
});
```

---

### 2. Ticket Detay Erişimi

**KURAL:** Kullanıcı bir ticket'ı görüntülerken, o ticket'ın sahibi olup olmadığı kontrol edilmelidir.

#### Backend Kontrolü:

```javascript
router.get('/tickets/:ticketId', authenticateUser, async (req, res) => {
  const ticketId = req.params.ticketId;
  const userId = req.user.id;
  
  const ticket = await Ticket.findById(ticketId);
  
  // ÖNEMLİ KONTROL: Ticket sahibi mi?
  if (ticket.userId !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Bu ticket\'a erişim yetkiniz yok' 
    });
  }
  
  res.json({ success: true, data: ticket });
});
```

---

### 3. Ticket'a Yanıt Verme

**KURAL:** Kullanıcı sadece **kendi ticket'larına** yanıt verebilir. Admin ise tüm ticket'lara yanıt verebilir.

#### Backend Kontrolü:

```javascript
router.post('/tickets/:ticketId/reply', authenticateUser, async (req, res) => {
  const ticketId = req.params.ticketId;
  const userId = req.user.id;
  const { message } = req.body;
  
  const ticket = await Ticket.findById(ticketId);
  
  // ÖNEMLİ KONTROL: Sadece ticket sahibi veya admin yanıt verebilir
  if (ticket.userId !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Bu ticket\'a yanıt verme yetkiniz yok' 
    });
  }
  
  const reply = await Reply.create({
    ticketId,
    userId,
    message,
    role: req.user.role
  });
  
  res.json({ success: true, data: reply });
});
```

---

## 📅 RANDEVU SİSTEMİ

### 1. Randevu Listesi Erişimi

**KURAL:** 
- **Öğrenci:** Sadece kendi randevularını görebilir
- **Akademisyen:** Sadece kendisiyle yapılan randevuları görebilir
- **Admin:** Tüm randevuları görebilir

#### Backend Kontrolü:

```javascript
router.get('/appointments', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  
  let appointments;
  
  switch(userRole) {
    case 'student':
      // Sadece bu öğrencinin randevuları
      appointments = await Appointment.find({ studentId: userId });
      break;
      
    case 'academician':
      // Sadece bu akademisyenle yapılan randevular
      appointments = await Appointment.find({ academicianId: userId });
      break;
      
    case 'admin':
      // Admin tüm randevuları görebilir
      appointments = await Appointment.find({});
      break;
      
    default:
      return res.status(403).json({ success: false, message: 'Yetkisiz erişim' });
  }
  
  res.json({ success: true, data: appointments });
});
```

---

## 💬 MESAJLAŞMA SİSTEMİ

### 1. Mesaj Erişimi

**KURAL:** Kullanıcı sadece **kendisinin gönderen veya alıcı olduğu** mesajları görebilir.

#### Backend Kontrolü:

```javascript
router.get('/messages', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  
  // Kullanıcının gönderdiği VEYA aldığı mesajlar
  const messages = await Message.find({
    $or: [
      { senderId: userId },
      { receiverId: userId }
    ]
  });
  
  res.json({ success: true, data: messages });
});
```

---

## 🔐 GENEL GÜVENLİK KURALLARI

### 1. Token Doğrulama

Her API isteğinde kullanıcı kimliği JWT token ile doğrulanmalıdır:

```javascript
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token yok' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Geçersiz token' });
  }
};
```

---

### 2. Rol Kontrolü

Bazı endpoint'ler sadece belirli roller için erişilebilir olmalıdır:

```javascript
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Bu işlem için admin yetkisi gerekli' 
    });
  }
  next();
};

// Kullanım
router.delete('/tickets/:id', authenticateUser, requireAdmin, async (req, res) => {
  // Sadece admin ticket silebilir
});
```

---

### 3. Veri Sanitizasyonu

Tüm kullanıcı girdileri sanitize edilmelidir:

```javascript
const sanitize = require('mongo-sanitize');

router.post('/tickets', authenticateUser, async (req, res) => {
  const { subject, description } = sanitize(req.body);
  
  // Temizlenmiş veri ile işlem yap
});
```

---

## ✅ KONTROL LİSTESİ

Backend geliştirme tamamlandığında aşağıdaki kontroller yapılmalıdır:

- [ ] Öğrenci sadece kendi ticket'larını görebiliyor mu?
- [ ] Akademisyen sadece kendi ticket'larını görebiliyor mu?
- [ ] Kullanıcı başka birinin ticket'ına yanıt veremiyor mu?
- [ ] Öğrenci sadece kendi randevularını görebiliyor mu?
- [ ] Akademisyen sadece kendisiyle olan randevuları görebiliyor mu?
- [ ] Mesajlaşmada sadece ilgili taraflar mesajları görebiliyor mu?
- [ ] Tüm endpoint'lerde JWT token kontrolü var mı?
- [ ] Rol bazlı erişim kontrolleri çalışıyor mu?
- [ ] Veri sanitizasyonu yapılıyor mu?
- [ ] HTTPS kullanılıyor mu?
- [ ] Rate limiting uygulanmış mı?

---

## 🚨 GÜVENLİK AÇIĞI SENARYOLARI

### Senaryo 1: Ticket ID Tahmin Etme

**Saldırı:**
```
GET /api/tickets/123
GET /api/tickets/124
GET /api/tickets/125
```

**Korunma:**
- Her ticket erişiminde kullanıcı sahipliği kontrol edin
- UUID kullanarak ID'leri tahmin edilemez yapın

---

### Senaryo 2: Başkasının Verisini Değiştirme

**Saldırı:**
```
PUT /api/tickets/123
{
  "status": "closed",
  "userId": 456  // Başka kullanıcının ID'si
}
```

**Korunma:**
- Request body'deki userId'yi **KULLANMAYIN**
- Token'dan gelen userId'yi kullanın

---

## 📞 İLETİŞİM

Güvenlik açığı tespit ederseniz:
- Email: security@ankara.edu.tr
- Acil: +90 XXX XXX XX XX

---

**Son Güncelleme:** 24 Aralık 2025
**Versiyon:** 1.0
**Sorumlular:** Backend Geliştirme Ekibi
