import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search, X, Plus, Calendar } from 'lucide-react';

const RmDsrView = () => {
  const navigate = useNavigate();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const dsrList = [
    {
      id: 'DSR-782',
      date: '12 May, 2026',
      dealerName: 'Modern Tyres & Service',
      summary: 'Met with Rahul. Discussed credit limit increase. Order for 20 tyres expected.',
      status: 'Submitted'
    },
    {
      id: 'DSR-779',
      date: '11 May, 2026',
      dealerName: 'Super Wheel Care',
      summary: 'Regular visit. Inventory check done. Payment collected for March invoices.',
      status: 'Submitted'
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* AppBar */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-gray-800 text-lg font-medium">RM DSR</h1>
      </header>

      {/* Filter Section */}
      <div className="bg-white p-3 shadow-sm border-b">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 font-medium">Filter By Date</span>
          {!isFilterExpanded ? (
            <button 
              onClick={() => setIsFilterExpanded(true)}
              className="flex items-center text-[#D32F2F] text-sm font-medium"
            >
              <Filter size={18} className="mr-1" />
              Add Filter
            </button>
          ) : (
            <div className="flex space-x-4">
               <button className="border border-gray-200 p-1 rounded text-[#D32F2F]">
                <Search size={18} />
              </button>
              <button 
                onClick={() => setIsFilterExpanded(false)}
                className="border border-gray-200 p-1 rounded text-[#D32F2F]"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
        
        {isFilterExpanded && (
          <div className="mt-3 grid grid-cols-2 gap-4 animate-in slide-in-from-top duration-200">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Date From *</label>
              <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
                <span className="text-xs text-gray-400">Select Date</span>
                <Calendar size={14} className="text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Date To *</label>
              <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
                <span className="text-xs text-gray-400">Select Date</span>
                <Calendar size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 text-sm font-medium text-gray-700">DSR List</div>

      {/* DSR List */}
      <div className="flex-1 px-3 space-y-4">
        {dsrList.map((dsr, index) => (
          <div key={index} className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-gray-400">#{dsr.id}</span>
              <span className="text-[10px] text-gray-400 font-medium">{dsr.date}</span>
            </div>
            <h3 className="font-bold text-sm text-gray-800">{dsr.dealerName}</h3>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed italic">
              "{dsr.summary}"
            </p>
            <div className="h-[1px] bg-gray-50 my-3" />
            <div className="flex justify-end">
              <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                {dsr.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar Action */}
      <div className="sticky bottom-0 bg-white p-2 border-t shrink-0">
        <button className="w-full bg-[#D32F2F] text-white font-bold py-3 rounded-md shadow-lg active:scale-95 transition-transform flex items-center justify-center space-x-2">
          <span>Add New</span>
        </button>
      </div>

      <div className="h-20" />
    </div>
  );
};

export default RmDsrView;
