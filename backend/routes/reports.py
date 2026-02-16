from datetime import datetime, timedelta

from django.db.models import Count, Q
from django.db.models.functions import TruncMonth

from core.models import Appointment
from core.models.report import SystemReport
from core.utils.decorators import token_required
from core.utils.response_helpers import api_error, api_success


@token_required
def get_system_stats_view(request):
    # Sadece adminler raporları görebilmeli
    if request.user_payload.get('role') != 'admin':
        return api_error("Bu işlem için yetkiniz yok.", "PERMISSION_DENIED", status=403)

    # 1. Genel Randevu İstatistikleri (Live)
    stats = Appointment.objects.aggregate(
        total=Count('id'),
        pending=Count('id', filter=Q(status='pending')),
        approved=Count('id', filter=Q(status='approved')),
        completed=Count('id', filter=Q(status='completed')),
        cancelled=Count('id', filter=Q(status='cancelled'))
    )

    # 2. Aylık Trend (Son 6 Ay)
    # Randevuları aylara göre gruplayıp sayıyoruz
    six_months_ago = datetime.now() - timedelta(days=180)
    monthly_trend_query = Appointment.objects.filter(
        availability__date__gte=six_months_ago
    ).annotate(
        month=TruncMonth('availability__date')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')

    monthly_trend = []
    for entry in monthly_trend_query:
        monthly_trend.append({
            "month": entry['month'].strftime('%Y-%m'),
            "value": entry['count']
        })

    # 3. Bölüm Bazlı İstatistikler
    # Hangi bölümde kaç randevu var?
    dept_stats_query = Appointment.objects.values(
        'student__department'
    ).annotate(
        count=Count('id')
    ).order_by('-count')[:5] # En yoğun 5 bölüm

    department_stats = [
        {
            "name": item['student__department'] if item['student__department'] else "Belirtilmemiş",
            "count": item['count']
        }
        for item in dept_stats_query
    ]

    # 4. En Çok Randevusu Olan Akademisyenler
    # first_name ve last_name'i birleştirip tek bir "name" alanı oluşturuyoruz
    academician_stats_query = Appointment.objects.values(
        'academician__first_name',
        'academician__last_name'
    ).annotate(
        count=Count('id')
    ).order_by('-count')[:5]

    top_academicians = [
        {
            "name": f"{item['academician__first_name']} {item['academician__last_name']}".strip() or "İsimsiz Akademisyen",
            "appointments": item['count']
        }
        for item in academician_stats_query
    ]

    # 5. Veriyi Topla
    report_data = {
        "summary": stats,
        "monthlyTrend": monthly_trend,
        "departmentStats": department_stats,
        "topAcademicians": top_academicians,
        "generatedAt": datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    }

    SystemReport.objects.create(
        total_appointments=stats['total'],
        completed_count=stats['completed'],
        cancelled_count=stats['cancelled'],
        pending_count=stats['pending'],
        dynamic_data=report_data # JSONField içine tüm detayları gömdük
    )

    return api_success(report_data)