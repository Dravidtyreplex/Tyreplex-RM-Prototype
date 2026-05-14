import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobileNumber(value);
      if (value.length === 10) {
        // Mimic Flutter's behavior of auto-calling getOtp
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* AppBar matching Flutter exactly */}
      <div className="bg-[#D32F2F] h-14 flex items-center px-4 shadow-md">
        <h1 className="text-white text-lg font-medium">Login</h1>
      </div>

      <div className="flex-1 px-5 pt-8">
        <div className="max-w-md mx-auto">
          <p className="text-[#1E263C] text-[16px] font-medium text-center mb-4">
            Enter 10 digit mobile number
          </p>
          
          <p className="text-gray-500 text-[12px] text-center mb-10">
            An OTP will be sent to this mobile number
          </p>

          <div className="relative mt-8">
            <div className="border border-gray-300 rounded px-3 py-4 flex items-center focus-within:border-[#D32F2F] transition-colors">
              <span className="text-gray-600 mr-3 border-r pr-3">+91</span>
              <input
                autoFocus
                type="tel"
                value={mobileNumber}
                onChange={handleInputChange}
                className="flex-1 outline-none text-lg tracking-wider"
                placeholder="Mobile Number"
                maxLength={10}
              />
            </div>
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-gray-500">
              Mobile Number
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
