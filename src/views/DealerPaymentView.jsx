import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, MessageCircle } from 'lucide-react';

const DealerPaymentView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* AppBar - matches Flutter */}
      <div className="bg-white h-14 flex items-center px-4 border-b">
        <button onClick={() => navigate(-1)} className="mr-3" aria-label="Go back">
          <ChevronLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-base font-medium flex-1">Dealer Payments</h1>
        <button className="mr-2" aria-label="Share on WhatsApp">
          <MessageCircle size={20} className="text-[#249B37]" />
        </button>
        <button aria-label="Share">
          <Share2 size={20} className="text-[#D32F2F]" />
        </button>
      </div>

      {/* WebView placeholder - in Flutter this loads a payment URL */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <CreditCardIcon />
          <p className="text-gray-500 mt-4 text-sm">Dealer payment page will load here</p>
          <p className="text-gray-400 text-xs mt-2">WebView loads dealer payment URL</p>
        </div>
      </div>
    </div>
  );
};

const CreditCardIcon = () => (
  <div className="w-16 h-16 mx-auto rounded-full bg-[#D32F2F]/10 flex items-center justify-center">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  </div>
);

export default DealerPaymentView;
