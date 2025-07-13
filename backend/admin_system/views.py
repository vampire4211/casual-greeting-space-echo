from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
import hashlib
import secrets
import uuid

from .models import AdminUser, AdminSession, VendorAction, CustomerAction
from .serializers import (
    AdminLoginSerializer, SubAdminCreateSerializer, SubAdminSerializer,
    VendorManagementSerializer, CustomerManagementSerializer, VendorActionSerializer
)
from vendors.models import VendorProfile
from accounts.models import CustomerProfile, User

class IsAdminAuthenticated(permissions.BasePermission):
    """Custom permission for admin authentication"""
    
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('AdminToken '):
            return False
        
        token = auth_header.split(' ')[1]
        try:
            session = AdminSession.objects.get(
                session_token=token,
                is_active=True,
                expires_at__gt=timezone.now()
            )
            request.admin_user = session.admin_user
            return True
        except AdminSession.DoesNotExist:
            return False

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_login(request):
    """Admin login endpoint"""
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid():
        admin_user = serializer.validated_data['admin_user']
        
        # Update last login
        admin_user.last_login = timezone.now()
        admin_user.save()
        
        # Create session
        session_token = secrets.token_urlsafe(32)
        session = AdminSession.objects.create(
            admin_user=admin_user,
            session_token=session_token,
            ip_address=request.META.get('REMOTE_ADDR', ''),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            expires_at=timezone.now() + timedelta(hours=8)
        )
        
        return Response({
            'token': session_token,
            'admin_type': admin_user.admin_type,
            'email': admin_user.email,
            'expires_at': session.expires_at
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAdminAuthenticated])
def admin_logout(request):
    """Admin logout endpoint"""
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(' ')[1]
    
    try:
        session = AdminSession.objects.get(session_token=token)
        session.is_active = False
        session.save()
        return Response({'message': 'Logged out successfully'})
    except AdminSession.DoesNotExist:
        return Response({'error': 'Invalid session'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAdminAuthenticated])
