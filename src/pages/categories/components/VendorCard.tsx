
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

  const mockTags = ['Professional', 'Experienced', 'Affordable', 'Quick Service', 'Premium Quality'];
  const vendorTags = mockTags.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 tags

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
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
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-800 transition-colors mb-3">
            {vendor.name}
          </h3>
          
          {/* Rating and Reviews in one line */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{vendor.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{vendor.reviews} reviews</span>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span>{vendor.location}</span>
          </div>
          
          {/* Tags - Consistent layout like second card */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 min-h-[3.5rem]">
              {vendorTags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Price and Button - pushed to bottom */}
          <div className="mt-auto">
            <p className="text-green-700 font-bold text-lg mb-4">{vendor.price}</p>
            
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/vendor/${vendor.id}`);
              }}
              className="w-full bg-primary-700 hover:bg-primary-800"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
