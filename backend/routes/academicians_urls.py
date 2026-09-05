from django.urls import path
from .academicians import list_academicians_view, academician_detail_view

urlpatterns = [
    path('', list_academicians_view, name='academician-list'),
    path('<int:aca_id>/', academician_detail_view, name="academician-detail")
]