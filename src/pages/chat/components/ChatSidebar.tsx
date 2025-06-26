
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Vendor {
  id: string;
  name: string;
  avatar: string;
  category: string;
  online: boolean;
}

interface ChatSidebarProps {
  selectedVendor: string | null;
  onVendorSelect: (vendorId: string) => void;
}

const ChatSidebar = ({ selectedVendor, onVendorSelect }: ChatSidebarProps) => {
  // Mock vendors for now - in real app this would come from props or API
  const vendors: Vendor[] = [
    {
      id: "1",
      name: "Royal Photography Studio",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      category: "Photography",
      online: true
    },
    {
      id: "2", 
      name: "Delicious Catering Co.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      category: "Catering",
      online: false
    },
    {
      id: "3",
      name: "Grand Palace Venues",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", 
      category: "Venue",
      online: true
    }
  ];

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Messages</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            onClick={() => onVendorSelect(vendor.id)}
            className={`p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors ${
              selectedVendor === vendor.id ? 'bg-accent' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={vendor.avatar} 
                  alt={vendor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {vendor.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground truncate">{vendor.name}</h3>
                  <span className="text-xs text-muted-foreground">{vendor.category}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Click to start chatting</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
