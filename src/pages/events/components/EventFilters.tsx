
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Filters {
  category: string;
  location: string;
  dateRange: string;
  priceRange: string;
}

interface EventFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const EventFilters = ({ filters, setFilters }: EventFiltersProps) => {
  const categories = ['All', 'Wedding', 'Corporate', 'Birthday', 'Anniversary'];
  const locations = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
  const dateRanges = ['All', 'This Week', 'This Month', 'Next Month'];
  const priceRanges = ['All', '₹0-50K', '₹50K-1L', '₹1L-5L', '₹5L+'];

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      dateRange: '',
      priceRange: ''
    });
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              className="px-3 py-2 border rounded-md bg-background"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Location</label>
            <select 
              className="px-3 py-2 border rounded-md bg-background"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            >
              {locations.map(loc => (
                <option key={loc} value={loc === 'All' ? '' : loc}>{loc}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date Range</label>
            <select 
              className="px-3 py-2 border rounded-md bg-background"
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            >
              {dateRanges.map(range => (
                <option key={range} value={range === 'All' ? '' : range}>{range}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Budget</label>
            <select 
              className="px-3 py-2 border rounded-md bg-background"
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            >
              {priceRanges.map(price => (
                <option key={price} value={price === 'All' ? '' : price}>{price}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">&nbsp;</label>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventFilters;
