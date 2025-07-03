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
      price: 5500,
      features: ['Profile listing', 'Reviews & ratings', 'Analytics access']
    },
    premium: {
      name: 'Premium',
      price: 7000,
      features: ['Everything in Basic', 'Boosted visibility', 'Priority support']
    },
    extreme: {
      name: 'Extreme',
      price: 8500,
      features: ['Everything in Premium', 'Homepage Highlight', 'Featured Badge']
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const selectedPlanData = plans[selectedPlan as keyof typeof plans];
      const amount = selectedPlanData.price;
      
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Choose Your Subscription Plan</h1>
            <p className="text-xl text-gray-600 animate-fade-in">Select the plan that best fits your business needs</p>
          </div>

          <PlanSelector
            plans={plans}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />

          <PaymentMethods
            selectedPlan={selectedPlan}
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
