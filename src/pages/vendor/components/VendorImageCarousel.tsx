import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useVendorImages } from '@/hooks/useVendorImages';

interface VendorImageCarouselProps {
  vendorId: number;
  fallbackImages?: string[];
}

const VendorImageCarousel = ({ vendorId, fallbackImages = [] }: VendorImageCarouselProps) => {
  const { images, loading } = useVendorImages(vendorId);
  
  // Use MongoDB images if available, otherwise fallback to provided images
  const imagesToShow = images.length > 0 ? images.map(img => img.image_url) : fallbackImages;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (imagesToShow.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">No images available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {imagesToShow.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video">
                  <img 
                    src={image} 
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      // Fallback to a default image if the image fails to load
                      e.currentTarget.src = `https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop`;
                    }}
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