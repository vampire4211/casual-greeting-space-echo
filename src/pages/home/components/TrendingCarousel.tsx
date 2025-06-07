
import React from 'react';

const TrendingCarousel = () => {
  const categories = [
    {
      id: 1,
      name: "Photography",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e8eba3f2?w=400&h=300&fit=crop",
      count: "150+"
    },
    {
      id: 2,
      name: "Catering",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop",
      count: "90+"
    },
    {
      id: 3,
      name: "Venues",
      image: "https://images.unsplash.com/photo-1519167758481-83f29c776cb2?w=400&h=300&fit=crop",
      count: "120+"
    },
    {
      id: 4,
      name: "Decoration",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
      count: "80+"
    },
    {
      id: 5,
      name: "Music",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      count: "45+"
    },
    {
      id: 6,
      name: "Makeup",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      count: "60+"
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Trending Categories</h2>
          <p className="text-xl text-muted-foreground">Discover the most popular event services</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} professionals</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
