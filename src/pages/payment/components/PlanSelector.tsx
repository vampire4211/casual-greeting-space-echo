
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Plan {
  name: string;
  price: number;
  features: string[];
}

interface PlanSelectorProps {
  plans: Record<string, Plan>;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  categoryCount?: string;
}

const PlanSelector = ({ plans, selectedPlan, setSelectedPlan, categoryCount }: PlanSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      {Object.entries(plans).map(([key, plan]) => (
        <Card 
          key={key} 
          className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
            selectedPlan === key 
              ? 'border-2 border-primary shadow-2xl bg-primary-50' 
              : 'hover:shadow-xl'
          }`}
          onClick={() => setSelectedPlan(key)}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
            <div className="text-5xl font-bold text-gray-900 mt-4">
              ₹{plan.price.toLocaleString()}
            </div>
            <p className="text-gray-600 text-lg">/month</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            {key === 'extreme' && (
              <Badge className="w-full mt-6 justify-center bg-yellow-500 text-black py-2 text-sm font-bold">
                Most Popular
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlanSelector;
