
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 lg:mb-6 leading-tight">
              Your Perfect <span className="text-primary-800">Planning Partner</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 lg:mb-8 max-w-2xl leading-relaxed">
              Discover and connect with India's top event vendors for weddings, corporate events, and celebrations. We make event planning effortless.
            </p>
            
            <div className="flex flex-col gap-4 max-w-2xl mb-6 lg:mb-8">
              <select className="w-full px-4 py-4 text-base rounded-lg border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
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
                className="w-full px-4 py-4 text-base rounded-lg border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button size="lg" className="bg-primary-700 hover:bg-primary-800 py-4 text-lg">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-lg mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary-800">10K+</div>
                <div className="text-sm lg:text-base text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary-800">4.9/5</div>
                <div className="text-sm lg:text-base text-muted-foreground">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary-800">50+</div>
                <div className="text-sm lg:text-base text-muted-foreground">Cities</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg mt-8 lg:mt-0">
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