def sub_admin_management(request):
    """Manage sub-admins (only main admin can access)"""
    if request.admin_user.admin_type != 'main':
        return Response({'error': 'Only main admin can manage sub-admins'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        sub_admins = AdminUser.objects.filter(admin_type='sub')
        serializer = SubAdminSerializer(sub_admins, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SubAdminCreateSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Hash password
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            
            # Create sub-admin
            sub_admin = AdminUser.objects.create(
                email=email,
                password=hashed_password,
                admin_type='sub',
                created_by=request.admin_user
            )
            
            return Response({
                'message': 'Sub-admin created successfully',
                'sub_admin': SubAdminSerializer(sub_admin).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminAuthenticated])
def remove_sub_admin(request):
    """Remove sub-admin (only main admin can access)"""
    if request.admin_user.admin_type != 'main':
        return Response({'error': 'Only main admin can remove sub-admins'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        sub_admin = AdminUser.objects.get(email=email, admin_type='sub')
        
        # Deactivate all sessions
        AdminSession.objects.filter(admin_user=sub_admin).update(is_active=False)
        
        # Delete sub-admin
        sub_admin.delete()
        
        return Response({'message': 'Sub-admin removed successfully'})
    except AdminUser.DoesNotExist:
        return Response({'error': 'Sub-admin not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminAuthenticated])
def vendor_management(request):
    """Get all vendors with management data"""
    vendors = VendorProfile.objects.annotate(
        total_bookings=Count('vendor_bookings'),
        total_revenue=Sum('vendor_bookings__total_amount'),
        is_blocked=Count('vendoraction', filter=Q(vendoraction__action_type='block'))
    ).select_related('user')
    
    # Filter options
    search = request.GET.get('search')
    if search:
        vendors = vendors.filter(
            Q(business_name__icontains=search) |
            Q(vendor_name__icontains=search) |
            Q(user__email__icontains=search)
        )
    
    subscription_plan = request.GET.get('subscription_plan')
    if subscription_plan:
        vendors = vendors.filter(subscription_plan=subscription_plan)
    
    serializer = VendorManagementSerializer(vendors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminAuthenticated])
def customer_management(request):
    """Get all customers with management data"""
    customers = CustomerProfile.objects.annotate(
        total_bookings=Count('bookings'),
        total_spent=Sum('bookings__total_amount'),
        is_blocked=Count('customeraction', filter=Q(customeraction__action_type='block'))
    ).select_related('user')
    
    # Filter options
    search = request.GET.get('search')
    if search:
        customers = customers.filter(
            Q(user__first_name__icontains=search) |
            Q(user__last_name__icontains=search) |
            Q(user__email__icontains=search)
        )
    
    serializer = CustomerManagementSerializer(customers, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminAuthenticated])
def vendor_action(request):
    """Perform action on vendor (block/unblock/remove)"""
    vendor_id = request.data.get('vendor_id')
    action_type = request.data.get('action_type')
    reason = request.data.get('reason', '')
    
    if not vendor_id or not action_type:
        return Response({'error': 'vendor_id and action_type are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    if action_type not in ['block', 'unblock', 'remove']:
        return Response({'error': 'Invalid action_type'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        vendor = VendorProfile.objects.get(id=vendor_id)
        
        # Record action
        VendorAction.objects.create(
            admin_user=request.admin_user,
            vendor_id=vendor_id,
            action_type=action_type,
            reason=reason
        )
        
        # Perform action
        if action_type == 'block':
            vendor.is_verified = False
            vendor.save()
            message = 'Vendor blocked successfully'
        elif action_type == 'unblock':
            vendor.is_verified = True
            vendor.save()
            message = 'Vendor unblocked successfully'
        elif action_type == 'remove':
            vendor.user.is_active = False
            vendor.user.save()
            message = 'Vendor removed successfully'
        
        return Response({'message': message})
    except VendorProfile.DoesNotExist:
        return Response({'error': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAdminAuthenticated])
def customer_action(request):
    """Perform action on customer (block/unblock/remove)"""
    customer_id = request.data.get('customer_id')
    action_type = request.data.get('action_type')
    reason = request.data.get('reason', '')
    
    if not customer_id or not action_type:
        return Response({'error': 'customer_id and action_type are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    if action_type not in ['block', 'unblock', 'remove']:
        return Response({'error': 'Invalid action_type'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        customer = CustomerProfile.objects.get(id=customer_id)
        
        # Record action
        CustomerAction.objects.create(
            admin_user=request.admin_user,
            customer_id=customer_id,
            action_type=action_type,
            reason=reason
        )
        
        # Perform action
        if action_type == 'block':
            customer.user.is_active = False
            customer.user.save()
            message = 'Customer blocked successfully'
        elif action_type == 'unblock':
            customer.user.is_active = True
            customer.user.save()
            message = 'Customer unblocked successfully'
        elif action_type == 'remove':
            customer.user.is_active = False
            customer.user.save()
            message = 'Customer removed successfully'
        
        return Response({'message': message})
    except CustomerProfile.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAdminAuthenticated])
def admin_dashboard_stats(request):
    """Get dashboard statistics"""
    stats = {
        'total_vendors': VendorProfile.objects.count(),
        'active_vendors': VendorProfile.objects.filter(is_verified=True).count(),
        'total_customers': CustomerProfile.objects.count(),
        'active_customers': CustomerProfile.objects.filter(user__is_active=True).count(),
        'total_sub_admins': AdminUser.objects.filter(admin_type='sub').count(),
        'recent_vendor_actions': VendorAction.objects.select_related('admin_user').order_by('-created_at')[:10],
        'recent_customer_actions': CustomerAction.objects.select_related('admin_user').order_by('-created_at')[:10],
    }
    
    # Serialize recent actions
    stats['recent_vendor_actions'] = VendorActionSerializer(stats['recent_vendor_actions'], many=True).data
    
    return Response(stats)