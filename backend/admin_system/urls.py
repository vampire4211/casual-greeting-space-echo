from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('login/', views.admin_login, name='admin_login'),
    path('logout/', views.admin_logout, name='admin_logout'),
    
    # Sub-admin management
    path('sub-admins/', views.sub_admin_management, name='sub_admin_management'),
    path('sub-admins/remove/', views.remove_sub_admin, name='remove_sub_admin'),
    
    # Vendor management
    path('vendors/', views.vendor_management, name='vendor_management'),
    path('vendors/action/', views.vendor_action, name='vendor_action'),
    
    # Customer management
    path('customers/', views.customer_management, name='customer_management'),
    path('customers/action/', views.customer_action, name='customer_action'),
    
    # Dashboard
    path('dashboard-stats/', views.admin_dashboard_stats, name='admin_dashboard_stats'),
]