
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, MapPin, Users, MessageCircle, Calendar, Phone, Mail } from 'lucide-react';
import BookingButton from '@/components/booking/BookingButton';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock vendor data - in a real app, this would come from the database
  const mockVendors = {
    "1": {
      id: "1",
      businessName: "Royal Photography Studio",
      categories: ["Photography", "Videography"],
      location: "Mumbai, Maharashtra",
      rating: 4.8,
      reviewCount: 125,
      featured: true,
      whatsappNumber: "+91-9876543210",
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
      travelRange: "Within 50km of Mumbai",
      flexibility: ["Customizable packages", "Flexible timing", "Advance booking discounts", "Partial refund policy"],
      reviews: [
        { name: "Priya Sharma", rating: 5, comment: "Amazing photography! Captured our special moments perfectly.", date: "2 weeks ago", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face" },
        { name: "Rahul Kumar", rating: 4, comment: "Professional service and great quality photos.", date: "1 month ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" },
        { name: "Anita Patel", rating: 5, comment: "Highly recommended! Great team and excellent work.", date: "2 months ago", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" }
      ]
    }
  };

  useEffect(() => {
    if (id) {
      // In a real app, fetch vendor data from database
      const vendorData = mockVendors[id as keyof typeof mockVendors];
      if (vendorData) {
        setVendor(vendorData);
        trackVendorVisit();
      }
    }
    setLoading(false);
  }, [id]);

  const trackVendorVisit = async () => {
    // Demo mode - visit tracking will be implemented when database is configured
    console.log('Demo: Vendor visit tracked for vendor', id);
  };

  const handleChatNow = async () => {
    toast({
      title: "Demo Mode",
      description: "Chat functionality will be available when database is configured.",
    });
    
    // Navigate to chat page with vendor pre-loaded
    navigate(`/chat?vendor=${id}&message=${encodeURIComponent("Hi, can I get more information?")}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
            <Button onClick={() => navigate('/categories')}>Back to Categories</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Business Name & Featured Badge */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">{vendor.businessName}</h1>
              {vendor.featured && (
                <Badge className="bg-primary text-white">Featured</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{vendor.rating}</span>
                <span>({vendor.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{vendor.location}</span>
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
                      {vendor.images.map((image: string, index: number) => (
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
                  {vendor.categories.map((category: string) => (
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
                  {vendor.packages.map((pkg: any, index: number) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-4">{pkg.price}</p>
                        <ul className="space-y-2">
                          {pkg.features.map((feature: string, idx: number) => (
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
                        <p className="text-gray-600">{vendor.travelRange}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Flexibility Options</h3>
                        <ul className="space-y-1">
                          {vendor.flexibility.map((option: string, index: number) => (
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
                  {vendor.reviews.map((review: any, index: number) => (
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
                    <Button onClick={handleChatNow} className="w-full" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Chat Now
                    </Button>
                    <BookingButton 
                      vendorId={id || ''}
                      vendorName={vendor.businessName}
                      category={vendor.categories[0]}
                      whatsappNumber={vendor.whatsappNumber}
                    />
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
                      <span>{vendor.whatsappNumber}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>info@royalphotography.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{vendor.location}</span>
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

      <Footer />
    </div>
  );
};

export default ProductPage;
