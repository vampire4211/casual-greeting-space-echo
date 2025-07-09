#!/bin/bash

# Event Sathi Django Backend Startup Script

echo "Starting Event Sathi Django Backend..."

# Navigate to backend directory
cd backend

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Make migrations
echo "Creating database migrations..."
python manage.py makemigrations accounts
python manage.py makemigrations vendors  
python manage.py makemigrations categories

# Apply migrations
echo "Applying database migrations..."
python manage.py migrate

# Start development server
echo "Starting Django development server on port 8000..."
python manage.py runserver 0.0.0.0:8000