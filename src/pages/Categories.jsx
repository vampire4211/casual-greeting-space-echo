import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FilterSection from './categories/components/FilterSection';
import VendorCard from './categories/components/VendorCard';
import { useSupabaseVendors } from '@/hooks/useSupabaseVendors';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');

  const { vendors, loading, error } = useSupabaseVendors(selectedCategory, selectedLocation);
  const { categories } = useSupabaseCategories();

  // Transform vendors data to match the expected format
  const transformedVendors = vendors.map((vendor) => ({
    id: vendor.id,
    name: vendor.business_name || vendor.vendor_name || 'Unknown Vendor',
    category: vendor.categories?.[0] || 'Unknown',
    location: vendor.address?.split(',')[0] || 'Unknown Location',
    rating: 4.5,
    reviews: Math.floor(Math.random() * 100) + 10,
    price: `₹${Math.floor(Math.random() * 50000) + 10000} - ₹${Math.floor(Math.random() * 100000) + 50000}`,
    image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000) + 1000000000000}?w=400&h=300&fit=crop`,
    featured: Math.random() > 0.7
  }));

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading vendors...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-red-600">Error loading vendors: {error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            {transformedVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;