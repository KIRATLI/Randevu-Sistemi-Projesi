from decimal import Decimal

from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser

from .appointment import Appointment
from .availability import Availability

# Specialization for Academicians model

class Specialization(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# Abstract Custom User

class AbstractCustomUser(AbstractUser):
    """
    Abstract base class for all users.
    Don't create instances of this directly - use Student or Academician.
    """
    ROLE_CHOICES = (
        ('academician', 'Akademisyen'),
        ('student', 'Öğrenci'),
        ('admin', 'Admin'),
    )
    name = models.CharField(max_length=20)
    email = models.EmailField(unique=True, blank=True, null=True)
    # bio has been moved to Profile
    #bio = models.TextField(max_length=255, blank=True, null=True)

    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='student')
    number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    faculty = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        abstract = False
        verbose_name = "Üye"
        verbose_name_plural = "Üyeler"


    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

    def is_student(self):
        return self.role == 'student'

    def is_academician(self):
        return self.role == 'academician'

    def as_student(self):
        if self.is_student():
            return Student.objects.get(pk=self.pk) # pk = primary key
        return None

    def as_academician(self):
        if self.is_academician():
            return Academician.objects.get(pk=self.pk)
        return None


    # Abstract methods
    def get_dashboard_data(self):
        raise NotImplementedError("Subclasses must implement get_dashboard_data")

    def get_upcoming_schedule(self):
        raise NotImplementedError("Subclasses must implement get_upcoming_schedule")




#=========
# MANAGERS
#=========

class StudentManager(models.Manager):
    """Manager that only returns students"""
    def get_queryset(self):
        return super().get_queryset().filter(role='student')


class AcademicianManager(models.Manager):
    """Manager that only returns academicians"""
    def get_queryset(self):
        return super().get_queryset().filter(role='academician')




#=================
# CHILDREN CLASSES
#=================

#================
# Child = Student
#================

class Student(AbstractCustomUser):
    """
    Student user - inherits from CustomUser.
    Uses proxy model pattern (no extra database table).
    """
    gpa = models.DecimalField(
        max_digits=3,          # Toplam basamak sayısı (Örn: 4.00 için 3 basamak)
        decimal_places=2,      # Virgülden sonraki basamak sayısı
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00')),
            MaxValueValidator(Decimal('4.00'))
        ],
        help_text="Öğrencinin genel not ortalaması (0.00 - 4.00 arası)"
    )
    
    objects = StudentManager()
    
    class Meta:
        verbose_name="Öğrenci"
        verbose_name_plural="Öğrenciler"


    def get_dashboard_data(self):
        """Get data for student dashboard"""
        return {
            'upcoming_appointments': self.get_upcoming_appointments(),
            'past_appointments': self.get_past_appointments(),
            'pending_appointments': self.get_pending_appointments(),
            'total_appointments': self.student_appointments.count(),
        }
    
    def get_upcoming_schedule(self):
        """Get upcoming appointments for student"""
        return self.get_upcoming_appointments()

    
    def save(self, *args, **kwargs):
        # Automatically set role to student
        self.role = 'student'
        super().save(*args, **kwargs)
    
    def get_my_appointments(self):
        """Get all appointments for this student"""
        return self.student_appointments.all().order_by('-availability__date') # descending order
    
    def get_upcoming_appointments(self):
        """Get future appointments"""
        today = timezone.now().date()
        return self.student_appointments.filter(
            availability__date__gte=today
        ).order_by('availability__date', 'availability__start_time')
    
    def get_past_appointments(self):
        """Get past appointments"""
        today = timezone.now().date()
        return self.student_appointments.filter(
            availability__date__lt=today
        ).order_by('-availability__date')
    
    def get_pending_appointments(self):
        """Get appointments waiting for approval"""
        return self.student_appointments.filter(approved=False)
    
    def has_appointment_with_teacher(self, teacher):
        """Check if student has appointment with specific teacher"""
        return self.student_appointments.filter(
            availability__academician=teacher
        ).exists()
    
    def can_book_slot(self, slot):
        """Check if student can book a specific slot"""
        # Can't book if already booked
        if not slot.is_available():
            return False, "This hour is full"
        
        # Can't book past slots
        if slot.is_past():
            return False, "Cannot book past slots"
        
        # Can't book if already has appointment at same time
        conflicting = self.student_appointments.filter(
            availability__date=slot.date,
            availability__start_time=slot.start_time
        ).exists()
        if conflicting:
            return False, "Already have an appointment at the same time"
        
        return True, "Can book this slot"




