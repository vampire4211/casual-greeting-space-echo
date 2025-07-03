
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface VendorData {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  aadhaar: string;
  pan: string;
  gst: string;
  address: string;
  password: string;
}

interface VendorSignUpFormProps {
  vendorData: VendorData;
  setVendorData: (data: VendorData) => void;
  selectedCategories: string[];
  handleCategoryToggle: (category: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const categories = [
  'Photography', 'Catering', 'Venue', 'Decor', 'Music', 'Makeup',
  'Wedding Planning', 'DJ', 'Florist', 'Transportation', 'Lighting',
  'Sound System', 'Security', 'Cleaning', 'Entertainment', 'Gifts',
  'Printing', 'Coordination', 'Hospitality'
];

const VendorSignUpForm: React.FC<VendorSignUpFormProps> = ({
  vendorData,
  setVendorData,
  selectedCategories,
  handleCategoryToggle,
  showPassword,
  setShowPassword,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text"
            value={vendorData.fullName}
            onChange={(e) => setVendorData({...vendorData, fullName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input 
            type="text"
            value={vendorData.businessName}
            onChange={(e) => setVendorData({...vendorData, businessName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email"
            value={vendorData.email}
            onChange={(e) => setVendorData({...vendorData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input 
            type="tel"
            value={vendorData.phone}
            onChange={(e) => setVendorData({...vendorData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input 
            type="number"
            value={vendorData.age}
            onChange={(e) => setVendorData({...vendorData, age: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select 
            value={vendorData.gender}
            onChange={(e) => setVendorData({...vendorData, gender: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
          <input 
            type="text"
            value={vendorData.aadhaar}
            onChange={(e) => setVendorData({...vendorData, aadhaar: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
          <input 
            type="text"
            value={vendorData.pan}
            onChange={(e) => setVendorData({...vendorData, pan: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
          <input 
            type="text"
            value={vendorData.gst}
            onChange={(e) => setVendorData({...vendorData, gst: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea 
          value={vendorData.address}
          onChange={(e) => setVendorData({...vendorData, address: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories (Select 1-5)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
          {categories.map(category => (
            <label key={category} className="flex items-center text-sm">
              <input 
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                disabled={!selectedCategories.includes(category) && selectedCategories.length >= 5}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Selected: {selectedCategories.length}/5
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            value={vendorData.password}
            onChange={(e) => setVendorData({...vendorData, password: e.target.value})}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
};

export default VendorSignUpForm;
