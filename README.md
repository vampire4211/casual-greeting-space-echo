# Event Sathi - Event Management Platform

A full-stack event management platform connecting customers with vendors for seamless event planning and execution.

## 🌟 Features

- **Vendor Discovery**: Browse and filter vendors by category and location
- **Real-time Chat**: Direct communication between customers and vendors
- **Image Management**: Upload and manage vendor portfolios and admin content
- **Authentication**: Secure login for customers, vendors, and admins
- **Dashboard**: Comprehensive vendor dashboard for business management
- **Responsive Design**: Modern UI that works on all devices

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Query** for data fetching
- **React Hook Form** for form management

### Backend
- **Django 4.2** with Django REST Framework
- **PostgreSQL** (via Supabase)
- **Token Authentication**
- **CORS enabled** for frontend integration

### Infrastructure
- **Supabase** for database and real-time features
- **Lovable** for development and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+
- Supabase account

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Run automated setup
python setup.py

# Or manual setup:
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The backend API will be available at `http://localhost:8000`

## 📁 Project Structure

```
event-sathi/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── auth/                # Authentication components
│   │   ├── home/                # Homepage components
│   │   ├── layout/              # Layout components (Navbar, Footer)
│   │   └── ui/                  # Shadcn UI components
│   ├── pages/                   # Page components
│   │   ├── auth/                # Authentication pages
│   │   ├── admin/               # Admin dashboard
│   │   ├── vendor/              # Vendor pages
│   │   └── home/                # Homepage
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services and utilities
│   └── integrations/            # Supabase integration
├── backend/                     # Django backend
│   ├── event_sathi/            # Django project settings
│   ├── accounts/               # User authentication & profiles
│   ├── vendors/                # Vendor management
│   ├── categories/             # Category management
│   └── requirements.txt        # Python dependencies
├── supabase/                   # Supabase configuration
│   ├── migrations/             # Database migrations
│   └── functions/              # Edge functions
└── public/                     # Static assets
```

## 🔗 API Integration

The frontend and backend are integrated through:

### REST API Endpoints
- **Authentication**: `/api/auth/`
- **Vendors**: `/api/vendors/`
- **Categories**: `/api/categories/`

### Frontend Services
- `src/services/api.ts` - Axios configuration
- `src/hooks/useAuth.tsx` - Authentication hook
- `src/hooks/useVendors.tsx` - Vendor data management
- `src/hooks/useCategories.tsx` - Category management

## 🚢 Deployment

### Lovable Deployment
1. Connect your GitHub repository
2. Push changes to trigger automatic deployment
3. Configure environment variables in Lovable dashboard

### Manual Deployment

#### Frontend
```bash
npm run build
# Deploy dist/ folder to your static hosting service
```

#### Backend
```bash
# Set environment variables
export DEBUG=False
export SECRET_KEY=your-production-secret-key

# Collect static files
python manage.py collectstatic

# Run with gunicorn
gunicorn event_sathi.wsgi:application
```

## 🧪 Development Workflow

### Adding New Features

1. **Backend**: Create Django models, views, and serializers
2. **Database**: Run migrations to update schema
3. **Frontend**: Create React components and hooks
4. **Integration**: Connect frontend to backend APIs
5. **Testing**: Test both frontend and backend functionality

## 📞 Support

For questions or support:
- Create an issue in the GitHub repository
- Check the backend README for API documentation
- Review the component documentation in `src/components/`

---

Built with ❤️ using React, Django, and Supabase
