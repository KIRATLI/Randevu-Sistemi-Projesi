// Mock API - Backend hazırmış gibi davranıyoruz

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock database - gerçek uygulamada bu backend'de olacak
let mockAppointments = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Ahmet Yılmaz',
    studentNo: '12345678',
    academicianId: 1,
    academicianName: 'Prof. Dr. Ayşe Demir',
    date: '2025-12-15',
    time: '14:00',
    duration: 30,
    status: 'confirmed',
    subject: 'Proje danışmanlığı hakkında görüşme'
  },
  {
    id: 2,
    studentId: 1,
    studentName: 'Ahmet Yılmaz',
    studentNo: '12345678',
    academicianId: 2,
    academicianName: 'Doç. Dr. Mehmet Kaya',
    date: '2025-12-16',
    time: '10:00',
    duration: 30,
    status: 'pending',
    subject: 'Ders içeriği hakkında soru'
  },
  {
    id: 3,
    studentId: 2,
    studentName: 'Zeynep Kara',
    studentNo: '87654321',
    academicianId: 1,
    academicianName: 'Prof. Dr. Ayşe Demir',
    date: '2025-12-17',
    time: '15:00',
    duration: 30,
    status: 'pending',
    subject: 'Tez konusu görüşmesi'
  }
]

let academicianSchedules = {
  1: {
    workingHours: [
      { day: 'monday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'tuesday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'wednesday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'thursday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'friday', enabled: true, start: '09:00', end: '17:00' },
      { day: 'saturday', enabled: false, start: '09:00', end: '17:00' },
      { day: 'sunday', enabled: false, start: '09:00', end: '17:00' }
    ],
    slotDuration: 30,
    breakDuration: 15,
    maxAppointmentsPerDay: 10
  }
}

let mockMessages = [
  {
    id: 1,
    senderId: 1,
    senderName: 'Prof. Dr. Ayşe Demir',
    senderRole: 'academician',
    receiverId: 1,
    receiverName: 'Ahmet Yılmaz',
    receiverRole: 'student',
    subject: 'Randevu Onayı',
    content: 'Merhaba Ahmet, 15 Aralık tarihli randevunuz onaylanmıştır. Ofisime gelmenizi bekliyorum.',
    date: '2025-12-09T10:30:00',
    read: false,
    threadId: 1
  },
  {
    id: 2,
    senderId: 1,
    senderName: 'Ahmet Yılmaz',
    senderRole: 'student',
    receiverId: 1,
    receiverName: 'Prof. Dr. Ayşe Demir',
    receiverRole: 'academician',
    subject: 'Proje Konusu Hakkında',
    content: 'Sayın Hocam, bitirme projesi konusu olarak yapay zeka alanında bir çalışma yapmak istiyorum. Bu konuda görüşmek istiyorum.',
    date: '2025-12-08T14:20:00',
    read: true,
    threadId: 2
  },
  {
    id: 3,
    senderId: 2,
    senderName: 'Doç. Dr. Mehmet Kaya',
    senderRole: 'academician',
    receiverId: 1,
    receiverName: 'Ahmet Yılmaz',
    receiverRole: 'student',
    subject: 'Ders İçeriği',
    content: 'Merhaba, Veri Yapıları dersinin final sınavı için kapsam listesini ekte bulabilirsiniz.',
    date: '2025-12-07T09:15:00',
    read: true,
    threadId: 3
  },
  {
    id: 4,
    senderId: 1,
    senderName: 'Ahmet Yılmaz',
    senderRole: 'student',
    receiverId: 2,
    receiverName: 'Doç. Dr. Mehmet Kaya',
    receiverRole: 'academician',
    subject: 'Ödev Teslimi',
    content: 'Hocam, ödevin son teslim tarihini bir gün uzatabilir misiniz? Hasta olduğum için yetiştiremedim.',
    date: '2025-12-06T16:45:00',
    read: false,
    threadId: 4
  },
  {
    id: 5,
    senderId: 1,
    senderName: 'Prof. Dr. Ayşe Demir',
    senderRole: 'academician',
    receiverId: 1,
    receiverName: 'Ahmet Yılmaz',
    receiverRole: 'student',
    subject: 'Re: Proje Konusu Hakkında',
    content: 'Merhaba Ahmet, yapay zeka konusunda proje yapmak güzel bir fikir. Önümüzdeki hafta detaylı konuşalım.',
    date: '2025-12-08T16:30:00',
    read: false,
    threadId: 2,
    replyTo: 2
  }
]

let messageIdCounter = mockMessages.length + 1

