from django.core.mail import send_mail
from django.conf import settings

from core.models.email_template import EmailTemplate
from core.utils.email_defaults import DEFAULT_EMAILS


def send_templated_email(template_slug, target_email, context):
    """
    template_slug: Hangi şablon kullanılacak?
    target_email: Kime gönderilecek?
    context: {'name': 'Ahmet', 'date': '2025-12-15'} gibi veriler.
    """
    try:
        template = EmailTemplate.objects.get(slug=template_slug)
        subject = template.subject
        body = template.body
    except EmailTemplate.DoesNotExist:
        default = DEFAULT_EMAILS.get(template_slug)
        if not default:
            print(f"Hata: {template_slug} isimli şablon bulunamadı.")
            return False # Kodda da tanımlı değilse gönderim yapma
        subject = default['subject']
        body = default['body']

    # Şablondaki {{anahtar}} yapılarını context verileriyle değiştir
    for key, value in context.items():
        placeholder = f"{{{{{key}}}}}"
        subject = subject.replace(placeholder, str(value))
        body = body.replace(placeholder, str(value))

    send_mail(
        subject=subject,
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[target_email],
        fail_silently=False,
    )
    return True