from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Category, Subcategory
from vendors.models import VendorCategory

@csrf_exempt
@require_http_methods(["GET"])
def category_list(request):
    """Get all categories"""
    categories = Category.objects.filter(is_active=True).order_by('name')
    
    category_data = []
    for category in categories:
        subcategories = Subcategory.objects.filter(category=category, is_active=True)
        subcategory_data = [{
            'id': sub.id,
            'name': sub.name,
            'description': sub.description
        } for sub in subcategories]
        
        # Count vendors in this category
        vendor_count = VendorCategory.objects.filter(category=category).count()
        
        category_data.append({
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'icon': category.icon,
            'vendor_count': vendor_count,
            'subcategories': subcategory_data,
            'created_at': category.created_at.isoformat()
        })
    
    return JsonResponse({'categories': category_data})

@csrf_exempt
@require_http_methods(["GET"])
def category_detail(request, category_id):
    """Get detailed information about a specific category"""
    try:
        category = Category.objects.get(id=category_id, is_active=True)
        
        subcategories = Subcategory.objects.filter(category=category, is_active=True)
        subcategory_data = [{
            'id': sub.id,
            'name': sub.name,
            'description': sub.description
        } for sub in subcategories]
        
        # Get vendors in this category
        vendor_categories = VendorCategory.objects.filter(category=category)
        vendor_count = vendor_categories.count()
        
        category_data = {
            'id': category.id,
            'name': category.name,
            'description': category.description,
            'icon': category.icon,
            'vendor_count': vendor_count,
            'subcategories': subcategory_data,
            'created_at': category.created_at.isoformat()
        }
        
        return JsonResponse({'category': category_data})
    
    except Category.DoesNotExist:
        return JsonResponse({'error': 'Category not found'}, status=404)

@csrf_exempt
@require_http_methods(["GET"])
def vendors_by_category(request, category_name):
    """Get vendors in a specific category"""
    try:
        category = Category.objects.get(name__iexact=category_name, is_active=True)
        vendor_categories = VendorCategory.objects.filter(category=category)
        
        vendor_data = []
        for vc in vendor_categories:
            vendor = vc.vendor
            if vendor.is_verified:
                vendor_data.append({
                    'id': vendor.id,
                    'business_name': vendor.business_name,
                    'vendor_name': vendor.user.first_name + ' ' + vendor.user.last_name,
                    'email': vendor.user.email,
                    'city': vendor.city,
                    'rating': float(vendor.rating),
                    'total_reviews': vendor.total_reviews,
                    'subscription_plan': vendor.subscription_plan
                })
        
        return JsonResponse({
            'category': category.name,
            'vendors': vendor_data
        })
    
    except Category.DoesNotExist:
        return JsonResponse({'error': 'Category not found'}, status=404)