from django.urls import path
from . import views

urlpatterns = [
    path('', views.category_list, name='category_list'),
    path('homepage-images/', views.homepage_images, name='homepage_images'),
    path('upload-homepage-image/', views.upload_homepage_image, name='upload_homepage_image'),
    path('download-image/<int:image_id>/', views.download_homepage_image, name='download_homepage_image'),
]