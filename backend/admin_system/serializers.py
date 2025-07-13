from rest_framework import serializers
from .models import AdminUser, VendorAction, CustomerAction
from vendors.models import VendorProfile
from accounts.models import CustomerProfile
import hashlib

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        # Check for main admin
        if email == 'eventsathi1@.com' and password == 'Jay@8401724506':
            # Create or get main admin user
            admin_user, created = AdminUser.objects.get_or_create(
                email=email,
                defaults={
                    'password': hashlib.sha256(password.encode()).hexdigest(),
                    'admin_type': 'main',
                    'is_active': True
                }
            )
            attrs['admin_user'] = admin_user
            return attrs
        
        # Check for sub-admin
        try:
            admin_user = AdminUser.objects.get(email=email, admin_type='sub', is_active=True)
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            if admin_user.password == hashed_password:
                attrs['admin_user'] = admin_user
                return attrs
        except AdminUser.DoesNotExist:
            pass
        
        raise serializers.ValidationError('Invalid email or password')

class SubAdminCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate_email(self, value):
        if not AdminUser.validate_sub_admin_email(value):
            raise serializers.ValidationError(
                'Email must be in format: eventsathi{number}@.com'
            )
        
        if AdminUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('This email already exists')
        
        return value
    
    def validate_password(self, value):
        is_valid, message = AdminUser.validate_sub_admin_password(value)
        if not is_valid:
            raise serializers.ValidationError(message)
        return value

class SubAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'email', 'created_at', 'last_login', 'is_active']

class VendorManagementSerializer(serializers.ModelSerializer):
    total_bookings = serializers.IntegerField(read_only=True)
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_blocked = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = VendorProfile
        fields = [
            'id', 'business_name', 'vendor_name', 'email', 'phone_number',
            'categories', 'rating', 'total_reviews', 'subscription_plan',
            'created_at', 'is_verified', 'total_bookings', 'total_revenue', 'is_blocked'
        ]

class CustomerManagementSerializer(serializers.ModelSerializer):
    total_bookings = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_blocked = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = CustomerProfile
        fields = [
            'id', 'user__first_name', 'user__last_name', 'user__email', 
            'user__phone', 'created_at', 'total_bookings', 'total_spent', 'is_blocked'
        ]

class VendorActionSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.business_name', read_only=True)
    admin_email = serializers.CharField(source='admin_user.email', read_only=True)
    
    class Meta:
        model = VendorAction
        fields = ['id', 'vendor_id', 'vendor_name', 'action_type', 'reason', 'created_at', 'admin_email']