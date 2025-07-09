import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone: '',
    user_type: 'customer' as 'customer' | 'vendor',
    // Vendor specific fields
    business_name: '',
    aadhaar_number: '',
    pan_number: '',
    gst_number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    categories: [] as string[]
  });

  const availableCategories = [
    'Photography', 'Catering', 'Decoration', 'Videography', 
    'Music & DJ', 'Venues', 'Flowers', 'Event Planning'
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login(loginData.email, loginData.password);
    if (result.data?.user && !result.error) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error?.message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    const result = await register(registerData.email, registerData.password, registerData);
    if (result.data?.user && !result.error) {
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/');
    } else {
      toast.error(result.error?.message || 'Registration failed');
    }
  };

  const handleCategoryToggle = (category: string) => {
    setRegisterData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Event Sathi</CardTitle>
          <CardDescription>Your one-stop solution for event planning</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      placeholder="First name"
                      value={registerData.first_name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      placeholder="Last name"
                      value={registerData.last_name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user-type">Account Type</Label>
                  <Select 
                    value={registerData.user_type} 
                    onValueChange={(value: 'customer' | 'vendor') => 
                      setRegisterData(prev => ({ ...prev, user_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {registerData.user_type === 'vendor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Business Name</Label>
                      <Input
                        id="business-name"
                        placeholder="Enter your business name"
                        value={registerData.business_name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, business_name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aadhaar">Aadhaar Number</Label>
                        <Input
                          id="aadhaar"
                          placeholder="Aadhaar number"
                          value={registerData.aadhaar_number}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, aadhaar_number: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pan">PAN Number</Label>
                        <Input
                          id="pan"
                          placeholder="PAN number"
                          value={registerData.pan_number}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, pan_number: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Categories (Select your services)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={category}
                              checked={registerData.categories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="rounded"
                            />
                            <Label htmlFor={category} className="text-sm">{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm password"
                      value={registerData.confirm_password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:underline">
              Back to Home
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;