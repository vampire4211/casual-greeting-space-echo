
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm ${
      scrolled ? 'py-3 shadow-md' : 'py-5'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Calendar className="h-7 w-7" />
          Event Sathi
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
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
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/signin')}
            className="hidden sm:inline-flex"
          >
            Sign In
          </Button>
          <Button onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
