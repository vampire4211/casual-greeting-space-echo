from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Avg
from accounts.models import VendorProfile
from categories.models import Category
from .models import VendorService, VendorPackage, VendorImage, VendorCategoryImages
import json
import base64
import random

@csrf_exempt
@require_http_methods(["GET"])
def vendor_list(request):
    """Get all vendors with filtering options"""
    try:
        category = request.GET.get('category')
        location = request.GET.get('location')
        
        vendors = VendorProfile.objects.filter(is_verified=True)
        
        if category and category != 'All':
            vendors = vendors.filter(categories__contains=[category])
        
        if location and location != 'All':
            vendors = vendors.filter(Q(city__icontains=location) | Q(address__icontains=location))
        
        vendor_data = []
        for vendor in vendors:
            # Get vendor images for display
            vendor_images = VendorCategoryImages.objects.filter(vendor=vendor)[:3]
            images = []
            for img in vendor_images:
                image_base64 = base64.b64encode(img.image_data).decode('utf-8')
                image_url = f"data:{img.image_type};base64,{image_base64}"
                images.append(image_url)
            
            # Calculate price range from services
            services = VendorService.objects.filter(vendor=vendor)
            if services:
                min_price = min([service.base_price for service in services])
                max_price = max([service.max_price or service.base_price for service in services])
            else:
                min_price = random.randint(10000, 30000)
                max_price = min_price + random.randint(20000, 50000)
            
            vendor_data.append({
                'id': vendor.id,
                'business_name': vendor.business_name,
                'vendor_name': f"{vendor.user.first_name} {vendor.user.last_name}",
                'email': vendor.user.email,
                'phone_number': vendor.user.phone,
                'address': vendor.address,
                'city': vendor.city,
                'state': vendor.state,
                'categories': vendor.categories,
                'rating': float(vendor.rating),
                'total_reviews': vendor.total_reviews,
                'images': images,
                'price_range': f"₹{int(min_price)} - ₹{int(max_price)}",
                'subscription_plan': vendor.subscription_plan,
                'created_at': vendor.user.date_joined.isoformat()
            })
        
        return JsonResponse({'vendors': vendor_data})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def vendor_detail(request, vendor_id):
    """Get detailed information about a specific vendor"""
    try:
        vendor = VendorProfile.objects.get(id=vendor_id, is_verified=True)
        
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
        
        # Get vendor images organized by category
        vendor_images = VendorCategoryImages.objects.filter(vendor=vendor).order_by('category_name', 'image_order')
        images_by_category = {}
        for image in vendor_images:
            if image.category_name not in images_by_category:
                images_by_category[image.category_name] = []
            
            image_base64 = base64.b64encode(image.image_data).decode('utf-8')
            image_url = f"data:{image.image_type};base64,{image_base64}"
            
            images_by_category[image.category_name].append({
                'id': image.id,
                'image_url': image_url,
                'image_name': image.image_name,
                'is_featured': image.is_featured,
                'order': image.image_order
            })
        
        vendor_data = {
            'id': vendor.id,
            'business_name': vendor.business_name,
            'vendor_name': f"{vendor.user.first_name} {vendor.user.last_name}",
            'email': vendor.user.email,
            'phone_number': vendor.user.phone,
            'address': vendor.address,
            'city': vendor.city,
            'state': vendor.state,
            'pincode': vendor.pincode,
            'categories': vendor.categories,
            'rating': float(vendor.rating),
            'total_reviews': vendor.total_reviews,
            'subscription_plan': vendor.subscription_plan,
            'business_info': vendor.business_info,
            'pricing_info': vendor.pricing_info,
            'availability_info': vendor.availability_info,
            'services': service_data,
            'packages': package_data,
            'images_by_category': images_by_category,
            'created_at': vendor.user.date_joined.isoformat()
        }
        
        return JsonResponse({'vendor': vendor_data})
    
    except VendorProfile.DoesNotExist:
        return JsonResponse({'error': 'Vendor not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@login_required
def upload_vendor_category_image(request):
    """Upload images for vendor categories"""
    try:
        if request.user.user_type != 'vendor':
            return JsonResponse({'error': 'Only vendors can upload images'}, status=403)
        
        vendor_profile = VendorProfile.objects.get(user=request.user)
        
        category_name = request.POST.get('category_name')
        image_order = int(request.POST.get('image_order', 0))
        is_featured = request.POST.get('is_featured', 'false').lower() == 'true'
        
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)
        
        image_file = request.FILES['image']
        
        # Validate image type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
        if image_file.content_type not in allowed_types:
            return JsonResponse({'error': 'Only JPEG, JPG, and PNG files are allowed'}, status=400)
        
        # Validate category belongs to vendor
        if category_name not in vendor_profile.categories:
            return JsonResponse({'error': 'Category not assigned to vendor'}, status=400)
        
        # Read image data
        image_data = image_file.read()
        
        # Create image record
        vendor_image = VendorCategoryImages.objects.create(
            vendor=vendor_profile,
            category_name=category_name,
            image_data=image_data,
            image_name=image_file.name,
            image_type=image_file.content_type,
            image_order=image_order,
            is_featured=is_featured
        )
        
        return JsonResponse({
            'message': 'Image uploaded successfully',
            'image_id': vendor_image.id,
            'category_name': category_name,
            'image_order': image_order
        })
    
    except VendorProfile.DoesNotExist:
        return JsonResponse({'error': 'Vendor profile not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
@login_required
def vendor_dashboard_data(request):
    """Get vendor dashboard data including categories and images"""
    try:
        if request.user.user_type != 'vendor':
            return JsonResponse({'error': 'Only vendors can access dashboard'}, status=403)
        
        vendor_profile = VendorProfile.objects.get(user=request.user)
        
        # Get images organized by category
        dashboard_data = {}
        for category in vendor_profile.categories:
            category_images = VendorCategoryImages.objects.filter(
                vendor=vendor_profile,
                category_name=category
            ).order_by('image_order')
            
            images = []
            for img in category_images:
                image_base64 = base64.b64encode(img.image_data).decode('utf-8')
                image_url = f"data:{img.image_type};base64,{image_base64}"
                
                images.append({
                    'id': img.id,
                    'image_url': image_url,
                    'image_name': img.image_name,
                    'order': img.image_order,
                    'is_featured': img.is_featured
                })
            
            dashboard_data[category] = {
                'images': images,
                'total_images': len(images)
            }
        
        return JsonResponse({
            'vendor_info': {
                'business_name': vendor_profile.business_name,
                'categories': vendor_profile.categories,
                'rating': float(vendor_profile.rating),
                'total_reviews': vendor_profile.total_reviews
            },
            'categories_data': dashboard_data
        })
    
    except VendorProfile.DoesNotExist:
        return JsonResponse({'error': 'Vendor profile not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)