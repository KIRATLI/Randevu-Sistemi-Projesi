from django.urls import path

from routes.notifications import get_notifications_view, get_unread_notifications_count_view, \
    mark_notification_read_view, mark_all_notifications_read_view, delete_notification_view, notification_settings_view

urlpatterns = [
    path('', get_notifications_view, name='api-notifications'),

    path('unread-count/', get_unread_notifications_count_view, name='api-unread-notifications-count'),

    path('mark-read/', mark_notification_read_view, name='api-mark-notification-read'),

    path('mark-all-read/', mark_all_notifications_read_view, name='api-mark-all-notifications-read'),

    path('delete/', delete_notification_view, name='api-delete-notification'),

    path('settings/', notification_settings_view, name='api-notification-settings'),
]