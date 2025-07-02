import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Upload, MessageCircle, TrendingUp, CreditCard, Menu, X, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import QuestionnaireModal from '@/components/questionnaire/QuestionnaireModal';
import { useToast } from '@/hooks/use-toast';

const VendorDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [profileCompletion, setProfileCompletion] = useState(75);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchVendorProfile();
    }
  }, [user]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchVendorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setVendorProfile(data);
      setProfileCompletion(data.profile_completion || 75);
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
    }
  };

  const handleQuestionnaireComplete = () => {
    toast({
      title: "Questionnaire Completed",
      description: "Your profile has been updated with your responses.",
    });
    fetchVendorProfile();
  };

  const vendorData = {
    name: vendorProfile?.business_name || "Royal Photography Studio",
    categories: vendorProfile?.categories || ["Photography", "Videography"],
    rating: 4.8,
    priceRange: "₹25,000 - ₹50,000",
    experience: "5 years",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-20 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className={`shadow-xl transition-all duration-300 ${
          sidebarCollapsed ? 'w-full md:w-16' : 'w-full md:w-80'
        } relative md:sticky md:top-20 md:h-[calc(100vh-5rem)] overflow-y-auto`} style={{ backgroundColor: '#F0EADF' }}>
          <div className="p-4 md:p-6 border-b">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 md:block"
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </button>
            
            {!sidebarCollapsed && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={vendorData.profileImage}
                    alt="Profile"
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{vendorData.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{vendorData.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {vendorData.categories.map(cat => (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Price:</strong> {vendorData.priceRange}</p>
                    <p><strong>Experience:</strong> {vendorData.experience}</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span>{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600">Manage your business profile and track performance</p>
          </div>

          <Tabs defaultValue="edits" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1">
              <TabsTrigger value="edits" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Upload className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Edits</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <Star className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Subscription</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edits">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Your Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="h-6 w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs md:text-sm text-gray-500">Upload Image</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Questionnaire Section */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900 mb-2">Complete Your Profile</h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Answer 20 carefully selected questions to help customers understand your services better. 
                            This includes 10 essential questions and category-specific questions based on your expertise.
                          </p>
                          <Button 
                            onClick={() => setShowQuestionnaire(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            Take Random 20 Questions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Minimum: 3 images per category</li>
                      <li>• Maximum: 6 images per category</li>
                      <li>• Total size limit: 40MB</li>
                      <li>• Supported formats: JPG, PNG</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Priya Sharma", rating: 5, comment: "Excellent service! Highly recommended.", date: "2 days ago" },
                      { name: "Rahul Kumar", rating: 4, comment: "Good quality work, professional team.", date: "1 week ago" },
                      { name: "Anita Patel", rating: 5, comment: "Amazing photography skills!", date: "2 weeks ago" }
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                          <div>
                            <h4 className="font-medium">{review.name}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chat Feature Coming Soon</h3>
                    <p className="text-gray-600">Connect with potential customers in real-time</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Profile Views</p>
                        <p className="text-xl md:text-2xl font-bold">1,234</p>
                      </div>
                      <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Inquiries</p>
                        <p className="text-xl md:text-2xl font-bold">56</p>
                      </div>
                      <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Bookings</p>
                        <p className="text-xl md:text-2xl font-bold">23</p>
                      </div>
                      <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-xl md:text-2xl font-bold">4.8</p>
                      </div>
                      <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 md:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Charts and analytics will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-center">Basic</CardTitle>
                    <div className="text-center">
                      <span className="text-2xl md:text-3xl font-bold">₹5,500</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li>✓ Profile listing</li>
                      <li>✓ Reviews & ratings</li>
                      <li>✓ Basic analytics</li>
                      <li>✗ Boosted visibility</li>
                      <li>✗ Featured badge</li>
                    </ul>
                    <Button variant="outline" className="w-full mt-6">
                      Current Plan
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="text-center">Premium</CardTitle>
                    <div className="text-center">
                      <span className="text-2xl md:text-3xl font-bold">₹7,000</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li>✓ Everything in Basic</li>
                      <li>✓ Boosted visibility</li>
                      <li>✓ Priority support</li>
                      <li>✓ Advanced analytics</li>
                      <li>✗ Featured badge</li>
                    </ul>
                    <Button className="w-full mt-6">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-yellow-400">
                  <CardHeader>
                    <CardTitle className="text-center">Extreme</CardTitle>
                    <div className="text-center">
                      <span className="text-2xl md:text-3xl font-bold">₹8,500</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li>✓ Everything in Premium</li>
                      <li>✓ Homepage highlight</li>
                      <li>✓ Featured badge</li>
                      <li>✓ Premium placement</li>
                      <li>✓ Dedicated support</li>
                    </ul>
                    <Button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <QuestionnaireModal
        isOpen={showQuestionnaire}
        onClose={() => setShowQuestionnaire(false)}
        vendorCategories={vendorData.categories}
        onComplete={handleQuestionnaireComplete}
      />
    </div>
  );
};

export default VendorDashboard;
