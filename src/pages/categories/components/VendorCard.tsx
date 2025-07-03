
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Vendor {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  image: string;
  featured: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard = ({ vendor }: VendorCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white"
      onClick={() => navigate(`/vendor/${vendor.id}`)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {vendor.featured && (
            <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-800 transition-colors">
              {vendor.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{vendor.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="bg-primary-700 text-white px-2 py-1 rounded text-xs font-medium">
              {vendor.category}
            </span>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {vendor.location}
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <Users className="h-4 w-4" />
            <span>{vendor.reviews} reviews</span>
          </div>
          
          <p className="text-green-700 font-bold text-lg mb-4">{vendor.price}</p>
          
          <Button className="w-full bg-primary-700 hover:bg-primary-800">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
