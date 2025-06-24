import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import PlanSelector from './payment/components/PlanSelector';
import PaymentMethods from './payment/components/PaymentMethods';
import { razorpayService } from '@/services/razorpayService';

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const [categoryCount, setCategoryCount] = useState('≤3');
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [loading, setLoading] = useState(false);

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

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const selectedPlanData = plans[selectedPlan as keyof typeof plans];
      const amount = selectedPlanData.price[categoryCount as '≤3' | '>3'];
      
      const userDetails = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210'
      };

      const paymentResult = await razorpayService.initiatePayment({
        amount,
        planName: `${selectedPlanData.name} Plan`,
        userDetails
      }) as PaymentResult;

      if (paymentResult.success) {
        console.log('Payment successful:', paymentResult);
        alert('Payment successful! Your subscription has been activated.');
        navigate('/vendor/dashboard');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      const errorMessage = error?.error || 'Unknown error occurred';
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Subscription Plan</h1>
            <p className="text-xl text-gray-600">Select the plan that best fits your business needs</p>
          </div>

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

          <PlanSelector
            plans={plans}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            categoryCount={categoryCount}
          />

          <PaymentMethods
            selectedPlan={selectedPlan}
            categoryCount={categoryCount}
            plans={plans}
            onPayment={handlePayment}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
