import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VendorSidebarProps {
  vendorId: string;
  phone: string;
  email: string;
  location: string;
  onBookingClick: () => void;
}

const VendorSidebar = ({ vendorId, phone, email, location, onBookingClick }: VendorSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
           <div className="space-y-4">
             <Button 
               className="w-full" 
               size="lg"
               onClick={() => navigate(`/chat?vendor=${vendorId}`)}
             >
               <MessageCircle className="h-5 w-5 mr-2" />
               Chat Now
             </Button>
             <Button 
               variant="outline" 
               className="w-full" 
               size="lg"
               onClick={onBookingClick}
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
               <span>{phone}</span>
             </div>
             <div className="flex items-center gap-3">
               <Mail className="h-5 w-5 text-primary" />
               <span>{email}</span>
             </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{location}</span>
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
  );
};

export default VendorSidebar;