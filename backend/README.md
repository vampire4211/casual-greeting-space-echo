# Django Backend for Event Sathi

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```
   SUPABASE_DB_PASSWORD=your_supabase_database_password
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   ```

3. **Database Migration**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

## API Endpoints

### Vendors
- `GET /api/vendors/` - List all vendors with filtering
- `GET /api/vendors/category/{category_name}/` - Vendors by category
- `GET /api/vendors/{vendor_id}/` - Vendor details
- `GET /api/vendors/images/` - Vendor images

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{category_id}/` - Category details

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - User profile

## Database Connection

This Django backend connects to your Supabase PostgreSQL database directly, using Supabase only for database storage while handling all business logic, authentication, and API endpoints through Django.