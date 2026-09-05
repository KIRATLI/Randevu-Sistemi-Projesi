import json

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt

from core.models import AbstractCustomUser
from core.models.announcement import Announcement
from core.utils.decorators import token_required, role_required
from core.utils.paginator import paginate_queryset
from core.utils.response_helpers import api_error, api_success


@token_required
def get_announcements_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    target_user_id = request.GET.get('userId')
    # userId DOCUMENTATION da zorunlu fakat bu sadece adminlere anlamlı olacağı için optional olarak değiştirildi.
    # if not target_user_id:
    #     return api_error("userId gerekli", "REQUIRED_FIELD_MISSING", status=400)

    # 1. Token'dan gerçek bilgileri al
    requester_role = request.user_payload.get('role')

    # 2. Hangi rolün duyurularını listeleyeceğimizi belirle
    # Varsayılan olarak istek atan kişinin kendi rolü
    filter_role = requester_role

    if requester_role == 'admin' and target_user_id:
        # Eğer admin bir userId göndermişse, o kullanıcının rolünü bulalım
        target_user = AbstractCustomUser.objects.filter(id=target_user_id).first()
        if target_user:
            filter_role = target_user.role
            # Admin burada "bir kullanıcı gibi" bakıyor
        else:
            return api_error("Hedef kullanıcı bulunamadı", "USER_NOT_FOUND", status=404)

    now = timezone.now()

    # 3. Filtreleme
    # Eğer admin spesifik bir userId göndermemişse (target_user_id None ise)
    # ve kendisi admin ise her şeyi görebilir.
    if requester_role == 'admin' and not target_user_id:
        query = Q(status='active') & (Q(expires_at__isnull=True) | Q(expires_at__gt=now))
    else:
        # Öğrenci, Akademisyen veya "Kullanıcı modundaki" Admin için filtre:
        query = Q(status='active') & \
                (Q(expires_at__isnull=True) | Q(expires_at__gt=now)) & \
                (Q(target_audience='all') | Q(target_audience=filter_role))

    announcements = Announcement.objects.filter(query).select_related('author').order_by('-created_at')

    paginated_data = paginate_queryset(announcements, request)

    data = []
    for ann in paginated_data['items']:
        data.append({
            "id": ann.id,
            "title": ann.title,
            "content": ann.content,
            "type": ann.type,
            "targetAudience": ann.target_audience,
            "author": ann.author.get_full_name() if ann.author else "Sistem",
            "createdAt": ann.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "status": ann.status,
            "priority": ann.priority,
            "views": ann.view_count, # Sinyal ile güncellediğimiz denormalize alan
            "expiresAt": ann.expires_at.strftime('%Y-%m-%dT%H:%M:%SZ') if ann.expires_at else None
        })

    paginated_data['items'] = data

    return api_success(paginated_data)


# Create Announcement

@csrf_exempt
@token_required
@role_required(['academician', 'admin'])
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
                "createdAt": announcement.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "views": announcement.view_count,
                "status": announcement.status
            },
            status=201
        )

    except Exception as e:
        return api_error(f"Duyuru oluşturulurken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Update Announcement

@csrf_exempt
@token_required
@role_required(['academician', 'admin'])
def update_announcement_view(request):
    if request.method != "PUT":
        return api_error("Yalnızca PUT kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        data = json.loads(request.body)
        ann_id = data.get('id')

        if not ann_id:
            return api_error("id gerekli", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Duyuruyu getir (Bulamazsa 404 döner)
        announcement = get_object_or_404(Announcement, id=ann_id)

        if str(requester_id) != str(announcement.author_id) and requester_role != 'admin':
            return api_error(
                message="Bu duyuruyu güncelleme yetkiniz bulunmuyor",
                code="ANNOUNCEMENT_PERMISSION_DENIED",
                status=403
            )

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
@token_required
@role_required(['academician', 'admin'])
def delete_announcement_view(request):
    if request.method not in ["POST", "DELETE"]:
        return api_error("Yalnızca POST veya DELETE kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        data = json.loads(request.body)
        ann_id = data.get('id')

        if not ann_id:
            return api_error("id gerekli", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Duyuruyu getir
        announcement = get_object_or_404(Announcement, id=ann_id)

        if str(requester_id) != str(announcement.author_id) and requester_role != 'admin':
            return api_error(
                message="Bu duyuruyu silme yetkiniz bulunmuyor",
                code="ANNOUNCEMENT_PERMISSION_DENIED",
                status=403)

        # 2. Duyuruyu sil
        # Bu işlem ilişkili tüm AnnouncementView kayıtlarını da temizler (CASCADE)
        announcement.delete()

        return api_success(message="Duyuru başarıyla silindi")

    except Exception as e:
        return api_error(f"Duyuru silinirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)
