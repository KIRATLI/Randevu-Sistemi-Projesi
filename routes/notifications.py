import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from core.models.notification import Notification, NotificationSettings


def get_notifications_view(request):
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Yalnızca GET kabul edilir"}, status=405)

    user_id = request.GET.get('userId')
    if not user_id:
        return JsonResponse({"success": False, "message": "userId gereklidir"}, status=400)

    # Bildirimleri çek (Daha performanslı olması için sadece gerekli alanları çekebilirsin)
    notifications = Notification.objects.filter(user_id=user_id)

    data = []
    for n in notifications:
        data.append({
            "id": n.id,
            "userId": n.user_id,
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "date": n.created_at.isoformat(),
            "read": n.is_read,
            "actionUrl": n.action_url,
            "relatedId": n.related_id
        })

    return JsonResponse({
        "success": True,
        "data": data
    })


# Unread notifications

def get_unread_notifications_count_view(request):
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Yalnızca GET kabul edilir"}, status=405)

    user_id = request.GET.get('userId')
    if not user_id:
        return JsonResponse({"success": False, "message": "userId gereklidir"}, status=400)

    # .count() metodu veritabanı seviyesinde 'SELECT COUNT(*)' sorgusu çalıştırır.
    # Tüm bildirimleri çekip Python tarafında saymak yerine bu yöntemi kullanmak
    # performans açısından çok daha sağlıklıdır.
    unread_count = Notification.objects.filter(
        user_id=user_id,
        is_read=False
    ).count()

    return JsonResponse({
        "success": True,
        "count": unread_count
    })


# Mark read the notification

@csrf_exempt
def mark_notification_read_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Yalnızca POST kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        notification_id = data.get('notificationId')

        if not notification_id:
            return JsonResponse({"success": False, "message": "notificationId gereklidir"}, status=400)

        # 1. Bildirimi veritabanından getir
        notification = get_object_or_404(Notification, id=notification_id)

        # 2. Eğer zaten okunmuşsa boşuna işlem yapma, okunmamışsa güncelle
        if not notification.is_read:
            notification.is_read = True
            notification.save(update_fields=['is_read']) # Sadece is_read alanını güncellemek daha hızlıdır

        return JsonResponse({
            "success": True,
            "message": "Bildirim okundu olarak işaretlendi"
        })

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Hata: {str(e)}"}, status=400)


# Mark all notifications read

@csrf_exempt
def mark_all_notifications_read_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Yalnızca POST kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        user_id = data.get('userId')

        if not user_id:
            return JsonResponse({"success": False, "message": "userId gereklidir"}, status=400)

        # Tek bir hamlede o kullanıcıya ait tüm okunmamış bildirimleri güncelle
        # SQL: UPDATE core_notification SET is_read = True WHERE user_id = 1 AND is_read = False
        Notification.objects.filter(
            user_id=user_id,
            is_read=False
        ).update(is_read=True)

        return JsonResponse({
            "success": True,
            "message": f"Tüm bildirimler okundu olarak işaretlendi"
        })

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Hata: {str(e)}"}, status=400)


# Delete notification

@csrf_exempt
def delete_notification_view(request):
    if request.method not in ["DELETE", "POST"]:
        return JsonResponse({"success": False, "message": "Yalnızca DELETE veya POST kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        notification_id = data.get('notificationId')

        if not notification_id:
            return JsonResponse({"success": False, "message": "notificationId gereklidir"}, status=400)

        # 1. Bildirimi bul (bulamazsa 404 döner)
        notification = get_object_or_404(Notification, id=notification_id)

        # 2. Bildirimi sil
        notification.delete()

        return JsonResponse({
            "success": True,
            "message": "Bildirim silindi"
        })

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Silme hatası: {str(e)}"}, status=400)


# Notification settings

def notification_settings_view(request):
    if request.method == "GET":
        return get_notification_settings_view(request)
    elif request.method == "POST":
        return update_notification_settings_view(request)
    return JsonResponse({"success": False, "message": "Sadece GET ve POST kabul edilir"}, status=405)


# Get settings

def get_notification_settings_view(request):
    if request.method != "GET":
        return JsonResponse({"success": False, "message": "Yalnızca GET kabul edilir"}, status=405)

    user_id = request.GET.get('userId')
    if not user_id:
        return JsonResponse({"success": False, "message": "userId gereklidir"}, status=400)

    # get_or_create kullanarak ayar kaydı yoksa otomatik oluşturuyoruz
    settings, created = NotificationSettings.objects.get_or_create(user_id=user_id)

    return JsonResponse({
        "success": True,
        "data": {
            "emailNotifications": settings.email_notifications,
            "pushNotifications": settings.push_notifications,
            "appointmentReminders": settings.appointment_reminders,
            "messageNotifications": settings.message_notifications,
            "systemNotifications": settings.system_notifications
        }
    })


# Update settings

def update_notification_settings_view(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Yalnızca POST kabul edilir"}, status=405)

    try:
        data = json.loads(request.body)
        user_id = data.get('userId')

        if not user_id:
            return JsonResponse({"success": False, "message": "userId gereklidir"}, status=400)

        # 1. Ayarları getir veya yoksa oluştur (get_or_create)
        settings, created = NotificationSettings.objects.get_or_create(user_id=user_id)

        # 2. Alanları güncelle
        # .get(key, default) kullanarak eğer veri gönderilmediyse mevcut ayarı koruyoruz
        settings.email_notifications = data.get('emailNotifications', settings.email_notifications)
        settings.push_notifications = data.get('pushNotifications', settings.push_notifications)
        settings.appointment_reminders = data.get('appointmentReminders', settings.appointment_reminders)
        settings.message_notifications = data.get('messageNotifications', settings.message_notifications)
        settings.system_notifications = data.get('systemNotifications', settings.system_notifications)

        # 3. Veritabanına kaydet
        settings.save()

        return JsonResponse({
            "success": True,
            "message": "Bildirim ayarları başarıyla güncellendi"
        })

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Güncelleme hatası: {str(e)}"}, status=400)