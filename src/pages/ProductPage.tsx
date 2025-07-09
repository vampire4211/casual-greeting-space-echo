
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Vendor } from '@/hooks/useVendors';
import VendorHeader from './vendor/components/VendorHeader';
import VendorImageCarousel from './vendor/components/VendorImageCarousel';
import VendorServices from './vendor/components/VendorServices';
import VendorPackages from './vendor/components/VendorPackages';
import VendorServiceInfo from './vendor/components/VendorServiceInfo';
import VendorReviews from './vendor/components/VendorReviews';
import VendorSidebar from './vendor/components/VendorSidebar';
import BookingDialog from './vendor/components/BookingDialog';

const ProductPage = () => {
  const { id } = useParams();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`http://localhost:8000/api/vendors/${id}/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setVendor(data.vendor);
      } catch (err) {
        console.error('Error fetching vendor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading vendor details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-red-600">Vendor not found</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Transform vendor data for display
  const transformedVendor = {
    id: vendor.id,
    businessName: vendor.business_name || vendor.vendor_name || 'Unknown Vendor',
    categories: vendor.categories || [],
    location: vendor.address || 'Location not specified',
    rating: vendor.rating || 4.5,
    reviewCount: vendor.total_reviews || 50,
    featured: true,
    phone: vendor.phone_number || '+91-XXXXXXXXXX',
    email: vendor.email,
    images: [
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop",
    ],
    packages: [
      { name: "Basic Package", price: "₹25,000", features: ["4 hours coverage", "100 edited photos", "Digital gallery"] },
      { name: "Premium Package", price: "₹45,000", features: ["8 hours coverage", "300 edited photos", "Album included", "Drone shots"] },
      { name: "Deluxe Package", price: "₹65,000", features: ["Full day coverage", "500+ edited photos", "Premium album", "Video highlights"] }
    ],
    travelRange: "Within 50km of location",
    flexibility: ["Customizable packages", "Flexible timing", "Advance booking discounts", "Partial refund policy"],
    reviews: [
      { name: "Priya Sharma", rating: 5, comment: "Amazing service! Highly professional and delivered exactly what was promised.", date: "2 weeks ago", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face" },
      { name: "Rahul Kumar", rating: 4, comment: "Professional service and great quality work. Recommended!", date: "1 month ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" },
      { name: "Anita Patel", rating: 5, comment: "Excellent experience! Great team and outstanding results.", date: "2 months ago", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" }
    ]
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <VendorHeader
            businessName={transformedVendor.businessName}
            featured={transformedVendor.featured}
            rating={transformedVendor.rating}
            reviewCount={transformedVendor.reviewCount}
            location={transformedVendor.location}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <VendorImageCarousel 
                vendorId={vendor.id.toString()} 
                fallbackImages={transformedVendor.images} 
              />
              <VendorServices categories={transformedVendor.categories} />
              <VendorPackages packages={transformedVendor.packages} />
              <VendorServiceInfo 
                travelRange={transformedVendor.travelRange}
                flexibility={transformedVendor.flexibility}
              />
              <VendorReviews reviews={transformedVendor.reviews} />
            </div>

            <VendorSidebar
              vendorId={vendor.id.toString()}
              phone={transformedVendor.phone}
              email={transformedVendor.email}
              location={transformedVendor.location}
              onBookingClick={() => setShowBookingDialog(true)}
            />
          </div>
        </div>
      </div>

      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        businessName={transformedVendor.businessName}
        phone={transformedVendor.phone}
      />

      <Footer />
    </div>
  );
};

export default ProductPage;
