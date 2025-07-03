
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from './components/HeroSection';
import TrendingCarousel from './components/TrendingCarousel';
import PopularCategories from './components/PopularCategories';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import ChatIcon from './components/ChatIcon';

const HomePage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <CTASection />
        
        <TrendingCarousel />
        <PopularCategories />
        <Testimonials />
      </main>
      <ChatIcon />
      <Footer />
    </div>
  );
};

export default HomePage;
