from django.urls import path

from routes.students import get_students_list_view

urlpatterns = [
    path('', get_students_list_view, name='student-list'),


]