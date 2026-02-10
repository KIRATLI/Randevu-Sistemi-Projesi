from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Core uygulamasının yolları
    path('', include('core.urls')),
    
    # Tüm auth işlemlerini 'api/auth/' prefix'i ile routes.auth içinden çekelim
    path('api/auth/', include('routes.auth_urls')),

    # Tüm academician işlemleri
    path('api/academicians/', include('routes.academicians_urls')),

    # Tüm student işlemleri
    path('api/students/', include('routes.students_urls')),

    # Tüm appointment işlemleri
    path('api/appointments/', include('routes.appointments_urls')),

    # Tüm profile işlemleri
    path('api/profile/', include('routes.profiles_urls')),

    # Tüm users işlemleri
    path('api/users/', include('routes.users_urls')),

    # Tüm messages işlemleri
    path('api/messages/', include('routes.messages_urls')),

    # Tüm schedule işlemleri
    path('api/schedules/', include('routes.schedules_urls')),

    # Tüm announcement işlemleri
    path('api/announcements/', include('routes.announcements_urls')),

    # Tüm notification işlemleri
    path('api/notifications/', include('routes.notifications_urls')),
]