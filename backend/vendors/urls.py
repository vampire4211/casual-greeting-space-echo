from django.urls import path
from . import views

urlpatterns = [
    path('', views.vendor_list, name='vendor_list'),
    path('<int:vendor_id>/', views.vendor_detail, name='vendor_detail'),
    path('upload-category-image/', views.upload_vendor_category_image, name='upload_vendor_category_image'),
    path('dashboard/', views.vendor_dashboard_data, name='vendor_dashboard_data'),
]