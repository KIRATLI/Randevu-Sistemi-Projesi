import traceback

from django.db.models import Count, Q, Max, Min
from django.utils import timezone

from core.models import Student
from core.utils.decorators import token_required
from core.utils.response_helpers import api_error, api_success


@token_required
def get_students_list_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        now = timezone.now()

        # Annotate kullanarak tüm istatistikleri tek sorguda hesaplıyoruz
        students = Student.objects.select_related('profile').annotate(
            total_count=Count('student_appointments'),
            completed_count=Count('student_appointments', filter=Q(student_appointments__status='completed')),
            cancelled_count=Count('student_appointments', filter=Q(student_appointments__status='cancelled')),
            # Geçmişteki son randevu tarihi
            last_app_date=Max('student_appointments__date', filter=Q(student_appointments__date__lt=now)),
            # Gelecekteki ilk randevu tarihi
            next_app_date=Min('student_appointments__date', filter=Q(student_appointments__date__gte=now))
        ).all()

        data = []
        for student in students:
            data.append({
                "id": student.id,
                "name": student.get_full_name() or student.username,
                "studentNo": student.number,
                "email": student.email,
                "department": student.department,
                "faculty": student.faculty,
                "year": student.profile.enrollment_year,
                "enrollment_year": student.profile.enrollment_year,
                "gpa": float(student.gpa) if student.gpa else 0.00,
                "phone": student.profile.phone,
                "totalAppointments": student.total_count,
                "completedAppointments": student.completed_count,
                "cancelledAppointments": student.cancelled_count,
                "lastAppointment": student.last_app_date.strftime('%Y-%m-%dT%H:%M:%SZ') if student.last_app_date else None,
                "nextAppointment": student.next_app_date.strftime('%Y-%m-%dT%H:%M:%SZ') if student.next_app_date else None,
                "status": "active" if student.is_active else "inactive"
            })

        return api_success(data)

    except Exception as e:
        traceback.print_exc()
        return api_error(f"Öğrencileri listelerken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Student Details

@token_required
def get_student_detail_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    student_id = request.GET.get('userId')
    if not student_id:
        return api_error("userId gereklidir", "REQUIRED_FIELD_MISSING", status=400)
    try:
        # 1. Öğrenciyi, profili ve randevu sayısını çekiyoruz
        student = Student.objects.filter(id=student_id).select_related('profile').annotate(
            total_count=Count('student_appointments')
        ).first()

        if not student:
            return api_error("Öğrenci bulunamadı", "USER_NOT_FOUND", status=404)

        # 2. Öğrencinin tüm randevularını listeliyoruz
        appointments_qs = student.student_appointments.all().order_by('-date', '-start_time')
        appointments_list = []

        for app in appointments_qs:
            appointments_list.append({
                "id": app.id,
                "date": app.date.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "time": app.start_time.strftime("%H:%M"),
                "subject": app.subject,
                "status": app.status
            })

        # 3. JSON Yanıtı
        return api_success(
            {
                "id": student.id,
                "name": student.get_full_name() or student.username,
                "studentNo": student.number, # Senin modelinde 'number' olarak geçiyordu
                "email": student.email,
                "department": student.department,
                "year": student.year,
                "gpa": float(student.gpa) if student.gpa else 0.0,
                "totalAppointments": student.total_count,
                "appointments": appointments_list,
                "notes": student.profile.bio,
                "registrationDate": student.date_joined.strftime("%Y-%m-%d") # Django'nun default alanı
            }
        )
    except Exception as e:
        traceback.print_exc()
        return api_error(f"Öğrenci detaylarını getirirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)

