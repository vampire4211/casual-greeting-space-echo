import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Copy } from 'lucide-react';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessName: string;
  phone: string;
}

const BookingDialog = ({ open, onOpenChange, businessName, phone }: BookingDialogProps) => {
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Connect with {businessName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Contact Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-medium">{phone}</span>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigator.clipboard.writeText(phone)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank')}
            >
              Chat on WhatsApp
            </Button>
          </div>

          {/* Confirmation Question */}
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Have you confirmed the deal with {businessName}?
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
              onOpenChange(false);
              setSelectedOption('');
            }}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;