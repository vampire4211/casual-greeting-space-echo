# Event Sathi Django Backend

A Django REST API backend for the Event Sathi application, providing vendor management, authentication, and admin controls.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip or pipenv
- Access to Supabase PostgreSQL database

### 1. Environment Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 2. Automated Setup (Recommended)

```bash
python setup.py
```

This will:
- Create your `.env` file with database credentials
- Install all Python dependencies
- Run database migrations
- Optionally create a Django admin superuser

### 3. Manual Setup (Alternative)

```bash
# Install dependencies
pip install -r requirements.txt

# Create and run migrations
python manage.py makemigrations accounts vendors categories
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 4. Start Development Server

```bash
python start_server.py
# OR
python manage.py runserver 0.0.0.0:8000
```

## 📁 Project Structure

```
backend/
├── event_sathi/          # Django project settings
│   ├── settings.py       # Main configuration
│   ├── urls.py          # URL routing
│   └── wsgi.py          # WSGI application
├── accounts/            # User authentication & profiles
│   ├── models.py        # User, CustomerProfile, VendorProfile
│   ├── views.py         # Auth endpoints
│   └── serializers.py   # Data serialization
├── vendors/             # Vendor management
│   ├── models.py        # Vendor services, packages, images
│   ├── views.py         # Vendor API endpoints
│   └── urls.py          # Vendor routes
├── categories/          # Category management
│   ├── models.py        # Categories and admin images
│   ├── views.py         # Category endpoints
│   └── urls.py          # Category routes
├── setup.py             # Automated setup script
├── start_server.py      # Development server starter
├── requirements.txt     # Python dependencies
└── .env.example         # Environment template
```

## 🔌 API Endpoints

### Authentication (`/api/auth/`)
- `POST /register/` - User registration (customer/vendor)
- `POST /login/` - User login
- `POST /logout/` - User logout
- `GET /profile/` - Get user profile
- `POST /vendor/categories/` - Update vendor categories

### Vendors (`/api/vendors/`)
- `GET /` - List vendors with filtering
- `GET /{vendor_id}/` - Get vendor details
- `GET /dashboard/` - Vendor dashboard data
- `POST /upload-category-image/` - Upload vendor images

### Categories (`/api/categories/`)
- `GET /` - List all categories
- `GET /homepage-images/` - Get homepage images
- `POST /upload-homepage-image/` - Upload homepage images
- `GET /download-image/{image_id}/` - Download image

## 🗄️ Database Configuration

The backend connects directly to your Supabase PostgreSQL database:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres.mwjrrhluqiuchczgzzld',
        'PASSWORD': env('SUPABASE_DB_PASSWORD'),
        'HOST': 'aws-0-ap-south-1.pooler.supabase.com',
        'PORT': '6543',
        'OPTIONS': {'sslmode': 'require'},
    }
}
```

## 🔐 Authentication System

- **Custom User Model**: Extends Django's `AbstractUser`
- **User Types**: Customer, Vendor, Admin
- **Token Authentication**: REST API uses token-based auth
- **Profile Management**: Separate customer and vendor profiles

## 📞 Frontend Integration

The Django backend serves the React/TypeScript frontend through:

1. **REST API**: All data exchange via JSON endpoints
2. **CORS**: Configured for local development and production
3. **Authentication**: Token-based auth with frontend hooks
4. **Image Handling**: Binary image storage with base64 API responses

### Frontend API Service

The frontend uses `src/services/api.ts` to communicate with Django:

```typescript
// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

// Authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `.env` file has correct `SUPABASE_DB_PASSWORD`
   - Verify Supabase database is running

2. **Migration Errors**
   - Delete migration files and regenerate: `python manage.py makemigrations`

3. **CORS Errors**
   - Add your frontend URL to `CORS_ALLOWED_ORIGINS` in `settings.py`

4. **Import Errors**
   - Make sure all apps are listed in `INSTALLED_APPS`