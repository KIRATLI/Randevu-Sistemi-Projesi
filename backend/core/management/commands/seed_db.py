from django.core.management.base import BaseCommand

from core.models.profile import Profile
from core.models.schedule import Schedule, WorkingSlot
from core.models.user import AbstractCustomUser, Student, Academician, Specialization

class Command(BaseCommand):
    help = 'Veritabanını başlangıç (mock) verileriyle doldurur.'

    def handle(self, *args, **kwargs):
        # 1. KONTROL: Veritabanı zaten dolu mu?
        if AbstractCustomUser.objects.filter(email='admin@ankara.edu.tr').exists():
            self.stdout.write(self.style.WARNING('Uyarı: Veritabanında zaten veri var. Seeding işlemi atlandı.'))
            return

        self.stdout.write(self.style.SUCCESS('Seeding işlemi başlatılıyor...'))

        # ==========================================
        # 2. KULLANICI (USER) VERİLERİNİ OLUŞTURMA
        # ==========================================
        # Django'da şifrelerin hashlenmesi gerektiği için create_user veya create_superuser kullanıyoruz.
        # Herkesin şifresini standart "password123" yapıyoruz ki test edebilesin.

        self.stdout.write('Kullanıcılar oluşturuluyor...')

        admin_user = AbstractCustomUser.objects.create_superuser(
            username='admin',
            email='admin@ankara.edu.tr',
            password='password123',
            role='admin',
            department='BT Departmanı',
        )
        Profile.objects.create(
            user=admin_user,
            phone='+90 312 XXX XX XX'
        )


        student_user_1 = Student.objects.create_user(
            username='ahmetyilmaz',
            email='ahmet@ankara.edu.tr',
            password='password123',
            first_name='Ahmet',
            last_name='Yılmaz',
            role='student',
            number='12345678',
            department='Bilgisayar Mühendisliği',
            faculty='Mühendislik Fakültesi',
            gpa='3.4'
        )
        Profile.objects.create(
            user=student_user_1,
            phone='+90 555 123 4567',
            birth_date='2002-05-15',
            address='Ankara, Türkiye',
            emergency_contact='+90 555 999 8888',
            enrollment_year=2020
        )


        student_user_2 = Student.objects.create_user(
            username='zeynepkara',
            email='zeynep@ankara.edu.tr',
            password='password123',
            first_name='Zeynep',
            last_name='Kara',
            role='student',
            number='87654321',
            department='Elektrik Elektronik Mühendisliği',
            faculty='Mühendislik Fakültesi',
            gpa='3.8'
        )
        Profile.objects.create(
            user=student_user_2,
            phone='+90 555 234 5678',
            birth_date='2002-04-11',
            address='Ankara, Türkiye',
            emergency_contact='+90 555 777 6666',
            enrollment_year=2020
        )


        # Specializations
        sps_yapayzeka = Specialization.objects.create(name='Yapay Zeka')
        sps_makineogrenmesi = Specialization.objects.create(name='Makine Öğrenmesi')
        sps_derinogrenme = Specialization.objects.create(name='Derin Öğrenme')

        academician_user_1 = Academician.objects.create_user(
            username='aysedemir',
            email='ayse.demir@ankara.edu.tr',
            password='password123',
            first_name='Ayşe',
            last_name='Demir',
            role='academician',
            number='AKD-2024-001',
            department='Bilgisayar Mühendisliği',
            faculty='Mühendislik Fakültesi',
            office='A-204'
        )
        Profile.objects.create(
            user=academician_user_1,
            bio='Yapay Zeka ve Makine Öğrenmesi alanında çalışmalar yürütmekteyim. Lisans ve yüksek lisans öğrencilerine danışmanlık vermekteyim.',
            phone='+90 312 XXX XX XX'
        )
        academician_user_1.specializations.set([sps_yapayzeka, sps_makineogrenmesi, sps_derinogrenme])
        schedule_1 = Schedule.objects.create(
            academician=academician_user_1,
            slot_duration=30,
            break_duration=15,
            max_appointments_per_day=10
        )
        WorkingSlot.objects.create(schedule=schedule_1, day='monday', start_time='09:00', end_time='15:00')
        WorkingSlot.objects.create(schedule=schedule_1, day='tuesday', start_time='09:00', end_time='17:00')


        academician_user_2 = Academician.objects.create_user(
            username='mehmetkaya',
            email='mehmet.kaya@ankara.edu.tr',
            password='password123',
            first_name='Mehmet',
            last_name='Kaya',
            role='academician',
            number='AKD-2024-002',
            department='Yazılım Mühendisliği',
            faculty='Mühendislik Fakültesi',
            office='B-101'
        )
        Profile.objects.create(
            user=academician_user_2,
            phone='+90 312 XXX XX XX'
        )
        schedule_2 = Schedule.objects.create(
            academician=academician_user_2,
            slot_duration=30,
            break_duration=10,
            max_appointments_per_day=8
        )
        WorkingSlot.objects.create(schedule=schedule_2, day='tuesday', start_time='12:00', end_time='19:00')
        WorkingSlot.objects.create(schedule=schedule_2, day='friday', start_time='12:00', end_time='20:00')

        self.stdout.write(self.style.SUCCESS('Tüm mock veriler veritabanına başarıyla eklendi!'))