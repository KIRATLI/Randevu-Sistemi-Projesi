import json

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt

from core.models import AbstractCustomUser
from core.models.announcement import Announcement
from core.utils.response_helpers import api_error, api_success


def get_announcements_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    user_id = request.GET.get('userId')
    if not user_id:
        return api_error("userId gerekli", "REQUIRED_FIELD_MISSING", status=400)

    # 1. Kullanıcıyı ve rolünü bul (Filtreleme için)
    user = AbstractCustomUser.objects.filter(id=user_id).first()
    if not user:
        return api_error("Kullanıcı bulunamadı", "USER_NOT_FOUND", status=404)

    now = timezone.now()

    # 2. Filtreleme Mantığı:
    # - Durumu 'active' olmalı.
    # - Süresi dolmamış olmalı (expires_at null olabilir veya gelecek bir tarih olmalı).
    # - Hedef kitle kullanıcının rolüyle eşleşmeli veya 'all' (herkes) olmalı.
    announcements = Announcement.objects.filter(
        status='active'
    ).filter(
        Q(expires_at__isnull=True) | Q(expires_at__gt=now)
    ).filter(
        Q(target_audience='all') | Q(target_audience=user.role)
    ).select_related('author').order_by('-created_at') # En yeni en üstte

    data = []
    for ann in announcements:
        data.append({
            "id": ann.id,
            "title": ann.title,
            "content": ann.content,
            "type": ann.type,
            "targetAudience": ann.target_audience,
            "author": ann.author.get_full_name() if ann.author else "Sistem",
            "createdAt": ann.created_at.isoformat(),
            "status": ann.status,
            "priority": ann.priority,
            "views": ann.view_count, # Sinyal ile güncellediğimiz denormalize alan
            "expiresAt": ann.expires_at.isoformat() if ann.expires_at else None
        })

    return api_success(data)


# Create Announcement

@csrf_exempt
def create_announcement_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)

        # 1. Gerekli alanların kontrolü
        title = data.get('title')
        content = data.get('content')
        if not title or not content:
            return api_error("title ve content gerekli", "REQUIRED_FIELD_MISSING", status=400)

        # 2. Tarih formatını parse etme
        expires_at = data.get('expiresAt')
        parsed_expires_at = None
        if expires_at:
            parsed_expires_at = parse_datetime(expires_at)

        # 3. Duyuruyu oluşturma
        # Not: 'author' kısmını request.user'dan alabilirsin (Giriş yapılmışsa)
        # Şimdilik örnek olması açısından varsa authorId, yoksa None geçiyoruz.
        announcement = Announcement.objects.create(
            title=title,
            content=content,
            type=data.get('type', 'info'),
            target_audience=data.get('targetAudience', 'all'),
            priority=data.get('priority', 'medium'),
            expires_at=parsed_expires_at,
            status='active',
            author=request.user if request.user.is_authenticated else None
        )

        return api_success(
            {
                "id": announcement.id,
                "title": announcement.title,
                "createdAt": announcement.created_at.isoformat(),
                "views": announcement.view_count,
                "status": announcement.status
            },
            status=201
        )

    except Exception as e:
        return api_error(f"Duyuru oluşturulurken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Update Announcement

@csrf_exempt
def update_announcement_view(request):
    if request.method != "PUT":
        return api_error("Yalnızca PUT kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        ann_id = data.get('id')

        if not ann_id:
            return api_error("id gerekli", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Duyuruyu getir (Bulamazsa 404 döner)
        announcement = get_object_or_404(Announcement, id=ann_id)

        # 2. Alanları güncelle (Eğer request içinde varsa)
        # dict.get(key, default) yapısı sayesinde veri gelmediyse eski halini koruruz
        announcement.title = data.get('title', announcement.title)
        announcement.content = data.get('content', announcement.content)
        announcement.type = data.get('type', announcement.type)
        announcement.priority = data.get('priority', announcement.priority)

        # Eğer status veya expiresAt gibi alanları da güncellemek istersen buraya ekleyebilirsin
        if 'status' in data:
            announcement.status = data['status']

        # 3. Veritabanına kaydet
        announcement.save()

        return api_success(message="Duyuru başarıyla güncellendi")

    except Exception as e:
        return api_error(f"Duyuru güncellenirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Delete Announcement

@csrf_exempt
def delete_announcement_view(request):
    if request.method not in ["POST", "DELETE"]:
        return api_error("Yalnızca POST veya DELETE kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        ann_id = data.get('id')

        if not ann_id:
            return api_error("id gerekli", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Duyuruyu getir
        announcement = get_object_or_404(Announcement, id=ann_id)

        # 2. Duyuruyu sil
        # Bu işlem ilişkili tüm AnnouncementView kayıtlarını da temizler (CASCADE)
        announcement.delete()

        return api_success(message="Duyuru başarıyla silindi")

    except Exception as e:
        return api_error(f"Duyuru silinirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)
