from django.urls import path
from .appointments import list_appointments_view, approve_appointment_view, reject_appointment_view, \
    cancel_appointment_view, appointments_view

urlpatterns = [
    path('', appointments_view, name='appointment'),
    path('<int:id>/', list_appointments_view, name="appointment-detail"),

    path('approve/', approve_appointment_view, name="appointment-approve"),
    path('reject/', reject_appointment_view, name="appointment-reject"),
    path('cancel/', cancel_appointment_view, name="appointment-cancel"),
]