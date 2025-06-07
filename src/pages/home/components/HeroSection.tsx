
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 px-4 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Perfect <span className="text-primary-800">Planning Partner</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Discover and connect with India's top event vendors for weddings, corporate events, and celebrations. We make event planning effortless.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mb-8">
              <select className="flex-1 px-4 py-3 rounded-lg border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select Category</option>
                <option value="photography">Photography</option>
                <option value="catering">Catering</option>
                <option value="venue">Venue</option>
                <option value="decor">Decor</option>
                <option value="music">Music</option>
              </select>
              <input 
                type="text" 
                placeholder="Location (City/District)" 
                className="flex-1 px-4 py-3 rounded-lg border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button size="lg" className="bg-primary-700 hover:bg-primary-800">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-800">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-800">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-800">50+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg">
            <img 
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop" 
              alt="Event Planning" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
