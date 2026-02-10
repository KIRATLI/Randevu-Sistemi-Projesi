from django.urls import path

from routes.profiles import profile_view

urlpatterns = [
    path('', profile_view, name='profile'),
]