let mockNotifications = [
  {
    id: 1,
    userId: 1,
    type: 'appointment_confirmed',
    title: 'Randevu Onaylandı',
    message: 'Prof. Dr. Ayşe Demir ile 15 Aralık 14:00 randevunuz onaylandı.',
    date: '2025-12-09T11:30:00',
    read: false,
    actionUrl: '/student/appointments',
    relatedId: 1
  },
  {
    id: 2,
    userId: 1,
    type: 'new_message',
    title: 'Yeni Mesaj',
    message: 'Prof. Dr. Ayşe Demir size mesaj gönderdi.',
    date: '2025-12-09T10:30:00',
    read: false,
    actionUrl: '/student/messages',
    relatedId: 1
  },
  {
    id: 3,
    userId: 1,
    type: 'appointment_reminder',
    title: 'Randevu Hatırlatması',
    message: 'Yarın saat 14:00\'te Prof. Dr. Ayşe Demir ile randevunuz var.',
    date: '2025-12-09T09:00:00',
    read: true,
    actionUrl: '/student/appointments',
    relatedId: 1
  },
  {
    id: 4,
    userId: 1,
    type: 'appointment_rejected',
    title: 'Randevu Reddedildi',
    message: 'Doç. Dr. Mehmet Kaya randevu talebinizi reddetti.',
    date: '2025-12-08T15:20:00',
    read: true,
    actionUrl: '/student/appointments',
    relatedId: 2
  },
  {
    id: 5,
    userId: 2,
    type: 'appointment_request',
    title: 'Yeni Randevu Talebi',
    message: 'Ahmet Yılmaz 17 Aralık 15:00 için randevu talep etti.',
    date: '2025-12-09T12:15:00',
    read: false,
    actionUrl: '/academician/appointments',
    relatedId: 3
  },
  {
    id: 6,
    userId: 2,
    type: 'new_message',
    title: 'Yeni Mesaj',
    message: 'Zeynep Kara size mesaj gönderdi.',
    date: '2025-12-09T08:45:00',
    read: false,
    actionUrl: '/academician/messages',
    relatedId: 4
  },
  {
    id: 7,
    userId: 1,
    type: 'system',
    title: 'Sistem Bildirimi',
    message: 'Profilinizi güncellediniz. Değişiklikler kaydedildi.',
    date: '2025-12-08T14:00:00',
    read: true,
    actionUrl: '/student/settings',
    relatedId: null
  },
  {
    id: 8,
    userId: 1,
    type: 'announcement',
    title: 'Yeni Duyuru',
    message: 'Sistem Bakım Bildirimi: 15 Aralık 02:00-06:00 arası hizmet dışı.',
    date: '2025-12-08T10:00:00',
    read: false,
    actionUrl: null,
    relatedId: 1
  },
  {
    id: 9,
    userId: 1,
    type: 'appointment_cancelled',
    title: 'Randevu İptal Edildi',
    message: 'Prof. Dr. Ayşe Demir 18 Aralık 11:00 randevunuzu iptal etti.',
    date: '2025-12-07T16:30:00',
    read: true,
    actionUrl: '/student/appointments',
    relatedId: 5
  },
  {
    id: 10,
    userId: 2,
    type: 'appointment_cancelled',
    title: 'Randevu İptal Edildi',
    message: 'Mehmet Aydın randevusunu iptal etti.',
    date: '2025-12-09T13:20:00',
    read: false,
    actionUrl: '/academician/appointments',
    relatedId: 6
  }
]

let notificationIdCounter = mockNotifications.length + 1

let mockUsers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@ankara.edu.tr',
    role: 'student',
    studentNo: '12345678',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    phone: '+90 555 123 4567',
    status: 'active',
    createdAt: '2024-09-01',
    lastLogin: '2025-12-09T10:30:00'
  },
  {
    id: 2,
    name: 'Zeynep Kara',
    email: 'zeynep@ankara.edu.tr',
    role: 'student',
    studentNo: '87654321',
    department: 'Elektrik-Elektronik Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    phone: '+90 555 234 5678',
    status: 'active',
    createdAt: '2024-09-01',
    lastLogin: '2025-12-08T15:20:00'
  },
  {
    id: 3,
    name: 'Prof. Dr. Ayşe Demir',
    email: 'ayse@ankara.edu.tr',
    role: 'academician',
    registrationNo: 'AKD-2024-001',
    title: 'Profesör',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'A-204',
    phone: '+90 312 XXX XX XX',
    status: 'active',
    createdAt: '2015-01-15',
    lastLogin: '2025-12-09T09:15:00'
  },
  {
    id: 4,
    name: 'Doç. Dr. Mehmet Kaya',
    email: 'mehmet@ankara.edu.tr',
    role: 'academician',
    registrationNo: 'AKD-2024-002',
    title: 'Doçent',
    department: 'Yazılım Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'B-101',
    phone: '+90 312 XXX XX XX',
    status: 'active',
    createdAt: '2018-03-10',
    lastLogin: '2025-12-09T11:45:00'
  },
  {
    id: 5,
    name: 'Can Özdemir',
    email: 'can@ankara.edu.tr',
    role: 'student',
    studentNo: '11223344',
    department: 'Makine Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    phone: '+90 555 345 6789',
    status: 'inactive',
    createdAt: '2024-09-01',
    lastLogin: '2025-11-20T14:30:00'
  },
  {
    id: 6,
    name: 'Admin User',
    email: 'admin@ankara.edu.tr',
    role: 'admin',
    department: 'BT Departmanı',
    phone: '+90 312 XXX XX XX',
    status: 'active',
    createdAt: '2020-01-01',
    lastLogin: '2025-12-09T12:00:00'
  }
]

