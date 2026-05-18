import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Search, X, MapPin, Phone } from 'lucide-react';

const RmDsrView = () => {
  const navigate = useNavigate();
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const dsrList = [
    {
      id: '35890',
      type: 'Old',
      dealerName: 'BIRHMAAN TYRES SHOPPE',
      date: '2026-04-14',
      address: 'GROUND FLOOR, PLOT NO 91 G/F KH - 145/6 Najafghar nangloi road, narendra enclave, NOW SHIV NANGLOI ROAD NEAR UDASIN ASHRAM, South West Delhi, Delhi, 110043',
      visitReason: 'Payment Collection,New Order',
      interested: '',
      showroomType: '',
      phone: '9*********6',
    },
    {
      id: '7609',
      type: 'Old',
      dealerName: 'ELEGANT MARKETING AND PROMOTERS',
      date: '2026-04-14',
      address: 'A.06 RAGUBIR ENCLIVE MAIN ROAD NEAR SWASTIK HOSPITAL NAJAF GARH',
      visitReason: 'Payment',
      interested: '',
      showroomType: '',
      phone: '9*********2',
    },
    {
      id: '7610',
      type: 'New',
      dealerName: 'SHARMA TYRE POINT',
      date: '2026-04-13',
      address: 'SHOP NO 5, MAIN ROAD, DWARKA SECTOR 7, New Delhi, 110075',
      visitReason: 'New Order',
      interested: 'Yes',
      showroomType: 'Multi Brand',
      phone: '8*********4',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F2F2F2]">
      {/* Header */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3" aria-label="Go back">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-[#D32F2F] text-[17px] font-bold flex-1 text-center pr-8">RM DSR</h1>
      </header>

      {/* Filter Section */}
      <div className="bg-white border-b">
        {/* Filter Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-[15px] font-bold text-black">Filter By Date</span>
          <div className="flex items-center gap-2">
            <button 
              className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center"
              aria-label="Search"
            >
              <Search size={16} className="text-[#D32F2F]" />
            </button>
            <button 
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center"
              aria-label={isFilterExpanded ? "Close filter" : "Open filter"}
            >
              <X size={16} className="text-[#D32F2F]" />
            </button>
          </div>
        </div>

        {/* Filter Fields */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#D32F2F] mb-1.5">
                      Date From <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded text-[13px] outline-none focus:border-gray-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#D32F2F] mb-1.5">
                      Date To <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded text-[13px] outline-none focus:border-gray-400 bg-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DSR List Title */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-bold text-black">DSR List</h2>
      </div>

      {/* DSR List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
        <div className="space-y-4">
          {dsrList.map((dsr, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Card Header - ID + Type Badge */}
              <div className="flex justify-between items-center px-4 pt-3 pb-1">
                <span className="text-[11px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded">
                  #{dsr.id}
                </span>
                <span className={`text-[12px] font-bold ${
                  dsr.type === 'Old' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {dsr.type}
                </span>
              </div>

              {/* Dealer Name + Date */}
              <div className="flex justify-between items-center px-4 pb-2">
                <h3 className="text-[14px] font-bold text-black">{dsr.dealerName}</h3>
                <span className="text-[12px] text-gray-600">{dsr.date}</span>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gray-200 mx-4" />

              {/* Address */}
              <div className="flex items-start gap-2 px-4 py-3">
                <MapPin size={16} className="text-[#2CBDFE] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#2CBDFE] leading-relaxed">{dsr.address}</p>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gray-200 mx-4" />

              {/* Visit Reason / Interested / Showroom Type */}
              <div className="grid grid-cols-3 px-4 pt-3 pb-1">
                <span className="text-[11px] text-gray-400 font-medium">Visit Reason</span>
                <span className="text-[11px] text-gray-400 font-medium text-center">Interested</span>
                <span className="text-[11px] text-gray-400 font-medium text-right">Showroom Type</span>
              </div>
              <div className="grid grid-cols-3 px-4 pb-3">
                <span className="text-[12px] font-medium text-black">{dsr.visitReason || '-'}</span>
                <span className="text-[12px] font-medium text-black text-center">{dsr.interested || '-'}</span>
                <span className="text-[12px] font-medium text-black text-right">{dsr.showroomType || '-'}</span>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gray-200 mx-4" />

              {/* Phone */}
              <div className="flex justify-end py-3 px-4">
                <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-1.5 rounded-full">
                  <Phone size={14} />
                  <span className="text-[12px] font-medium">{dsr.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Add New Button */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <div className="w-full max-w-[430px] px-4 pb-4 pointer-events-auto">
          <button 
            className="w-full bg-[#ED1D24] text-white font-bold text-[16px] py-4 rounded-lg shadow-lg active:scale-[0.98] transition-transform"
          >
            Add New
          </button>
        </div>
      </div>
    </div>
  );
};

export default RmDsrView;
