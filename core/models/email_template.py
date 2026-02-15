from django.db import models

# Template slugs
#
# welcome: routes/auth.py
# appointment-approved: routes/appointments.py
# appointment-rejected: routes/appointments.py
# appointment-cancelled: routes/appointments.py
# appointment-reminder: -
# password-reset: routes/auth.py
#
class EmailTemplate(models.Model):
    name = models.CharField(max_length=100)     # E.g.: "Randevu Onay Maili"
    slug = models.SlugField(unique=True)        # E.g.: "appointment-approved"
    subject = models.CharField(max_length=255)
    body = models.TextField(help_text="Değişkenler için {{name}}, {{date}} gibi ifadeler kullanın.")

    def __str__(self):
        return self.name