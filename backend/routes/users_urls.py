from django.urls import path
from .users import users_base_view, update_user_view, delete_user_view, global_search_view, get_user_stats_view

urlpatterns = [
    path('', users_base_view, name='user-list'),

    path('update/', update_user_view, name='update-user'),

    path('delete/', delete_user_view, name='delete-user'),

    path('search/', global_search_view, name='global-search'),

    path('stats/', get_user_stats_view, name='user-stats'),
]