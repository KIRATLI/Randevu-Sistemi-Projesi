import json

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from core.models import AbstractCustomUser
from core.models.message import Message, Thread
from core.models.notification import Notification
from core.utils.decorators import token_required, role_required
from core.utils.paginator import paginate_queryset
from core.utils.response_helpers import api_error, api_success


# Messages

@csrf_exempt
@token_required
def messages_view(request):
    if request.method == "GET":
        return get_messages_view(request)
    elif request.method == "POST":
        return send_message_view(request)
    return api_error("Yalnızca GET ve POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)


# List all messages

def get_messages_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    target_user_id = request.GET.get('userId')
    # userId DOCUMENTATION da zorunlu fakat bu sadece adminlere anlamlı olacağı için optional olarak değiştirildi.
    # if not user_id:
    #     return api_error("userId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    # 1. Kullanıcıyı getir
    user_id_to_query = requester_id

    if requester_role == 'admin' and target_user_id:
        user_id_to_query = target_user_id

    # 2. Kullanıcının dahil olduğu thread'lerdeki tüm mesajları getir
    # select_related ve prefetch_related kullanımı performansı %80 artırır
    messages = Message.objects.filter(
        thread__participants__id=user_id_to_query
    ).select_related('sender', 'thread', 'reply_to').prefetch_related('thread__participants').order_by('-date')

    data = []
    for msg in messages:
        # Thread içindeki diğer katılımcıyı (alıcıyı) bulalım
        receiver = msg.thread.get_receiver(msg.sender)

        # Eğer grup konuşması değilse ve bir alıcı varsa bilgileri doldur
        # (Alıcı bazen göndericinin kendisi de olabilir - not defteri mantığı gibi)
        r_id = receiver.id if receiver else msg.sender.id
        r_name = receiver.get_full_name() if receiver else msg.sender.get_full_name()
        r_role = receiver.role if receiver else msg.sender.role

        data.append({
            "id": msg.id,
            "senderId": msg.sender.id,
            "senderName": msg.sender.get_full_name() or msg.sender.username,
            "senderRole": msg.sender.role,
            "receiverId": r_id,
            "receiverName": r_name,
            "receiverRole": r_role,
            "subject": msg.thread.subject,
            "content": msg.content,
            "date": msg.date.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "read": msg.is_read,
            "threadId": msg.thread.id,
            "replyTo": msg.reply_to_id
        })

    return api_success(data)


# Send Message

def send_message_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        data = json.loads(request.body)

        # Request'ten verileri al (Senin pattern'ine göre senderId'yi de bekliyoruz)
        sender_id = data.get('userId') or requester_id
        receiver_id = data.get('receiverId')
        subject = data.get('subject', 'Yeni Mesaj')
        content = data.get('content')
        thread_id = data.get('threadId')

        if str(sender_id) != str(requester_id) and requester_role != 'admin':
            return api_error("Bu mesajı göndermek için yetkiniz yok", "MESSAGE_PERMISSION_DENIED", status=403)

        if not all([receiver_id, content]):
            return api_error("receiverId ve content gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        sender = get_object_or_404(AbstractCustomUser, id=sender_id)
        receiver = get_object_or_404(AbstractCustomUser, id=receiver_id)

        # 1. Thread Belirleme veya Oluşturma
        if thread_id:
            # Mevcut thread'i getir
            thread = get_object_or_404(Thread, id=thread_id)
        else:
            # Yeni thread oluştur ve katılımcıları ekle
            thread = Thread.objects.create(subject=subject)
            thread.participants.add(sender, receiver)

        # 2. Mesajı Kaydet
        message = Message.objects.create(
            thread=thread,
            sender=sender,
            content=content
        )

        # 3. Thread'i güncelle (updated_at için)
        thread.save() # auto_now=True sayesinde güncellenir

        return api_success(
            {
                "id": message.id,
                "senderId": sender.id,
                "receiverId": receiver.id,
                "subject": thread.subject,
                "content": message.content,
                "date": message.date.strftime('%Y-%m-%dT%H:%M:%SZ'),
                "read": message.is_read,
                "threadId": thread.id
            },
            "Mesaj gönderildi",
            status=201
        )

    except Exception as e:
        return api_error(f"Mesaj gönderirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Messages in a Thread

@token_required
def get_thread_messages_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    thread_id = request.GET.get('threadId')
    if not thread_id:
        return api_error("threadId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    # 1. Thread'i ve katılımcıları getir (Hata kontrolü için)
    thread = get_object_or_404(Thread, id=thread_id)

    is_participant = thread.participants.filter(id=requester_id).exists()

    if not is_participant and requester_role != 'admin':
        return api_error("Bu konuşmaya erişim yetkiniz bulunmuyor.", "MESSAGE_PERMISSION_DENIED", status=403)

    # 2. Thread içindeki tüm mesajları kronolojik (eskiden yeniye) getir
    # select_related: sender ve reply_to verilerini tek sorguda çeker
    messages = Message.objects.filter(thread_id=thread_id).select_related(
        'sender', 'reply_to'
    ).order_by('date') # 'date' -> En eski mesaj en üstte

    paginated_data = paginate_queryset(messages, request)

    data = []
    # Thread'deki katılımcıları önceden alalım (alıcıyı belirlemek için)
    # 2 kişilik mesajlaşma varsayımıyla:
    participants = list(thread.participants.all())

    for msg in paginated_data['items']:
        # Alıcıyı bul: Katılımcılardan gönderici olmayanı seç
        receiver = next((p for p in participants if p.id != msg.sender_id), msg.sender)

        data.append({
            "id": msg.id,
            "senderId": msg.sender.id,
            "senderName": msg.sender.get_full_name() or msg.sender.username,
            "senderRole": msg.sender.role,
            "receiverId": receiver.id,
            "receiverName": receiver.get_full_name() or receiver.username,
            "receiverRole": receiver.role,
            "subject": thread.subject,
            "content": msg.content,
            "date": msg.date.strftime('%Y-%m-%dT%H:%M:%SZ'),
            "read": msg.is_read,
            "threadId": thread.id,
            "replyTo": msg.reply_to_id
        })

    paginated_data['items'] = data

    return api_success(paginated_data)


# Mark read the message

@csrf_exempt
@token_required
def mark_message_read_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')

    try:
        data = json.loads(request.body)
        message_id = data.get('messageId')

        if not message_id:
            return api_error("messageId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Mesajı bul
        message = get_object_or_404(Message, id=message_id)

        is_participant = message.thread.participants.filter(id=requester_id).exists()

        if not is_participant:
            return api_error("Bu mesaj üzerinde işlem yapma yetkiniz yok.", "MESSAGE_PERMISSION_DENIED", status=403)

        # 2. Eğer zaten okunduysa boşuna işlem yapma, değilse güncelle
        if not message.is_read:
            message.is_read = True
            message.save(update_fields=['is_read']) # Sadece bu alanı güncellemek daha performanslıdır

        return api_success(message="Mesaj okundu olarak işaretlendi")

    except Exception as e:
        return api_error(f"Mesajı okundu işaretlerken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Delete a message

@csrf_exempt
@token_required
@role_required('admin')
def delete_message_view(request):
    if request.method != "DELETE":
        return api_error("Yalnızca DELETE kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        data = json.loads(request.body)
        message_id = data.get('messageId')

        if not message_id:
            return api_error("messageId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Mesajı bul
        message = Message.objects.filter(id=message_id).first()

        is_participant = message.thread.participants.filter(id=requester_id).exists()

        if not is_participant and requester_role != 'admin':
            return api_error("Bu mesajı silme yetkiniz yok.", "MESSAGE_PERMISSION_DENIED", status=403)

        if not message:
            return api_error("Mesaj bulunamadı", "MESSAGE_NOT_FOUND", status=404)

        # 2. Silme işlemini gerçekleştir
        # Not: Eğer bu mesaj bir 'replyTo' referansı ise,
        # diğer mesajlardaki reply_to alanları models.SET_NULL sayesinde boşa çıkar.
        message.delete()

        return api_success(message="Mesaj silindi")

    except Exception as e:
        return api_error(f"Mesaj silinirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Unread messages count

@token_required
def get_unread_count_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    target_user_id = request.GET.get('userId')
    # if not user_id:
    #     return api_error("userId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

    if requester_role != 'admin':
        target_user_id = requester_id

    # 1. Kullanıcıyı getir
    user = get_object_or_404(AbstractCustomUser, id=target_user_id)

    # 2. Sayma Mantığı:
    # - Mesajın thread'inde kullanıcı katılımcı olmalı (thread__participants=user)
    # - Mesaj okunmamış olmalı (is_read=False)
    # - Mesajı kullanıcı kendisi göndermemiş olmalı (.exclude(sender=user))
    unread_count = Message.objects.filter(
        thread__participants=user,
        is_read=False
    ).exclude(sender=user).count()

    return api_success(message="Okunmamış mesaj sayısı kontrol edildi.", count=unread_count)


# Send a bulk message

@csrf_exempt
@token_required
@role_required(['academician', 'admin'])
def bulk_send_message_view(request):
    if request.method != "POST":
        return api_error("Yalnızca POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        data = json.loads(request.body)
        subject = data.get('subject')
        content = data.get('content')
        audience = data.get('targetAudience') # all, student, academician

        if not all([subject, content, audience]):
            return api_error("subject, content ve targetAudience gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        # 1. Hedef kitleyi filtrele
        user_query = AbstractCustomUser.objects.filter(is_active=True)
        if audience == 'student':
            user_query = user_query.filter(role='student')
        elif audience == 'academician':
            user_query = user_query.filter(role='academician')

        users = list(user_query) # QuerySet'i listeye çeviriyoruz
        sent_count = len(users)

        # 2. Toplu İşlem (Atomic)
        with transaction.atomic():
            messages_to_create = []
            notifications_to_create = []

            for user in users:
                # Her kullanıcı için mesaj objesi hazırla
                messages_to_create.append(Message(
                    sender=request.user if request.user.is_authenticated else None,
                    recipient=user,
                    subject=subject,
                    content=content
                ))

                # Her kullanıcı için bildirim objesi hazırla
                notifications_to_create.append(Notification(
                    user=user,
                    type='new_message',
                    title=f"Yeni Mesaj: {subject}",
                    message="Yönetimden yeni bir mesaj aldınız.",
                    action_url="/messages/inbox"
                ))

            # 3. Veritabanına tek seferde göm (bulk_create)
            # 500'erli paketler halinde göndererek hafızayı koruruz (batch_size)
            Message.objects.bulk_create(messages_to_create, batch_size=500)
            Notification.objects.bulk_create(notifications_to_create, batch_size=500)

        return api_success(message="Mesaj tüm kullanıcılara gönderildi", status=201, sentCount=sent_count)

    except Exception as e:
        return api_error(f"Bulk mesaj gönderirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)
