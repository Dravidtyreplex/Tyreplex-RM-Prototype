import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone } from 'lucide-react';

const AskQuoteView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['Requests', 'Quote Received', 'Your Price', 'Final Quote', 'Rejected'];

  // --- Mock Data ---
  const requestsData = [
    {
      quoteId: '81557',
      dealerId: '22399',
      dealerName: 'Jiveshwar Tyres',
      date: '2026-05-18',
      items: [
        { name: 'CEAT HYTON 10.00 R20 16PR TTF', qty: 1 },
        { name: 'CEAT MILAZE LT 155 R13 TL', qty: 2 },
      ],
      message: 'Best price quote will be shared soon',
    },
    {
      quoteId: '81556',
      dealerId: '31090',
      dealerName: 'Tyre Czar',
      date: '2026-05-16',
      items: [
        { name: 'MRF NYLOGRIP FE PLUS 90/100-10 TL Front/Rear', qty: 3 },
      ],
      message: 'Best price quote will be shared soon',
    },
    {
      quoteId: '81555',
      dealerId: '31090',
      dealerName: 'Tyre Czar',
      date: '2026-05-16',
      items: [
        { name: 'Pirelli P ZERO 265/40 R21 101Y PI NO', qty: 2 },
      ],
      message: 'Best price quote will be shared soon',
    },
  ];

  const quoteReceivedData = [
    {
      quoteId: '81538',
      dealerId: '36662',
      dealerName: 'M/S KRISHNA TYRE ZONE',
      date: '2026-04-15',
      items: [
        { name: 'Bridgestone DUELER D693 265/65 R17 112 S TL', tpPrice: '₹12,400', qty: 4, dot: 'DOT: 2025' },
      ],
    },
    {
      quoteId: '81541',
      dealerId: '29626',
      dealerName: 'Balaji tyre house',
      date: '2026-04-15',
      items: [
        { name: 'Apollo AMAZER 4G LIFE 165/70 R14 81T TL', tpPrice: '₹2,825', qty: 10 },
      ],
    },
    {
      quoteId: '81518',
      dealerId: '31004',
      dealerName: 'Singh Tyres',
      date: '2026-04-15',
      items: [
        { name: 'MRF TRIPLE PLUS 4.00-8 N4 TT', tpPrice: '₹1,250', qty: 25 },
      ],
    },
  ];

  const yourPriceData = [
    {
      quoteId: '81526',
      dealerId: '17199',
      dealerName: 'Preet Tyres',
      date: '2026-04-15',
      items: [
        { name: 'JK Tyre Ultima Neo 155/80 R13 79S TL', tpPrice: '₹2,975', yourPrice: '₹2,750', qty: 5 },
      ],
      message: 'Price shared and is under moderation',
    },
    {
      quoteId: '81495',
      dealerId: '20308',
      dealerName: 'The Pit stop',
      date: '2026-04-15',
      items: [
        { name: 'JK Tyre UX ROYALE 205/65 R16 TL 95 H', tpPrice: '₹4,850', yourPrice: '₹4,750', qty: 1 },
        { name: 'JK Tyre UX ROYALE 175/65 R15 84 H TL', tpPrice: '₹3,670', yourPrice: '₹3,500', qty: 6 },
      ],
      message: 'Price shared and is under moderation',
      hasViewMore: true,
    },
  ];

  const finalQuoteData = [
    {
      quoteId: '81552',
      dealerId: '34208',
      dealerName: 'Santosh Tyres House',
      date: '2026-04-23',
      items: [
        { name: 'MRF Wanderer Street-A1 235/60 R18 103H TL', tpPrice: '₹8,978', yourPrice: '₹2,100', finalPrice: '₹8,978', qty: 1 },
      ],
    },
    {
      quoteId: '81549',
      dealerId: '173467',
      dealerName: 'new test',
      date: '2026-04-20',
      items: [
        { name: 'MRF NYLOGRIP PLUS V2 N6 3.00-18 TL Rear', tpPrice: '₹1,098', yourPrice: '₹2,800', finalPrice: '₹1,098', qty: 1 },
      ],
    },
  ];

  const rejectedData = [
    {
      quoteId: '81337',
      dealerId: '36662',
      dealerName: 'M/S KRISHNA TYRE ZONE',
      date: '2026-04-13',
      items: [
        { name: 'Bridgestone DUELER D693 265/65 R17 112 S TL', tpPrice: '₹12,500', yourPrice: '₹11,000', qty: 4 },
      ],
      reason: 'Duplicate Order Placed',
    },
    {
      quoteId: '81534',
      dealerId: '22774',
      dealerName: 'Tyre Express',
      date: '2026-04-15',
      items: [
        { name: 'JK Tyre STEEL KING 215/75 R15 TL 115S', tpPrice: '₹0', yourPrice: 'N/A', qty: 4 },
      ],
      reason: 'Stock not available',
    },
  ];

  // --- Render Functions ---
  const renderRequests = () => (
    <div className="space-y-4">
      {requestsData.map((item, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Quote ID tab */}
          <div className="px-4 pt-3">
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{item.quoteId}</span>
          </div>
          {/* Dealer info */}
          <div className="flex justify-between items-center px-4 pt-2 pb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-gray-400">#{item.dealerId}</span>
              <span className="text-[14px] font-bold text-black">{item.dealerName}</span>
            </div>
            <span className="text-[12px] text-gray-600">{item.date}</span>
          </div>
          <div className="h-[1px] bg-gray-200 mx-4" />
          {/* Table header */}
          <div className="grid grid-cols-2 px-4 pt-3 pb-1">
            <span className="text-[11px] text-gray-400">Product Name</span>
            <span className="text-[11px] text-gray-400 text-right">Quantity</span>
          </div>
          {/* Items */}
          {item.items.map((product, i) => (
            <div key={i} className="grid grid-cols-2 px-4 pb-2">
              <span className="text-[12px] font-medium text-black">{product.name}</span>
              <span className="text-[12px] font-medium text-black text-right">{product.qty}</span>
            </div>
          ))}
          <div className="h-[1px] bg-gray-200 mx-4" />
          {/* Message */}
          <div className="px-4 py-3 text-center">
            <span className="text-[12px] font-medium text-green-600">{item.message}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderQuoteReceived = () => (
    <div className="space-y-4">
      {quoteReceivedData.map((item, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 pt-3">
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{item.quoteId}</span>
          </div>
          <div className="flex justify-between items-center px-4 pt-2 pb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-gray-400">#{item.dealerId}</span>
              <span className="text-[14px] font-bold text-black">{item.dealerName}</span>
            </div>
            <span className="text-[12px] text-gray-600">{item.date}</span>
          </div>
          <div className="h-[1px] bg-gray-200 mx-4" />
          <div className="grid grid-cols-2 px-4 pt-3 pb-1">
            <span className="text-[11px] text-gray-400">Product Name</span>
            <span className="text-[11px] text-gray-400 text-right">TP Price</span>
          </div>
          {item.items.map((product, i) => (
            <div key={i} className="px-4 pb-2">
              <div className="grid grid-cols-2">
                <span className="text-[12px] font-medium text-black">{product.name}</span>
                <span className="text-[12px] font-medium text-black text-right">{product.tpPrice}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-gray-500">Qty: {product.qty}</span>
                {product.dot && (
                  <span className="text-[10px] border border-gray-300 px-2 py-0.5 rounded">{product.dot}</span>
                )}
              </div>
            </div>
          ))}
          <div className="h-[1px] bg-gray-200 mx-4" />
          {/* Action buttons */}
          <div className="flex items-center gap-2 px-4 py-3">
            <button className="flex-1 py-2.5 border border-[#ED1D24] rounded-lg text-[13px] font-bold text-[#ED1D24] text-center">
              Reject
            </button>
            <button className="flex-1 py-2.5 bg-green-600 rounded-lg text-[13px] font-bold text-white text-center">
              Confirm
            </button>
            <button className="flex-1 py-2.5 border border-[#ED1D24] rounded-lg text-[13px] font-bold text-[#ED1D24] text-center">
              Edit & Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderYourPrice = () => (
    <div className="space-y-4">
      {yourPriceData.map((item, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 pt-3">
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{item.quoteId}</span>
          </div>
          <div className="flex justify-between items-center px-4 pt-2 pb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-gray-400">#{item.dealerId}</span>
              <span className="text-[14px] font-bold text-black">{item.dealerName}</span>
            </div>
            <span className="text-[12px] text-gray-600">{item.date}</span>
          </div>
          <div className="h-[1px] bg-gray-200 mx-4" />
          <div className="grid grid-cols-3 px-4 pt-3 pb-1">
            <span className="text-[11px] text-gray-400">Product Name</span>
            <span className="text-[11px] text-gray-400 text-center">TP Price</span>
            <span className="text-[11px] text-gray-400 text-right">Your Price</span>
          </div>
          {item.items.map((product, i) => (
            <div key={i} className="px-4 pb-2">
              <div className="grid grid-cols-3">
                <span className="text-[12px] font-medium text-black">{product.name}</span>
                <span className="text-[12px] font-medium text-black text-center">{product.tpPrice}</span>
                <span className="text-[12px] font-medium text-black text-right">{product.yourPrice}</span>
              </div>
              <span className="text-[11px] text-gray-500">Qty: {product.qty}</span>
            </div>
          ))}
          {item.hasViewMore && (
            <div className="px-4 pb-2">
              <button className="text-[12px] text-gray-500 flex items-center gap-1">
                View More <span>▼</span>
              </button>
            </div>
          )}
          <div className="h-[1px] bg-gray-200 mx-4" />
          <div className="px-4 py-3 text-center">
            <span className="text-[12px] font-medium text-[#ED1D24]">{item.message}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFinalQuote = () => (
    <div className="space-y-4">
      {finalQuoteData.map((item, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 pt-3">
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{item.quoteId}</span>
          </div>
          <div className="flex justify-between items-center px-4 pt-2 pb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-gray-400">#{item.dealerId}</span>
              <span className="text-[14px] font-bold text-black">{item.dealerName}</span>
            </div>
            <span className="text-[12px] text-gray-600">{item.date}</span>
          </div>
          <div className="h-[1px] bg-gray-200 mx-4" />
          <div className="grid grid-cols-4 px-4 pt-3 pb-1">
            <span className="text-[11px] text-gray-400">Product Name</span>
            <span className="text-[11px] text-gray-400 text-center">TP Price</span>
            <span className="text-[11px] text-gray-400 text-center">Your Price</span>
            <span className="text-[11px] text-gray-400 text-right">Final Price</span>
          </div>
          {item.items.map((product, i) => (
            <div key={i} className="px-4 pb-2">
              <div className="grid grid-cols-4">
                <span className="text-[12px] font-medium text-black">{product.name}</span>
                <span className="text-[12px] font-medium text-black text-center">{product.tpPrice}</span>
                <span className="text-[12px] font-medium text-black text-center">{product.yourPrice}</span>
                <span className="text-[12px] font-medium text-black text-right">{product.finalPrice}</span>
              </div>
              <span className="text-[11px] text-gray-500">Qty: {product.qty}</span>
            </div>
          ))}
          <div className="h-[1px] bg-gray-200 mx-4" />
          <div className="flex justify-between items-center px-4 py-3">
            <button className="text-[12px] font-medium text-[#2CBDFE]">Show History</button>
            <button className="px-4 py-2 bg-[#ED1D24] rounded-lg text-[12px] font-bold text-white">
              Create B2B Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRejected = () => (
    <div className="space-y-4">
      {rejectedData.map((item, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 pt-3">
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{item.quoteId}</span>
          </div>
          <div className="flex justify-between items-center px-4 pt-2 pb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-gray-400">#{item.dealerId}</span>
              <span className="text-[14px] font-bold text-black">{item.dealerName}</span>
            </div>
            <span className="text-[12px] text-gray-600">{item.date}</span>
          </div>
          <div className="h-[1px] bg-gray-200 mx-4" />
          <div className="grid grid-cols-3 px-4 pt-3 pb-1">
            <span className="text-[11px] text-gray-400">Product Name</span>
            <span className="text-[11px] text-gray-400 text-center">TP Price</span>
            <span className="text-[11px] text-gray-400 text-right">Your Price</span>
          </div>
          {item.items.map((product, i) => (
            <div key={i} className="px-4 pb-2">
              <div className="grid grid-cols-3">
                <span className="text-[12px] font-medium text-black">{product.name}</span>
                <span className="text-[12px] font-medium text-black text-center">{product.tpPrice}</span>
                <span className="text-[12px] font-medium text-black text-right">{product.yourPrice}</span>
              </div>
              <span className="text-[11px] text-gray-500">Qty: {product.qty}</span>
            </div>
          ))}
          <div className="h-[1px] bg-gray-200 mx-4" />
          {/* Rejected status + Re-Ask */}
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-[13px] font-bold text-[#ED1D24]">Order Rejected</span>
            <button className="px-4 py-2 border border-[#ED1D24] rounded-lg text-[12px] font-bold text-[#ED1D24]">
              Re-Ask Quote
            </button>
          </div>
          <div className="h-[1px] bg-gray-200 mx-4" />
          <div className="px-4 py-2">
            <span className="text-[12px] text-gray-600">Reason: {item.reason}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return renderRequests();
      case 1: return renderQuoteReceived();
      case 2: return renderYourPrice();
      case 3: return renderFinalQuote();
      case 4: return renderRejected();
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F2F2]">
      {/* Header */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="mr-3" aria-label="Go back">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-[#D32F2F] text-[17px] font-bold flex-1 text-center pr-8">Ask Quote</h1>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b shrink-0 sticky top-14 z-10">
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === i
                  ? 'border-[#D32F2F] text-[#D32F2F]'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 no-scrollbar">
        {renderTabContent()}
      </div>

      {/* Floating Ask Quote Button */}
      <div className="absolute bottom-6 right-4 z-20">
        <button
          onClick={() => navigate('/add-tyre')}
          className="bg-[#ED1D24] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Phone size={18} />
          <span className="font-bold text-[13px]">Ask Quote</span>
        </button>
      </div>
    </div>
  );
};

export default AskQuoteView;
