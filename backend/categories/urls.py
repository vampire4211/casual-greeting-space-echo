from django.urls import path
from . import views

urlpatterns = [
    path('', views.category_list, name='category_list'),
    path('<int:category_id>/', views.category_detail, name='category_detail'),
    path('<str:category_name>/vendors/', views.vendors_by_category, name='vendors_by_category'),
]