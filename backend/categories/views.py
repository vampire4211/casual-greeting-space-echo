from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from .models import Category, AdminHomepageImages
import json
import base64
from django.core.files.base import ContentFile

@csrf_exempt
@require_http_methods(["GET"])
def category_list(request):
    """Get all categories"""
    try:
        categories = Category.objects.filter(is_active=True).order_by('name')
        
        category_data = []
        for category in categories:
            subcategories = category.subcategories.filter(is_active=True)
            subcategory_data = [{
                'id': sub.id,
                'name': sub.name,
                'description': sub.description
            } for sub in subcategories]
            
            category_data.append({
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'icon': category.icon,
                'subcategories': subcategory_data,
                'created_at': category.created_at.isoformat()
            })
        
        return JsonResponse({'categories': category_data})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def homepage_images(request):
    """Get homepage images for hero and carousel"""
    try:
        section = request.GET.get('section', 'all')
        
        if section == 'all':
            images = AdminHomepageImages.objects.filter(is_active=True).order_by('section', 'slot_number')
        else:
            images = AdminHomepageImages.objects.filter(
                section=section, 
                is_active=True
            ).order_by('slot_number')
        
        image_data = []
        for image in images:
            # Convert binary data to base64 for transmission
            image_base64 = base64.b64encode(image.image_data).decode('utf-8')
            image_url = f"data:{image.image_type};base64,{image_base64}"
            
            image_data.append({
                'id': image.id,
                'section': image.section,
                'slot_number': image.slot_number,
                'image_url': image_url,
                'image_name': image.image_name,
                'alt_text': image.alt_text,
                'title': image.title,
                'description': image.description,
                'created_at': image.created_at.isoformat()
            })
        
        return JsonResponse({'images': image_data})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@login_required
def upload_homepage_image(request):
    """Upload or update homepage image"""
    try:
        # Check if user is admin (you can modify this logic based on your admin system)
        if request.user.user_type != 'admin':
            return JsonResponse({'error': 'Only admins can upload homepage images'}, status=403)
        
        section = request.POST.get('section')
        slot_number = int(request.POST.get('slot_number'))
        title = request.POST.get('title', '')
        description = request.POST.get('description', '')
        alt_text = request.POST.get('alt_text', '')
        
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)
        
        image_file = request.FILES['image']
        
        # Validate image type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png']
        if image_file.content_type not in allowed_types:
            return JsonResponse({'error': 'Only JPEG, JPG, and PNG files are allowed'}, status=400)
        
        # Read image data
        image_data = image_file.read()
        
        # Update or create image record
        image_obj, created = AdminHomepageImages.objects.update_or_create(
            section=section,
            slot_number=slot_number,
            defaults={
                'image_data': image_data,
                'image_name': image_file.name,
                'image_type': image_file.content_type,
                'title': title,
                'description': description,
                'alt_text': alt_text,
                'uploaded_by': str(request.user.id),
                'is_active': True
            }
        )
        
        return JsonResponse({
            'message': 'Image uploaded successfully',
            'image_id': image_obj.id,
            'action': 'created' if created else 'updated'
        })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def download_homepage_image(request, image_id):
    """Download homepage image"""
    try:
        image = AdminHomepageImages.objects.get(id=image_id, is_active=True)
        
        response = HttpResponse(image.image_data, content_type=image.image_type)
        response['Content-Disposition'] = f'attachment; filename="{image.image_name}"'
        
        return response
    
    except AdminHomepageImages.DoesNotExist:
        return JsonResponse({'error': 'Image not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)