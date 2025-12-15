// Mock data for development and testing

export const mockUsers = {
  student: {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@ankara.edu.tr',
    studentNo: '12345678',
    department: 'Bilgisayar Mühendisliği',
    role: 'student'
  },
  academician: {
    id: 2,
    name: 'Prof. Dr. Ayşe Demir',
    email: 'ayse@ankara.edu.tr',
    department: 'Bilgisayar Mühendisliği',
    office: 'A-204',
    role: 'academician'
  },
  admin: {
    id: 3,
    name: 'Admin User',
    email: 'admin@ankara.edu.tr',
    role: 'admin'
  }
}

export const mockAcademicians = [
  {
    id: 1,
    name: 'Prof. Dr. Ayşe Demir',
    title: 'Profesör',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'A-204',
    phone: '+90 312 XXX XX 01',
    email: 'ayse.demir@ankara.edu.tr',
    available: true,
    specialization: 'Veri Tabanı Sistemleri, Yazılım Mühendisliği',
    bio: 'Veri tabanı sistemleri ve yazılım mühendisliği alanında 20 yıllık deneyime sahip. Ulusal ve uluslararası projelerde görev almıştır.',
    officeHours: 'Pazartesi 14:00-16:00, Çarşamba 10:00-12:00',
    rating: 4.8,
    totalAppointments: 145
  },
  {
    id: 2,
    name: 'Doç. Dr. Mehmet Kaya',
    title: 'Doçent',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'B-101',
    phone: '+90 312 XXX XX 02',
    email: 'mehmet.kaya@ankara.edu.tr',
    available: true,
    specialization: 'Algoritmalar, Veri Yapıları',
    bio: 'Algoritma tasarımı ve veri yapıları konusunda uzman. ACM ICPC yarışmalarında danışmanlık yapmaktadır.',
    officeHours: 'Salı 13:00-15:00, Perşembe 09:00-11:00',
    rating: 4.6,
    totalAppointments: 132
  },
  {
    id: 3,
    name: 'Dr. Öğr. Üyesi Zeynep Yıldız',
    title: 'Dr. Öğretim Üyesi',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'C-305',
    phone: '+90 312 XXX XX 03',
    email: 'zeynep.yildiz@ankara.edu.tr',
    available: false,
    specialization: 'Yapay Zeka, Makine Öğrenmesi',
    bio: 'Yapay zeka ve makine öğrenmesi alanında araştırmalar yapmaktadır. Derin öğrenme projeleri yürütmektedir.',
    officeHours: 'Çarşamba 14:00-16:00',
    rating: 4.9,
    totalAppointments: 118
  },
  {
    id: 4,
    name: 'Prof. Dr. Ali Öztürk',
    title: 'Profesör',
    department: 'Elektrik-Elektronik Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'D-102',
    phone: '+90 312 XXX XX 04',
    email: 'ali.ozturk@ankara.edu.tr',
    available: true,
    specialization: 'Güç Sistemleri, Yenilenebilir Enerji',
    bio: 'Elektrik güç sistemleri ve yenilenebilir enerji kaynakları konusunda uzman. TÜBİTAK projelerinde yürütücü.',
    officeHours: 'Pazartesi 10:00-12:00, Cuma 13:00-15:00',
    rating: 4.7,
    totalAppointments: 95
  },
  {
    id: 5,
    name: 'Doç. Dr. Fatma Yılmaz',
    title: 'Doçent',
    department: 'Elektrik-Elektronik Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'D-205',
    phone: '+90 312 XXX XX 05',
    email: 'fatma.yilmaz@ankara.edu.tr',
    available: true,
    specialization: 'Sinyal İşleme, Görüntü İşleme',
    bio: 'Dijital sinyal işleme ve görüntü işleme alanlarında çalışmalar yürütmektedir.',
    officeHours: 'Salı 10:00-12:00, Perşembe 14:00-16:00',
    rating: 4.5,
    totalAppointments: 87
  },
  {
    id: 6,
    name: 'Dr. Öğr. Üyesi Can Arslan',
    title: 'Dr. Öğretim Üyesi',
    department: 'Makine Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'E-301',
    phone: '+90 312 XXX XX 06',
    email: 'can.arslan@ankara.edu.tr',
    available: true,
    specialization: 'Termodinamik, Enerji Sistemleri',
    bio: 'Termodinamik ve enerji dönüşüm sistemleri üzerine araştırmalar yapmaktadır.',
    officeHours: 'Çarşamba 09:00-11:00, Cuma 10:00-12:00',
    rating: 4.4,
    totalAppointments: 76
  },
  {
    id: 7,
    name: 'Prof. Dr. Elif Koç',
    title: 'Profesör',
    department: 'İnşaat Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'F-104',
    phone: '+90 312 XXX XX 07',
    email: 'elif.koc@ankara.edu.tr',
    available: true,
    specialization: 'Yapı Mekaniği, Deprem Mühendisliği',
    bio: 'Yapı mekaniği ve deprem mühendisliği alanında 25 yıllık deneyime sahip. Uluslararası dergilerde yayınları bulunmaktadır.',
    officeHours: 'Pazartesi 13:00-15:00, Perşembe 10:00-12:00',
    rating: 4.9,
    totalAppointments: 102
  },
  {
    id: 8,
    name: 'Doç. Dr. Ahmet Şen',
    title: 'Doçent',
    department: 'Endüstri Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'G-201',
    phone: '+90 312 XXX XX 08',
    email: 'ahmet.sen@ankara.edu.tr',
    available: true,
    specialization: 'Üretim Planlama, Lojistik',
    bio: 'Üretim planlama ve lojistik yönetimi konularında danışmanlık hizmetleri vermektedir.',
    officeHours: 'Salı 14:00-16:00, Cuma 09:00-11:00',
    rating: 4.3,
    totalAppointments: 68
  },
  {
    id: 9,
    name: 'Dr. Öğr. Üyesi Deniz Çelik',
    title: 'Dr. Öğretim Üyesi',
    department: 'Kimya Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'H-302',
    phone: '+90 312 XXX XX 09',
    email: 'deniz.celik@ankara.edu.tr',
    available: false,
    specialization: 'Biyokimya Mühendisliği, Biyoteknoloji',
    bio: 'Biyokimya mühendisliği ve endüstriyel biyoteknoloji alanında çalışmalar yürütmektedir.',
    officeHours: 'Çarşamba 11:00-13:00',
    rating: 4.6,
    totalAppointments: 54
  },
  {
    id: 10,
    name: 'Öğr. Gör. Selin Aydın',
    title: 'Öğretim Görevlisi',
    department: 'Bilgisayar Mühendisliği',
    faculty: 'Mühendislik Fakültesi',
    office: 'A-108',
    phone: '+90 312 XXX XX 10',
    email: 'selin.aydin@ankara.edu.tr',
    available: true,
    specialization: 'Web Programlama, Mobil Uygulama Geliştirme',
    bio: 'Web teknolojileri ve mobil uygulama geliştirme derslerini yürütmektedir.',
    officeHours: 'Pazartesi 10:00-12:00, Çarşamba 13:00-15:00',
    rating: 4.7,
    totalAppointments: 89
  },
  {
    id: 11,
    name: 'Prof. Dr. Kemal Demir',
    title: 'Profesör',
    department: 'Matematik',
    faculty: 'Fen Fakültesi',
    office: 'M-201',
    phone: '+90 312 XXX XX 11',
    email: 'kemal.demir@ankara.edu.tr',
    available: true,
    specialization: 'Diferansiyel Denklemler, Matematiksel Modelleme',
    bio: 'Uygulamalı matematik ve matematiksel modelleme alanında uzman.',
    officeHours: 'Salı 10:00-12:00, Perşembe 13:00-15:00',
    rating: 4.5,
    totalAppointments: 72
  },
  {
    id: 12,
    name: 'Doç. Dr. Ayşe Kara',
    title: 'Doçent',
    department: 'Fizik',
    faculty: 'Fen Fakültesi',
    office: 'F-305',
    phone: '+90 312 XXX XX 12',
    email: 'ayse.kara@ankara.edu.tr',
    available: true,
    specialization: 'Kuantum Fiziği, Katı Hal Fiziği',
    bio: 'Kuantum mekaniği ve katı hal fiziği üzerine teorik çalışmalar yapmaktadır.',
    officeHours: 'Pazartesi 14:00-16:00, Çarşamba 10:00-12:00',
    rating: 4.8,
    totalAppointments: 61
  }
]

