import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Events = () => {
  const events = [
    {
      id: 1,
      title: "Wedding Season Trends 2024",
      category: "Wedding",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      description: "Discover the latest wedding trends for 2024 including color palettes, decor ideas, and ceremony styles.",
      date: "March 15, 2024"
    },
    {
      id: 2,
      title: "Corporate Event Planning Guide",
      category: "Corporate",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      description: "Essential tips for organizing successful corporate events that leave lasting impressions.",
      date: "March 10, 2024"
    },
    {
      id: 3,
      title: "Birthday Party Ideas for Kids",
      category: "Birthday",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      description: "Creative and fun birthday party themes that will make your child's special day unforgettable.",
      date: "March 5, 2024"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Events & Ideas</h1>
            <p className="text-xl text-gray-600">Get inspired with the latest event trends and planning ideas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <Card key={event.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative overflow-hidden">
                    <img 
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-white">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <p className="text-sm text-gray-500 mb-2">{event.date}</p>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 flex-grow">{event.description}</p>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Processed to payment');
                      }}
                      className="w-full bg-primary-700 hover:bg-primary-800 mt-auto"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Events;
