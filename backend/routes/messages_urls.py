from django.urls import path

from backend.routes.messages import messages_view, get_thread_messages_view, mark_message_read_view, delete_message_view, \
    get_unread_count_view, bulk_send_message_view

urlpatterns = [
    path('', messages_view, name="messages"),

    path('threads/', get_thread_messages_view, name="thread-messages"),

    path('mark-read/', mark_message_read_view, name="message-mark-read"),

    path('delete/', delete_message_view, name="message-delete"),

    path('unread-count/', get_unread_count_view, name="message-unread-count"),

    path('bulk/', bulk_send_message_view, name='message-bulk-send'),
]