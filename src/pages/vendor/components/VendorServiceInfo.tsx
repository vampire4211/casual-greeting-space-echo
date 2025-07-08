import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface VendorServiceInfoProps {
  travelRange: string;
  flexibility: string[];
}

const VendorServiceInfo = ({ travelRange, flexibility }: VendorServiceInfoProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Service Information</h2>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Travel Range</h3>
              <p className="text-gray-600">{travelRange}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Flexibility Options</h3>
              <ul className="space-y-1">
                {flexibility.map((option, index) => (
                  <li key={index} className="text-gray-600 text-sm">• {option}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorServiceInfo;