from django.contrib import admin
from core.models import CustomUser, Availability, Appointment

# We display the models created in models.py in the admin panel
admin.site.register(CustomUser)
admin.site.register(Availability)
admin.site.register(Appointment)