import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface VendorServicesProps {
  categories: string[];
}

const VendorServices = ({ categories }: VendorServicesProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Services</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Badge
            key={category} 
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
            onClick={() => navigate(`/categories?category=${category.toLowerCase()}`)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default VendorServices;