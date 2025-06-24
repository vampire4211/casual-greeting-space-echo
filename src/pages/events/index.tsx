import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import CreateEventModal from './components/CreateEventModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const EventsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    dateRange: '',
    priceRange: ''
  });

  const events = [
    {
      id: 1,
      title: "Royal Wedding Celebration",
      category: "Wedding",
      location: "Mumbai, Maharashtra",
      date: "2024-03-15",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      description: "A grand wedding celebration with traditional and modern elements",
      budget: "₹5,00,000 - ₹10,00,000",
      status: "upcoming",
      organizer: "Priya Sharma"
    },
    {
      id: 2,
      title: "Tech Conference 2024",
      category: "Corporate",
      location: "Bangalore, Karnataka",
      date: "2024-04-20",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      description: "Annual technology conference featuring industry leaders",
      budget: "₹2,00,000 - ₹5,00,000",
      status: "planning",
      organizer: "Tech Corp Ltd"
    },
    {
      id: 3,
      title: "Birthday Bash 2024",
      category: "Birthday",
      location: "Delhi, NCR",
      date: "2024-05-10",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      description: "Fun-filled birthday party with entertainment and games",
      budget: "₹50,000 - ₹1,00,000",
      status: "completed",
      organizer: "Raj Patel"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Events</h1>
              <p className="text-xl text-muted-foreground">Discover and plan amazing events</p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-700 hover:bg-primary-800"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          </div>

          <EventFilters filters={filters} setFilters={setFilters} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>

      <CreateEventModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />

      <Footer />
    </div>
  );
};

export default EventsPage;
