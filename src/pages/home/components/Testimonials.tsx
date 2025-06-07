
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "New Delhi",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      content: "Event Sathi made planning our wedding effortless. We found the perfect vendors within our budget, and everything went smoothly on our big day. Highly recommend their services!"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Mumbai",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "Amazing platform! The vendor quality is top-notch and the booking process is seamless. Our corporate event was a huge success thanks to Event Sathi."
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Bangalore",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "Found the perfect photographer for my daughter's birthday party. The platform is user-friendly and the vendors are professional. Will definitely use again!"
    }
  ];

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-xl opacity-90">Real experiences from real customers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-lg italic leading-relaxed">"{testimonial.content}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm opacity-80">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
