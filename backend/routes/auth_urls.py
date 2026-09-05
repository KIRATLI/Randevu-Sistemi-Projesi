from django.urls import path

from .auth import login_view, register_view, logout_view, forgot_password_view, reset_password_view, refresh_token_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path("forgot-password/", forgot_password_view, name="forgot_password"),
    path("reset-password/", reset_password_view, name="reset_password"),
    path("refresh-token/", refresh_token_view, name="refresh_token")
]