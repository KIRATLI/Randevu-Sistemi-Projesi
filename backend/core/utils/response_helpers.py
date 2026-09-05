from django.http import JsonResponse


def api_success(data=None, message=None, status=200, **extra):
    """Başarılı işlemleri standart formatta döndürür."""
    response = {"success": True}
    if data is not None:
        response["data"] = data
    if message:
        response["message"] = message

    response.update(extra)
    return JsonResponse(response, status=status)

def api_error(message, code, status=400, **extra):
    """Hatalı işlemleri standart formatta döndürür."""
    response = {
        "success": False,
        "error": message,
        "code": code
    }

    response.update(extra)
    return JsonResponse(response, status=status)


class APIErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        # Beklenmedik tüm API hatalarını yakalar ve JSON döner
        if request.path.startswith('/api/'):
            return api_error(
                message=str(exception),
                code="INTERNAL_SERVER_ERROR",
                status=500
            )
        return None