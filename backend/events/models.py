from django.db import models
from accounts.models import User, CustomerProfile, VendorProfile

class Event(models.Model):
    EVENT_TYPES = [
        ('wedding', 'Wedding'),
        ('corporate', 'Corporate'),
        ('birthday', 'Birthday'),
        ('anniversary', 'Anniversary'),
        ('party', 'Party'),
        ('conference', 'Conference'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    organizer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='organized_events')
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    guest_count = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    requirements = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.event_date}"

class EventVendor(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_vendors')
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='vendor_events')
    service_type = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[
        ('invited', 'Invited'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('confirmed', 'Confirmed'),
    ], default='invited')
    quoted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['event', 'vendor']