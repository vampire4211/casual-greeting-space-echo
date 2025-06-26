
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
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [stats, setStats] = useState({
    visits: 0,
    chats: 0,
    bookings: 0,
    responses: 0
  });

  useEffect(() => {
    if (user) {
      fetchVendorProfile();
      fetchStats();
    }
  }, [user]);

  const fetchVendorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setVendorProfile(data);
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: profile } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!profile) return;

      const [visitsRes, chatsRes, bookingsRes] = await Promise.all([
        supabase.from('vendor_visits').select('id').eq('vendor_id', profile.id),
        supabase.from('chat_initiations').select('id').eq('vendor_id', profile.id),
        supabase.from('booking_interactions').select('*').eq('vendor_id', profile.id)
      ]);

      const bookings = bookingsRes.data || [];
      const responses = bookings.filter(b => b.customer_response !== 'pending').length;

      setStats({
        visits: visitsRes.data?.length || 0,
        chats: chatsRes.data?.length || 0,
        bookings: bookings.length,
        responses
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const updates = {
        business_name: formData.get('business_name') as string,
        categories: (formData.get('categories') as string)?.split(',').map(c => c.trim()) || []
      };

      const { error } = await supabase
        .from('vendor_profiles')
        .update(updates)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      fetchVendorProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 mb-6">
          <TabsTrigger value="edit" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Edit</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
            <BarChart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Messages</span>
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
  );
};

export default VendorDashboard;
