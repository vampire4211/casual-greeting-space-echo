
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Smartphone } from 'lucide-react';

interface PaymentMethodsProps {
  selectedPlan: string;
  categoryCount: string;
  plans: any;
  onPayment: () => void;
  loading: boolean;
}

const PaymentMethods = ({ selectedPlan, categoryCount, plans, onPayment, loading }: PaymentMethodsProps) => {
  return (
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
              ₹{plans[selectedPlan].price[categoryCount as '≤3' | '>3'].toLocaleString()}
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
            onClick={onPayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
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
  );
};

export default PaymentMethods;
