from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
import re

class AdminUser(models.Model):
    """Custom admin user model for main admin and sub-admins"""
    ADMIN_TYPES = [
        ('main', 'Main Admin'),
        ('sub', 'Sub Admin'),
    ]
    
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Will be hashed
    admin_type = models.CharField(max_length=10, choices=ADMIN_TYPES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'admin_users'
    
    def __str__(self):
        return f"{self.email} ({self.admin_type})"
    
    @classmethod
    def validate_sub_admin_email(cls, email):
        """Validate sub-admin email format: eventsathi{number}@.com"""
        pattern = r'^eventsathi\d+@\.com$'
        return re.match(pattern, email) is not None
    
    @classmethod
    def validate_sub_admin_password(cls, password):
        """Validate sub-admin password requirements"""
        if len(password) < 10 or len(password) > 15:
            return False, "Password must be between 10-15 characters"
        
        has_lower = re.search(r'[a-z]', password)
        has_upper = re.search(r'[A-Z]', password)
        has_digit = re.search(r'\d', password)
        has_special = re.search(r'[!@#$%^&*(),.?":{}|<>]', password)
        
        if not all([has_lower, has_upper, has_digit, has_special]):
            return False, "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
        
        return True, "Valid password"

class VendorAction(models.Model):
    """Track admin actions on vendors"""
    ACTION_TYPES = [
        ('block', 'Block'),
        ('unblock', 'Unblock'),
        ('remove', 'Remove'),
    ]
    
    admin_user = models.ForeignKey(AdminUser, on_delete=models.CASCADE)
    vendor_id = models.UUIDField()  # Reference to vendor from vendors app
    action_type = models.CharField(max_length=10, choices=ACTION_TYPES)
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'vendor_actions'

class CustomerAction(models.Model):
    """Track admin actions on customers"""
    ACTION_TYPES = [
        ('block', 'Block'),
        ('unblock', 'Unblock'),
        ('remove', 'Remove'),
    ]
    
    admin_user = models.ForeignKey(AdminUser, on_delete=models.CASCADE)
    customer_id = models.UUIDField()  # Reference to customer from accounts app
    action_type = models.CharField(max_length=10, choices=ACTION_TYPES)
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'customer_actions'

class AdminSession(models.Model):
    """Track admin login sessions"""
    admin_user = models.ForeignKey(AdminUser, on_delete=models.CASCADE)
    session_token = models.CharField(max_length=255, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'admin_sessions'