from django.urls import path
from .announcements import get_announcements_view, create_announcement_view, update_announcement_view, \
    delete_announcement_view

urlpatterns = [
    path('', get_announcements_view, name='api-announcements-list'),

    path('create/', create_announcement_view, name='api-announcements-create'),

    path('update/', update_announcement_view, name='api-announcements-update'),

    path('delete/', delete_announcement_view, name='api-announcements-delete'),
]