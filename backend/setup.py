#!/usr/bin/env python3
"""
Event Sathi Django Backend Setup Script
This script sets up the Django backend with proper database configuration.
"""

import os
import sys
import subprocess
import getpass

def create_env_file():
    """Create .env file with required environment variables"""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_path):
        print("✓ .env file already exists")
        return
    
    print("Creating .env file...")
    
    # Get Supabase DB password
    db_password = getpass.getpass("Enter your Supabase database password: ")
    
    # Generate Django secret key
    from django.core.management.utils import get_random_secret_key
    secret_key = get_random_secret_key()
    
    env_content = f"""# Django Environment Variables
SECRET_KEY={secret_key}
DEBUG=True
SUPABASE_DB_PASSWORD={db_password}

# Database Configuration (Already set in settings.py)
# DB_NAME=postgres
# DB_USER=postgres.mwjrrhluqiuchczgzzld
# DB_HOST=aws-0-ap-south-1.pooler.supabase.com
# DB_PORT=6543
"""
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print("✓ .env file created successfully")

def install_requirements():
    """Install Python requirements"""
    print("Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True, cwd=os.path.dirname(__file__))
        print("✓ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install dependencies: {e}")
        return False
    return True

def run_migrations():
    """Create and run database migrations"""
    print("Creating and applying database migrations...")
    django_dir = os.path.dirname(__file__)
    
    try:
        # Make migrations for each app
        apps = ['accounts', 'vendors', 'categories']
        for app in apps:
            print(f"Making migrations for {app}...")
            subprocess.run([sys.executable, 'manage.py', 'makemigrations', app], 
                          check=True, cwd=django_dir)
        
        # Apply all migrations
        print("Applying migrations...")
        subprocess.run([sys.executable, 'manage.py', 'migrate'], 
                      check=True, cwd=django_dir)
        
        print("✓ Database migrations completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to run migrations: {e}")
        return False
    return True

def create_superuser():
    """Optionally create Django superuser"""
    django_dir = os.path.dirname(__file__)
    
    create_user = input("Create Django admin superuser? (y/n): ").lower().strip()
    if create_user == 'y':
        try:
            subprocess.run([sys.executable, 'manage.py', 'createsuperuser'], 
                          cwd=django_dir)
            print("✓ Superuser created successfully")
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to create superuser: {e}")

def main():
    """Main setup function"""
    print("=== Event Sathi Django Backend Setup ===\n")
    
    # Change to backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Step 1: Create environment file
    create_env_file()
    
    # Step 2: Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Step 3: Run migrations
    if not run_migrations():
        sys.exit(1)
    
    # Step 4: Create superuser (optional)
    create_superuser()
    
    print("\n=== Setup Complete! ===")
    print("To start the development server, run:")
    print("  python manage.py runserver 0.0.0.0:8000")
    print("\nOr use the startup script:")
    print("  python start_server.py")

if __name__ == '__main__':
    main()