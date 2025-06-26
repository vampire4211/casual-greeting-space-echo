
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FilterSection from './categories/components/FilterSection';
import VendorCard from './categories/components/VendorCard';

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');

  const vendors = [
    {
      id: "1",
      name: "Royal Photography Studio",
      category: "Photography",
      location: "Mumbai",
      rating: 4.8,
      reviews: 125,
      price: "₹25,000 - ₹50,000",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop",
      description: "Professional wedding and event photography with creative storytelling approach.",
      featured: true,
      whatsappNumber: "+91-9876543210"
    },
    {
      id: "2",
      name: "Delicious Catering Co.",
      category: "Catering",
      location: "Delhi",
      rating: 4.6,
      reviews: 89,
      price: "₹500 - ₹1,200 per plate",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      description: "Exquisite catering services offering diverse cuisines for all types of events.",
      featured: false,
      whatsappNumber: "+91-9876543211"
    },
    {
      id: "3",
      name: "Grand Palace Venues",
      category: "Venue",
      location: "Bangalore",
      rating: 4.9,
      reviews: 67,
      price: "₹1,00,000 - ₹3,00,000",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
      description: "Luxurious event venues with elegant décor and world-class amenities.",
      featured: true,
      whatsappNumber: "+91-9876543212"
    },
    {
      id: "4",
      name: "Elegant Decor Solutions",
      category: "Decor",
      location: "Chennai",
      rating: 4.7,
      reviews: 93,
      price: "₹15,000 - ₹75,000",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
      description: "Creative decoration services transforming venues into magical spaces.",
      featured: false,
      whatsappNumber: "+91-9876543213"
    },
    {
      id: "5",
      name: "Melody Music Band",
      category: "Music",
      location: "Pune",
      rating: 4.5,
      reviews: 45,
      price: "₹20,000 - ₹80,000",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      description: "Live music performances and DJ services for unforgettable celebrations.",
      featured: false,
      whatsappNumber: "+91-9876543214"
    },
    {
      id: "6",
      name: "Glamour Makeup Studio",
      category: "Makeup",
      location: "Hyderabad",
      rating: 4.8,
      reviews: 112,
      price: "₹8,000 - ₹25,000",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
      description: "Professional makeup and styling services for brides and special occasions.",
      featured: true,
      whatsappNumber: "+91-9876543215"
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    return (selectedCategory === '' || selectedCategory === 'All' || vendor.category === selectedCategory) &&
           (selectedLocation === '' || selectedLocation === 'All' || vendor.location === selectedLocation);
  });

  const handleVendorClick = (vendorId: string) => {
    navigate(`/vendors/${vendorId}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Vendors</h1>
            <p className="text-xl text-gray-600">Browse through our curated list of top-rated event professionals</p>
          </div>

          <FilterSection
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            rating={rating}
            setRating={setRating}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div 
                key={vendor.id}
                onClick={() => handleVendorClick(vendor.id)}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <VendorCard 
                  id={vendor.id}
                  name={vendor.name}
                  category={vendor.category}
                  location={vendor.location}
                  rating={vendor.rating}
                  reviews={vendor.reviews}
                  image={vendor.image}
                  description={vendor.description}
                  whatsappNumber={vendor.whatsappNumber}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
