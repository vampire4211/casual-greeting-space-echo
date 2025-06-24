
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Award, Heart } from 'lucide-react';

const ValuesSection = () => {
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
  );
};

export default ValuesSection;
