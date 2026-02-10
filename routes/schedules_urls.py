from django.urls import path

from routes.schedules import schedule_view, get_available_slots_view, get_available_dates_view

urlpatterns = [
    path('', schedule_view, name='schedule'),

    path('available-slots/', get_available_slots_view, name='available-slots'),

    path('available-dates/', get_available_dates_view, name='available-dates'),
]