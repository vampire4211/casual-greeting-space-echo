import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Package {
  name: string;
  price: string;
  features: string[];
}

interface VendorPackagesProps {
  packages: Package[];
}

const VendorPackages = ({ packages }: VendorPackagesProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Packages & Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {packages.map((pkg, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
              <p className="text-2xl font-bold text-primary mb-4">{pkg.price}</p>
              <ul className="space-y-2">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorPackages;