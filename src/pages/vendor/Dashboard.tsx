
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import QuestionnaireModal from '@/components/questionnaire/QuestionnaireModal';
import { BarChart, Users, MessageSquare, Star, Edit, FileText, TrendingUp } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendorProfile, setVendorProfile] = useState({
    business_name: 'Demo Vendor',
    categories: ['Photography', 'Catering'],
    profile_completion: 75
  });
  const [loading, setLoading] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [stats, setStats] = useState({
    visits: 125,
    chats: 34,
    bookings: 18,
    responses: 12
  });

  useEffect(() => {
    if (user) {
      fetchVendorProfile();
      fetchStats();
    }
  }, [user]);

  const fetchVendorProfile = async () => {
    // Demo mode - using static profile data
    setVendorProfile({
      business_name: 'Demo Vendor Business',
      categories: ['Photography', 'Catering'],
      profile_completion: 75
    });
    setLoading(false);
  };

  const fetchStats = async () => {
    // Demo mode - using static data
    setStats({
      visits: 125,
      chats: 34,
      bookings: 18,
      responses: 12
    });
  };

  const handleUpdateProfile = async (formData: FormData) => {
    const updates = {
      business_name: formData.get('business_name') as string,
      categories: (formData.get('categories') as string)?.split(',').map(c => c.trim()) || []
    };

    // Update local state for demo
    setVendorProfile(prev => ({ ...prev, ...updates }));

    toast({
      title: "Demo Mode",
      description: "Profile updates will be saved when database is configured!",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {vendorProfile?.business_name}</p>
          </div>
          <Button onClick={() => setShowQuestionnaire(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Complete Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Visits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.visits}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chat Initiations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.chats}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booking Clicks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Responses</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.responses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="edit" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Reviews</span>
              <span className="sm:hidden">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <BarChart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Messages</span>
              <span className="sm:hidden">Messages</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProfile(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input 
                      id="business_name" 
                      name="business_name"
                      defaultValue={vendorProfile?.business_name || ''} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="categories">Categories (comma-separated)</Label>
                    <Input 
                      id="categories" 
                      name="categories"
                      defaultValue={vendorProfile?.categories?.join(', ') || ''} 
                      placeholder="Photography, Catering, Decoration"
                    />
                  </div>
                  <Button type="submit">Update Profile</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No reviews yet. Complete your profile to start receiving bookings and reviews.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Booking Conversion Rate</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.bookings > 0 ? Math.round((stats.responses / stats.bookings) * 100) : 0}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Profile Completion</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {vendorProfile?.profile_completion || 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages & Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Message history and customer interactions will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showQuestionnaire && (
          <QuestionnaireModal
            isOpen={showQuestionnaire}
            onClose={() => setShowQuestionnaire(false)}
            vendorCategories={vendorProfile?.categories || []}
            onComplete={() => {
              fetchVendorProfile();
              toast({
                title: "Profile Updated",
                description: "Your questionnaire responses have been saved!",
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
