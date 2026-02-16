from django.db.models import F
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from core.models.announcement import AnnouncementView


@receiver(post_save, sender=AnnouncementView)
def update_announcement_view_count(sender, instance, created, **kwargs):
    """
    Bir AnnouncementView kaydı OLUŞTURULDUĞUNDA (created=True),
    ilgili duyurunun view_count değerini atomik olarak 1 artırır.
    """
    if created:
        # F('field') kullanarak veritabanı seviyesinde +1 yapıyoruz.
        # Bu işlem 'race condition' riskini tamamen ortadan kaldırır.
        instance.announcement.view_count = F('view_count') + 1
        instance.announcement.save(update_fields=['view_count'])

@receiver(post_delete, sender=AnnouncementView)
def decrement_announcement_view_count(sender, instance, **kwargs):
    """
    Bir AnnouncementView kaydı silindiğinde (manuel veya cascade),
    ilgili duyurunun view_count değerini atomik olarak 1 azaltır.
    """
    if instance.announcement:
        # F('field') - 1 kullanarak veritabanı seviyesinde azaltma yapıyoruz.
        instance.announcement.view_count = F('view_count') - 1
        instance.announcement.save(update_fields=['view_count'])