from django.http import JsonResponse
from .models import Vendor

def get_vendors_by_category(request, category_name):
    vendors = Vendor.objects.filter(categories__icontains=category_name)
    return JsonResponse({
        "vendors": list(vendors.values())})