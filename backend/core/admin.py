from django.contrib import admin
from core.models import Availability, Appointment
from core.models.user import Student, Academician

# Register the proxy models separately for better organization
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'number', 'department')
    list_filter = ('department',) # must contain ',' to be a tuple
    search_fields = ('username', 'first_name', 'last_name', 'number')

@admin.register(Academician)
class AcademicianAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'title', 'department')
    list_filter = ('title', 'department')
    search_fields = ('username', 'first_name', 'last_name')

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('academician', 'date', 'start_time', 'end_time')
    list_filter = ('date',)
    search_fields = ('academician__username',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'academician', 'availability','start_time', 'end_time', 'creation_date', 'subject', 'note_message', 'status')
    list_filter = ('status', 'creation_date')
    search_fields = ('student__username',)