let userIdCounter = mockUsers.length + 1

let mockProfiles = {
  1: {
    id: 1,
    userId: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@ankara.edu.tr',
    role: 'student',
    studentNo: '12345678',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    phone: '+90 555 123 4567',
    avatar: null,
    bio: '',
    birthDate: '2002-05-15',
    address: 'Ankara, Türkiye',
    emergencyContact: '+90 555 999 8888',
    enrollmentYear: 2020
  },
  2: {
    id: 2,
    userId: 1,
    name: 'Prof. Dr. Ayşe Demir',
    email: 'ayse@ankara.edu.tr',
    role: 'academician',
    title: 'Profesör',
    registrationNo: 'AKD-2024-001',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'A-204',
    phone: '+90 312 XXX XX XX',
    avatar: null,
    bio: 'Yapay Zeka ve Makine Öğrenmesi alanında çalışmalar yürütmekteyim. Lisans ve yüksek lisans öğrencilerine danışmanlık vermekteyim.',
    specializations: ['Yapay Zeka', 'Makine Öğrenmesi', 'Derin Öğrenme'],
    education: [
      { degree: 'Doktora', university: 'MIT', year: 2010, field: 'Computer Science' },
      { degree: 'Yüksek Lisans', university: 'Stanford', year: 2005, field: 'AI' },
      { degree: 'Lisans', university: 'Ankara Üniversitesi', year: 2003, field: 'Bilgisayar Mühendisliği' }
    ],
    publications: 45,
    hIndex: 18,
    officeHours: 'Pazartesi-Cuma 09:00-17:00'
  },
  3: {
    id: 3,
    userId: 3,
    name: 'Admin User',
    email: 'admin@ankara.edu.tr',
    role: 'admin',
    phone: '+90 312 XXX XX XX',
    avatar: null,
    department: 'BT Departmanı'
  }
}

