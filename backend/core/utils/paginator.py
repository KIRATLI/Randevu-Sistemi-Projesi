from django.core.paginator import Paginator

def paginate_queryset(queryset, request, limit_default=10):
    page_number = request.GET.get('page', 1)
    limit = request.GET.get('limit', limit_default)

    paginator = Paginator(queryset, limit)
    page_obj = paginator.get_page(page_number)

    return {
        "items": list(page_obj.object_list),
        "total_pages": paginator.num_pages,
        "current_page": page_obj.number,
        "total_items": paginator.count
    }