import json

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from core.models import AbstractCustomUser, Academician, Student
from core.utils.decorators import token_required
from core.utils.paginator import paginate_queryset
from core.utils.response_helpers import api_error, api_success


@csrf_exempt
def users_base_view(request):
    """Ana Yönlendirici (Dispatcher)"""
    if request.method == "GET":
        return list_users_view(request)
    elif request.method == "POST":
        return create_user_view(request)
    return api_error("Yalnızca GET ve POST kabul edilir", "METHOD_NOT_ALLOWED", status=405)


# List users

def list_users_view(request):
    users = AbstractCustomUser.objects.all().order_by('-date_joined')
    total_count = users.count()

    paginated_data = paginate_queryset(users, request)

    data = []
    for user in paginated_data['items']:
        data.append({
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "email": user.email,
            "role": user.role,
            "studentNo": user.number,
            "department": user.department,
            "status": "active" if user.is_active else "inactive",
            "createdAt": user.date_joined.strftime('%Y-%m-%d'),
            "lastLogin": user.last_login.strftime('%Y-%m-%dT%H:%M:%SZ') if user.last_login else None
        })

    paginated_data['items'] = data

    return api_success(paginated_data, total=total_count)

# Create user

def create_user_view(request):
    try:
        data = json.loads(request.body)

        # İsim ayırma mantığı
        full_name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        student_no = data.get('studentNo')
        registration_no = data.get('registrationNo')
        department = data.get('department')
        faculty = data.get('faculty')

        if not all[full_name, email, password, role]:
            return api_error("name, email, password ve role gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        if role == 'student' and not student_no:
            return api_error('studentNo gereklidir', "REQUIRED_FIELD_MISSING", status=400)
        if role == 'academician' and not registration_no:
            return api_error('registrationNo gereklidir', "REQUIRED_FIELD_MISSING", status=400)

        parts = full_name.split(' ', 1)
        f_name = parts[0]
        l_name = parts[1] if len(parts) > 1 else ""

        # Kullanıcı oluşturma (Hassas bilgi: create_user şifreyi hash'ler)
        user = AbstractCustomUser.objects.create_user(
            username=email, # E-postayı kullanıcı adı olarak kullanıyoruz
            email=email,
            password=password,
            first_name=f_name,
            last_name=l_name,
            role=role,
            department=department,
            faculty=faculty,
            number=student_no if role == 'student' else (registration_no if role == 'academician' else "admin")
        )

        # Eğer rol akademisyen ise Academician tablosuna da ekleyelim (Multi-table Inheritance)
        if user.role == 'academician':
            Academician.objects.create(
                abstractcustomuser_ptr=user,
                title="Öğretim Görevlisi", # Varsayılan unvan
                office="Belirtilmemiş"
            )

        return api_success(
            {
                "id": user.id,
                "name": user.get_full_name(),
                "email": user.email,
                "role": user.role,
                "status": "active" if user.is_active else "inactive"
            },
            "Kullanıcı başarıyla oluşturuldu",
            status=201
        )

    except Exception as e:
        return api_error(f"Kullanıcı oluşturulurken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Update user

@csrf_exempt
@token_required
def update_user_view(request):
    if request.method != "PUT":
        return api_error("Yalnızca PUT kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        data = json.loads(request.body)
        target_user_id = data.get('userId')

        if not target_user_id:
            return api_error("userId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        if str(target_user_id) != str(requester_id) and requester_role != 'admin':
            return api_error("Kullanıcıyı güncellemek için yetkiniz yok", "USER_PERMISSION_DENIED", status=403)

        # 1. Kullanıcıyı getir
        user = get_object_or_404(AbstractCustomUser, id=target_user_id)

        # 2. İsim Güncelleme (First Name / Last Name ayırımı)
        name = data.get('name')
        if name:
            parts = name.split(' ', 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ""

        # 3. Email Güncelleme
        if 'email' in data:
            user.email = data.get('email')
            user.username = data.get('email') # Genelde username e-posta ile aynı tutulur

        # 4. Status (is_active) Güncelleme
        # Request'ten "active" gelirse True, gelmezse (veya "inactive" ise) False yapıyoruz
        if 'status' in data:
            user.is_active = (data.get('status') == 'active')

        user.save()

        return api_success(message="Kullanıcı başarıyla güncellendi")

    except Exception as e:
        return api_error(f"Kullanıcı güncellenirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Delete user

@csrf_exempt
@token_required
def delete_user_view(request):
    if request.method != "DELETE":
        return api_error("Yalnızca DELETE kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    requester_id = request.user_payload.get('id')
    requester_role = request.user_payload.get('role')

    try:
        # Request body'den userId'yi alıyoruz
        data = json.loads(request.body)
        user_id = data.get('userId')

        if not user_id:
            return api_error("userId gereklidir", "REQUIRED_FIELD_MISSING", status=400)

        if str(user_id) != str(requester_id) and requester_role != 'admin':
            return api_error("Kullanıcıyı silmek için yetkiniz yok", "USER_PERMISSION_DENIED", status=403)

        # 1. Kullanıcıyı bul
        user = AbstractCustomUser.objects.filter(id=user_id).first()

        if not user:
            return api_error("Kullanıcı bulunamadı", "USER_NOT_FOUND", status=404)

        # 2. Silme işlemini gerçekleştir
        # Not: Bu işlem CASCADE tanımlı tüm alt kayıtları (Profile, Appointments vb.) siler.
        user.delete()

        return api_success(message="Kullanıcı başarıyla silindi")

    except Exception as e:
        return api_error(f"Kullanıcı silinirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)


# Search

@token_required
def global_search_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    query = request.GET.get('query', '').strip()

    if not query:
        return api_error("Arama terimi (query) boş olamaz", "QUERY_CANNOT_BE_EMPTY", status=400)

    # 1. Akademisyenleri ara (İsim, Soyisim, Departman, Fakülte, Unvan)
    # icontains: Büyük/küçük harf duyarsız arama yapar
    academician_results = Academician.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(department__icontains=query) |
        Q(faculty__icontains=query) |
        Q(title__icontains=query)
    ).distinct()

    # 2. Öğrencileri ara (İsim, Soyisim, Öğrenci No)
    student_results = Student.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(number__icontains=query)
    ).distinct()

    # 3. Sonuçları birleştir ve formatla
    results = []

    # Akademisyenleri ekle
    for aca in academician_results:
        results.append({
            "id": aca.id,
            "type": "academician",
            "name": aca.get_full_name() or aca.username,
            "number": aca.number,
            "department": aca.department,

            "title": aca.title,

            "avatar": aca.profile.avatar.url if hasattr(aca, 'profile') and aca.profile.avatar else None,
            "info": f"{aca.title} - {aca.department}"
        })

    # Öğrencileri ekle
    for stu in student_results:
        results.append({
            "id": stu.id,
            "type": "student",
            "name": stu.get_full_name() or stu.username,
            "number": stu.number,
            "department": stu.department,
            "gpa": stu.gpa,

            "avatar": stu.profile.avatar.url if hasattr(stu, 'profile') and stu.profile.avatar else None,
            "info": f"{stu.get_full_name} - {stu.department}"
        })

    #Adminler
    for admin in AbstractCustomUser.objects.filter(role='admin'):
        results.append({
            "id": admin.id,
            "type": "admin",
            "name": admin.get_full_name() or admin.username,
            "email": admin.email,
            "role": admin.role
        })

    return api_success(results)


# Stats

@token_required
def get_user_stats_view(request):
    if request.method != "GET":
        return api_error("Yalnızca GET kabul edilir", "METHOD_NOT_ALLOWED", status=405)

    try:
        # Tüm sayıları veritabanından tek tek çekiyoruz
        total_count = AbstractCustomUser.objects.count()

        # Role bazlı sayımlar
        student_count = AbstractCustomUser.objects.filter(role='student').count()
        academician_count = AbstractCustomUser.objects.filter(role='academician').count()

        # Admin sayımı (Hem role='admin' hem de is_staff/is_superuser olanları kapsayabilir)
        admin_count = AbstractCustomUser.objects.filter(role='admin').count()

        # Durum bazlı sayımlar
        active_count = AbstractCustomUser.objects.filter(is_active=True).count()
        inactive_count = AbstractCustomUser.objects.filter(is_active=False).count()

        return api_success(
            {
                "total": total_count,
                "students": student_count,
                "academicians": academician_count,
                "admins": admin_count,
                "active": active_count,
                "inactive": inactive_count
            }
        )

    except Exception as e:
        return api_error(f"Kullanıcı istatistikleri getirilirken hata: {str(e)}", "INTERNAL_SERVER_ERROR", status=500)
