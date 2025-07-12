#!/usr/bin/env python3
"""
Event Sathi Django Development Server Starter
"""

import os
import sys
import subprocess

def main():
    """Start the Django development server"""
    print("=== Starting Event Sathi Django Backend ===")
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("⚠️  .env file not found. Please run setup.py first:")
        print("  python setup.py")
        sys.exit(1)
    
    # Start the development server
    try:
        print("Starting Django development server on http://localhost:8000")
        print("Press Ctrl+C to stop the server\n")
        
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
        ], check=True)
        
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to start server: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure you've run setup.py first")
        print("2. Check that your .env file has the correct database password")
        print("3. Ensure your Supabase database is accessible")

if __name__ == '__main__':
    main()