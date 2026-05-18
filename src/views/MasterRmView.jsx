import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const MasterRmView = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRM, setSelectedRM] = useState('');

  // Mock data matching Flutter's city and RM list from API
  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
  const rmList = ['AnoopSingh', 'Rahul Sharma', 'Amit Kumar', 'Priya Singh', 'Vikash Gupta', 'Suresh Patel'];

  const handleSubmit = () => {
    if (selectedCity && selectedRM) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header - "Master RM" in red, no back arrow, with bottom border */}
      <header className="bg-white px-4 pt-6 pb-3 border-b border-gray-200">
        <h1 className="text-[#D32F2F] text-[18px] font-bold">Master RM</h1>
      </header>

      {/* Body */}
      <div className="flex-1 px-5 pt-8">
        {/* Select City - always visible */}
        <div className="mb-5">
          <div className="relative">
            <select
              className="w-full h-[52px] px-4 border border-gray-300 rounded-md text-[15px] text-black appearance-none outline-none focus:border-gray-400 bg-white"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedRM(''); // Reset RM when city changes
              }}
            >
              <option value="" disabled>Select City *</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            {/* Floating label */}
            {selectedCity && (
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-500">
                Select City <span className="text-[#D32F2F]">*</span>
              </label>
            )}
            {!selectedCity && (
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-500">
                Select City <span className="text-[#D32F2F]">*</span>
              </label>
            )}
          </div>
        </div>

        {/* Select RM - only visible after city is selected */}
        {selectedCity && (
          <div className="mb-8">
            <div className="relative">
              <select
                className="w-full h-[52px] px-4 border border-gray-300 rounded-md text-[15px] text-black appearance-none outline-none focus:border-gray-400 bg-white"
                value={selectedRM}
                onChange={(e) => setSelectedRM(e.target.value)}
              >
                <option value="" disabled>Select RM *</option>
                {rmList.map((rm) => (
                  <option key={rm} value={rm}>{rm}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              {/* Floating label */}
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-500">
                Select RM <span className="text-[#D32F2F]">*</span>
              </label>
            </div>
          </div>
        )}

        {/* Submit button - only visible after both city and RM are selected */}
        {selectedCity && selectedRM && (
          <button
            onClick={handleSubmit}
            className="w-full bg-[#ED1D24] text-white font-bold text-[16px] py-4 rounded-lg active:scale-[0.98] transition-transform"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default MasterRmView;
