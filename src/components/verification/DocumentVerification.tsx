
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Shield } from 'lucide-react';
import { verificationService } from '@/services/verificationService';

interface DocumentVerificationProps {
  onVerificationComplete: (verifiedData: any) => void;
}

const DocumentVerification: React.FC<DocumentVerificationProps> = ({ onVerificationComplete }) => {
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panOTP, setPanOTP] = useState('');
  const [aadhaarOTP, setAadhaarOTP] = useState('');
  const [panTransactionId, setPanTransactionId] = useState('');
  const [aadhaarTransactionId, setAadhaarTransactionId] = useState('');
  const [panStep, setPanStep] = useState<'input' | 'otp' | 'verified'>('input');
  const [aadhaarStep, setAadhaarStep] = useState<'input' | 'otp' | 'verified'>('input');
  const [loading, setLoading] = useState(false);

  const handleSendPanOTP = async () => {
    if (!panNumber || panNumber.length !== 10) {
      alert('Please enter a valid PAN number');
      return;
    }

    setLoading(true);
    const response = await verificationService.sendPanOTP(panNumber);
    setLoading(false);

    if (response.success) {
      setPanTransactionId(response.data.transactionId);
      setPanStep('otp');
      alert(response.message);
    } else {
      alert(response.message);
    }
  };

  const handleSendAadhaarOTP = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      alert('Please enter a valid Aadhaar number');
      return;
    }

    setLoading(true);
    const response = await verificationService.sendAadhaarOTP(aadhaarNumber);
    setLoading(false);

    if (response.success) {
      setAadhaarTransactionId(response.data.transactionId);
      setAadhaarStep('otp');
      alert(response.message);
    } else {
      alert(response.message);
    }
  };

  const handleVerifyPanOTP = async () => {
    if (!panOTP || panOTP.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    const response = await verificationService.verifyPanOTP(panNumber, panOTP, panTransactionId);
    setLoading(false);

    if (response.success) {
      setPanStep('verified');
      checkBothVerified();
    } else {
      alert(response.message);
    }
  };

  const handleVerifyAadhaarOTP = async () => {
    if (!aadhaarOTP || aadhaarOTP.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    const response = await verificationService.verifyAadhaarOTP(aadhaarNumber, aadhaarOTP, aadhaarTransactionId);
    setLoading(false);

    if (response.success) {
      setAadhaarStep('verified');
      checkBothVerified();
    } else {
      alert(response.message);
    }
  };

  const checkBothVerified = () => {
    if (panStep === 'verified' && aadhaarStep === 'verified') {
      onVerificationComplete({
        panVerified: true,
        aadhaarVerified: true,
        panNumber,
        aadhaarNumber
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Document Verification</h3>
        <p className="text-gray-600">Verify your PAN and Aadhaar for account activation</p>
      </div>

      {/* PAN Verification */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            PAN Card Verification
          </CardTitle>
          {panStep === 'verified' && (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {panStep === 'otp' && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3 mr-1" />
              Pending OTP
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {panStep === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number
                </label>
                <Input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="uppercase"
                />
              </div>
              <Button
                onClick={handleSendPanOTP}
                disabled={loading || !panNumber}
                className="w-full"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </div>
          )}

          {panStep === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP sent to registered mobile
                </label>
                <InputOTP
                  maxLength={6}
                  value={panOTP}
                  onChange={(value) => setPanOTP(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleVerifyPanOTP}
                  disabled={loading || panOTP.length !== 6}
                  className="flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSendPanOTP}
                  disabled={loading}
                >
                  Resend
                </Button>
              </div>
            </div>
          )}

          {panStep === 'verified' && (
            <div className="text-center py-4">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">PAN verified successfully!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aadhaar Verification */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Aadhaar Card Verification
          </CardTitle>
          {aadhaarStep === 'verified' && (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {aadhaarStep === 'otp' && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Clock className="h-3 w-3 mr-1" />
              Pending OTP
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {aadhaarStep === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number
                </label>
                <Input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234 5678 9012"
                  maxLength={12}
                />
              </div>
              <Button
                onClick={handleSendAadhaarOTP}
                disabled={loading || !aadhaarNumber}
                className="w-full"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </div>
          )}

          {aadhaarStep === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP sent to registered mobile
                </label>
                <InputOTP
                  maxLength={6}
                  value={aadhaarOTP}
                  onChange={(value) => setAadhaarOTP(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleVerifyAadhaarOTP}
                  disabled={loading || aadhaarOTP.length !== 6}
                  className="flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSendAadhaarOTP}
                  disabled={loading}
                >
                  Resend
                </Button>
              </div>
            </div>
          )}

          {aadhaarStep === 'verified' && (
            <div className="text-center py-4">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Aadhaar verified successfully!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {panStep === 'verified' && aadhaarStep === 'verified' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center py-6">
            <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Verification Complete!</h3>
            <p className="text-green-700">Both documents have been verified successfully.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentVerification;
