import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is a vendor (mock logic - would be from auth context)
  const isVendor = location.pathname.includes('/vendor') || localStorage.getItem('userType') === 'vendor';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm ${
      scrolled ? 'py-2 lg:py-3 shadow-xl' : 'py-4 lg:py-5'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/1b617e92-9eed-43c3-930b-89645adc6360.png" 
            alt="Event Sathi Logo" 
            className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-contain filter brightness-75 contrast-125"
          />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="font-medium text-gray-700 hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/categories" className="font-medium text-gray-700 hover:text-primary transition-colors">
            Categories
          </Link>
          <Link to="/events" className="font-medium text-gray-700 hover:text-primary transition-colors">
            Events
          </Link>
          <Link to="/about" className="font-medium text-gray-700 hover:text-primary transition-colors">
            About Us
          </Link>
          {isVendor && (
            <Link to="/vendor/dashboard" className="font-medium text-gray-700 hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/signin')}
          >
            Sign In
          </Button>
          <Button onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/" 
                className="block py-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                className="block py-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/events" 
                className="block py-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/about" 
                className="block py-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              {isVendor && (
                <Link 
                  to="/vendor/dashboard" 
                  className="block py-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate('/signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-base"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 text-base"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
