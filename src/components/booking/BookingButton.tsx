import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, RefreshCw, Clock } from 'lucide-react';

interface BookingButtonProps {
  vendorId: string;
  vendorName: string;
  category: string;
  whatsappNumber?: string;
}

const BookingButton = ({ vendorId, vendorName, category, whatsappNumber }: BookingButtonProps) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const { toast } = useToast();

  const handleBookNowClick = () => {
    setShowWhatsAppModal(true);
    
    toast({
      title: "Demo Mode",
      description: "Booking functionality will be available when database is set up.",
    });
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
              <p className="text-blue-700 text-xs mt-1">
                Full booking tracking will be available when database is configured.
              </p>
            </div>
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
};

export default BookingButton;