#====================
# Child = Academician
#====================

class Academician(AbstractCustomUser):
    """
    Academician/Teacher user - inherits from CustomUser.
    Uses proxy model pattern.
    """
    title = models.CharField(max_length=50, blank=True, null=True)
    office = models.CharField(max_length=100, blank=True, null=True)
    specializations = models.ManyToManyField(Specialization, blank=True)
    #available = models.BooleanField(default=True) is it a field or result of a availability check?
    
    objects = AcademicianManager()
    
    class Meta:
        verbose_name = "Akademisyen"
        verbose_name_plural = "Akademisyenler"
    
    def save(self, *args, **kwargs):
        # Automatically set role to academician
        self.role = 'academician'
        super().save(*args, **kwargs)
    
    # Override display name to include title
    def get_display_name(self):
        """Get full name with academic title"""
        if self.title:
            return f"{self.title} {self.get_full_name()}"
        return self.get_full_name()
    
    # Teacher-specific slot management
    def get_all_slots(self):
        """Get all time slots for this teacher"""
        return self.availability_set.all()
    
    # def get_available_slots(self):
    #     """Get available (not booked) slots"""
    #     return self.availability_set.filter(is_booked=False)
    
    # def get_upcoming_available_slots(self):
    #     """Get future available slots"""
    #     today = timezone.now().date()
    #     return self.availability_set.filter(
    #         is_booked=False,
    #         date__gte=today
    #     ).order_by('date', 'start_time')
    
    # def get_booked_slots(self):
    #     """Get booked slots"""
    #     return self.availability_set.filter(is_booked=True)
    
    # Teacher-specific appointment management
    def get_all_appointments(self):
        """Get all appointments with this teacher"""
        return Appointment.objects.filter(
            availability__academician=self
        ).order_by('-availability__date')
    
    def get_upcoming_appointments(self):
        """Get upcoming appointments with this teacher"""
        today = timezone.now().date()
        return Appointment.objects.filter(
            availability__academician=self,
            availability__date__gte=today
        ).order_by('availability__date', 'availability__start_time')
    
    def get_past_appointments(self):
        """Get past appointments"""
        today = timezone.now().date()
        return Appointment.objects.filter(
            availability__academician=self,
            availability__date__lt=today
        ).order_by('-availability__date')
    
    def get_pending_appointments(self):
        """Get appointments waiting for approval"""
        return Appointment.objects.filter(
            availability__academician=self,
            approved=False
        )
    
    def get_todays_appointments(self):
        """Get today's appointments"""
        today = timezone.now().date()
        return Appointment.objects.filter(
            availability__academician=self,
            availability__date=today
        ).order_by('availability__start_time')
    
    def has_appointment_with_student(self, student):
        """Check if teacher has any appointment with specific student"""
        return Appointment.objects.filter(
            availability__academician=self,
            student=student
        ).exists()
    
    def get_students(self):
        """Get all students who have/had appointments with this teacher"""
        student_ids = Appointment.objects.filter(
            availability__academician=self
        ).values_list('student_id', flat=True).distinct()
        return Student.objects.filter(id__in=student_ids)
    
    def create_availability_slot(self, date, start_time, end_time):
        """Helper method to create a new availability slot"""
        slot = Availability.objects.create(
            academician=self,
            date=date,
            start_time=start_time,
            end_time=end_time
        )
        return slot
    
    # Statistics methods
    def get_total_appointments_count(self):
        """Get total number of appointments ever"""
        return Appointment.objects.filter(availability__academician=self).count()
    
    def get_total_slots_count(self):
        """Get the total number of slots created"""
        return self.availability_set.count()
    
    # def get_available_slots_count(self):
    #     """Get number of available slots"""
    #     return self.availability_set.filter(is_booked=False).count()
    
    # Implementation of abstract methods
    def get_dashboard_data(self):
        """Get data for teacher dashboard"""
        return {
            'upcoming_appointments': self.get_upcoming_appointments(),
            'todays_appointments': self.get_todays_appointments(),
            'pending_appointments': self.get_pending_appointments(),
            #'available_slots': self.get_upcoming_available_slots()[:10],  # Next 10 TODO fix
            'total_appointments': self.get_total_appointments_count(),
            'total_students': self.get_students().count(),
        }
    
    def get_upcoming_schedule(self):
        """Get upcoming appointments for teacher"""
        return self.get_upcoming_appointments()