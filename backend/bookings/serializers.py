from rest_framework import serializers
from .models import Booking, BookingMessage
from accounts.serializers import CustomerProfileSerializer, VendorProfileSerializer, UserSerializer
from events.serializers import EventSerializer

class BookingSerializer(serializers.ModelSerializer):
    customer = CustomerProfileSerializer(read_only=True)
    vendor = VendorProfileSerializer(read_only=True)
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['customer', 'created_at', 'updated_at']

class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['vendor', 'event', 'service_type', 'booking_date', 'event_date', 
                 'location', 'guest_count', 'package_details', 'total_amount', 
                 'advance_amount', 'special_requirements', 'notes']

class BookingMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = BookingMessage
        fields = '__all__'
        read_only_fields = ['sender', 'created_at']