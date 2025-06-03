
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold relative inline-block">
            What Our Clients Say
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-white rounded-full"></span>
          </h2>
        </div>

        <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 md:p-12">
            <div className="relative">
              <div className="text-6xl text-white/20 absolute -top-4 -left-2">"</div>
              <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 relative z-10">
                Event Sathi made planning our wedding effortless. We found the perfect vendors within our budget, 
                and everything went smoothly on our big day. Highly recommend their services!
              </p>
              <div className="text-6xl text-white/20 absolute -bottom-8 -right-2">"</div>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
                alt="Priya Sharma"
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div>
                <h4 className="text-xl font-semibold">Priya Sharma</h4>
                <p className="text-white/80">New Delhi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Testimonials;
