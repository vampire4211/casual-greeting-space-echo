import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Users, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');

  const vendors = [
    {
      id: 1,
      name: "Royal Photography Studio",
      category: "Photography",
      location: "Mumbai",
      rating: 4.8,
      reviews: 125,
      price: "₹25,000 - ₹50,000",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 2,
      name: "Delicious Catering Co.",
      category: "Catering",
      location: "Delhi",
      rating: 4.6,
      reviews: 89,
      price: "₹500 - ₹1,200 per plate",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 3,
      name: "Grand Palace Venues",
      category: "Venue",
      location: "Bangalore",
      rating: 4.9,
      reviews: 67,
      price: "₹1,00,000 - ₹3,00,000",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 4,
      name: "Elegant Decor Solutions",
      category: "Decor",
      location: "Chennai",
      rating: 4.7,
      reviews: 93,
      price: "₹15,000 - ₹75,000",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 5,
      name: "Melody Music Band",
      category: "Music",
      location: "Pune",
      rating: 4.5,
      reviews: 45,
      price: "₹20,000 - ₹80,000",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 6,
      name: "Glamour Makeup Studio",
      category: "Makeup",
      location: "Hyderabad",
      rating: 4.8,
      reviews: 112,
      price: "₹8,000 - ₹25,000",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
      featured: true
    }
  ];

  const categories = ['All', 'Photography', 'Catering', 'Venue', 'Decor', 'Music', 'Makeup'];
  const locations = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'];

  const filteredVendors = vendors.filter(vendor => {
    return (selectedCategory === '' || selectedCategory === 'All' || vendor.category === selectedCategory) &&
           (selectedLocation === '' || selectedLocation === 'All' || vendor.location === selectedLocation);
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ backgroundColor: '#F5F5F5' }} >Find Your Perfect Vendors</h1>
            <p className="text-xl text-gray-600">Browse through our curated list of top-rated event professionals</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Location</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Price Range</option>
                <option value="budget">Budget (Under ₹25K)</option>
                <option value="medium">Medium (₹25K - ₹75K)</option>
                <option value="premium">Premium (Above ₹75K)</option>
              </select>

              <select 
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* Vendor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white"
                onClick={() => navigate(`/vendor/${vendor.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {vendor.featured && (
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-800 transition-colors">
                        {vendor.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{vendor.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="bg-primary-700 text-white px-2 py-1 rounded text-xs font-medium">
                        {vendor.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {vendor.location}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                      <Users className="h-4 w-4" />
                      <span>{vendor.reviews} reviews</span>
                    </div>
                    
                    <p className="text-green-700 font-bold text-lg mb-4">{vendor.price}</p>
                    
                    <Button className="w-full bg-primary-700 hover:bg-primary-800">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
