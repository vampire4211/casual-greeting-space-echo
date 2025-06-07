
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-20 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop)'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 lg:mb-6 leading-tight">
          Ready to Plan Your Perfect Event?
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 lg:mb-10 leading-relaxed px-4 sm:px-0">
          Join thousands of happy customers who found their ideal vendors through Event Sathi. 
          Whether you're planning a wedding, corporate event, or birthday party, we've got you covered.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <Button 
            size="lg" 
            onClick={() => navigate('/categories')}
            className="px-6 sm:px-8 py-4 text-base sm:text-lg"
          >
            Find Vendors
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/signup')}
            className="px-6 sm:px-8 py-4 text-base sm:text-lg bg-pink-600 hover:bg-pink-700"
          >
            Become a Vendor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
