from rest_framework import serializers
from .models import Event, EventVendor
from accounts.serializers import CustomerProfileSerializer, VendorProfileSerializer

class EventSerializer(serializers.ModelSerializer):
    organizer = CustomerProfileSerializer(read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer', 'created_at', 'updated_at']

class EventVendorSerializer(serializers.ModelSerializer):
    vendor = VendorProfileSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = EventVendor
        fields = '__all__'

class CreateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'event_type', 'event_date', 'location', 
                 'budget_min', 'budget_max', 'guest_count', 'requirements']