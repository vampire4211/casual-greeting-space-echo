
interface VerificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface OTPRequest {
  documentType: 'pan' | 'aadhaar';
  documentNumber: string;
}

interface OTPVerification {
  documentType: 'pan' | 'aadhaar';
  documentNumber: string;
  otp: string;
}

export const verificationService = {
  // Send OTP for PAN verification
  sendPanOTP: async (panNumber: string): Promise<VerificationResponse> => {
    try {
      // This would integrate with actual government API
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Sending OTP for PAN: ${panNumber}`);
      
      // Simulate API response
      return {
        success: true,
        message: 'OTP sent successfully to registered mobile number',
        data: { transactionId: `PAN_${Date.now()}` }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP for PAN verification'
      };
    }
  },

  // Send OTP for Aadhaar verification
  sendAadhaarOTP: async (aadhaarNumber: string): Promise<VerificationResponse> => {
    try {
      // This would integrate with actual government API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Sending OTP for Aadhaar: ${aadhaarNumber}`);
      
      return {
        success: true,
        message: 'OTP sent successfully to registered mobile number',
        data: { transactionId: `AADHAAR_${Date.now()}` }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP for Aadhaar verification'
      };
    }
  },

  // Verify PAN with OTP
  verifyPanOTP: async (panNumber: string, otp: string, transactionId: string): Promise<VerificationResponse> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Verifying PAN OTP: ${panNumber}, OTP: ${otp}`);
      
      // Simulate verification
      if (otp === '123456') {
        return {
          success: true,
          message: 'PAN verified successfully',
          data: {
            name: 'John Doe',
            panNumber: panNumber,
            verified: true
          }
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'PAN verification failed'
      };
    }
  },

  // Verify Aadhaar with OTP
  verifyAadhaarOTP: async (aadhaarNumber: string, otp: string, transactionId: string): Promise<VerificationResponse> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Verifying Aadhaar OTP: ${aadhaarNumber}, OTP: ${otp}`);
      
      if (otp === '123456') {
        return {
          success: true,
          message: 'Aadhaar verified successfully',
          data: {
            name: 'John Doe',
            aadhaarNumber: aadhaarNumber,
            verified: true
          }
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Aadhaar verification failed'
      };
    }
  }
};
