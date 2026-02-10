from django.urls import path

from routes.profiles import profile_view, upload_avatar_view, change_password_view

urlpatterns = [
    path('', profile_view, name='profile'),

    path('avatar/', upload_avatar_view, name="upload-avatar"),

    path('change-password/', change_password_view, name="change-password"),
]