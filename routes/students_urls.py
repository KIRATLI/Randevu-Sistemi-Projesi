from django.urls import path

from routes.students import get_students_list_view, get_student_detail_view

urlpatterns = [
    path('', get_students_list_view, name='student-list'),

    path('detail/', get_student_detail_view, name='student-detail'),
]