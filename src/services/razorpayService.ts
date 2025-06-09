
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const razorpayService = {
  loadRazorpay: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  createOrder: async (amount: number, currency: string = 'INR') => {
    try {
      // This would typically call your backend to create a Razorpay order
      // For now, we'll simulate it
      const orderId = `order_${Date.now()}`;
      return {
        success: true,
        orderId,
        amount,
        currency
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create order'
      };
    }
  },

  initiatePayment: async (options: {
    amount: number;
    planName: string;
    userDetails: {
      name: string;
      email: string;
      phone: string;
    };
  }) => {
    const isLoaded = await razorpayService.loadRazorpay();
    
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    const order = await razorpayService.createOrder(options.amount);
    
    if (!order.success) {
      throw new Error('Failed to create payment order');
    }

    return new Promise((resolve, reject) => {
      const razorpayOptions: RazorpayOptions = {
        key: 'rzp_test_your_key_here', // Replace with actual key
        amount: options.amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Event Sathi',
        description: `Subscription: ${options.planName}`,
        order_id: order.orderId,
        handler: (response: any) => {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        },
        prefill: {
          name: options.userDetails.name,
          email: options.userDetails.email,
          contact: options.userDetails.phone
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      
      razorpay.on('payment.failed', (response: any) => {
        reject({
          success: false,
          error: response.error.description
        });
      });

      razorpay.open();
    });
  }
};
