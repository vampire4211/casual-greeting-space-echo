from django.db import models
from accounts.models import CustomerProfile, VendorProfile
from events.models import Event

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='bookings')
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='vendor_bookings')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings', null=True, blank=True)
    service_type = models.CharField(max_length=100)
    booking_date = models.DateTimeField()
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    guest_count = models.IntegerField(null=True, blank=True)
    package_details = models.JSONField(default=dict, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    special_requirements = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Booking {self.id} - {self.customer.user.username} with {self.vendor.business_name}"

class BookingMessage(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']