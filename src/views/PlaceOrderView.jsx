import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  X, 
  Filter, 
  Download, 
  ChevronDown
} from 'lucide-react';

const PlaceOrderView = () => {
  const navigate = useNavigate();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Filter states
  const [filterOrderId, setFilterOrderId] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterDealer, setFilterDealer] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterTillDate, setFilterTillDate] = useState('');

  const discountSummary = [
    { label: 'Available Discount', value: '₹10,45,801.25' },
    { label: 'Used Discount', value: '₹1,87,35,268.75' },
    { label: 'Total Discount', value: '₹1,97,81,070' },
  ];

  const orders = [
    {
      orderId: '1217832',
      userName: 'NEW CHOUDHARY TYRES',
      orderAdded: '2026-04-15',
      status: 'Waiting for approval',
      paymentStatus: 'NOT PAID',
      items: [
        { name: 'JK Tyre JETWAY JUH5 295/90 R20 TTF', qty: 20, total: '₹4,30,000' }
      ],
      deliveryTime: '2026-04-15 16:09:00',
    },
    {
      orderId: '1217783',
      userName: 'MVIN CARGO PRIVATE LIMITED',
      orderAdded: '2026-04-15',
      status: 'Waiting for approval',
      paymentStatus: 'NOT PAID',
      items: [
        { name: 'Apollo EnduRace RT 295/95 R20', qty: 10, total: '₹2,15,000' }
      ],
      deliveryTime: '2026-04-15 14:30:00',
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="mr-3" aria-label="Go back">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-[#D32F2F] text-[17px] font-bold flex-1 text-center pr-8">Order History</h1>
      </header>

      {/* Discount Summary - Horizontal Scroll */}
      <div className="overflow-x-auto no-scrollbar py-4 px-3 flex gap-3 shrink-0 bg-[#F2F2F2]">
        {discountSummary.map((item, i) => (
          <div key={i} className="bg-white border border-[#2CBDFE] rounded-lg p-3 min-w-[140px] flex flex-col items-center shrink-0">
            <span className="text-[11px] font-semibold text-[#2CBDFE] mb-1">{item.label}</span>
            <span className="text-[13px] font-bold text-[#D32F2F]">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b">
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-[14px] font-bold text-black">Filter By Order Date</span>
          <div className="flex items-center gap-2">
            {isFilterExpanded && (
              <button 
                className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center"
                aria-label="Search filters"
              >
                <Search size={16} className="text-[#D32F2F]" />
              </button>
            )}
            <button 
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center"
              aria-label={isFilterExpanded ? "Close filters" : "Open filters"}
            >
              {isFilterExpanded ? (
                <X size={16} className="text-[#D32F2F]" />
              ) : (
                <Filter size={16} className="text-[#D32F2F]" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Filter Fields */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                {/* Row 1: Order Id, Order Status, Payment Status */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-black mb-1">Order Id</label>
                    <input
                      type="text"
                      placeholder=""
                      value={filterOrderId}
                      onChange={(e) => setFilterOrderId(e.target.value)}
                      className="w-full h-9 px-2 border border-gray-300 rounded text-[12px] outline-none focus:border-gray-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-black mb-1">Order Status</label>
                    <div className="relative">
                      <select
                        value={filterOrderStatus}
                        onChange={(e) => setFilterOrderStatus(e.target.value)}
                        className="w-full h-9 px-2 border border-gray-300 rounded text-[12px] outline-none focus:border-gray-400 bg-white appearance-none"
                      >
                        <option value="">Order Status</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Waiting for approval">Waiting for approval</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-black mb-1">Payment Status</label>
                    <div className="relative">
                      <select
                        value={filterPaymentStatus}
                        onChange={(e) => setFilterPaymentStatus(e.target.value)}
                        className="w-full h-9 px-2 border border-gray-300 rounded text-[12px] outline-none focus:border-gray-400 bg-white appearance-none"
                      >
                        <option value=""></option>
                        <option value="PAID">PAID</option>
                        <option value="NOT PAID">NOT PAID</option>
                        <option value="PARTIAL">PARTIAL</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 2: Select B2B Dealer, Order From Date, Order Till Date */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-black mb-1">Select B2B Dealer</label>
                    <div className="relative">
                      <select
                        value={filterDealer}
                        onChange={(e) => setFilterDealer(e.target.value)}
                        className="w-full h-9 px-2 border border-gray-300 rounded text-[12px] outline-none focus:border-gray-400 bg-white appearance-none"
                      >
                        <option value=""></option>
                        <option value="NEW CHOUDHARY TYRES">NEW CHOUDHARY TYRES</option>
                        <option value="Modern Tyres">Modern Tyres</option>
                        <option value="Super Wheel Care">Super Wheel Care</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-black mb-1">Order From Date</label>
                    <input
                      type="date"
                      value={filterFromDate}
                      onChange={(e) => setFilterFromDate(e.target.value)}
                      className="w-full h-9 px-2 border border-gray-300 rounded text-[11px] outline-none focus:border-gray-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-black mb-1">Order Till Date</label>
                    <input
                      type="date"
                      value={filterTillDate}
                      onChange={(e) => setFilterTillDate(e.target.value)}
                      className="w-full h-9 px-2 border border-gray-300 rounded text-[11px] outline-none focus:border-gray-400 bg-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order History Title */}
      <div className="px-4 pt-4 pb-2 bg-[#F2F2F2]">
        <h2 className="text-[16px] font-bold text-black">Order History</h2>
      </div>

      {/* Order List */}
      <div className="flex-1 px-3 pb-24 space-y-4 bg-[#F2F2F2] overflow-y-auto no-scrollbar">
        {orders.map((order, index) => (
          <div key={index} className="flex flex-col relative overflow-hidden">
            {/* Order Card Header - Order ID + Raise Issue + Re-Ask */}
            <div className="flex justify-between items-end">
              <div className="bg-white rounded-t-lg px-3 py-1.5 border border-b-0 border-gray-200">
                <span className="text-[11px] font-medium text-gray-400">#{order.orderId}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/raise-issue/form')}
                  className="text-[12px] font-bold text-[#D32F2F]"
                >
                  Raise Issue
                </button>
                <button className="bg-[#ED1D24] text-white text-[11px] font-bold px-3 py-1.5 rounded">
                  Re-Ask
                </button>
              </div>
            </div>

            {/* Main Order Card Body */}
            <div className="bg-white border border-gray-200 rounded-b-lg rounded-tr-lg p-4 relative">
              {/* NOT PAID Watermark */}
              {order.paymentStatus === 'NOT PAID' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[20deg] pointer-events-none z-0">
                  <span className="text-4xl font-bold text-red-200 border-4 border-red-200 px-3 py-1 rounded opacity-40">
                    NOT PAID
                  </span>
                </div>
              )}

              {/* Dealer Name + Date */}
              <div className="flex justify-between items-center relative z-10">
                <span className="font-bold text-[14px] text-black">{order.userName}</span>
                <span className="text-[12px] text-gray-500">{order.orderAdded}</span>
              </div>
              
              <div className="h-[1px] bg-gray-200 my-3" />
              
              {/* Product Table Header */}
              <div className="grid grid-cols-3 text-[11px] text-gray-400 mb-2 relative z-10">
                <span>Product Name</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              {/* Product Items */}
              {order.items.map((item, i) => (
                <div key={i} className="grid grid-cols-3 text-[12px] mb-2 relative z-10">
                  <span className="text-black font-medium leading-tight">{item.name}</span>
                  <span className="text-center text-black">{item.qty}</span>
                  <span className="text-right text-black font-medium">{item.total}</span>
                </div>
              ))}

              <div className="h-[1px] bg-gray-200 my-3" />

              {/* Action Links */}
              <div className="flex justify-between items-center text-[12px] relative z-10">
                <button className="text-[#2CBDFE] font-medium">Order Details</button>
                <span className="text-[#F59E0B] font-medium">{order.status}</span>
                <button className="text-[#2CBDFE] font-medium">Show Notes</button>
              </div>

              {/* Delivery Time Bar */}
              {order.deliveryTime && (
                <div className="mt-3 -mx-4 -mb-4 bg-[#E8F5E9] border-t border-green-300 px-4 py-2.5 flex justify-between items-center rounded-b-lg">
                  <span className="text-[12px] font-semibold text-black">Delivery Time</span>
                  <span className="text-[12px] font-bold text-black">{order.deliveryTime}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Ask Quote Button */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <div className="w-full max-w-[430px] px-4 pb-4 pointer-events-auto">
          <button 
            onClick={() => navigate('/ask-quote')}
            className="w-full bg-[#ED1D24] text-white font-bold text-[16px] py-4 rounded-lg shadow-lg active:scale-[0.98] transition-transform"
          >
            Ask Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderView;
