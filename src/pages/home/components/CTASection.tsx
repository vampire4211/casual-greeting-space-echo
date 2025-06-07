
import React from 'react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section 
      className="py-20 bg-cover bg-center relative"
      style={{
        backgroundImage: 'linear-gradient(rgba(47, 46, 65, 0.8), rgba(47, 46, 65, 0.8)), url("https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop")'
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to Plan Your Perfect Event?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
          Join thousands of happy customers who found their ideal vendors through Event Sathi. 
          Whether you're planning a wedding, corporate event, or birthday party, we've got you covered.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white border-0">
            Find Vendors
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-800">
            Become a Vendor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
