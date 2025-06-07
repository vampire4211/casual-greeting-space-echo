
import React from 'react';
import HeroSection from './components/HeroSection';
import TrendingCarousel from './components/TrendingCarousel';
import PopularCategories from './components/PopularCategories';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import ChatIcon from './components/ChatIcon';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrendingCarousel 
        title="Trending Categories"
        items={[
          { id: 1, title: "Photography", subtitle: "150+ professional photographers", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop" },
          { id: 2, title: "Catering", subtitle: "90+ catering services", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop" },
          { id: 3, title: "Venues", subtitle: "120+ beautiful locations", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop" },
          { id: 4, title: "Decor", subtitle: "80+ decor specialists", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop" },
          { id: 5, title: "Music Bands", subtitle: "45+ musical options", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop" },
          { id: 6, title: "Makeup Artists", subtitle: "60+ beauty professionals", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop" },
        ]}
      />
      <PopularCategories />
      <TrendingCarousel 
        title="Trending Events & Ideas"
        items={[
          { id: 1, title: "Wedding Decor Ideas", subtitle: "Latest trends for 2023", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop" },
          { id: 2, title: "Birthday Party Themes", subtitle: "Creative concepts", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop" },
          { id: 3, title: "Corporate Events", subtitle: "Professional setups", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop" },
          { id: 4, title: "Catering Menus", subtitle: "Seasonal specials", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop" },
          { id: 5, title: "Photobooth Ideas", subtitle: "Fun concepts", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop" },
          { id: 6, title: "Destination Weddings", subtitle: "Exotic locations", image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop" },
        ]}
      />
      <Testimonials />
      <CTASection />
      <ChatIcon />
    </div>
  );
};

export default HomePage;
