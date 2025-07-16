
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import CustomerSignUpForm from '@/components/auth/CustomerSignUpForm';
import VendorSignUpForm from '@/components/auth/VendorSignUpForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [userType, setUserType] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
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
    email: '',
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (userType === 'vendor') {
        if (selectedCategories.length === 0) {
          toast.error('Please select at least one category');
          return;
        }
        
        const { data, error } = await signUp(vendorData.email, vendorData.password, {
          user_type: 'vendor',
          first_name: vendorData.fullName.split(' ')[0],
          last_name: vendorData.fullName.split(' ').slice(1).join(' '),
          phone: vendorData.phone,
          business_name: vendorData.businessName,
          categories: selectedCategories,
          aadhaar_number: vendorData.aadhaar,
          pan_number: vendorData.pan,
          gst_number: vendorData.gst,
          address: vendorData.address,
          age: vendorData.age,
          gender: vendorData.gender
        });
        
        if (error) {
          toast.error(error.message || 'Registration failed');
          return;
        }
        
        toast.success('Account created successfully! Please check your email to verify your account.');
        navigate('/payment');
      } else {
        const { data, error } = await signUp(customerData.email, customerData.password, {
          user_type: 'customer',
          first_name: customerData.name.split(' ')[0],
          last_name: customerData.name.split(' ').slice(1).join(' '),
          phone: customerData.phone,
          gender: customerData.gender
        });
        
        if (error) {
          toast.error(error.message || 'Registration failed');
          return;
        }
        
        toast.success('Account created successfully! Please check your email to verify your account.');
        navigate('/');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


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
              loading={loading}
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
              loading={loading}
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
