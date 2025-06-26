
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, RefreshCw } from 'lucide-react';

interface BookingButtonProps {
  vendorId: string;
  vendorName: string;
  category: string;
  whatsappNumber?: string;
}

const BookingButton = ({ vendorId, vendorName, category, whatsappNumber }: BookingButtonProps) => {
  const [bookingState, setBookingState] = useState<'available' | 'clicked' | 'expired'>('available');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [response, setResponse] = useState<'yes' | 'no' | ''>('');
  const [daysLeft, setDaysLeft] = useState<number>(10);
  const { toast } = useToast();

  useEffect(() => {
    checkBookingStatus();
  }, [vendorId]);

  const checkBookingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customerProfile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!customerProfile) return;

      const { data: booking } = await supabase
        .from('booking_interactions')
        .select('*')
        .eq('customer_id', customerProfile.id)
        .eq('vendor_id', vendorId)
        .single();

      if (booking) {
        const expiresAt = new Date(booking.expires_at);
        const now = new Date();
        const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays > 0 && booking.is_active) {
          setBookingState('clicked');
          setDaysLeft(diffDays);
        } else {
          setBookingState('expired');
        }
      }
    } catch (error) {
      console.error('Error checking booking status:', error);
    }
  };

  const handleBookNowClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to book services.",
          variant: "destructive",
        });
        return;
      }

      const { data: customerProfile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!customerProfile) {
        toast({
          title: "Profile not found",
          description: "Please complete your profile first.",
          variant: "destructive",
        });
        return;
      }

      // Record the booking interaction
      const { error } = await supabase
        .from('booking_interactions')
        .upsert({
          customer_id: customerProfile.id,
          vendor_id: vendorId,
          category: category,
          whatsapp_number: whatsappNumber || '',
          is_active: true
        });

      if (error) throw error;

      // Track vendor visit
      await supabase
        .from('vendor_visits')
        .upsert({
          customer_id: customerProfile.id,
          vendor_id: vendorId,
          page_type: 'booking'
        });

      setBookingState('clicked');
      setDaysLeft(10);
      setShowWhatsAppModal(true);
    } catch (error) {
      console.error('Error recording booking:', error);
      toast({
        title: "Error",
        description: "Failed to process booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateResponse = async () => {
    if (!response) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customerProfile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!customerProfile) return;

      const { error } = await supabase
        .from('booking_interactions')
        .update({
          customer_response: response,
          responded_at: new Date().toISOString(),
          is_active: false
        })
        .eq('customer_id', customerProfile.id)
        .eq('vendor_id', vendorId);

      if (error) throw error;

      toast({
        title: "Response recorded",
        description: "Thank you for your feedback!",
      });

      setShowUpdateModal(false);
      setBookingState('expired');
    } catch (error) {
      console.error('Error updating response:', error);
      toast({
        title: "Error",
        description: "Failed to record response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openWhatsApp = () => {
    const message = `Hi ${vendorName}, I'm interested in your ${category} services. Could you please share more details?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = whatsappNumber 
      ? `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setShowWhatsAppModal(false);
  };

  if (bookingState === 'available') {
    return (
      <>
        <Button onClick={handleBookNowClick} className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Book Now
        </Button>

        <Dialog open={showWhatsAppModal} onOpenChange={setShowWhatsAppModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contact {vendorName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click the button below to contact {vendorName} via WhatsApp for {category} services.
              </p>
              <Button onClick={openWhatsApp} className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Open WhatsApp
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (bookingState === 'clicked') {
    return (
      <div className="space-y-2">
        <Button disabled className="w-full bg-gray-400">
          <MessageCircle className="w-4 h-4 mr-2" />
          Booking Clicked
        </Button>
        <Button 
          onClick={() => setShowUpdateModal(true)} 
          variant="outline" 
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Update ({daysLeft} days left)
        </Button>

        <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Booking Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Did you make a deal with {vendorName} for {category}?
              </p>
              <RadioGroup value={response} onValueChange={(value: 'yes' | 'no') => setResponse(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
              <Button 
                onClick={handleUpdateResponse} 
                disabled={!response}
                className="w-full"
              >
                Submit Response
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Button onClick={handleBookNowClick} className="w-full">
      <MessageCircle className="w-4 h-4 mr-2" />
      Book Now
    </Button>
  );
};

export default BookingButton;
