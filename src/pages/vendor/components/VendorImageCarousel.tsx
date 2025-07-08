import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface VendorImageCarouselProps {
  images: string[];
}

const VendorImageCarousel = ({ images }: VendorImageCarouselProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video">
                  <img 
                    src={image} 
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default VendorImageCarousel;