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
    search_fields = ('akademician__username',)

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'get_teacher', 'availability','start_time', 'end_time', 'creation_date', 'approved')
    list_filter = ('approved', 'creation_date')
    search_fields = ('student__username',)
    
    def get_teacher(self, obj):
        return obj.get_teacher()
    get_teacher.short_description = 'Academician'