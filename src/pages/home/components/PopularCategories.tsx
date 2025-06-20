
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PopularCategories = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const selectedIndexRef = useRef(0);
  const rotateIntervalRef = useRef<NodeJS.Timeout>();
  const autoRotateRef = useRef(true);

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
    },
    {
      id: 7,
      title: "Event Security",
      description: "Professional security services for safe events",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=300&fit=crop"
    },
    {
      id: 8,
      title: "Transportation",
      description: "Luxury transport services for special occasions",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop"
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
        const card = cell.querySelector('.card-content') as HTMLElement;
        if (card) card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
      } else if (position === -1) {
        // Left 1 - increased distance
        cell.style.transform = 'translateX(-280px) rotateY(15deg) scale(0.95)';
        const card = cell.querySelector('.card-content') as HTMLElement;
        if (card) card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
      } else if (position === -2) {
        // Left 2 - increased distance
        cell.style.transform = 'translateX(-480px) rotateY(25deg) scale(0.9)';
        const card = cell.querySelector('.card-content') as HTMLElement;
        if (card) card.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
      } else if (position === 1) {
        // Right 1 - increased distance
        cell.style.transform = 'translateX(280px) rotateY(-15deg) scale(0.95)';
        const card = cell.querySelector('.card-content') as HTMLElement;
        if (card) card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
      } else if (position === 2) {
        // Right 2 - increased distance
        cell.style.transform = 'translateX(480px) rotateY(-25deg) scale(0.9)';
        const card = cell.querySelector('.card-content') as HTMLElement;
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
    <section className="py-16 lg:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block mb-4">
            Popular Categories
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded-full"></span>
          </h2>
        </div>

        <div className="relative" style={{ perspective: '1200px' }}>
          <div
            ref={carouselRef}
            className="carousel w-full h-[520px] relative transform-style-preserve-3d"
            onMouseEnter={stopAutoRotation}
            onMouseLeave={startAutoRotation}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="carousel__cell absolute w-[280px] h-[420px] left-1/2 top-1/2 -ml-[140px] -mt-[210px] transition-all duration-500 ease-in-out transform-origin-center"
              >
                <Card className="card-content h-full w-full rounded-lg overflow-hidden relative border-gray-200 shadow-lg transition-transform duration-500 group cursor-pointer hover:shadow-xl">
                  <CardContent className="p-0 relative h-full">
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 transition-all duration-300 group-hover:text-primary group-hover:transform group-hover:translateY-[-2px]">{category.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed transition-transform duration-300 group-hover:translateY-[-1px]">{category.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/categories')}
                        className="w-full py-2 text-base transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary transform hover:translateY-[-2px] hover:shadow-lg"
                      >
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="carousel-options absolute bottom-5 left-0 right-0 flex justify-center gap-5 z-10">
            <button
              onClick={handlePrevious}
              className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-all duration-300"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-all duration-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
