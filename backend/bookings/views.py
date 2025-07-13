from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Booking, BookingMessage
from .serializers import BookingSerializer, CreateBookingSerializer, BookingMessageSerializer
from accounts.models import CustomerProfile, VendorProfile

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def booking_list(request):
    """List bookings or create new booking"""
    if request.method == 'GET':
        # Get bookings based on user type
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
            bookings = Booking.objects.filter(customer=customer_profile)
        except CustomerProfile.DoesNotExist:
            try:
                vendor_profile = VendorProfile.objects.get(user=request.user)
                bookings = Booking.objects.filter(vendor=vendor_profile)
            except VendorProfile.DoesNotExist:
                return Response({'error': 'Profile not found'}, 
                              status=status.HTTP_400_BAD_REQUEST)
        
        # Filter by status
        status_filter = request.GET.get('status')
        if status_filter:
            bookings = bookings.filter(status=status_filter)
        
        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(bookings, request)
        serializer = BookingSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    elif request.method == 'POST':
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CreateBookingSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save(customer=customer_profile)
            return Response(BookingSerializer(booking).data, 
                          status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def booking_detail(request, booking_id):
    """Get or update specific booking"""
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    # Check permissions
    if (booking.customer.user != request.user and 
        booking.vendor.user != request.user):
        return Response({'error': 'Permission denied'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Only allow status updates for vendors
        if booking.vendor.user == request.user:
            allowed_fields = ['status', 'notes']
            data = {k: v for k, v in request.data.items() if k in allowed_fields}
            serializer = BookingSerializer(booking, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Permission denied'}, 
                          status=status.HTTP_403_FORBIDDEN)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def booking_messages(request, booking_id):
    """Get or create booking messages"""
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    # Check permissions
    if (booking.customer.user != request.user and 
        booking.vendor.user != request.user):
        return Response({'error': 'Permission denied'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        messages = BookingMessage.objects.filter(booking=booking)
        serializer = BookingMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = BookingMessageSerializer(data=request.data)
        if serializer.is_valid():
            message = serializer.save(booking=booking, sender=request.user)
            return Response(BookingMessageSerializer(message).data, 
                          status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)