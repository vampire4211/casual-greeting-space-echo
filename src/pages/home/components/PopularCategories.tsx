
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Autoplay from "embla-carousel-autoplay";

const PopularCategories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      title: "Wedding Planners",
      description: "Professional planners to make your dream wedding come true",
      image: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Corporate Events",
      description: "Experts in organizing successful corporate gatherings",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Birthday Parties",
      description: "Make every birthday celebration memorable",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Photobooths",
      description: "Fun and creative photo experiences for your guests",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "DJ Services",
      description: "Professional DJs to keep your party going",
      image: "https://images.unsplash.com/photo-1571266028243-d220c6c3be4d?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      title: "Floral Design",
      description: "Beautiful flower arrangements for any occasion",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block mb-4">
            Popular Categories
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></span>
          </h2>
        </div>

        <Carousel 
          className="w-full max-w-6xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img 
                        src={category.image}
                        alt={category.title}
                        className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">{category.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">{category.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/categories')}
                        className="w-full py-2 text-base"
                      >
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-0" />
          <CarouselNext className="hidden md:flex right-0" />
        </Carousel>
      </div>
    </section>
  );
};

export default PopularCategories;
