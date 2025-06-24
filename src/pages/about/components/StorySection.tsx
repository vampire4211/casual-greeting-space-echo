
import React from 'react';

const StorySection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Event Sathi was born from a simple observation: planning events in India was unnecessarily 
            complicated. People struggled to find reliable vendors, compare services, and ensure quality.
          </p>
          <p>
            Founded in 2023, we set out to create a platform that would make event planning effortless 
            and enjoyable. Today, we're proud to connect thousands of customers with verified vendors 
            across 50+ cities in India.
          </p>
          <p>
            From intimate birthday parties to grand weddings and corporate events, we believe every 
            occasion deserves to be special.
          </p>
        </div>
      </div>
      <div>
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
          alt="Our team"
          className="w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default StorySection;
