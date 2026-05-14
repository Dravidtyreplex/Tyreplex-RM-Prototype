import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Filter, 
  Download, 
  Info, 
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PlaceOrderView = () => {
  const navigate = useNavigate();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const discountSummary = [
    { label: 'Available Discount', value: '₹1,24,500' },
    { label: 'Used Discount', value: '₹45,000' },
    { label: 'Total Discount', value: '₹1,69,500' },
  ];

  const orders = [
    {
      orderId: 'ORD-89234',
      userName: 'Modern Tyres & Service',
      orderAdded: '12 May, 2026',
      status: 'Delivered',
      paymentStatus: 'PAID',
      items: [
        { name: 'MRF ZLX 165/80 R14', qty: 4, total: '₹12,400' },
        { name: 'CEAT Milaze X3 155/80 R13', qty: 2, total: '₹5,800' }
      ],
      expectedDelivery: '14 May, 2026',
      delayReason: ''
    },
    {
      orderId: 'ORD-89210',
      userName: 'Super Wheel Care',
      orderAdded: '10 May, 2026',
      status: 'Pending',
      paymentStatus: 'NOT PAID',
      items: [
        { name: 'Apollo Alnac 4G 195/55 R16', qty: 8, total: '₹42,000' }
      ],
      expectedDelivery: '15 May, 2026',
      delayReason: 'Logistics delay due to weather'
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header - back arrow + centered title */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="mr-3">
          <ArrowLeft size={21} className="text-black" />
        </button>
        <h1 className="text-base font-medium flex-1 text-center pr-8">Order History</h1>
      </header>

      {/* Discount Summary - Horizontal Scroll */}
      <div className="bg-[#9DD1EE]/20 overflow-x-auto no-scrollbar py-4 px-2.5 flex space-x-4 shrink-0">
        {discountSummary.map((item, i) => (
          <div key={i} className="bg-white shadow-[0_4px_3px_rgba(30,38,60,0.15)] p-2 px-4 min-w-[140px] flex flex-col items-center shrink-0">
            <span className="text-[12px] text-[#096395] mb-1">{item.label}</span>
            <span className="text-sm font-bold text-[#D32F2F]">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-3 shadow-sm border-b">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Filter By Order Date</span>
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
              <button className="border border-gray-200 p-1 rounded">
                <Search size={18} className="text-[#D32F2F]" />
              </button>
              <button 
                onClick={() => setIsFilterExpanded(false)}
                className="border border-gray-200 p-1 rounded"
              >
                <X size={18} className="text-[#D32F2F]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order List */}
      <div className="flex-1 p-2.5 space-y-6 pt-4">
        {orders.map((order, index) => (
          <div key={index} className="flex flex-col relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[23deg] pointer-events-none opacity-[0.05] z-0">
              <span className={`text-6xl font-bold border-4 px-4 py-2 rounded ${order.paymentStatus === 'PAID' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
                {order.paymentStatus}
              </span>
            </div>

            {/* Order Card Header */}
            <div className="flex justify-between items-end relative z-10">
              <div className="bg-white rounded-tl-xl rounded-tr px-3 py-1 shadow-sm border-b border-gray-50">
                <span className="text-[11px] font-bold text-gray-400">#{order.orderId}</span>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate('/raise-issue/form')}
                  className="bg-white border border-[#2CBDFE] rounded-t-md px-2 py-1 text-[10px] text-[#2CBDFE] font-bold active:bg-blue-50"
                >
                  Raise Issue
                </button>
                <button className="bg-gradient-to-b from-[#2CBDFE] to-[#2E95F4] rounded-t-md px-2 py-1 text-[10px] text-white font-bold">
                  Re-Ask
                </button>
              </div>
            </div>

            {/* Main Order Card Body */}
            <div className="bg-white shadow-[0_4px_3px_rgba(30,38,60,0.15)] p-4 flex flex-col relative z-10">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-sm">{order.userName}</span>
                <span className="text-xs text-gray-500">{order.orderAdded}</span>
              </div>
              
              <div className="h-[1px] bg-red-100 my-2" />
              
              <div className="grid grid-cols-3 text-[10px] text-gray-500 mb-2">
                <span>Product Name</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              {order.items.map((item, i) => (
                <div key={i} className="grid grid-cols-3 text-[10px] mb-2 font-medium">
                  <span className="text-gray-800 leading-tight">{item.name}</span>
                  <span className="text-center text-gray-800">{item.qty}</span>
                  <span className="text-right text-gray-800">{item.total}</span>
                </div>
              ))}

              <div className="flex space-x-6 mt-2">
                <button className="flex items-center text-[#9DD1EE] underline text-[10px]">
                  <Download size={14} className="mr-1" />
                  Invoice
                </button>
              </div>

              <div className="h-[1px] bg-red-100 my-2" />

              <div className="flex justify-between items-center text-[10px]">
                <button className="text-[#3D9CF4] underline">Order Details</button>
                <span className={`font-bold ${order.status === 'Delivered' ? 'text-green-600' : 'text-orange-500'}`}>
                  {order.status}
                </span>
                <button className="text-[#3D9CF4] underline">Show Notes</button>
              </div>

              {order.delayReason && (
                <>
                  <div className="h-[1px] bg-red-100 my-2" />
                  <div className="text-[10px] flex">
                    <span className="text-gray-500 mr-1">Reason:</span>
                    <span className="text-gray-700">{order.delayReason}</span>
                  </div>
                </>
              )}

              {order.expectedDelivery && (
                <div className="mt-4 -mx-4 -mb-4 bg-green-50 border-t border-green-600 p-2 px-4 flex justify-between items-center text-[10px]">
                  <span className="text-gray-600">Delivery Time</span>
                  <span className="font-bold text-gray-800">{order.expectedDelivery}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar Action */}
      <div className="sticky bottom-0 bg-white p-2 border-t shrink-0">
        <button className="w-full bg-[#D32F2F] text-white font-bold py-3 rounded-md shadow-lg active:scale-95 transition-transform">
          Ask Quote
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderView;
