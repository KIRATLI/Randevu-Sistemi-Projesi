from functools import wraps
from backend.core.security import verify_token
from backend.core.utils.response_helpers import api_error

def token_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        # 1. Header'dan "Authorization: Bearer <token>" bilgisini al
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return api_error("Token bulunamadı veya geçersiz format", "INVALID_TOKEN", status=401)

        token = auth_header.split(' ')[1] # "Bearer" kısmını at, sadece token'ı al

        # 2. Token'ı doğrula
        payload = verify_token(token)
        if not payload:
            return api_error("Token geçersiz veya süresi dolmuş", "INVALID_TOKEN", status=401)

        # 3. Kullanıcı verisini request içine koy ki view içinden erişebilelim
        request.user_payload = payload
        return view_func(request, *args, **kwargs)

    return _wrapped_view


def role_required(allowed_roles):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # 1. token_required'ın çalıştığından emin ol
            user_payload = getattr(request, 'user_payload', None)

            if not user_payload:
                return api_error("Kimlik bilgileri bulunamadı.", "UNAUTHORIZED", status=401)

            user_role = user_payload.get('role')

            # 2. Esneklik: Eğer tek bir string gelirse onu listeye çevir
            # Böylece kontrol her zaman 'in' ile yapılabilir
            roles_to_check = allowed_roles if isinstance(allowed_roles, list) else [allowed_roles]

            # 3. Rol kontrolü
            if user_role not in roles_to_check:
                return api_error(
                    message=f"Bu işlem için şu yetkilerden biri gerekiyor: {', '.join(roles_to_check)}",
                    code="PERMISSION_DENIED",
                    status=403
                )

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator