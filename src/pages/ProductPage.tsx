
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, MapPin, Users, MessageCircle, Calendar, Phone, Mail, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { VendorWithDetails } from '@/hooks/useVendors';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [vendor, setVendor] = useState<VendorWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      if (!id) return;
      
      try {
        // Get vendor data with details
        const { data, error } = await supabase
          .from('vendor_details')
          .select(`
            *,
            vendors!inner (
              id,
              vendor_name,
              business_name,
              email,
              phone_number,
              address,
              categories,
              created_at
            )
          `)
          .limit(1)
          .single();

        if (error) throw error;
        
        // Transform to match expected format
        const transformedVendor = {
          id: data.vendors.id,
          vendor_name: data.vendors.vendor_name,
          business_name: data.vendors.business_name,
          email: data.vendors.email,
          phone_number: data.vendors.phone_number,
          address: data.vendors.address,
          categories: data.vendors.categories,
          created_at: data.vendors.created_at,
          user_id: null,
          age: null,
          gender: null,
          aadhar: null,
          pan: null,
          gst: null,
          vendor_details: [data]
        };
        
        setVendor(transformedVendor);
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
    rating: vendor.vendor_details?.[0]?.overall_gr || 4.5,
    reviewCount: vendor.vendor_details?.[0]?.no_of_images || 50,
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
          {/* Business Name & Featured Badge */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">{transformedVendor.businessName}</h1>
              {transformedVendor.featured && (
                <Badge className="bg-primary text-white">Featured</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{transformedVendor.rating}</span>
                <span>({transformedVendor.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{transformedVendor.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Image Carousel */}
              <Card>
                <CardContent className="p-0">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {transformedVendor.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-video">
                            <img 
                              src={image} 
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </CardContent>
              </Card>

              {/* Category Tags */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {transformedVendor.categories.map(category => (
                    <Badge
                      key={category} 
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                      onClick={() => navigate(`/categories?category=${category.toLowerCase()}`)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Packages */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Packages & Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {transformedVendor.packages.map((pkg, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-4">{pkg.price}</p>
                        <ul className="space-y-2">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Service Information</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Travel Range</h3>
                        <p className="text-gray-600">{transformedVendor.travelRange}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Flexibility Options</h3>
                        <ul className="space-y-1">
                          {transformedVendor.flexibility.map((option, index) => (
                            <li key={index} className="text-gray-600 text-sm">• {option}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
                <div className="space-y-4">
                  {transformedVendor.reviews.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img 
                            src={review.avatar}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.name}</h4>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6">
                   <div className="space-y-4">
                     <Button 
                       className="w-full" 
                       size="lg"
                       onClick={() => navigate(`/chat?vendor=${vendor.id}`)}
                     >
                       <MessageCircle className="h-5 w-5 mr-2" />
                       Chat Now
                     </Button>
                     <Button 
                       variant="outline" 
                       className="w-full" 
                       size="lg"
                       onClick={() => setShowBookingDialog(true)}
                     >
                       <Calendar className="h-5 w-5 mr-2" />
                       Book Now
                     </Button>
                   </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                       <Phone className="h-5 w-5 text-primary" />
                       <span>{transformedVendor.phone}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <Mail className="h-5 w-5 text-primary" />
                       <span>{transformedVendor.email}</span>
                     </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{transformedVendor.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">5+ Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects</span>
                      <span className="font-medium">200+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium">2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Connect with {transformedVendor.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Contact Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-medium">{transformedVendor.phone}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(transformedVendor.phone)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open(`https://wa.me/${transformedVendor.phone.replace(/[^0-9]/g, '')}`, '_blank')}
              >
                Chat on WhatsApp
              </Button>
            </div>

            {/* Confirmation Question */}
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Have you confirmed the deal with {transformedVendor.businessName}?
              </p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="confirmation"
                    value="yes"
                    checked={selectedOption === 'yes'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="text-primary"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="confirmation"
                    value="no"
                    checked={selectedOption === 'no'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="text-primary"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => {
                console.log('Confirmation:', selectedOption);
                setShowBookingDialog(false);
                setSelectedOption('');
              }}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductPage;
