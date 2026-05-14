import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Pointer } from 'lucide-react';

const AskQuoteView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    'Requests',
    'Quote Received',
    'Your Price',
    'Final Quote',
    'Rejected'
  ];

  const requests = [
    {
      id: 'AQ-9045',
      dealer: 'Modern Tyres & Service',
      date: '12 May, 2026',
      items: [
        { name: 'MRF ZLX 165/80 R14', qty: 4, status: 'Pending Approval' }
      ]
    },
    {
      id: 'AQ-9012',
      dealer: 'Super Wheel Care',
      date: '10 May, 2026',
      items: [
        { name: 'Apollo Alnac 4G 195/55 R16', qty: 8, status: 'Quote Sent' }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* Tabs - no separate AppBar since main AppBar shows from AppShell */}
      <header className="bg-white border-b shrink-0 sticky top-0 z-10">
        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar bg-white">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === i 
                  ? 'border-[#D32F2F] text-[#D32F2F]' 
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-2.5 space-y-3">
        {activeTab === 0 ? (
          requests.map((req, index) => (
            <div key={index} className="bg-white rounded-md p-4 shadow-[0_3px_3px_rgba(30,38,60,0.15)]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-gray-400">#{req.id}</span>
                <span className="text-[10px] text-gray-400">{req.date}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-800">{req.dealer}</h3>
              <div className="mt-3 space-y-2">
                {req.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-600">{item.name} (x{item.qty})</span>
                    <span className="text-orange-500 font-bold">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <span className="text-sm">No data available for {tabs[activeTab]}</span>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/add-tyre')}
        className="absolute bottom-20 right-4 bg-[#D32F2F] text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 active:scale-95 transition-transform z-20"
      >
        <Pointer size={20} />
        <span className="font-bold text-sm">Ask Quote</span>
      </button>
    </div>
  );
};

export default AskQuoteView;
