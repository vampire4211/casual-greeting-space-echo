
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Plan {
  name: string;
  price: { '≤3': number; '>3': number };
  features: string[];
}

interface PlanSelectorProps {
  plans: Record<string, Plan>;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  categoryCount: string;
}

const PlanSelector = ({ plans, selectedPlan, setSelectedPlan, categoryCount }: PlanSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Object.entries(plans).map(([key, plan]) => (
        <Card 
          key={key} 
          className={`cursor-pointer transition-all duration-300 ${
            selectedPlan === key 
              ? 'border-2 border-primary shadow-lg' 
              : 'hover:shadow-md'
          }`}
          onClick={() => setSelectedPlan(key)}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <div className="text-4xl font-bold text-primary">
              ₹{plan.price[categoryCount as '≤3' | '>3'].toLocaleString()}
            </div>
            <p className="text-gray-500">/month</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            {key === 'extreme' && (
              <Badge className="w-full mt-4 justify-center bg-yellow-500 text-black">
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
