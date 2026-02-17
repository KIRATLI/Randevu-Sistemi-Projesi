import * as yup from 'yup'

// Türkçe hata mesajları
yup.setLocale({
    mixed: {
        default: 'Geçerli bir değer giriniz',
        required: 'Bu alan zorunludur',
        notType: 'Geçersiz format',
    },
    string: {
        min: ({ min }) => `En az ${min} karakter olmalıdır`,
        max: ({ max }) => `En fazla ${max} karakter olmalıdır`,
        email: 'Geçerli bir email adresi giriniz',
        url: 'Geçerli bir URL giriniz',
    },
    number: {
        min: ({ min }) => `En az ${min} olmalıdır`,
        max: ({ max }) => `En fazla ${max} olmalıdır`,
        positive: 'Pozitif bir sayı olmalıdır',
        negative: 'Negatif bir sayı olmalıdır',
        integer: 'Tam sayı olmalıdır',
    },
    date: {
        min: ({ min }) => `${min} tarihinden sonra olmalıdır`,
        max: ({ max }) => `${max} tarihinden önce olmalıdır`,
    },
    array: {
        min: ({ min }) => `En az ${min} öğe seçmelisiniz`,
        max: ({ max }) => `En fazla ${max} öğe seçebilirsiniz`,
    },
})

// Yaygın validation şemaları
export const commonSchemas = {
    // Email validation
    email: yup
        .string()
        .email()
        .required()
        .matches(/@ankara\.edu\.tr$/, 'Ankara Üniversitesi email adresi kullanmalısınız'),

    // Şifre validation
    password: yup
        .string()
        .required()
        .min(8, 'Şifre en az 8 karakter olmalıdır')
        .matches(/[a-z]/, 'En az bir küçük harf içermelidir')
        .matches(/[A-Z]/, 'En az bir büyük harf içermelidir')
        .matches(/[0-9]/, 'En az bir rakam içermelidir')
        .matches(/[@$!%*?&]/, 'En az bir özel karakter içermelidir'),

    // Şifre onayı
    passwordConfirm: (passwordField = 'password') =>
        yup
            .string()
            .required()
            .oneOf([yup.ref(passwordField)], 'Şifreler eşleşmiyor'),

    // Telefon
    phone: yup
        .string()
        .required()
        .matches(/^[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz (10 haneli)'),

    // TC Kimlik No
    tcNo: yup
        .string()
        .required()
        .matches(/^[1-9][0-9]{10}$/, 'Geçerli bir TC Kimlik No giriniz'),

    // Öğrenci No
    studentNo: yup
        .string()
        .required()
        .matches(/^[0-9]{8}$/, 'Öğrenci numarası 8 haneli olmalıdır'),

    // Tarih (bugünden sonra)
    futureDate: yup
        .date()
        .required()
        .min(new Date(), 'Geçmiş bir tarih seçemezsiniz'),

    // Tarih (bugünden önce - doğum tarihi için)
    pastDate: yup
        .date()
        .required()
        .max(new Date(), 'Gelecek bir tarih seçemezsiniz'),

    // Saat (09:00-17:00 arası)
    workingHours: yup
        .string()
        .required()
        .test('is-working-hours', 'Çalışma saatleri içinde olmalıdır (09:00-17:00)', (value) => {
            if (!value) return false
            const [hours] = value.split(':').map(Number)
            return hours >= 9 && hours < 17
        }),
}

// Form validation şemaları
export const validationSchemas = {
    // Login formu
    login: yup.object({
        email: commonSchemas.email,
        password: yup.string().required('Şifre gereklidir'),
    }),

    // Kayıt formu
    register: yup.object({
        name: yup.string().required().min(2).max(50),
        email: commonSchemas.email,
        password: commonSchemas.password,
        passwordConfirm: commonSchemas.passwordConfirm(),
        studentNo: commonSchemas.studentNo,
        phone: commonSchemas.phone,
        acceptTerms: yup.boolean().oneOf([true], 'Kullanım şartlarını kabul etmelisiniz'),
    }),

    // Randevu oluşturma
    appointment: yup.object({
        academicianId: yup.number().required('Akademisyen seçiniz'),
        date: commonSchemas.futureDate,
        time: commonSchemas.workingHours,
        subject: yup.string().required().min(10, 'Konu en az 10 karakter olmalıdır').max(200),
        description: yup.string().max(500, 'Açıklama en fazla 500 karakter olmalıdır'),
    }),

    // Profil güncelleme
    profile: yup.object({
        name: yup.string().required().min(2).max(50),
        phone: commonSchemas.phone,
        bio: yup.string().max(500),
    }),

    // Şifre değiştirme
    changePassword: yup.object({
        currentPassword: yup.string().required('Mevcut şifrenizi giriniz'),
        newPassword: commonSchemas.password,
        newPasswordConfirm: commonSchemas.passwordConfirm('newPassword'),
    }),

    // Destek talebi
    supportTicket: yup.object({
        category: yup.string().required('Kategori seçiniz'),
        priority: yup.string().required('Öncelik seçiniz'),
        subject: yup.string().required().min(5).max(100),
        description: yup.string().required().min(20).max(1000),
    }),

    // Duyuru oluşturma (Admin)
    announcement: yup.object({
        title: yup.string().required().min(5).max(150),
        content: yup.string().required().min(20),
        type: yup.string().required(),
        priority: yup.string().required(),
        targetAudience: yup.array().min(1, 'En az bir hedef kitle seçiniz'),
        startDate: yup.date().required(),
        endDate: yup
            .date()
            .required()
            .min(yup.ref('startDate'), 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır'),
    }),
}

// Custom validation fonksiyonları
export const customValidators = {
    // Email domain kontrolü
    isUniversityEmail: (email) => {
        return /@ankara\.edu\.tr$/.test(email)
    },

    // Güçlü şifre kontrolü
    isStrongPassword: (password) => {
        return (
            password.length >= 8 &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[@$!%*?&]/.test(password)
        )
    },

    // Tarih aralığı kontrolü
    isDateInRange: (date, minDate, maxDate) => {
        const dateObj = new Date(date)
        return dateObj >= minDate && dateObj <= maxDate
    },
}

export default yup
