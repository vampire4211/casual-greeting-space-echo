from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from accounts.models import VendorProfile
from categories.models import Category
from .models import VendorCategory, VendorService, VendorPackage, VendorImage, VendorReview
import json
import random

@csrf_exempt
@require_http_methods(["GET"])
def vendor_list(request):
    """Get all vendors with filtering options"""
    category = request.GET.get('category')
    location = request.GET.get('location')
    
    vendors = VendorProfile.objects.filter(is_verified=True)
    
    if category and category != 'All':
        vendors = vendors.filter(categories__category__name__icontains=category)
    
    if location and location != 'All':
        vendors = vendors.filter(city__icontains=location)
    
    vendor_data = []
    for vendor in vendors:
        # Get vendor categories
        vendor_categories = VendorCategory.objects.filter(vendor=vendor)
        categories = [vc.category.name for vc in vendor_categories]
        
        # Get vendor images
        vendor_images = VendorImage.objects.filter(vendor=vendor).order_by('order')[:3]
        images = [f"/api/media/image/{img.image_id}" for img in vendor_images]
        
        # Get vendor services for pricing
        services = VendorService.objects.filter(vendor=vendor)
        min_price = min([service.base_price for service in services]) if services else random.randint(10000, 30000)
        max_price = max([service.max_price or service.base_price for service in services]) if services else min_price + random.randint(20000, 50000)
        
        vendor_data.append({
            'id': vendor.id,
            'business_name': vendor.business_name,
            'vendor_name': vendor.user.first_name + ' ' + vendor.user.last_name,
            'email': vendor.user.email,
            'phone_number': vendor.user.phone,
            'address': vendor.address,
            'city': vendor.city,
            'state': vendor.state,
            'categories': categories,
            'rating': float(vendor.rating),
            'total_reviews': vendor.total_reviews,
            'images': images,
            'price_range': f"₹{int(min_price)} - ₹{int(max_price)}",
            'subscription_plan': vendor.subscription_plan,
            'created_at': vendor.user.date_joined.isoformat()
        })
    
    return JsonResponse({'vendors': vendor_data})

@csrf_exempt
@require_http_methods(["GET"])
def get_vendors_by_category(request, category_name):
    """Get vendors filtered by category"""
    try:
        category = Category.objects.get(name__iexact=category_name)
        vendor_categories = VendorCategory.objects.filter(category=category)
        vendors = [vc.vendor for vc in vendor_categories if vc.vendor.is_verified]
        
        vendor_data = []
        for vendor in vendors:
            # Get all categories for this vendor
            all_categories = VendorCategory.objects.filter(vendor=vendor)
            categories = [vc.category.name for vc in all_categories]
            
            # Get vendor images
            vendor_images = VendorImage.objects.filter(vendor=vendor).order_by('order')[:3]
            images = [f"/api/media/image/{img.image_id}" for img in vendor_images]
            
            # Get services for pricing
            services = VendorService.objects.filter(vendor=vendor)
            min_price = min([service.base_price for service in services]) if services else random.randint(10000, 30000)
            max_price = max([service.max_price or service.base_price for service in services]) if services else min_price + random.randint(20000, 50000)
            
            vendor_data.append({
                'id': vendor.id,
                'business_name': vendor.business_name,
                'vendor_name': vendor.user.first_name + ' ' + vendor.user.last_name,
                'email': vendor.user.email,
                'phone_number': vendor.user.phone,
                'address': vendor.address,
                'city': vendor.city,
                'state': vendor.state,
                'categories': categories,
                'rating': float(vendor.rating),
                'total_reviews': vendor.total_reviews,
                'images': images,
                'price_range': f"₹{int(min_price)} - ₹{int(max_price)}",
                'subscription_plan': vendor.subscription_plan,
                'created_at': vendor.user.date_joined.isoformat()
            })
        
        return JsonResponse({'vendors': vendor_data})
    
    except Category.DoesNotExist:
        return JsonResponse({'error': 'Category not found'}, status=404)

@csrf_exempt
@require_http_methods(["GET"])
def vendor_detail(request, vendor_id):
    """Get detailed information about a specific vendor"""
    try:
        vendor = VendorProfile.objects.get(id=vendor_id, is_verified=True)
        
        # Get vendor categories
        vendor_categories = VendorCategory.objects.filter(vendor=vendor)
        categories = [vc.category.name for vc in vendor_categories]
        
        # Get vendor services
        services = VendorService.objects.filter(vendor=vendor)
        service_data = [{
            'id': service.id,
            'title': service.title,
            'description': service.description,
            'base_price': float(service.base_price),
            'max_price': float(service.max_price) if service.max_price else None,
            'duration': service.duration,
            'is_customizable': service.is_customizable
        } for service in services]
        
        # Get vendor packages
        packages = VendorPackage.objects.filter(vendor=vendor, is_active=True)
        package_data = [{
            'id': package.id,
            'name': package.name,
            'description': package.description,
            'price': float(package.price),
            'features': package.features
        } for package in packages]
        
        # Get vendor images
        vendor_images = VendorImage.objects.filter(vendor=vendor).order_by('order')
        images = [{
            'id': image.id,
            'image_url': f"/api/media/image/{image.image_id}",
            'title': image.title,
            'description': image.description,
            'is_featured': image.is_featured
        } for image in vendor_images]
        
        # Get vendor reviews
        reviews = VendorReview.objects.filter(vendor=vendor).order_by('-created_at')[:10]
        review_data = [{
            'id': review.id,
            'customer_name': review.customer.user.first_name + ' ' + review.customer.user.last_name,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at.isoformat()
        } for review in reviews]
        
        vendor_data = {
            'id': vendor.id,
            'business_name': vendor.business_name,
            'vendor_name': vendor.user.first_name + ' ' + vendor.user.last_name,
            'email': vendor.user.email,
            'phone_number': vendor.user.phone,
            'address': vendor.address,
            'city': vendor.city,
            'state': vendor.state,
            'pincode': vendor.pincode,
            'categories': categories,
            'rating': float(vendor.rating),
            'total_reviews': vendor.total_reviews,
            'subscription_plan': vendor.subscription_plan,
            'services': service_data,
            'packages': package_data,
            'images': images,
            'reviews': review_data,
            'created_at': vendor.user.date_joined.isoformat()
        }
        
        return JsonResponse({'vendor': vendor_data})
    
    except VendorProfile.DoesNotExist:
        return JsonResponse({'error': 'Vendor not found'}, status=404)

@csrf_exempt
@require_http_methods(["GET"])
def vendor_images(request):
    """Get images for a specific vendor"""
    vendor_id = request.GET.get('vendor_id')
    
    if not vendor_id:
        return JsonResponse({'error': 'Vendor ID is required'}, status=400)
    
    try:
        vendor = VendorProfile.objects.get(id=vendor_id)
        images = VendorImage.objects.filter(vendor=vendor).order_by('order')
        
        image_data = [{
            'id': image.id,
            'image_url': f"/api/media/image/{image.image_id}",
            'title': image.title,
            'description': image.description,
            'is_featured': image.is_featured,
            'order': image.order
        } for image in images]
        
        return JsonResponse({'images': image_data})
    
    except VendorProfile.DoesNotExist:
        return JsonResponse({'error': 'Vendor not found'}, status=404)

@csrf_exempt
@require_http_methods(["POST"])
def upload_vendor_image(request):
    """Upload image for a vendor"""
    # This will be implemented when we add media storage functionality
    return JsonResponse({'message': 'Image upload endpoint ready'})