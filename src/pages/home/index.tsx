
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from './components/HeroSection';
import TrendingCarousel from './components/TrendingCarousel';
import PopularCategories from './components/PopularCategories';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import ChatIcon from './components/ChatIcon';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrendingCarousel />
      <PopularCategories />
      <Testimonials />
      <CTASection />
      <ChatIcon />
    </div>
  );
};

export default HomePage;
