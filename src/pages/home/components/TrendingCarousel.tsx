import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TrendingCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const selectedIndexRef = useRef(0);
  const rotateIntervalRef = useRef<NodeJS.Timeout>();
  const autoRotateRef = useRef(true);

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

  const positionCells = () => {
    if (!carouselRef.current) return;
    
    const cells = Array.from(carouselRef.current.children) as HTMLElement[];
    const centerIndex = selectedIndexRef.current;
    const cellCount = categories.length;

    cells.forEach((cell, i) => {
      // Calculate relative position to center
      let position = (i - centerIndex + cellCount) % cellCount;
      if (position > cellCount / 2) position -= cellCount;

      // Only show nearby cards
      if (Math.abs(position) > 2) {
        cell.style.opacity = '0';
        cell.style.pointerEvents = 'none';
        cell.style.transform = 'translateX(-1000px)';
        return;
      }

      cell.style.opacity = '1';
      cell.style.pointerEvents = 'auto';
      cell.style.zIndex = (10 - Math.abs(position)).toString();

      // Position cards with increased spacing and slight curve
      if (position === 0) {
        // Center card
        cell.style.transform = 'translateX(0) scale(1.1)';
        const card = cell.querySelector('.card') as HTMLElement;
        if (card) card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
      } else if (position === -1) {
        // Left 1 - increased distance
        cell.style.transform = 'translateX(-280px) rotateY(15deg) scale(0.95)';
        const card = cell.querySelector('.card') as HTMLElement;
        if (card) card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
      } else if (position === -2) {
        // Left 2 - increased distance
        cell.style.transform = 'translateX(-480px) rotateY(25deg) scale(0.9)';
        const card = cell.querySelector('.card') as HTMLElement;
        if (card) card.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
      } else if (position === 1) {
        // Right 1 - increased distance
        cell.style.transform = 'translateX(280px) rotateY(-15deg) scale(0.95)';
        const card = cell.querySelector('.card') as HTMLElement;
        if (card) card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
      } else if (position === 2) {
        // Right 2 - increased distance
        cell.style.transform = 'translateX(480px) rotateY(-25deg) scale(0.9)';
        const card = cell.querySelector('.card') as HTMLElement;
        if (card) card.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
      }
    });
  };

  const rotateToIndex = (index: number) => {
    selectedIndexRef.current = (index + categories.length) % categories.length;
    positionCells();
  };

  const startAutoRotation = () => {
    if (autoRotateRef.current) {
      rotateIntervalRef.current = setInterval(() => {
        rotateToIndex(selectedIndexRef.current + 1);
      }, 3000);
    }
  };

  const stopAutoRotation = () => {
    if (rotateIntervalRef.current) {
      clearInterval(rotateIntervalRef.current);
    }
  };

  const handlePrevious = () => {
    stopAutoRotation();
    rotateToIndex(selectedIndexRef.current - 1);
    setTimeout(startAutoRotation, 10000);
  };

  const handleNext = () => {
    stopAutoRotation();
    rotateToIndex(selectedIndexRef.current + 1);
    setTimeout(startAutoRotation, 10000);
  };

  useEffect(() => {
    positionCells();
    startAutoRotation();

    return () => {
      stopAutoRotation();
    };
  }, []);

  return (
    <section className="py-16 lg:py-20 bg-gray-50 overflow-hidden" style={{ backgroundColor: '#F0EADF' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block mb-4">
            Trending Categories
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mt-4">
            Discover the most popular event services
          </p>
        </div>

        <div className="relative" style={{ perspective: '1200px' }}>
          <div
            ref={carouselRef}
            className="carousel w-full h-[500px] relative transform-style-preserve-3d"
            onMouseEnter={stopAutoRotation}
            onMouseLeave={startAutoRotation}
          >
            {categories.map((item) => (
              <div
                key={item.id}
                className="carousel__cell absolute w-[280px] h-[380px] left-1/2 top-1/2 -ml-[140px] -mt-[190px] transition-all duration-500 ease-in-out transform-origin-center"
              >
                <Card className="h-full w-full rounded-lg overflow-hidden relative border-gray-200 shadow-lg transition-transform duration-500">
                  <CardContent className="p-0 relative h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-100">{item.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg z-20 flex items-center justify-center"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg z-20 flex items-center justify-center"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