const fakeFetch = async (endpoint, data = null, method = 'GET') => {
  // Simulate network delay
  await delay(500)
  
  // Mock responses based on endpoint
  const responses = {
    '/api/login': {
      success: true,
      token: 'mock-jwt-token-12345',
      user: {
        id: 1,
        name: 'Ahmet Yılmaz',
        email: 'ahmet@ankara.edu.tr',
        role: 'student'
      }
    },
    '/api/register': {
      success: true,
      message: 'Kayıt başarılı'
    },
    '/api/academicians': {
      success: true,
      data: [
        {
          id: 1,
          name: 'Prof. Dr. Ayşe Demir',
          department: 'Bilgisayar Mühendisliği',
          office: 'A-204',
          available: true
        },
        {
          id: 2,
          name: 'Doç. Dr. Mehmet Kaya',
          department: 'Yazılım Mühendisliği',
          office: 'B-101',
          available: true
        }
      ]
    },
    '/api/appointments': method === 'GET' ? {
      success: true,
      data: mockAppointments
    } : method === 'POST' ? {
      success: true,
      message: 'Randevu talebi oluşturuldu',
      data: {
        id: mockAppointments.length + 1,
        ...data,
        status: 'pending'
      }
    } : { success: false },
    '/api/appointments/approve': {
      success: true,
      message: 'Randevu onaylandı'
    },
    '/api/appointments/reject': {
      success: true,
      message: 'Randevu reddedildi'
    },
    '/api/appointments/cancel': {
      success: true,
      message: 'Randevu iptal edildi'
    },
    '/api/messages': method === 'GET' ? {
      success: true,
      data: mockMessages.filter(msg => {
        if (!data?.userId) return true
        return msg.senderId === data.userId || msg.receiverId === data.userId
      })
    } : method === 'POST' ? {
      success: true,
      message: 'Mesaj gönderildi',
      data: {
        id: messageIdCounter++,
        ...data,
        date: new Date().toISOString(),
        read: false
      }
    } : { success: false },
    '/api/messages/thread': {
      success: true,
      data: mockMessages.filter(msg => msg.threadId === data?.threadId)
    },
    '/api/messages/mark-read': {
      success: true,
      message: 'Mesaj okundu olarak işaretlendi'
    },
    '/api/messages/delete': {
      success: true,
      message: 'Mesaj silindi'
    },
    '/api/messages/unread-count': {
      success: true,
      count: mockMessages.filter(msg => 
        !msg.read && msg.receiverId === (data?.userId || 1)
      ).length
    },
    '/api/schedule': method === 'GET' ? {
      success: true,
      data: academicianSchedules[data?.academicianId || 1]
    } : method === 'POST' || method === 'PUT' ? {
      success: true,
      message: 'Program ayarları güncellendi',
      data: data
    } : { success: false },
    '/api/schedule/available-slots': {
      success: true,
      data: generateTimeSlots(data?.date, data?.academicianId)
    },
    '/api/schedule/available-dates': {
      success: true,
      data: generateAvailableDates(data?.academicianId, data?.month, data?.year)
    },
    '/api/students': {
      success: true,
      data: [
        {
          id: 1,
          name: 'Ahmet Yılmaz',
          studentNo: '12345678',
          department: 'Bilgisayar Mühendisliği'
        }
      ]
    },
    '/api/users': method === 'GET' ? {
      success: true,
      data: mockUsers,
      total: mockUsers.length
    } : method === 'POST' ? {
      success: true,
      message: 'Kullanıcı oluşturuldu',
      data: { id: userIdCounter++, ...data, createdAt: new Date().toISOString(), status: 'active' }
    } : { success: false },
    '/api/users/update': {
      success: true,
      message: 'Kullanıcı güncellendi'
    },
    '/api/users/delete': {
      success: true,
      message: 'Kullanıcı silindi'
    },
    '/api/users/search': {
      success: true,
      data: mockUsers.filter(u => 
        u.name.toLowerCase().includes(data?.query?.toLowerCase() || '') ||
        u.email.toLowerCase().includes(data?.query?.toLowerCase() || '')
      )
    },
    '/api/users/stats': {
      success: true,
      data: {
        total: mockUsers.length,
        students: mockUsers.filter(u => u.role === 'student').length,
        academicians: mockUsers.filter(u => u.role === 'academician').length,
        admins: mockUsers.filter(u => u.role === 'admin').length,
        active: mockUsers.filter(u => u.status === 'active').length,
        inactive: mockUsers.filter(u => u.status === 'inactive').length
      }
    },
    '/api/reports': {
      success: true,
      data: {
        totalAppointments: 1542,
        completedAppointments: 987,
        cancelledAppointments: 342,
        pendingAppointments: 213,
        monthlyTrend: [
          { month: 'Ocak', value: 120 },
          { month: 'Şubat', value: 145 },
          { month: 'Mart', value: 168 },
          { month: 'Nisan', value: 190 },
          { month: 'Mayıs', value: 210 },
          { month: 'Haziran', value: 195 },
          { month: 'Temmuz', value: 180 },
          { month: 'Ağustos', value: 85 },
          { month: 'Eylül', value: 155 },
          { month: 'Ekim', value: 178 },
          { month: 'Kasım', value: 198 },
          { month: 'Aralık', value: 118 }
        ],
        topAcademicians: [
          { name: 'Prof. Dr. Ayşe Demir', appointments: 145 },
          { name: 'Doç. Dr. Mehmet Kaya', appointments: 132 },
          { name: 'Dr. Öğr. Üyesi Fatma Yılmaz', appointments: 118 },
          { name: 'Dr. Öğr. Üyesi Ali Öztürk', appointments: 95 },
          { name: 'Öğr. Gör. Zeynep Çelik', appointments: 87 }
        ],
        departmentStats: [
          { name: 'Bilgisayar Mühendisliği', count: 456 },
          { name: 'Elektrik-Elektronik Mühendisliği', count: 342 },
          { name: 'Makine Mühendisliği', count: 278 },
          { name: 'İnşaat Mühendisliği', count: 245 },
          { name: 'Endüstri Mühendisliği', count: 221 }
        ]
      }
    },
    '/api/reports/logs': {
      success: true,
      data: [
        {
          id: 1,
          action: 'Kullanıcı Girişi',
          user: 'Admin User',
          timestamp: '2025-12-09T12:00:00',
          details: 'Admin paneline başarılı giriş'
        },
        {
          id: 2,
          action: 'Kullanıcı Oluşturma',
          user: 'Admin User',
          timestamp: '2025-12-09T11:45:00',
          details: 'Yeni öğrenci kaydı oluşturuldu'
        },
        {
          id: 3,
          action: 'Randevu İptal',
          user: 'Prof. Dr. Ayşe Demir',
          timestamp: '2025-12-09T11:30:00',
          details: 'Randevu #1234 iptal edildi'
        },
        {
          id: 4,
          action: 'Profil Güncelleme',
          user: 'Ahmet Yılmaz',
          timestamp: '2025-12-09T11:15:00',
          details: 'Profil bilgileri güncellendi'
        },
        {
          id: 5,
          action: 'Randevu Onayı',
          user: 'Doç. Dr. Mehmet Kaya',
          timestamp: '2025-12-09T11:00:00',
          details: 'Randevu #1235 onaylandı'
        }
      ]
    },
    '/api/students': {
      success: true,
      data: [
        {
          id: 1,
          name: 'Ahmet Yılmaz',
          studentNo: '20190001',
          email: 'ahmet.yilmaz@ankara.edu.tr',
          department: 'Bilgisayar Mühendisliği',
          faculty: 'Mühendislik Fakültesi',
          year: 4,
          gpa: 3.45,
          phone: '+90 555 123 4567',
          totalAppointments: 8,
          completedAppointments: 6,
          cancelledAppointments: 2,
          lastAppointment: '2025-12-05T14:00:00',
          nextAppointment: '2025-12-15T10:00:00',
          status: 'active'
        },
        {
          id: 2,
          name: 'Zeynep Kara',
          studentNo: '20190002',
          email: 'zeynep.kara@ankara.edu.tr',
          department: 'Bilgisayar Mühendisliği',
          faculty: 'Mühendislik Fakültesi',
          year: 4,
          gpa: 3.78,
          phone: '+90 555 234 5678',
          totalAppointments: 12,
          completedAppointments: 10,
          cancelledAppointments: 2,
          lastAppointment: '2025-12-08T11:00:00',
          nextAppointment: null,
          status: 'active'
        },
        {
          id: 3,
          name: 'Mehmet Aydın',
          studentNo: '20200015',
          email: 'mehmet.aydin@ankara.edu.tr',
          department: 'Bilgisayar Mühendisliği',
          faculty: 'Mühendislik Fakültesi',
          year: 3,
          gpa: 3.21,
          phone: '+90 555 345 6789',
          totalAppointments: 5,
          completedAppointments: 4,
          cancelledAppointments: 1,
          lastAppointment: '2025-11-28T13:00:00',
          nextAppointment: '2025-12-12T14:00:00',
          status: 'active'
        },
        {
          id: 4,
          name: 'Ayşe Demir',
          studentNo: '20200028',
          email: 'ayse.demir@ankara.edu.tr',
          department: 'Yazılım Mühendisliği',
          faculty: 'Mühendislik Fakültesi',
          year: 3,
          gpa: 3.92,
          phone: '+90 555 456 7890',
          totalAppointments: 15,
          completedAppointments: 13,
          cancelledAppointments: 2,
          lastAppointment: '2025-12-07T15:00:00',
          nextAppointment: '2025-12-18T11:00:00',
          status: 'active'
        },
        {
          id: 5,
          name: 'Can Öztürk',
          studentNo: '20210042',
          email: 'can.ozturk@ankara.edu.tr',
          department: 'Bilgisayar Mühendisliği',
          faculty: 'Mühendislik Fakültesi',
          year: 2,
          gpa: 2.87,
          phone: '+90 555 567 8901',
          totalAppointments: 3,
          completedAppointments: 2,
          cancelledAppointments: 1,
          lastAppointment: '2025-12-01T10:00:00',
          nextAppointment: null,
          status: 'active'
        },
        {
          id: 6,
          name: 'Elif Yıldız',
          studentNo: '20210055',
          email: 'elif.yildiz@ankara.edu.tr',
          department: 'Yazılım Mühendisliği',
          faculty: 'Mühendislik Fakültesi',
          year: 2,
          gpa: 3.65,
          phone: '+90 555 678 9012',
          totalAppointments: 7,
          completedAppointments: 6,
          cancelledAppointments: 1,
          lastAppointment: '2025-12-06T16:00:00',
          nextAppointment: '2025-12-20T13:00:00',
          status: 'active'
        },
        {
          id: 7,
          name: 'Burak Şen',
          studentNo: '20220018',
          email: 'burak.sen@ankara.edu.tr',
          department: 'Bilgisayar Mühendisliği',
          faculty: 'Mühendislik Fakültesi',
          year: 1,
          gpa: 3.12,
          phone: '+90 555 789 0123',
          totalAppointments: 2,
          completedAppointments: 1,
          cancelledAppointments: 1,
          lastAppointment: '2025-11-25T14:00:00',
          nextAppointment: '2025-12-14T10:00:00',
          status: 'active'
        },
        {
          id: 8,
          name: 'Selin Çelik',
          studentNo: '20220031',
          email: 'selin.celik@ankara.edu.tr',
          department: 'Yazılım Mühendisliği',
          faculty: 'Mühendislik Fakültesi',
          year: 1,
          gpa: 3.54,
          phone: '+90 555 890 1234',
          totalAppointments: 4,
          completedAppointments: 3,
          cancelledAppointments: 1,
          lastAppointment: '2025-12-03T11:00:00',
          nextAppointment: null,
          status: 'active'
        }
      ]
    },
    '/api/students/detail': {
      success: true,
      data: {
        id: data?.studentId || 1,
        name: 'Ahmet Yılmaz',
        studentNo: '20190001',
        email: 'ahmet.yilmaz@ankara.edu.tr',
        department: 'Bilgisayar Mühendisliği',
        faculty: 'Mühendislik Fakültesi',
        year: 4,
        gpa: 3.45,
        phone: '+90 555 123 4567',
        totalAppointments: 8,
        completedAppointments: 6,
        cancelledAppointments: 2,
        status: 'active',
        appointments: [
          {
            id: 1,
            date: '2025-12-15',
            time: '10:00',
            subject: 'Proje Danışmanlığı',
            status: 'confirmed',
            notes: 'Bitirme projesi için görüşme'
          },
          {
            id: 2,
            date: '2025-12-05',
            time: '14:00',
            subject: 'Ders İçeriği Görüşmesi',
            status: 'completed',
            notes: 'Veri yapıları dersi hakkında'
          },
          {
            id: 3,
            date: '2025-11-20',
            time: '11:00',
            subject: 'Sınav Hazırlığı',
            status: 'completed',
            notes: 'Final sınavı hazırlık'
          },
          {
            id: 4,
            date: '2025-11-10',
            time: '15:00',
            subject: 'Genel Danışmanlık',
            status: 'cancelled',
            notes: 'Öğrenci iptal etti'
          }
        ],
        notes: 'Başarılı bir öğrenci. Proje çalışmasında aktif rol alıyor.',
        registrationDate: '2019-09-15'
      }
    },
    '/api/profile': method === 'GET' ? {
      success: true,
      data: mockProfiles[data?.userId || 1]
    } : method === 'PUT' ? {
      success: true,
      message: 'Profil güncellendi',
      data: { ...mockProfiles[data?.userId || 1], ...data }
    } : { success: false },
    '/api/profile/avatar': {
      success: true,
      message: 'Profil fotoğrafı güncellendi',
      avatarUrl: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data?.name || 'User')
    },
    '/api/profile/change-password': {
      success: true,
      message: 'Şifre başarıyla değiştirildi'
    },
    '/api/notifications': method === 'GET' ? {
      success: true,
      data: mockNotifications.filter(n => n.userId === (data?.userId || 1))
    } : { success: false },
    '/api/notifications/unread-count': {
      success: true,
      count: mockNotifications.filter(n => 
        !n.read && n.userId === (data?.userId || 1)
      ).length
    },
    '/api/notifications/mark-read': {
      success: true,
      message: 'Bildirim okundu olarak işaretlendi'
    },
    '/api/notifications/mark-all-read': {
      success: true,
      message: 'Tüm bildirimler okundu olarak işaretlendi'
    },
    '/api/notifications/delete': {
      success: true,
      message: 'Bildirim silindi'
    },
    '/api/notifications/settings': method === 'GET' ? {
      success: true,
      data: {
        emailNotifications: true,
        pushNotifications: true,
        appointmentReminders: true,
        messageNotifications: true,
        systemNotifications: true
      }
    } : {
      success: true,
      message: 'Bildirim ayarları güncellendi'
    },
    '/api/announcements': {
      success: true,
      data: [
        {
          id: 1,
          title: 'Sistem Bakım Bildirimi',
          content: 'Randevu sistemi 15 Aralık 2025 tarihinde saat 02:00 - 06:00 arasında bakım çalışması nedeniyle hizmet dışı kalacaktır. Bu süre zarfında randevu alma ve görüntüleme işlemleri yapılamayacaktır.',
          type: 'warning',
          targetAudience: 'all',
          author: 'Admin User',
          createdAt: '2025-12-08T10:00:00',
          updatedAt: '2025-12-08T10:00:00',
          status: 'active',
          priority: 'high',
          views: 245,
          expiresAt: '2025-12-16T00:00:00'
        },
        {
          id: 2,
          title: 'Final Dönemi Randevu Bilgilendirmesi',
          content: 'Değerli öğrencilerimiz, final dönemi yaklaşmakta olup akademisyenlerimizle randevu taleplerinde artış beklenmektedir. Lütfen randevularınızı önceden planlayınız.',
          type: 'info',
          targetAudience: 'student',
          author: 'Admin User',
          createdAt: '2025-12-05T14:30:00',
          updatedAt: '2025-12-05T14:30:00',
          status: 'active',
          priority: 'medium',
          views: 512,
          expiresAt: '2025-12-31T23:59:59'
        },
        {
          id: 3,
          title: 'Yeni Özellik: Takvim Entegrasyonu',
          content: 'Randevularınızı artık Google Takvim ve Outlook ile senkronize edebilirsiniz. Ayarlar menüsünden entegrasyon seçeneklerini inceleyebilirsiniz.',
          type: 'success',
          targetAudience: 'all',
          author: 'Admin User',
          createdAt: '2025-12-01T09:00:00',
          updatedAt: '2025-12-01T09:00:00',
          status: 'active',
          priority: 'low',
          views: 387,
          expiresAt: null
        },
        {
          id: 4,
          title: 'Akademisyen Ofis Saatleri Güncellemesi',
          content: 'Sayın akademisyenlerimiz, lütfen ofis saatlerinizi ve müsaitlik durumlarınızı güncel tutmayı unutmayınız. Bu sayede öğrencilerimiz daha verimli randevu planlayabileceklerdir.',
          type: 'info',
          targetAudience: 'academician',
          author: 'Admin User',
          createdAt: '2025-11-28T11:15:00',
          updatedAt: '2025-11-28T11:15:00',
          status: 'active',
          priority: 'medium',
          views: 89,
          expiresAt: '2026-01-15T23:59:59'
        },
        {
          id: 5,
          title: 'Randevu İptal Politikası Hatırlatması',
          content: 'Randevularınızı iptal etmeniz gerektiğinde lütfen en az 24 saat önceden bildirimde bulununuz. Sürekli iptal eden kullanıcılar için kısıtlamalar uygulanabilir.',
          type: 'warning',
          targetAudience: 'student',
          author: 'Admin User',
          createdAt: '2025-11-20T16:45:00',
          updatedAt: '2025-11-20T16:45:00',
          status: 'active',
          priority: 'high',
          views: 623,
          expiresAt: null
        },
        {
          id: 6,
          title: 'Tatil Dönemi Bilgilendirmesi',
          content: 'Yeni yıl tatili süresince (25 Aralık - 3 Ocak) üniversitemiz kapalı olacaktır. Bu dönemde randevu sistemi aktif olmayacaktır.',
          type: 'info',
          targetAudience: 'all',
          author: 'Admin User',
          createdAt: '2025-11-15T10:00:00',
          updatedAt: '2025-11-15T10:00:00',
          status: 'archived',
          priority: 'medium',
          views: 891,
          expiresAt: '2025-12-24T23:59:59'
        }
      ]
    },
    '/api/announcements/create': {
      success: true,
      message: 'Duyuru oluşturuldu',
      data: { id: Date.now(), ...data, createdAt: new Date().toISOString(), views: 0, status: 'active' }
    },
    '/api/announcements/update': {
      success: true,
      message: 'Duyuru güncellendi'
    },
    '/api/announcements/delete': {
      success: true,
      message: 'Duyuru silindi'
    },
    '/api/messages/bulk': {
      success: true,
      message: `Mesaj ${data?.targetAudience === 'all' ? 'tüm kullanıcılara' : data?.targetAudience + ' kullanıcılarına'} gönderildi`,
      sentCount: data?.targetAudience === 'all' ? 250 : data?.targetAudience === 'student' ? 205 : 45
    }
  }

  return responses[endpoint] || { success: false, message: 'Endpoint not found' }
}

