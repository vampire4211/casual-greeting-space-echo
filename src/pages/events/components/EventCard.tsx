
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  image: string;
  description: string;
  budget: string;
  status: string;
  organizer: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
const handelClick()=>{
    alert("this feature is for future")
      }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <Badge className={`absolute top-4 left-4 ${getStatusColor(event.status)}`}>
          {event.status}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <Badge variant="outline">{event.category}</Badge>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{event.organizer}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium text-foreground">Budget: {event.budget}</p>
        </div>
        
        <Button className="w-full" onclick="handelClick">book now</Button>
      </CardContent>
    </Card>
    
  );
};

export default EventCard;
