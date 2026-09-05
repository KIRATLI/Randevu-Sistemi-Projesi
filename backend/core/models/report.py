from django.db import models

# experimental, not implemented yet
class SystemReport(models.Model):
    # Raporun oluşturulduğu tarih (Günlük veya Aylık raporlar için)
    generated_at = models.DateTimeField(auto_now_add=True)

    # Basit sayısal veriler (Hızlı filtreleme için)
    total_appointments = models.PositiveIntegerField(default=0)
    completed_count = models.PositiveIntegerField(default=0)
    cancelled_count = models.PositiveIntegerField(default=0)
    pending_count = models.PositiveIntegerField(default=0)

    # Karmaşık veriler (Trendler ve sıralamalar için JSON)
    # monthlyTrend, topAcademicians ve departmentStats burada duracak
    dynamic_data = models.JSONField(help_text="Trend ve sıralama verilerini JSON olarak tutar.")

    class Meta:
        ordering = ['-generated_at']
        verbose_name = "Sistem Raporu"

    def __str__(self):
        return f"Rapor - {self.generated_at.strftime('%Y-%m-%dT%H:%M:%SZ')}"