// Helper functions
const generateTimeSlots = (date, academicianId = 1) => {
  const slots = []
  const startHour = 9
  const endHour = 17
  const slotDuration = 30

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      
      // Check if slot is booked
      const isBooked = mockAppointments.some(
        apt => apt.academicianId === academicianId && 
               apt.date === date && 
               apt.time === time &&
               apt.status !== 'cancelled' &&
               apt.status !== 'rejected'
      )

      slots.push({
        time,
        available: !isBooked
      })
    }
  }

  return slots
}

const generateAvailableDates = (academicianId = 1, month, year) => {
  const dates = []
  const daysInMonth = new Date(year, month, 0).getDate()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()
    
    // Skip weekends for now (simple logic)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Skip past dates
      if (date >= new Date()) {
        dates.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
      }
    }
  }
  
  return dates
}

// API functions
export const api = {
  // Auth
  login: (data) => fakeFetch('/api/login', data, 'POST'),
  register: (data) => fakeFetch('/api/register', data, 'POST'),
  
  // Academicians
  getAcademicians: () => fakeFetch('/api/academicians'),
  getAcademician: (id) => fakeFetch(`/api/academicians/${id}`),
  
  // Appointments
  getAppointments: (filters) => fakeFetch('/api/appointments', filters),
  getAppointment: (id) => fakeFetch(`/api/appointments/${id}`),
  createAppointment: (data) => fakeFetch('/api/appointments', data, 'POST'),
  updateAppointment: (id, data) => fakeFetch(`/api/appointments/${id}`, data, 'PUT'),
  approveAppointment: (id) => fakeFetch('/api/appointments/approve', { id }, 'POST'),
  rejectAppointment: (id, reason) => fakeFetch('/api/appointments/reject', { id, reason }, 'POST'),
  cancelAppointment: (id, reason) => fakeFetch('/api/appointments/cancel', { id, reason }, 'POST'),
  
  // Messages
  getMessages: (userId) => fakeFetch('/api/messages', { userId }),
  getMessageThread: (threadId) => fakeFetch('/api/messages/thread', { threadId }),
  sendMessage: (data) => fakeFetch('/api/messages', data, 'POST'),
  markMessageAsRead: (messageId) => fakeFetch('/api/messages/mark-read', { messageId }, 'POST'),
  deleteMessage: (messageId) => fakeFetch('/api/messages/delete', { messageId }, 'DELETE'),
  getUnreadCount: (userId) => fakeFetch('/api/messages/unread-count', { userId }),
  
  // Schedule (for academicians)
  getSchedule: (academicianId) => fakeFetch('/api/schedule', { academicianId }),
  updateSchedule: (data) => fakeFetch('/api/schedule', data, 'POST'),
  getAvailableSlots: (date, academicianId) => fakeFetch('/api/schedule/available-slots', { date, academicianId }),
  getAvailableDates: (academicianId, month, year) => fakeFetch('/api/schedule/available-dates', { academicianId, month, year }),
  
  // Students (for academicians)
  getStudents: () => fakeFetch('/api/students'),
  getStudentDetail: (studentId) => fakeFetch('/api/students/detail', { studentId }),
  
  // Admin
  getUsers: () => fakeFetch('/api/users'),
  getUserStats: () => fakeFetch('/api/users/stats'),
  createUser: (data) => fakeFetch('/api/users', data, 'POST'),
  updateUser: (userId, data) => fakeFetch('/api/users/update', { userId, ...data }, 'PUT'),
  deleteUser: (userId) => fakeFetch('/api/users/delete', { userId }, 'DELETE'),
  searchUsers: (query) => fakeFetch('/api/users/search', { query }),
  getReports: () => fakeFetch('/api/reports'),
  getAppointmentStats: () => fakeFetch('/api/reports/appointments'),
  getSystemLogs: () => fakeFetch('/api/reports/logs'),
  getAnnouncements: () => fakeFetch('/api/announcements'),
  createAnnouncement: (data) => fakeFetch('/api/announcements/create', data, 'POST'),
  updateAnnouncement: (id, data) => fakeFetch('/api/announcements/update', { id, ...data }, 'PUT'),
  deleteAnnouncement: (id) => fakeFetch('/api/announcements/delete', { id }, 'DELETE'),
  sendBulkMessage: (data) => fakeFetch('/api/messages/bulk', data, 'POST'),

  // Profile
  getProfile: (userId) => fakeFetch('/api/profile', { userId }),
  updateProfile: (userId, data) => fakeFetch('/api/profile', { userId, ...data }, 'PUT'),
  uploadAvatar: (userId, file) => fakeFetch('/api/profile/avatar', { userId, name: file.name }, 'POST'),
  changePassword: (userId, oldPassword, newPassword) => fakeFetch('/api/profile/change-password', { userId, oldPassword, newPassword }, 'POST'),

  // Notifications
  getNotifications: (userId) => fakeFetch('/api/notifications', { userId }),
  getNotificationUnreadCount: (userId) => fakeFetch('/api/notifications/unread-count', { userId }),
  markNotificationAsRead: (notificationId) => fakeFetch('/api/notifications/mark-read', { notificationId }, 'POST'),
  markAllNotificationsAsRead: (userId) => fakeFetch('/api/notifications/mark-all-read', { userId }, 'POST'),
  deleteNotification: (notificationId) => fakeFetch('/api/notifications/delete', { notificationId }, 'DELETE'),
  getNotificationSettings: (userId) => fakeFetch('/api/notifications/settings', { userId }),
  updateNotificationSettings: (userId, settings) => fakeFetch('/api/notifications/settings', { userId, ...settings }, 'POST'),
}

export default api

