import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';

interface VendorHeaderProps {
  businessName: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  location: string;
}

const VendorHeader = ({ businessName, featured, rating, reviewCount, location }: VendorHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-4xl font-bold text-gray-900">{businessName}</h1>
        {featured && (
          <Badge className="bg-primary text-white">Featured</Badge>
        )}
      </div>
      <div className="flex items-center gap-4 text-gray-600">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
          <span>({reviewCount} reviews)</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-5 w-5" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;