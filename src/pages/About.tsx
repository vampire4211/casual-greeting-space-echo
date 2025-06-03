
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in building strong relationships between event planners and vendors."
    },
    {
      icon: Target,
      title: "Quality Focus",
      description: "Every vendor on our platform is verified and committed to excellence."
    },
    {
      icon: Award,
      title: "Trust & Reliability",
      description: "We ensure transparent processes and reliable service delivery."
    },
    {
      icon: Heart,
      title: "Passion Driven",
      description: "We're passionate about making every event special and memorable."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Event Sathi</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize event planning in India by connecting people with trusted, 
              verified vendors who can bring their vision to life.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Event Sathi was born from a simple observation: planning events in India was unnecessarily 
                  complicated. People struggled to find reliable vendors, compare services, and ensure quality.
                </p>
                <p>
                  Founded in 2023, we set out to create a platform that would make event planning effortless 
                  and enjoyable. Today, we're proud to connect thousands of customers with verified vendors 
                  across 50+ cities in India.
                </p>
                <p>
                  From intimate birthday parties to grand weddings and corporate events, we believe every 
                  occasion deserves to be special.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Our team"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-primary rounded-2xl text-white p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl opacity-90">Numbers that tell our story</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="opacity-90">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <div className="opacity-90">Verified Vendors</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="opacity-90">Cities Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="opacity-90">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
