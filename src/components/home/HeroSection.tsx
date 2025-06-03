
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!category || !location) {
      alert('Please select both category and location');
      return;
    }
    navigate(`/categories?category=${category}&location=${location}`);
  };

  const categories = [
    'Photographer', 'Catering', 'Venue', 'Decor', 'Music', 
    'Makeup Artist', 'Wedding Planner', 'DJ', 'Florist', 'Transportation'
  ];

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your Perfect <span className="text-primary">Planning Partner</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Discover and connect with India's top event vendors for weddings, corporate events, and celebrations. We make event planning effortless.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
              <input 
                type="text"
                placeholder="Location (City/District)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-6 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              <Button onClick={handleSearch} size="lg" className="px-8 py-4 text-lg">
                Search
              </Button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
                  <p className="text-gray-600">Happy Clients</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">4.9/5</h3>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                  <p className="text-gray-600">Cities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop"
                alt="Event Planning"
                className="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
