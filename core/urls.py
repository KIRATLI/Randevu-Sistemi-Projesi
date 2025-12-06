from django.urls import path
from . import views

urlpatterns = [
    # Homepage
    # path('', views.home, name='home'),
    
    # # Authentication
    # path('login/', views.login_view, name='login'),
    # path('logout/', views.logout_view, name='logout'),
    # path('register/', views.register, name='register'),
    
    # # Teacher list (students browse teachers)
    # path('teachers/', views.teacher_list, name='teachers'),
    
    # # Teacher schedule (view availability)
    # path('teachers/<int:teacher_id>/schedule/', views.teacher_schedule, name='teacher_schedule'),
    
    # # Request meeting
    # path('request-meeting/<int:slot_id>/', views.request_meeting, name='request_meeting'),
    
    # # Student dashboard (view my appointments)
    # path('my-appointments/', views.student_appointments, name='student_appointments'),
    
    # # Teacher dashboard (manage appointments)
    # path('teacher/dashboard/', views.teacher_dashboard, name='teacher_dashboard'),
    # path('teacher/add-availability/', views.add_availability, name='add_availability'),
    # path('teacher/approve-meeting/<int:meeting_id>/', views.approve_meeting, name='approve_meeting'),
]