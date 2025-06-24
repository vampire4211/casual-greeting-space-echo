
import React from 'react';

const StatsSection = () => {
  return (
    <div className="bg-primary rounded-2xl text-white p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
        <p className="text-xl opacity-90">Numbers that tell our story</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold mb-2">10,000+</div>
          <div className="opacity-90">Happy Customers</div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">2,500+</div>
          <div className="opacity-90">Verified Vendors</div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">50+</div>
          <div className="opacity-90">Cities Covered</div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2">4.9/5</div>
          <div className="opacity-90">Average Rating</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
