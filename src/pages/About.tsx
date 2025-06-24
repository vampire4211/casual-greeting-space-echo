
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StorySection from './about/components/StorySection';
import ValuesSection from './about/components/ValuesSection';
import StatsSection from './about/components/StatsSection';

const About = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Event Sathi</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize event planning in India by connecting people with trusted, 
              verified vendors who can bring their vision to life.
            </p>
          </div>

          <StorySection />
          <ValuesSection />
          <StatsSection />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
