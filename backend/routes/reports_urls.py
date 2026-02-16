from django.urls import path

from backend.routes.reports import get_system_stats_view

urlpatterns = [
    path('', get_system_stats_view, name='reports')
]