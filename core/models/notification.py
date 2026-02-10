from django.db import models

class Notification(models.Model):
    TYPE_CHOICES = (
        ('appointment_confirmed', 'Randevu Onaylandı'),
        ('appointment_rejected', 'Randevu Reddedildi'),
        ('appointment_cancelled', 'Randevu İptal Edildi'),
        ('appointment_reminder', 'Randevu Hatırlatması'),
        ('appointment_request', 'Yeni Randevu Talebi'),
        ('new_message', 'Yeni Mesaj'),
        ('system', 'Sistem Bildirimi'),
        ('announcement', 'Duyuru'),
    )

    # Bildirimi alacak kullanıcı
    user = models.ForeignKey(
        'core.AbstractCustomUser',
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()

    # Okunma durumu
    is_read = models.BooleanField(default=False)

    # Yönlendirme ve İlişki
    action_url = models.CharField(max_length=255, blank=True, null=True)
    related_id = models.PositiveIntegerField(blank=True, null=True) # Randevu ID, Mesaj ID vb.

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"


# Notification Settings

class NotificationSettings(models.Model):
    user = models.OneToOneField(
        'core.AbstractCustomUser',
        on_delete=models.CASCADE,
        related_name='notification_settings'
    )

    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    appointment_reminders = models.BooleanField(default=True)
    message_notifications = models.BooleanField(default=True)
    system_notifications = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - Bildirim Ayarları"