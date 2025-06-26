
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users } from 'lucide-react';
import BookingButton from '@/components/booking/BookingButton';

interface VendorCardProps {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  whatsappNumber?: string;
}

const VendorCard = ({ 
  id, 
  name, 
  category, 
  location, 
  rating, 
  reviews, 
  image, 
  description,
  whatsappNumber 
}: VendorCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {rating}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {reviews} reviews
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <BookingButton 
          vendorId={id}
          vendorName={name}
          category={category}
          whatsappNumber={whatsappNumber}
        />
      </CardContent>
    </Card>
  );
};

export default VendorCard;
