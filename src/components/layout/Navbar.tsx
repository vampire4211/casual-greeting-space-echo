import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, isVendor } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm ${
      scrolled ? 'py-2 lg:py-3 shadow-xl' : 'py-4 lg:py-5'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center px-1">
          <img 
            src="/lovable-uploads/845ac0b0-e94e-4bd1-a2aa-1d4cdf30190f.png" 
            alt="Event Sathi Logo" 
            className="h-12 w-12 rounded-full object-contain shadow-lg"
          />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-7">
  
  <Link to="/" className="relative font-semibold text-gray-900 hover:text-[#F59E0B] transition-all duration-300 text-[1.05rem] group">
    Home
    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full"></span>
  </Link>

  <Link to="/categories" className="relative font-semibold text-gray-900 hover:text-[#F59E0B] transition-all duration-300 text-[1.05rem] group">
    Categories
    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full"></span>
  </Link>

  <Link to="/events" className="relative font-semibold text-gray-900 hover:text-[#F59E0B] transition-all duration-300 text-[1.05rem] group">
    Events
    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full"></span>
  </Link>

  <Link to="/about" className="relative font-semibold text-gray-900 hover:text-[#F59E0B] transition-all duration-300 text-[1.05rem] group">
    About Us
    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full"></span>
  </Link>

  {isVendor && (
    <Link to="/vendor/dashboard" className="relative font-semibold text-gray-900 hover:text-[#F59E0B] transition-all duration-300 text-[1.05rem] group">
      Dashboard
      <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )}

</div>


        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.first_name || user?.username}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Sign Up
              </Button>
            </>
          )}
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
