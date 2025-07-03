
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import DocumentVerification from '@/components/verification/DocumentVerification';
import CustomerSignUpForm from '@/components/auth/CustomerSignUpForm';
import VendorSignUpForm from '@/components/auth/VendorSignUpForm';

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'verification', 'complete'
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    password: ''
  });

  const [vendorData, setVendorData] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    age: '',
    gender: '',
    aadhaar: '',
    pan: '',
    gst: '',
    address: '',
    password: ''
  });

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === 'vendor') {
      if (selectedCategories.length === 0) {
        alert('Please select at least one category');
        return;
      }
      console.log('Vendor signup:', vendorData, 'Categories:', selectedCategories);
      localStorage.setItem('userType', 'vendor');
      navigate('/vendor/dashboard');
    } else {
      console.log('Customer signup:', customerData);
      navigate('/');
    }
  };

  const handleVerificationComplete = (verifiedData: any) => {
    console.log('Vendor signup with verification:', {
      ...vendorData,
      categories: selectedCategories,
      verification: verifiedData
    });
    
    // Navigate to subscription page after verification
    setTimeout(() => {
      navigate('/payment');
    }, 2000);
  };

  if (currentStep === 'verification' && userType === 'vendor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Event Sathi</span>
            </div>
            <CardTitle className="text-2xl">Document Verification</CardTitle>
            <p className="text-gray-600">Complete KYC to activate your vendor account</p>
          </CardHeader>
          
          <CardContent>
            <DocumentVerification onVerificationComplete={handleVerificationComplete} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Event Sathi</span>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <p className="text-gray-600">Join our platform today</p>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex gap-4 justify-center">
              <label className="flex items-center">
                <input 
                  type="radio"
                  value="customer"
                  checked={userType === 'customer'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Customer
              </label>
              <label className="flex items-center">
                <input 
                  type="radio"
                  value="vendor"
                  checked={userType === 'vendor'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                Vendor
              </label>
            </div>
          </div>

          {userType === 'customer' ? (
            <CustomerSignUpForm
              customerData={customerData}
              setCustomerData={setCustomerData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onSubmit={handleFormSubmit}
            />
          ) : (
            <VendorSignUpForm
              vendorData={vendorData}
              setVendorData={setVendorData}
              selectedCategories={selectedCategories}
              handleCategoryToggle={handleCategoryToggle}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onSubmit={handleFormSubmit}
            />
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
