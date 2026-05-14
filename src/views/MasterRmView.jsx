import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const MasterRmView = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRM, setSelectedRM] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isRMOpen, setIsRMOpen] = useState(false);

  // Mock data matching Flutter's city and RM list from API
  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
  const rmList = ['Rahul Sharma', 'Amit Kumar', 'Priya Singh', 'Vikash Gupta', 'Suresh Patel'];

  const handleSetTarget = () => {
    if (selectedRM) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* AppBar - matches Flutter */}
      <div className="bg-white h-14 flex items-center px-4 border-b">
        <button onClick={() => navigate(-1)} className="mr-3" aria-label="Go back">
          <ChevronLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-base font-medium">Master RM</h1>
      </div>

      {/* Body - matches Flutter's dropdown layout */}
      <div className="flex-1 p-4 mt-4">
        {/* City Dropdown */}
        <div className="mb-6">
          <div 
            onClick={() => setIsCityOpen(!isCityOpen)}
            className="border border-[#D8D8D8] rounded px-3 py-3 flex items-center justify-between cursor-pointer"
          >
            <span className={`text-sm ${selectedCity ? 'text-gray-800' : 'text-gray-400'}`}>
              {selectedCity || 'Select City *'}
            </span>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
          {isCityOpen && (
            <div className="border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto shadow-sm">
              {cities.map((city) => (
                <div
                  key={city}
                  onClick={() => { setSelectedCity(city); setIsCityOpen(false); }}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RM Dropdown */}
        <div className="mb-6">
          <div 
            onClick={() => setIsRMOpen(!isRMOpen)}
            className="border border-[#D8D8D8] rounded px-3 py-3 flex items-center justify-between cursor-pointer"
          >
            <span className={`text-sm ${selectedRM ? 'text-gray-800' : 'text-gray-400'}`}>
              {selectedRM || 'Select RM *'}
            </span>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
          {isRMOpen && (
            <div className="border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto shadow-sm">
              {rmList.map((rm) => (
                <div
                  key={rm}
                  onClick={() => { setSelectedRM(rm); setIsRMOpen(false); }}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                >
                  {rm}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Set Target Button */}
        {selectedRM && (
          <button
            onClick={handleSetTarget}
            className="w-full bg-[#D32F2F] text-white py-3 rounded-full text-sm font-medium mt-4"
          >
            Set Target
          </button>
        )}
      </div>
    </div>
  );
};

export default MasterRmView;
