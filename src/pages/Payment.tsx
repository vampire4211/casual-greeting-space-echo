
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Smartphone } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [categoryCount, setCategoryCount] = useState('≤3');
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const plans = {
    basic: {
      name: 'Basic',
      price: { '≤3': 5500, '>3': 4000 },
      features: ['Profile listing', 'Reviews & ratings', 'Analytics access']
    },
    premium: {
      name: 'Premium',
      price: { '≤3': 7000, '>3': 5500 },
      features: ['Everything in Basic', 'Boosted visibility', 'Priority support']
    },
    extreme: {
      name: 'Extreme',
      price: { '≤3': 8500, '>3': 7000 },
      features: ['Everything in Premium', 'Homepage Highlight', 'Featured Badge']
    }
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment successful! Your plan has been activated.');
      navigate('/vendor/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Subscription Plan</h1>
            <p className="text-xl text-gray-600">Select the plan that best fits your business needs</p>
          </div>

          {/* Category Toggle */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Number of Categories</h3>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio"
                    value="≤3"
                    checked={categoryCount === '≤3'}
                    onChange={(e) => setCategoryCount(e.target.value)}
                    className="mr-2"
                  />
                  3 or fewer categories
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio"
                    value=">3"
                    checked={categoryCount === '>3'}
                    onChange={(e) => setCategoryCount(e.target.value)}
                    className="mr-2"
                  />
                  More than 3 categories
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Plans */}
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
                    ₹{plan.price[categoryCount as keyof typeof plan.price].toLocaleString()}
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

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Selected Plan:</span>
                  <span className="font-semibold capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span>{categoryCount} categories</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>Total Amount:</span>
                  <span className="text-primary">
                    ₹{plans[selectedPlan as keyof typeof plans].price[categoryCount as '≤3' | '>3'].toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Payment Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 flex items-center gap-3">
                    <CreditCard className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">Cards & Net Banking</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, RuPay</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-16 flex items-center gap-3">
                    <Smartphone className="h-6 w-6" />
                    <div className="text-left">
                      <div className="font-medium">UPI</div>
                      <div className="text-sm text-gray-500">PhonePe, Google Pay, Paytm</div>
                    </div>
                  </Button>
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handlePayment}
                >
                  Proceed to Payment
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  Your payment is secured by Razorpay with 256-bit SSL encryption. 
                  We don't store your payment information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
