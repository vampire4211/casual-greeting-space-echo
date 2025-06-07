
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal = ({ isOpen, onClose }: CreateEventModalProps) => {
  const [eventData, setEventData] = useState({
    title: '',
    category: '',
    location: '',
    date: '',
    description: '',
    budget: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating event:', eventData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Event Title</label>
            <Input
              placeholder="Enter event title"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Category</label>
            <select 
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={eventData.category}
              onChange={(e) => setEventData({...eventData, category: e.target.value})}
              required
            >
              <option value="">Select Category</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              placeholder="Enter location"
              value={eventData.location}
              onChange={(e) => setEventData({...eventData, location: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={eventData.date}
              onChange={(e) => setEventData({...eventData, date: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Budget Range</label>
            <select 
              className="w-full px-3 py-2 border rounded-md bg-background"
              value={eventData.budget}
              onChange={(e) => setEventData({...eventData, budget: e.target.value})}
              required
            >
              <option value="">Select Budget Range</option>
              <option value="₹0-50K">₹0 - ₹50,000</option>
              <option value="₹50K-1L">₹50,000 - ₹1,00,000</option>
              <option value="₹1L-5L">₹1,00,000 - ₹5,00,000</option>
              <option value="₹5L+">₹5,00,000+</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe your event..."
              value={eventData.description}
              onChange={(e) => setEventData({...eventData, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Create Event</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
