
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [defaultMessage, setDefaultMessage] = useState<string>('');

  useEffect(() => {
    const vendorId = searchParams.get('vendor');
    const message = searchParams.get('message');
    
    if (vendorId) {
      setSelectedVendor(vendorId);
    }
    
    if (message) {
      setDefaultMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EADF' }}>
      <Navbar />
      
      <div className="pt-20 pb-4 h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r border-gray-200 bg-white">
            <ChatSidebar 
              selectedVendor={selectedVendor}
              onVendorSelect={setSelectedVendor}
            />
          </div>
          <div className="flex-1 bg-white">
            <ChatWindow 
              selectedVendor={selectedVendor}
              defaultMessage={defaultMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
