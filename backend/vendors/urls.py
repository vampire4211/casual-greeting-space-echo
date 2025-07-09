from django.urls import path
from . import views

urlpatterns = [
    path('', views.vendor_list, name='vendor_list'),
    path('category/<str:category_name>/', views.get_vendors_by_category, name='vendors_by_category'),
    path('<int:vendor_id>/', views.vendor_detail, name='vendor_detail'),
    path('images/', views.vendor_images, name='vendor_images'),
    path('upload-image/', views.upload_vendor_image, name='upload_vendor_image'),
]