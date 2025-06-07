
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Wedding Planners",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      description: "Professional planners to make your dream wedding come true"
    },
    {
      id: 2,
      name: "Corporate Events",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      description: "Experts in organizing successful corporate gatherings"
    },
    {
      id: 3,
      name: "Birthday Parties",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
      description: "Make every birthday celebration memorable"
    },
    {
      id: 4,
      name: "Photobooths",
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
      description: "Fun and creative photo experiences for your guests"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">Popular Categories</h2>
          <p className="text-xl text-primary-700">Find the perfect service for your event</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-primary-200 hover:border-primary-400">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-800 transition-colors text-primary-900">
                    {category.name}
                  </h3>
                  <p className="text-primary-700 leading-relaxed mb-4">{category.description}</p>
                  <Button variant="outline" className="w-full border-primary-400 text-primary-800 hover:bg-primary-100">
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
