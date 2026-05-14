import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';

const FaqView = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      q: 'How to place an order?',
      a: 'Go to the Dashboard, click on "Place Order", select your dealer and tyres, and then click "Submit".'
    },
    {
      id: 2,
      q: 'How can I track my visits?',
      a: 'All your scheduled and completed visits are available in the "My Route" tab in the bottom navigation.'
    },
    {
      id: 3,
      q: 'What is a B2B Discount?',
      a: 'B2B discounts are special price reductions offered to high-volume dealers. You can check available discounts in the RM Dealer screen.'
    },
    {
      id: 4,
      q: 'How to raise an issue?',
      a: 'You can raise an issue from any order card or by clicking "Raise Issue" in the main menu grid.'
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* AppBar */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-gray-800 text-lg font-medium">FAQs</h1>
      </header>

      <div className="p-4 flex flex-col items-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-[#D32F2F]">
          <HelpCircle size={32} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">How can we help you?</h2>
        <p className="text-xs text-gray-500 mt-1">Search for common questions below</p>
      </div>

      <div className="flex-1 p-4 space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <span className="text-sm font-semibold text-gray-700">{faq.q}</span>
              <motion.div
                animate={{ rotate: expandedId === faq.id ? 180 : 0 }}
              >
                <ChevronDown size={18} className="text-gray-400" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqView;
