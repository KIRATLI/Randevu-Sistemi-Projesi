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

    # Tüm appointment işlemleri
    path('api/appointments/', include('routes.appointments_urls')),

    # Tüm profile işlemleri
    path('api/profile/', include('routes.profiles_urls')),

    # Tüm users işlemleri
    path('api/users/', include('routes.users_urls'))
]