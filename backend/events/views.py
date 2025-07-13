from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from .models import Event, EventVendor
from .serializers import EventSerializer, CreateEventSerializer, EventVendorSerializer
from accounts.models import CustomerProfile

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def event_list(request):
    """List events or create new event"""
    if request.method == 'GET':
        events = Event.objects.all()
        
        # Filter by event type
        event_type = request.GET.get('event_type')
        if event_type:
            events = events.filter(event_type=event_type)
        
        # Filter by location
        location = request.GET.get('location')
        if location:
            events = events.filter(location__icontains=location)
        
        # Filter by status
        status_filter = request.GET.get('status')
        if status_filter:
            events = events.filter(status=status_filter)
        
        # Search
        search = request.GET.get('search')
        if search:
            events = events.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        paginator = PageNumberPagination()
        paginator.page_size = 12
        result_page = paginator.paginate_queryset(events, request)
        serializer = EventSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    elif request.method == 'POST':
        try:
            customer_profile = CustomerProfile.objects.get(user=request.user)
        except CustomerProfile.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CreateEventSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save(organizer=customer_profile)
            return Response(EventSerializer(event).data, 
                          status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def event_detail(request, event_id):
    """Get, update or delete specific event"""
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    # Check permissions
    if request.method in ['PUT', 'DELETE']:
        if event.organizer.user != request.user:
            return Response({'error': 'Permission denied'}, 
                          status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CreateEventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(EventSerializer(event).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_events(request):
    """Get current user's events"""
    try:
        customer_profile = CustomerProfile.objects.get(user=request.user)
        events = Event.objects.filter(organizer=customer_profile)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    except CustomerProfile.DoesNotExist:
        return Response({'error': 'Customer profile not found'}, 
                       status=status.HTTP_400_BAD_REQUEST)