import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Events = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  const events = [
    {
      id: 1,
      title: "Wedding Season Trends 2024",
      category: "Wedding",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      description: "Discover the latest wedding trends for 2024 including color palettes, decor ideas, and ceremony styles.",
      date: "March 15, 2024",
      price: "₹2,500"
    },
    {
      id: 2,
      title: "Corporate Event Planning Guide",
      category: "Corporate",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      description: "Essential tips for organizing successful corporate events that leave lasting impressions.",
      date: "March 10, 2024",
      price: "₹3,500"
    },
    {
      id: 3,
      title: "Birthday Party Ideas for Kids",
      category: "Birthday",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      description: "Creative and fun birthday party themes that will make your child's special day unforgettable.",
      date: "March 5, 2024",
      price: "₹1,800"
    },
    {
      id: 4,
      title: "Anniversary Celebration Ideas",
      category: "Anniversary",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
      description: "Romantic and memorable anniversary celebration ideas for couples.",
      date: "March 20, 2024",
      price: "₹2,200"
    },
    {
      id: 5,
      title: "Corporate Team Building Events",
      category: "Corporate",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
      description: "Engaging team building activities and event planning strategies.",
      date: "March 25, 2024",
      price: "₹4,000"
    },
    {
      id: 6,
      title: "Baby Shower Celebration",
      category: "Baby Shower",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Sweet and elegant baby shower themes and decoration ideas.",
      date: "March 30, 2024",
      price: "₹1,500"
    }
  ];

  const handleBookNow = (eventTitle: string) => {
    setSelectedEvent(eventTitle);
    setShowPaymentDialog(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Events & Ideas</h1>
            <p className="text-xl text-gray-600">Get inspired with the latest event trends and planning ideas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {events.map(event => (
              <Card key={event.id} className="group cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:scale-105 flex flex-col h-full bg-white">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-white shadow-lg">
                      {event.category}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-sm font-bold text-gray-800">{event.price}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <p className="text-sm text-gray-500 mb-2">{event.date}</p>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 flex-grow text-sm line-clamp-3">{event.description}</p>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(event.title);
                      }}
                      className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 mt-auto font-semibold"
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

      {/* Payment Processing Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">Payment Processing</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-2">Processing your booking for:</p>
            <p className="text-primary font-bold">{selectedEvent}</p>
            <p className="text-sm text-gray-600 mt-4">Please wait while we process your payment...</p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Events;
