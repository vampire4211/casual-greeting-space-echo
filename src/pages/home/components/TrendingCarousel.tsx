
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const TrendingCarousel = () => {
  const categories = [
    {
      id: 1,
      title: "Photography",
      subtitle: "150+ professional photographers",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Catering",
      subtitle: "90+ catering services",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Venues",
      subtitle: "120+ beautiful locations",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Decor",
      subtitle: "80+ decor specialists",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Music Bands",
      subtitle: "45+ musical options",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Makeup Artists",
      subtitle: "60+ beauty professionals",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-primary-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-900 relative inline-block">
            Trending Categories
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary-800 rounded-full"></span>
          </h2>
          <p className="text-xl text-primary-700 mt-4">Discover the most popular event services</p>
        </div>

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent className="-ml-4">
            {categories.map((item) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-80 overflow-hidden group cursor-pointer border-primary-300 hover:border-primary-500 transition-all duration-300">
                  <CardContent className="p-0 relative h-full">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                      <p className="text-sm text-primary-100">{item.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 border-primary-400 bg-white hover:bg-primary-50" />
          <CarouselNext className="right-0 border-primary-400 bg-white hover:bg-primary-50" />
        </Carousel>
      </div>
    </section>
  );
};

export default TrendingCarousel;