export const mockAppointments = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Ahmet Yılmaz',
    academicianId: 1,
    academicianName: 'Prof. Dr. Ayşe Demir',
    date: '2025-12-15',
    time: '14:00',
    duration: 30,
    status: 'confirmed',
    subject: 'Proje danışmanlığı'
  },
  {
    id: 2,
    studentId: 1,
    studentName: 'Ahmet Yılmaz',
    academicianId: 2,
    academicianName: 'Doç. Dr. Mehmet Kaya',
    date: '2025-12-16',
    time: '10:00',
    duration: 30,
    status: 'pending',
    subject: 'Ders içeriği hakkında'
  }
]

export const mockMessages = [
  {
    id: 1,
    from: 'Prof. Dr. Ayşe Demir',
    fromId: 2,
    to: 'Ahmet Yılmaz',
    toId: 1,
    subject: 'Randevu Onayı',
    content: 'Randevunuz onaylanmıştır.',
    date: '2025-12-09',
    read: false
  },
  {
    id: 2,
    from: 'Doç. Dr. Mehmet Kaya',
    fromId: 2,
    to: 'Ahmet Yılmaz',
    toId: 1,
    subject: 'Proje Hakkında',
    content: 'Projeniz için toplantı yapalım.',
    date: '2025-12-08',
    read: true
  }
]

export default {
  mockUsers,
  mockAcademicians,
  mockAppointments,
  mockMessages
}

