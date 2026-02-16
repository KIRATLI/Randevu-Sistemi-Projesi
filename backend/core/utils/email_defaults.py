DEFAULT_EMAILS = {
    'welcome': {
        'name': 'Hoş Geldiniz Maili',
        'subject': 'Ankara Üniversitesi Akademik Randevu Sistemine Hoş Geldiniz 🎓',
        'body': (
            "Merhaba {{user_name}},\n\n"
            "Akademik Randevu Sistemine kaydınız başarıyla tamamlanmıştır. "
            "Artık sistem üzerinden randevu trafiğinizi yönetebilir, duyuruları takip edebilir "
            "ve hocalarınızla/öğrencilerinizle mesajlaşabilirsiniz.\n\n"
            "Giriş Adresi: {{login_url}}\n\n"
            "İyi çalışmalar dileriz,\n"
            "Ankara Üniversitesi Yönetim Sistemi"
        )
    },
    'appointment-approved': {
        'name': 'Randevu Onay Maili',
        'subject': 'Randevunuz Onaylandı: {{date}} - {{time}} ✅',
        'body': (
            "Sayın {{student_name}},\n\n"
            "{{academician_name}} ile olan randevu talebiniz onaylanmıştır.\n\n"
            "Randevu Detayları:\n"
            "- Tarih: {{date}}\n"
            "- Saat: {{time}}\n"
            "- Konu: {{subject}}\n\n"
            "Lütfen randevu saatinde belirtilen konumda hazır olunuz.\n\n"
            "Sistem adresi: {{login_url}}"
        )
    },
    'appointment-rejected': {
        'name': 'Randevu Red Maili',
        'subject': 'Randevu Talebiniz Hakkında Bilgilendirme ❌',
        'body': (
            "Sayın {{student_name}},\n\n"
            "{{academician_name}} ile {{date}} tarihinde planladığınız randevu talebi maalesef reddedilmiştir.\n\n"
            "Red Sebebi: {{reason}}\n\n"
            "Dilerseniz hocamızın uygun olduğu başka bir zaman dilimi için yeni bir talep oluşturabilirsiniz.\n\n"
            "İyi günler dileriz."
        )
    },
    'appointment-cancelled': {
        'name': 'Randevu İptal Maili',
        'subject': 'Randevu İptal Edildi: {{date}} ⚠️',
        'body': (
            "Bilgilendirme,\n\n"
            "{{date}} tarihindeki randevunuz {{cancelled_by}} tarafından iptal edilmiştir.\n\n"
            "İptal Nedeni: {{reason}}\n\n"
            "Güncel durumunuzu sistem üzerinden kontrol edebilirsiniz.\n\n"
            "{{login_url}}"
        )
    },
    'appointment-reminder': {
        'name': 'Randevu Hatırlatma Maili',
        'subject': 'Hatırlatma: Yarın Randevunuz Var! ⏰',
        'body': (
            "Merhaba {{student_name}},\n\n"
            "Yarın saat {{time}}'da {{academician_name}} ile bir randevunuz bulunmaktadır. "
            "Unutmamanız için size bu hatırlatmayı göndermek istedik.\n\n"
            "Başarılar dileriz."
        )
    },
    'password-reset': {
        'name': 'Şifre Sıfırlama Maili',
        'subject': 'Şifre Sıfırlama Talebi 🔐',
        'body': (
            "Merhaba,\n\n"
            "Hesabınız için şifre sıfırlama talebinde bulundunuz. "
            "Aşağıdaki bağlantıyı kullanarak yeni şifrenizi belirleyebilirsiniz:\n\n"
            "{{reset_link}}\n\n"
            "Bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayınız.\n\n"
            "Güvenliğiniz için bu bağlantı 24 saat içinde geçerliliğini yitirecektir."
        )
    }
}