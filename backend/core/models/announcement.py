from django.db import models

class Announcement(models.Model):
    TYPE_CHOICES = (
        ('info', 'Bilgi'),
        ('success', 'Başarı'),
        ('warning', 'Uyarı'),
        ('error', 'Hata'),
    )
    AUDIENCE_CHOICES = (
        ('all', 'Herkes'),
        ('student', 'Öğrenciler'),
        ('academician', 'Akademisyenler'),
    )
    PRIORITY_CHOICES = (
        ('low', 'Düşük'),
        ('medium', 'Orta'),
        ('high', 'Yüksek'),
    )
    STATUS_CHOICES = (
        ('active', 'Aktif'),
        ('archived', 'Arşivlendi'),
    )

    title = models.CharField(max_length=255)
    content = models.TextField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='info')
    target_audience = models.CharField(max_length=15, choices=AUDIENCE_CHOICES, default='all')
    author = models.ForeignKey('core.AbstractCustomUser', on_delete=models.SET_NULL, null=True)

    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    # Counter for quick display, real tracking is in AnnouncementView
    # See core/models.py, where view_count gets updated every time an AnnouncementView is created or deleted.
    view_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

class AnnouncementView(models.Model):
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey('core.AbstractCustomUser', on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Bir kullanıcı bir duyuruyu sadece bir kez "gördü" olarak kaydedilmeli
        unique_together = ('announcement', 'user')

    def __str__(self):
        return f"{self.user.username} viewed {self.announcement.title}"