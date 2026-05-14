import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const DealerDetailView = () => {
  const [formData, setFormData] = useState({
    dealerType: 'Multi-brand',
    outletType: 'Showroom',
    monthlySales: '500',
    otherServices: ['Alignment', 'Balancing'],
    currentStatus: 'Active'
  });

  const dealerInfo = {
    id: '20456',
    name: 'Modern Tyres & Service',
    pincode: '201301',
    mobile: '9876543210',
    city: 'Noida'
  };

  const InputField = ({ label, value, readOnly = false, type = "text" }) => (
    <div className="mb-4">
      <label className="block text-[11px] font-medium text-gray-700 mb-1">{label}</label>
      <div className={`p-3 rounded border text-sm ${readOnly ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-300 text-gray-800'}`}>
        {value}
      </div>
    </div>
  );

  const SelectField = ({ label, value }) => (
    <div className="mb-4">
      <label className="block text-[11px] font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select className="w-full p-3 rounded border border-gray-300 text-sm appearance-none bg-white">
          <option>{value}</option>
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* AppBar */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="mr-4">
          <ArrowLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-gray-800 text-lg font-medium">Dealer Details</h1>
      </header>

      <div className="flex-1 p-4">
        <SelectField label="Select Dealer Type" value={formData.dealerType} />
        
        <InputField label="Dealer ID" value={dealerInfo.id} readOnly />
        <InputField label="Dealer Name" value={dealerInfo.name} readOnly />
        <InputField label="Pincode" value={dealerInfo.pincode} readOnly />
        <InputField label="Dealer Mobile" value={dealerInfo.mobile} readOnly />
        <InputField label="City" value={dealerInfo.city} readOnly />

        <SelectField label="Select Type of Outlet" value={formData.outletType} />
        
        <div className="mb-4">
          <label className="block text-[11px] font-medium text-gray-700 mb-1">Select Vehicle Category</label>
          <div className="flex flex-wrap gap-2">
            {['Car', 'SUV', 'Hatchback'].map((cat, i) => (
              <span key={i} className="bg-[#D32F2F]/10 text-[#D32F2F] text-[10px] px-2 py-1 rounded-full border border-[#D32F2F]/20">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-medium text-gray-700 mb-1">Average Monthly Sales</label>
          <input 
            type="number" 
            className="w-full p-3 rounded border border-gray-300 text-sm bg-white" 
            defaultValue={formData.monthlySales}
          />
        </div>

        <SelectField label="Current Status" value={formData.currentStatus} />

        <div className="mt-8 mb-4">
          <button className="w-full bg-[#D32F2F] text-white font-bold py-3 rounded-md shadow-lg active:scale-95 transition-transform">
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealerDetailView;
