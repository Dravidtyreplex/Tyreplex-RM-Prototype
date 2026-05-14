import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, ChevronDown, MessageSquare } from 'lucide-react';

const SalesInsightView = () => {
  const navigate = useNavigate();
  
  const insights = [
    {
      dealerId: '20456',
      dealerName: 'Modern Tyres & Service',
      date: '12 May, 2026',
      variant: 'MRF ZLX 165/80 R14',
      qty: 4,
      orderId: 'ORD-89234',
      rmPrice: '₹3,100',
      invoiceAmount: '₹12,400'
    },
    {
      dealerId: '20489',
      dealerName: 'Super Wheel Care',
      date: '10 May, 2026',
      variant: 'Apollo Alnac 4G 195/55 R16',
      qty: 8,
      orderId: 'ORD-89210',
      rmPrice: '₹5,250',
      invoiceAmount: '₹42,000'
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* AppBar */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-gray-800 text-lg font-medium">Sales Insight</h1>
      </header>

      {/* Selectors Section */}
      <div className="bg-white p-4 shadow-sm border-b">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-700 font-medium">Select Details</span>
          <div className="flex space-x-4">
            <button className="border border-gray-200 p-1 rounded text-[#D32F2F]">
              <X size={20} />
            </button>
            <button className="border border-gray-200 p-1 rounded text-[#D32F2F]">
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <select className="w-full p-2 pr-8 border border-gray-300 rounded text-[10px] appearance-none bg-white">
              <option>Select Dealer</option>
              <option>Modern Tyres & Service</option>
              <option>Super Wheel Care</option>
              <option>Gupta Tyres</option>
              <option>Sharma Auto</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="w-full p-2 pr-8 border border-gray-300 rounded text-[10px] appearance-none bg-white">
              <option>Select Variant</option>
              <option>MRF ZLX 165/80 R14</option>
              <option>Apollo Alnac 4G 195/55 R16</option>
              <option>CEAT Milaze X3 155/80 R13</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="flex-1 p-2.5 space-y-6 pt-4">
        {insights.map((item, index) => (
          <div key={index} className="flex flex-col">
            {/* Header tab */}
            <div className="flex justify-between items-end">
              <div className="bg-white rounded-tl-xl rounded-tr px-3 py-1 shadow-sm">
                <span className="text-[11px] font-bold text-gray-400">#{item.dealerId}</span>
              </div>
              <button 
                onClick={() => navigate('/ask-quote')}
                className="bg-gradient-to-b from-[#2CBDFE] to-[#2E95F4] rounded-t-md px-3 py-1 text-white text-[10px] font-medium active:scale-95"
              >
                Ask Quote
              </button>
            </div>

            {/* Card body */}
            <div className="bg-white shadow-[0_4px_3px_rgba(30,38,60,0.15)] p-4 rounded-b-xl rounded-tr-xl">
              <div className="flex justify-between items-start">
                <span className="text-[11px] text-gray-500 w-2/3 leading-tight">{item.dealerName}</span>
                <span className="text-[10px] font-medium text-gray-900">{item.date}</span>
              </div>
              
              <div className="h-[0.5px] bg-gray-400/50 my-2" />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 mb-1">Variant Name</span>
                  <span className="text-[10px] font-medium leading-tight">{item.variant}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 mb-1">Quantity</span>
                  <span className="text-[10px] font-medium">{item.qty}</span>
                </div>
              </div>

              <div className="h-[0.5px] bg-gray-400/50 my-4" />

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-gray-500 mb-1">Order Id</span>
                  <span className="text-[10px] font-medium">{item.orderId}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 mb-1">RM Price</span>
                  <span className="text-[10px] font-medium">{item.rmPrice}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-[#3D9CF4] mb-1">Invoice Amount</span>
                  <span className="text-[10px] font-medium text-[#3D9CF4]">{item.invoiceAmount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-20" />
    </div>
  );
};

export default SalesInsightView;
