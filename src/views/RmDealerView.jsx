import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, MapPin, 
  Phone, Edit2, Trophy, RotateCcw, Banknote, Calendar, Upload, 
  X, ChevronDown, CheckCircle2, Circle, Target, User
} from 'lucide-react';

const BottomSheet = ({ isOpen, onClose, title, subtitle, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div key="bottom-sheet-wrapper" className="fixed inset-0 z-[100] flex flex-col justify-end items-center">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />
        <motion.div 
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative bg-white rounded-t-[25px] flex flex-col max-h-[90vh] overflow-hidden w-full max-w-[430px]"
        >
          <div className="p-4 border-b border-[#E0E0E0] relative flex flex-col items-center">
            <div className="w-[50px] h-1 bg-[#D9D9D9] rounded-full mb-4" />
            <div className="w-full flex justify-between items-start px-1">
              <div>
                <h3 className="text-[18px] font-bold text-black">{title}</h3>
                {subtitle && <p className="text-[12px] text-[#627085] mt-1 uppercase">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="p-1.5 bg-[#F7F9FA] rounded-full text-[#627085] hover:bg-gray-200">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 no-scrollbar bg-white">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const RmDealerView = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  
  // Bottom Sheet States
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLogPaymentOpen, setIsLogPaymentOpen] = useState(false);
  const [isCancelVisitOpen, setIsCancelVisitOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [selectedDealer, setSelectedDealer] = useState(null);
  
  // Form States
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  // Filter Form States
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterDealerName, setFilterDealerName] = useState('');
  const [filterMobile, setFilterMobile] = useState('');

  // Schedule Visit States
  const [schedulePaymentMode, setSchedulePaymentMode] = useState('Cash');
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleTimeSlot, setScheduleTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [scheduleAmount, setScheduleAmount] = useState('');

  // Edit Form States
  const [editFormData, setEditFormData] = useState({});

  const [dealers, setDealers] = useState([
    {
      id: '1208432',
      name: 'VANSUN VENTURES PRIVATE LIMITED (Haryana)',
      location: 'ARDEE CITY BINDAPUR WAZIRABAD',
      contact: 'Nihal jatav',
      mobile: '9876543210',
      due: '11,400',
      creditPeriod: '30 DAYS',
      rewards: {
        unlocked: '2500',
        nextTier: 'Gold Tier',
        nextTierReward: '7,000',
        progressText: '₹4.8L/₹5.0L',
        progressPercent: 96,
        needMore: 'Need ₹20,000 more sales to unlock',
      },
      performance: { achieved: '0%', totalAmount: '0' },
      visitScheduled: null
    },
    {
      id: '1208433',
      name: 'TYRE ZONE',
      location: 'ARDEE CITY BINDAPUR WAZIRABAD',
      contact: 'Nihal jatav',
      mobile: '8765432109',
      due: '11,400',
      creditPeriod: '30 DAYS',
      rewards: {
        unlocked: '2500',
        nextTier: 'Gold Tier',
        nextTierReward: '7,000',
        progressText: '₹4.8L/₹5.0L',
        progressPercent: 96,
        needMore: 'Need ₹20,000 more sales to unlock',
      },
      performance: { achieved: '0%', totalAmount: '0' },
      visitScheduled: {
        date: 'Thu, Jan 8',
        time: '09:00 AM',
        toCollect: '23,290',
        mode: 'CASH',
        totalPending: '11,250'
      }
    }
  ]);

  // --- Handlers ---
  const openLogPayment = (dealer) => {
    setSelectedDealer(dealer);
    setPaymentAmount('');
    setIsLogPaymentOpen(true);
  };

  const handleLogPaymentSubmit = () => {
    if (!selectedDealer || !paymentAmount) return;
    
    // Simulate updating the due amount and clearing the scheduled visit
    setDealers(dealers.map(d => {
      if (d.id === selectedDealer.id) {
        const currentDue = parseInt(d.due.replace(/,/g, ''));
        const newDue = Math.max(0, currentDue - parseInt(paymentAmount)).toLocaleString('en-IN');
        return { 
          ...d, 
          due: newDue,
          visitScheduled: null 
        };
      }
      return d;
    }));
    setIsLogPaymentOpen(false);
  };

  const openCancelVisit = (dealer) => {
    setSelectedDealer(dealer);
    setCancelReason('');
    setIsCancelVisitOpen(true);
  };

  const handleCancelVisitSubmit = () => {
    if (!selectedDealer || !cancelReason) return;
    setDealers(dealers.map(d => {
      if (d.id === selectedDealer.id) {
        return { ...d, visitScheduled: null }; // Removes the scheduled visit
      }
      return d;
    }));
    setIsCancelVisitOpen(false);
  };

  const openRewards = (dealer) => {
    setSelectedDealer(dealer);
    setIsRewardsOpen(true);
  };

  const openSchedule = (dealer) => {
    setSelectedDealer(dealer);
    setIsScheduleOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (!selectedDealer) return;
    
    let dateStr = 'Thu, Jan 8';
    if (scheduleDate === 'Tomorrow') dateStr = 'Fri, Jan 9';
    if (scheduleDate === 'Pick Date') dateStr = 'Mon, Jan 12';

    setDealers(dealers.map(d => {
      if (d.id === selectedDealer.id) {
        return { 
          ...d, 
          visitScheduled: { 
            date: dateStr, 
            time: scheduleTimeSlot,
            toCollect: scheduleAmount || '0',
            mode: schedulePaymentMode.toUpperCase(),
            totalPending: d.due
          }
        };
      }
      return d;
    }));
    setIsScheduleOpen(false);
  };

  const openEdit = (dealer) => {
    setSelectedDealer(dealer);
    setEditFormData({
      name: dealer.name,
      contact: dealer.contact,
      mobile: dealer.mobile || 'N/A',
      location: dealer.location,
      city: 'Gurgaon',
      pincode: '560001',
      dealerType: 'Tyre Dealer',
      outletType: 'Multi Brand Outlet',
      authorisedDealer: 'Michelin',
      brandOutletNames: 'Apollo',
      vehicleCategories: ['Car', 'Bike'],
      otherServices: 'Wheel Alignment',
      avgMonthlySales: '50000',
      currentStatus: 'Open'
    });
    setIsEditOpen(true);
  };

  const toggleCategory = (cat) => {
    setEditFormData(prev => {
      const cats = prev.vehicleCategories || [];
      return {
        ...prev,
        vehicleCategories: cats.includes(cat) 
          ? cats.filter(c => c !== cat) 
          : [...cats, cat]
      };
    });
  };

  const handleEditSubmit = () => {
    if (!selectedDealer) return;
    setDealers(dealers.map(d => {
      if (d.id === selectedDealer.id) {
        return { 
          ...d, 
          name: editFormData.name,
          contact: editFormData.contact,
          mobile: editFormData.mobile,
          location: editFormData.location
        };
      }
      return d;
    }));
    setIsEditOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F7] relative overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-[#F4F5F7] h-14 flex items-center px-4 shrink-0 z-10 relative">
        <button onClick={() => navigate(-1)} className="mr-3 p-1" aria-label="Go back">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-[18px] font-bold flex-1 text-center pr-10 text-gray-900">RM Dealers</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 relative z-0 no-scrollbar">
        {/* Date Selector */}
        <div className="flex justify-center my-2">
          <div className="flex items-center border border-gray-400 rounded-lg px-3 py-1.5 bg-transparent">
            <button aria-label="Previous month"><ChevronLeft size={18} className="text-gray-600" /></button>
            <span className="mx-6 text-[14px] font-bold text-[#D32F2F]">Jan, 2025</span>
            <button aria-label="Next month"><ChevronRight size={18} className="text-gray-600" /></button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="flex gap-3 mb-5 mt-4">
          <div className="flex-1 bg-white rounded-xl border border-[#E0E0E0] p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <Target size={16} className="text-[#D32F2F]" />
              </div>
              <div className="text-right">
                <p className="text-[12px] font-semibold text-[#D32F2F]">Target Added</p>
                <p className="text-[11px] font-bold text-[#D32F2F]">(50%)</p>
              </div>
            </div>
            <div className="flex items-baseline mt-1">
              <span className="text-[18px] font-black text-black tracking-tight">₹ 25,00,00</span>
            </div>
            <div className="text-[12px] font-bold text-gray-500">/ 50L</div>
          </div>
          
          <div className="flex-1 bg-white rounded-xl border border-[#E0E0E0] p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#059669] font-bold">
                ₹
              </div>
              <div className="text-right">
                <p className="text-[12px] font-semibold text-[#059669]">Collection</p>
                <p className="text-[11px] font-bold text-[#059669]">(20%)</p>
              </div>
            </div>
            <div className="flex items-baseline mt-1">
              <span className="text-[18px] font-black text-black tracking-tight">₹ 10,00,00</span>
            </div>
            <div className="text-[12px] font-bold text-gray-500">/ 47.5L</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by dealer id....."
              className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-lg text-[13px] font-medium bg-transparent focus:outline-none focus:border-blue-500"
            />
          </div>
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)} 
            className={`h-11 px-5 rounded-lg flex items-center gap-2 text-[13px] font-bold ${
              isFiltersOpen 
                ? 'bg-black text-white' 
                : 'border border-gray-300 bg-transparent text-gray-700'
            }`}
          >
            {isFiltersOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
            Filters
          </button>
        </div>

        {/* Inline Filter Card */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white rounded-[16px] border border-gray-200 p-5 shadow-sm">
                <h4 className="text-[16px] font-bold text-black mb-4">Filter By Date</h4>
                
                {/* Date From & Date To */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-[#627085] mb-1.5">
                      Date from <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="w-full h-11 px-3 border border-gray-200 rounded-lg text-[13px] font-medium bg-[#F9FAFB] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-[#627085] mb-1.5">
                      Date to <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="w-full h-11 px-3 border border-gray-200 rounded-lg text-[13px] font-medium bg-[#F9FAFB] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Dealer Name & Mobile No */}
                <div className="flex gap-3 mb-6">
                  <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-[#627085] mb-1.5">Dealer Name</label>
                    <input
                      type="text"
                      value={filterDealerName}
                      onChange={(e) => setFilterDealerName(e.target.value)}
                      placeholder="Enter Your Dealer id"
                      className="w-full h-11 px-3 border border-gray-200 rounded-lg text-[13px] font-medium bg-[#F9FAFB] focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-[#627085] mb-1.5">Mobile No.</label>
                    <input
                      type="tel"
                      value={filterMobile}
                      onChange={(e) => setFilterMobile(e.target.value)}
                      placeholder="Enter Your Mobile Number"
                      className="w-full h-11 px-3 border border-gray-200 rounded-lg text-[13px] font-medium bg-[#F9FAFB] focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => {
                      setFilterDateFrom('');
                      setFilterDateTo('');
                      setFilterDealerName('');
                      setFilterMobile('');
                    }}
                    className="text-[14px] font-bold text-[#627085]"
                  >
                    Reset All
                  </button>
                  <button 
                    onClick={() => setIsFiltersOpen(false)}
                    className="bg-black text-white px-8 py-3 rounded-[12px] text-[14px] font-bold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dealer Assigned Count */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px] font-bold text-black">Dealer Assigned</h2>
          <span className="bg-gray-200 text-black text-[11px] font-bold px-2 py-0.5 rounded-md">25</span>
        </div>

        {/* Dealer Cards */}
        <div className="space-y-4">
          {dealers.map((dealer, index) => (
            <div key={index} className="bg-white rounded-[16px] border border-gray-200 p-4 shadow-sm relative pt-6">
              {/* ID */}
              <div className="absolute top-4 left-4 text-[10px] font-semibold text-[#627085]">
                #ID:{dealer.id}
              </div>

              {/* Name & Location */}
              <div className="mt-3 mb-4">
                <div className="flex items-start gap-2">
                  <h3 className="text-[15px] font-bold text-black leading-snug tracking-tight">
                    {dealer.name}
                  </h3>
                  {/* EDIT ICON CLICK ATTACHED */}
                  <button onClick={() => openEdit(dealer)} className="p-1 bg-gray-100 rounded-full shrink-0 mt-0.5">
                    <Edit2 size={12} className="text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin size={12} className="text-gray-400 shrink-0" />
                  <span className="text-[11px] font-semibold text-[#627085] uppercase tracking-wide">{dealer.location}</span>
                </div>
              </div>

              {/* Contact & Due */}
              <div className="flex justify-between items-start mb-5 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-[12px] font-semibold text-[#627085] mb-1">Contact</p>
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-gray-400" />
                    <span className="text-[13px] font-medium text-black">{dealer.contact}</span>
                    <button className="ml-1"><Phone size={14} className="text-blue-600" /></button>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-[12px] font-semibold text-[#627085] mb-0.5">Total Due</p>
                  <p className="text-[18px] font-black text-[#ED1D24] tracking-tight">₹{dealer.due}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="border border-blue-200 bg-blue-50 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded flex items-center">
                      LEDGER
                    </div>
                    <span className="text-[8px] font-bold text-[#627085] bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
                      CREDIT PERIOD: {dealer.creditPeriod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rewards Tracker */}
              <div className="bg-[#F8F9FA] rounded-[12px] p-3 mb-5 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <Trophy size={14} className="text-gray-500" />
                    <span className="text-[12px] font-bold text-[#627085]">Dealer Rewards Tracker</span>
                  </div>
                  <button onClick={() => openRewards(dealer)} className="text-[11px] font-bold text-[#627085] flex items-center">
                    View Tiers <ChevronRight size={12} className="ml-0.5" />
                  </button>
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-[11px] font-semibold text-[#627085] mr-1">Unlocked:</span>
                  <span className="text-[12px] font-black text-black">₹ {dealer.rewards.unlocked}</span>
                </div>
                
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-[10px] font-bold text-black">Next: {dealer.rewards.nextTier} (₹{dealer.rewards.nextTierReward})</span>
                  <span className="text-[10px] font-bold text-black">{dealer.rewards.progressText}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-[#2563EB] h-2 rounded-full" style={{ width: `${dealer.rewards.progressPercent}%` }}></div>
                </div>
                <p className="text-[10px] font-medium text-[#627085]">{dealer.rewards.needMore}</p>
              </div>

              {/* Nov Performance */}
              <div className="mb-5">
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[12px] font-bold text-[#627085]">Nov Performance</span>
                  <RotateCcw size={12} className="text-[#627085]" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-semibold text-[#627085] mb-1">Target</p>
                    <button className="text-[11px] font-bold text-blue-600">+ Set Target</button>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-semibold text-[#627085] mb-1">Achieved</p>
                    <p className="text-[13px] font-black text-black">{dealer.performance.achieved}</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-2.5 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-semibold text-[#627085] mb-1">Total Amount</p>
                    <p className="text-[13px] font-black text-black">{dealer.performance.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {dealer.visitScheduled ? (
                // State: Visit Scheduled
                <div className="space-y-3">
                  <div className="rounded-[12px] border border-[#F97316] p-3 relative bg-white shadow-sm overflow-hidden">
                     {/* Orange accent line */}
                     <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#F97316]" />
                     
                     <div className="flex justify-between items-start pl-2">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg border border-orange-100 flex items-center justify-center">
                            <Calendar size={16} className="text-[#F97316]" />
                         </div>
                         <div>
                            <h4 className="text-[13px] font-bold text-[#F97316]">Visit Schedule</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                               <span className="text-[11px] font-bold text-black">{dealer.visitScheduled.date}</span>
                               <span className="text-[10px] font-bold bg-orange-50 border border-orange-200 text-orange-700 px-1.5 py-0.5 rounded">
                                 {dealer.visitScheduled.time}
                               </span>
                            </div>
                         </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => openSchedule(dealer)} className="w-7 h-7 rounded-full border border-orange-200 flex items-center justify-center"><Edit2 size={12} className="text-[#F97316]" /></button>
                          <button onClick={() => openCancelVisit(dealer)} className="w-7 h-7 rounded-full border border-orange-200 flex items-center justify-center"><X size={14} className="text-[#F97316]" /></button>
                       </div>
                     </div>
                     
                     <div className="flex justify-between items-center mt-4 pl-2 border-t border-orange-100 pt-3">
                        <div>
                          <p className="text-[10px] font-semibold text-[#627085] mb-0.5">To Collect <span className="bg-orange-50 border border-orange-200 text-orange-700 px-1 py-0.5 rounded-[4px] ml-1 text-[8px]">{dealer.visitScheduled.mode}</span></p>
                          <p className="text-[13px] font-black text-black">₹{dealer.visitScheduled.toCollect}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-semibold text-[#627085] mb-0.5">Total Pending</p>
                          <p className="text-[13px] font-black text-black">₹{dealer.visitScheduled.totalPending}</p>
                        </div>
                     </div>
                  </div>
                  
                  <button className="w-full bg-[#FEF2F2] border border-[#FCA5A5] text-[#ED1D24] py-3.5 rounded-[12px] flex items-center justify-center gap-2 font-bold text-[13px]">
                    <Banknote size={16} /> Pending Payment Details
                  </button>
                  <button onClick={() => openLogPayment(dealer)} className="w-full bg-[#ED1D24] text-white py-3.5 rounded-[12px] flex items-center justify-center gap-2 font-bold text-[13px] shadow-sm">
                    <Banknote size={16} /> Log Payment
                  </button>
                </div>
              ) : (
                // State: No Visit Scheduled
                <div className="space-y-3">
                  <button className="w-full bg-[#FEF2F2] border border-[#FCA5A5] text-[#ED1D24] py-3.5 rounded-[12px] flex items-center justify-center gap-2 font-bold text-[13px]">
                    <Banknote size={16} /> Pending Payment Details
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => openLogPayment(dealer)} className="flex-1 bg-[#ED1D24] text-white py-3.5 rounded-[12px] flex items-center justify-center gap-2 font-bold text-[13px] shadow-sm">
                      <Banknote size={16} /> Log Payment
                    </button>
                    <button onClick={() => openSchedule(dealer)} className="flex-1 bg-white border border-gray-300 text-black py-3.5 rounded-[12px] flex items-center justify-center gap-2 font-bold text-[13px]">
                      <Calendar size={16} /> Schedule Visit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM SHEETS --- */}

      {/* 1. Log Payment Bottom Sheet */}
      <BottomSheet isOpen={isLogPaymentOpen} onClose={() => setIsLogPaymentOpen(false)} title="Log Payment">
        <div className="space-y-5">
          {/* Payment Mode */}
          <div>
            <label className="block text-[13px] font-bold text-black mb-2">Payment Mode <span className="text-[#ED1D24]">*</span></label>
            <div className="flex gap-3">
              {['Cash', 'Online', 'Cheque'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`flex-1 py-3 rounded-[10px] text-[13px] font-semibold border ${
                    paymentMode === mode ? 'border-[#ED1D24] text-[#ED1D24]' : 'border-gray-300 text-gray-600'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Collected */}
          <div>
            <label className="block text-[13px] font-bold text-black mb-2">Amount Collected <span className="text-[#ED1D24]">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input 
                type="number" 
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter Amount" 
                className="w-full pl-9 pr-4 py-3.5 rounded-[10px] border border-gray-300 text-[14px] font-medium focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Payment Proof */}
          <div>
            <label className="block text-[13px] font-bold text-black mb-2">Payment Proof <span className="text-[#ED1D24]">*</span></label>
            <div className="border-2 border-dashed border-gray-300 rounded-[12px] py-8 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer">
              <Upload size={24} className="text-gray-500 mb-2" />
              <p className="text-[14px] font-bold text-black">Click To Upload</p>
              <p className="text-[10px] text-gray-400 font-medium mt-1">SVG, PNG, JPG, PDF</p>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-[13px] font-bold text-black mb-2">Remarks</label>
            <textarea 
              rows="3" 
              placeholder="Add your Remarks Here" 
              className="w-full p-4 rounded-[10px] border border-gray-300 text-[13px] resize-none focus:outline-none focus:border-black"
            ></textarea>
          </div>

          <button 
            onClick={handleLogPaymentSubmit}
            className={`w-full py-4 rounded-[12px] text-[15px] font-bold text-white transition-colors ${
              paymentAmount ? 'bg-[#708090] active:scale-95' : 'bg-[#708090] opacity-90'
            }`}
          >
            Submit
          </button>
        </div>
      </BottomSheet>

      {/* 2. Cancel Visit Bottom Sheet */}
      <BottomSheet isOpen={isCancelVisitOpen} onClose={() => setIsCancelVisitOpen(false)} title="Cancel Visit">
        <div className="space-y-5 pb-4">
          <div>
            <label className="block text-[13px] font-bold text-black mb-2">Reason for Cancellation <span className="text-[#ED1D24]">*</span></label>
            <div className="relative">
              <select 
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded-[10px] px-4 py-3.5 text-[14px] text-gray-500 focus:outline-none focus:border-black outline-none bg-white"
              >
                <option value="" disabled>Select a Reason</option>
                <option value="Dealer Not Available">Dealer Not Available</option>
                <option value="Shop Closed">Shop Closed</option>
                <option value="Rescheduled">Rescheduled by Dealer</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-black mb-2">Remarks</label>
            <textarea 
              rows="4" 
              placeholder="Add your Remarks Here" 
              className="w-full p-4 rounded-[10px] border border-gray-300 text-[13px] resize-none focus:outline-none focus:border-black"
            ></textarea>
          </div>

          <button 
            onClick={handleCancelVisitSubmit}
            className="w-full bg-[#708090] text-white py-4 rounded-[12px] text-[15px] font-bold mt-2 active:scale-95"
          >
            Submit
          </button>
        </div>
      </BottomSheet>

      {/* 3. Dealer Rewards Tracker Bottom Sheet */}
      <BottomSheet isOpen={isRewardsOpen} onClose={() => setIsRewardsOpen(false)} title="Dealer Rewards Tracker" subtitle={selectedDealer?.name}>
        <div className="space-y-6 pb-4">
          
          {/* Cars/2W Rewards Tracker */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
                <h4 className="text-[14px] font-bold text-black">Cars/2W Rewards Tracker</h4>
              </div>
              <span className="text-[12px] font-medium text-[#627085]">Sales: <strong className="text-black font-black">₹4.8L</strong></span>
            </div>

            <div className="relative border-l border-dashed border-gray-300 ml-[11px] pl-6 space-y-6 pb-2">
              {/* Silver Tier */}
              <div className="relative">
                <div className="absolute -left-[35px] top-0 bg-white p-0.5">
                  <CheckCircle2 size={20} className="text-[#059669] fill-green-50" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-[13px] font-bold text-black">Silver Tier (₹4L)</h5>
                    <p className="text-[10px] font-medium text-[#627085] mt-0.5">Reward: ₹ 5,000</p>
                  </div>
                  <span className="bg-green-100 text-[#059669] text-[10px] font-bold px-2 py-1 rounded">Unlocked</span>
                </div>
              </div>

              {/* Gold Tier */}
              <div className="relative">
                <div className="absolute -left-[35px] top-0 bg-white p-0.5">
                  <div className="w-5 h-5 rounded-full border-[2px] border-[#2563EB] flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-[13px] font-bold text-black">Gold Tier (₹5L)</h5>
                    <p className="text-[10px] font-medium text-[#627085] mt-0.5">Reward: ₹ 7,000</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[8px] font-bold text-[#627085] mb-1">₹20K needed</p>
                     <div className="flex h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                       <div className="bg-[#2563EB] w-[80%] h-full"></div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Diamond Tier */}
              <div className="relative">
                <div className="absolute -left-[35px] top-0 bg-white p-0.5">
                  <Circle size={20} className="text-gray-300" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-[13px] font-bold text-gray-500">Diamond Tier (₹7L)</h5>
                    <p className="text-[10px] font-medium text-[#627085] mt-0.5">Reward: ₹ 7,000</p>
                  </div>
                  <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1 rounded">Locked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 w-full my-6"></div>

          {/* Bus & Truck Rewards Tracker */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
                <h4 className="text-[14px] font-bold text-black">Bus & Truck</h4>
              </div>
              <span className="text-[12px] font-medium text-[#627085]">Sales: <strong className="text-black font-black">₹3.8L</strong></span>
            </div>

             <div className="relative border-l border-dashed border-gray-300 ml-[11px] pl-6 space-y-6 pb-2">
              <div className="relative">
                <div className="absolute -left-[35px] top-0 bg-white p-0.5"><CheckCircle2 size={20} className="text-[#059669] fill-green-50" /></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-[13px] font-bold text-black">Silver Tier (₹4L)</h5>
                    <p className="text-[10px] font-medium text-[#627085] mt-0.5">Reward: ₹ 5,000</p>
                  </div>
                  <span className="bg-green-100 text-[#059669] text-[10px] font-bold px-2 py-1 rounded">Unlocked</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-0 bg-white p-0.5">
                   <div className="w-5 h-5 rounded-full border-[2px] border-[#2563EB] flex items-center justify-center"><div className="w-2 h-2 bg-[#2563EB] rounded-full"></div></div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-[13px] font-bold text-black">Gold Tier (₹5L)</h5>
                    <p className="text-[10px] font-medium text-[#627085] mt-0.5">Reward: ₹ 7,000</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[8px] font-bold text-[#627085] mb-1">₹20K needed</p>
                     <div className="flex h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden"><div className="bg-[#2563EB] w-[80%] h-full"></div></div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-0 bg-white p-0.5"><Circle size={20} className="text-gray-300" /></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-[13px] font-bold text-gray-500">Diamond Tier (₹7L)</h5>
                    <p className="text-[10px] font-medium text-[#627085] mt-0.5">Reward: ₹ 7,000</p>
                  </div>
                  <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1 rounded">Locked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="mt-8">
            <h4 className="text-[14px] font-bold text-black mb-3">Transaction History</h4>
            <p className="text-[12px] font-medium text-[#627085] mb-3">March 2025</p>
            
            <div className="border border-gray-200 rounded-[12px] bg-white overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <div>
                  <h5 className="text-[13px] font-bold text-black">Cars/2W Rewards</h5>
                  <p className="text-[11px] font-medium text-[#627085] mt-0.5">Reviewing Dealer payment...</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-black text-black mb-0.5">₹6,200</p>
                  <span className="bg-orange-50 text-orange-600 text-[9px] font-bold px-2 py-0.5 rounded border border-orange-100">Under Review</span>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center bg-gray-50">
                <div>
                  <h5 className="text-[13px] font-bold text-black">Bus & Truck Rewards</h5>
                  <p className="text-[11px] font-medium text-[#627085] mt-0.5">Credited on 01 Sep</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-black text-black mb-0.5">₹8,200</p>
                  <span className="bg-green-100 text-[#059669] text-[9px] font-bold px-2 py-0.5 rounded border border-green-200">Credited</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </BottomSheet>

      {/* 4. Schedule Visit Bottom Sheet */}
      <BottomSheet isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Schedule Visit">
        <div className="space-y-5 pb-4">
          <div className="bg-[#F7F9FA] rounded-[10px] p-3 w-full border border-gray-100">
            <span className="text-[11px] font-medium text-[#627085]">Visiting</span>
            <div className="text-[13px] font-bold text-black mt-0.5">{selectedDealer?.name || ''}</div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-black mb-2">Select Reason</label>
            <div className="relative">
              <select defaultValue="Payment Collection" className="w-full appearance-none bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3.5 text-[14px] font-semibold text-[#627085] outline-none focus:border-black">
                <option value="" disabled>Select Reason</option>
                <option value="Payment Collection">Payment Collection</option>
                <option value="Order Collection">Order Collection</option>
                <option value="General Visit">General Visit</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-[#627085]" />
              </div>
            </div>
          </div>

          <div className="bg-[#F7F9FA] border border-gray-100 rounded-[10px] p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-white border border-gray-200 rounded-[8px] px-2.5 py-1">
                  <span className="text-[12px] font-bold text-black">₹</span>
                </div>
                <span className="text-[13px] font-bold text-[#627085]">Total Pending</span>
              </div>
              <span className="text-[14px] font-black text-[#ED1D24]">₹{selectedDealer?.due || '0'}</span>
            </div>
            
            <div className="h-[1px] bg-[#D9D9D9] my-4" />
            
            <label className="block text-[12px] font-medium text-[#627085] mb-2">Collection Amount(₹)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-[14px] font-bold text-black">₹</span>
              </div>
              <input 
                type="number" 
                value={scheduleAmount}
                onChange={(e) => setScheduleAmount(e.target.value)} 
                placeholder="0" 
                className="w-full bg-white border border-[#E0E0E0] rounded-[10px] pl-8 pr-4 py-3.5 text-[14px] font-bold text-black outline-none focus:border-black" 
              />
            </div>

            <div className="flex items-center space-x-1.5 mt-4 mb-3">
              <span className="text-[12px] font-medium text-[#627085]">Payment Mode</span>
            </div>
            <div className="flex space-x-3">
              {['Cash', 'Cheque', 'Online'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setSchedulePaymentMode(mode)}
                  className={`flex-1 text-[12px] font-bold py-2.5 rounded-[10px] border ${
                    schedulePaymentMode === mode 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'bg-white text-black border-[#E0E0E0]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5 mb-2">
              <Calendar size={15} className="text-gray-500" />
              <label className="text-[13px] font-bold text-black">Select Date</label>
            </div>
            <div className="flex space-x-3">
              {[
                { id: 'Today', label: 'Today', subLabel: 'Thu, Jan 8' },
                { id: 'Tomorrow', label: 'Tomorrow', subLabel: 'Fri, Jan 9' },
                { id: 'Pick Date', label: 'Pick Date', subLabel: 'Calendar' }
              ].map(date => {
                const isActive = scheduleDate === date.id;
                return (
                  <button 
                    key={date.id}
                    onClick={() => setScheduleDate(date.id)}
                    className={`flex-1 rounded-[10px] py-2 flex flex-col items-center border ${
                      isActive ? 'bg-red-50 border-[#ED1D24]' : 'bg-white border-[#E0E0E0]'
                    }`}
                  >
                    <span className={`text-[11px] font-bold ${isActive ? 'text-[#ED1D24]' : 'text-black'}`}>{date.label}</span>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-[#ED1D24]' : 'text-[#627085]'}`}>{date.subLabel}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5 mb-2">
              <label className="text-[13px] font-bold text-black">Select Time Slot</label>
            </div>
            <div className="space-y-3">
              {[
                '10:00 AM - 11:00 AM',
                '11:00 AM - 12:00 PM',
                '12:00 PM - 01:00 PM'
              ].map(slot => {
                const isActive = scheduleTimeSlot === slot;
                return (
                  <button 
                    key={slot}
                    onClick={() => setScheduleTimeSlot(slot)}
                    className={`w-full flex justify-between items-center bg-white rounded-[10px] px-4 py-3.5 border ${
                      isActive ? 'border-[#ED1D24] bg-red-50/30' : 'border-[#E0E0E0]'
                    }`}
                  >
                    <span className={`text-[13px] font-semibold ${isActive ? 'text-[#ED1D24]' : 'text-black'}`}>{slot}</span>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${isActive ? 'border-[#ED1D24]' : 'border-gray-300'}`}>
                       {isActive && <div className="w-2 h-2 bg-[#ED1D24] rounded-full"></div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <button onClick={handleConfirmSchedule} className="w-full bg-[#ED1D24] text-white py-4 rounded-[12px] text-[15px] font-bold mt-2 shadow-md active:scale-95">
            Confirm Schedule
          </button>
        </div>
      </BottomSheet>

      {/* 5. Edit Dealer Details Bottom Sheet */}
      <BottomSheet isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Dealer Details">
        <div className="space-y-6 pb-6">
          
          {/* Basic Details */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#627085] mb-4">Basic Details</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-black mb-1.5">Dealer Name</label>
                <input 
                  type="text" 
                  value={editFormData.name || ''} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black outline-none focus:border-black"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[13px] font-semibold text-black mb-1.5">Dealer ID</label>
                  <input 
                    type="text" 
                    value={selectedDealer?.id || ''} 
                    className="w-full px-4 py-3.5 bg-[#F8F9FA] rounded-[10px] text-[13px] font-semibold text-gray-500 outline-none cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-semibold text-black mb-1.5">Mobile Number</label>
                  <input 
                    type="text" 
                    value={editFormData.mobile || ''} 
                    onChange={(e) => setEditFormData({...editFormData, mobile: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 w-full" />

          {/* Location */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#627085] mb-4">Location</h4>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[13px] font-semibold text-black mb-1.5">City</label>
                <input 
                  type="text" 
                  value={editFormData.city || ''}
                  onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black outline-none focus:border-black"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[13px] font-semibold text-black mb-1.5">Pincode</label>
                <input 
                  type="text" 
                  value={editFormData.pincode || ''}
                  onChange={(e) => setEditFormData({...editFormData, pincode: e.target.value})}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 w-full" />

          {/* Segmentation */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#627085] mb-4">Segmentation</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-black mb-1.5">Dealer Type</label>
                <div className="relative">
                  <select 
                    value={editFormData.dealerType || ''}
                    onChange={(e) => setEditFormData({...editFormData, dealerType: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black appearance-none outline-none focus:border-black"
                  >
                    <option value="Tyre Dealer">Tyre Dealer</option>
                    <option value="Spare Parts Dealer">Spare Parts Dealer</option>
                    <option value="Service Center">Service Center</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-black mb-1.5">Outlet Type</label>
                <div className="relative">
                  <select 
                    value={editFormData.outletType || ''}
                    onChange={(e) => setEditFormData({...editFormData, outletType: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black appearance-none outline-none focus:border-black"
                  >
                    <option value="Multi Brand Outlet">Multi Brand Outlet</option>
                    <option value="Exclusive Brand Outlet">Exclusive Brand Outlet</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 w-full" />

          {/* Brand & Authorisation */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#627085] mb-4">Brand & Authorisation</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-black mb-1.5">Select Authorised Dealer</label>
                <div className="relative">
                  <select 
                    value={editFormData.authorisedDealer || ''}
                    onChange={(e) => setEditFormData({...editFormData, authorisedDealer: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black appearance-none outline-none focus:border-black"
                  >
                    <option value="Michelin">Michelin</option>
                    <option value="MRF">MRF</option>
                    <option value="CEAT">CEAT</option>
                    <option value="Apollo">Apollo</option>
                    <option value="Bridgestone">Bridgestone</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-black mb-1.5">Select Brand Outlet Names</label>
                <div className="relative">
                  <select 
                    value={editFormData.brandOutletNames || ''}
                    onChange={(e) => setEditFormData({...editFormData, brandOutletNames: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black appearance-none outline-none focus:border-black"
                  >
                    <option value="Apollo">Apollo</option>
                    <option value="Michelin">Michelin</option>
                    <option value="Pirelli">Pirelli</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 w-full" />

          {/* Vehicle Categories */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#627085] mb-4">Vehicle Categories</h4>
            <div className="flex flex-wrap gap-3">
              {['Car', 'Bike', 'Scooter', 'Commercial'].map((cat) => {
                const isSelected = (editFormData.vehicleCategories || []).includes(cat);
                return (
                  <button 
                    key={cat} 
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-full border text-[13px] font-semibold flex items-center gap-1.5 transition-colors ${
                      isSelected ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 w-full" />

          {/* Services Offered */}
          <div>
            <h4 className="text-[14px] font-semibold text-[#627085] mb-4">Services Offered</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-black mb-1.5">Select Other Services</label>
                <div className="relative">
                  <select 
                    value={editFormData.otherServices || ''}
                    onChange={(e) => setEditFormData({...editFormData, otherServices: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black appearance-none outline-none focus:border-black"
                  >
                    <option value="Wheel Alignment">Wheel Alignment</option>
                    <option value="Wheel Balancing">Wheel Balancing</option>
                    <option value="Nitrogen Fill">Nitrogen Fill</option>
                    <option value="None">None</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-semibold text-black mb-1.5">Avg Monthly Sales (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-semibold">₹</span>
                  <input 
                    type="number" 
                    value={editFormData.avgMonthlySales || ''}
                    onChange={(e) => setEditFormData({...editFormData, avgMonthlySales: e.target.value})}
                    className="w-full pl-8 pr-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-black mb-1.5">Current Status</label>
                <div className="relative">
                  <select 
                    value={editFormData.currentStatus || ''}
                    onChange={(e) => setEditFormData({...editFormData, currentStatus: e.target.value})}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-semibold text-black appearance-none outline-none focus:border-black"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Temporarily Closed">Temporarily Closed</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleEditSubmit} 
            className="w-full bg-[#ED1D24] text-white py-4 rounded-[12px] text-[15px] font-bold mt-4 active:scale-95 transition-transform"
          >
            Save Changes
          </button>
        </div>
      </BottomSheet>

    </div>
  );
};

export default RmDealerView;