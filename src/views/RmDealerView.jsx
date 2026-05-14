import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, User, 
  MapPin, Phone, MessageCircle, Edit, Clock, FileText, Calendar,
  X, ChevronDown, CreditCard, Home, IndianRupee
} from 'lucide-react';

const MetricCard = ({ title, percentage, amount, subAmount, icon: Icon, color }) => (
  <div className="flex-1 bg-white rounded-lg border border-[#D9D9D9] p-2 flex flex-col shadow-sm">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 bg-gray-50 rounded-[10px] flex items-center justify-center">
        <Icon size={23} className={color} />
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-[11px] font-bold ${color}`}>{title}</span>
        <span className={`text-[10px] font-bold ${color}`}>{percentage}</span>
      </div>
    </div>
    <div className="mt-3">
      <div className="text-[15px] font-[900] text-gray-900 leading-none">{amount}</div>
      <div className="text-[11px] font-bold text-blue-900/60 mt-0.5">{subAmount}</div>
    </div>
  </div>
);

const BottomSheet = ({ isOpen, onClose, title, children }) => (
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
          className="relative bg-white rounded-t-[25px] flex flex-col max-h-[85vh] overflow-hidden w-full max-w-[430px]"
        >
          <div className="p-4 border-b border-[#E0E0E0] relative">
            <div className="w-[50px] h-1 bg-[#D9D9D9] rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[16px] font-bold text-black">{title}</h3>
              <button onClick={onClose} className="p-1 bg-[#F7F9FA] rounded-full text-[#627085]">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);

  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  
  const [selectedDealer, setSelectedDealer] = useState(null);

  // Dynamic Date calculation for Schedule Visit
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // --- Schedule Visit States ---
  const [schedulePaymentMode, setSchedulePaymentMode] = useState('Cash');
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleTimeSlot, setScheduleTimeSlot] = useState('11:00 AM - 12:00 PM');

  // --- Edit Dealer States ---
  const [editFormData, setEditFormData] = useState({});

  // --- Target States ---
  const [targetAmount, setTargetAmount] = useState('');

  // Mock dealer data matching the screenshot exactly
  const [dealers, setDealers] = useState([
    {
      id: 'I73460',
      dealerName: 'SAI RAM TYRES',
      contactPerson: 'ram reddy',
      location: 'House 1, Kushaiguda Rd, ECIL, Hyderabad',
      mobile: '9876543210',
      creditPeriod: '0 DAYS',
      pendingAmount: '51,725',
      hasPendingPayment: true,
      stats: { month: 'May', age: '0%', total: '0', gmv: '₹0', completed: '0', target: null },
      showSetTarget: true,
      showScheduleVisit: true,
    },
    {
      id: 'I73447',
      dealerName: 'MVIN CARCO PRIVATE LIMITED',
      contactPerson: 'Suresh Kumar',
      location: 'Plot No 45, Industrial Area, Telangana',
      mobile: '8765432109',
      creditPeriod: '30 DAYS',
      pendingAmount: '1,20,000',
      hasPendingPayment: true,
      stats: { month: 'May', age: '45%', total: '5', gmv: '₹1,80,000', completed: '3', target: '₹4,00,000' },
      showSetTarget: false,
      showScheduleVisit: true,
    },
    {
      id: 'I73521',
      dealerName: 'SHARMA TYRES HOUSE',
      contactPerson: 'Amit Sharma',
      location: 'Near Bus Stand, Jaipur Road, Sikar',
      mobile: '7654321098',
      creditPeriod: '30 DAYS',
      pendingAmount: '0',
      hasPendingPayment: false,
      stats: { month: 'May', age: '90%', total: '12', gmv: '₹4,50,000', completed: '11', target: '₹5,00,000' },
      showSetTarget: false,
      showScheduleVisit: false,
    },
  ]);

  // --- Actions Logic ---
  const openSchedule = (dealer) => {
    setSelectedDealer(dealer);
    setIsScheduleOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (!selectedDealer) return;
    
    let dateStr = '14 May, 2026';
    if (scheduleDate === 'Tomorrow') dateStr = '15 May, 2026';
    if (scheduleDate === 'Pick Date') dateStr = '18 May, 2026';

    setDealers(dealers.map(d => {
      if (d.id === selectedDealer.id) {
        return { 
          ...d, 
          showScheduleVisit: false,
          visitSchedule: { date: dateStr, time: scheduleTimeSlot }
        };
      }
      return d;
    }));
    setIsScheduleOpen(false);
  };

  const openEdit = (dealer) => {
    setSelectedDealer(dealer);
    setEditFormData({
      name: dealer.dealerName,
      contactPerson: dealer.contactPerson,
      mobile: dealer.mobile,
      location: dealer.location
    });
    setIsEditOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedDealer) return;
    setDealers(dealers.map(d => {
      if (d.id === selectedDealer.id) {
        return { 
          ...d, 
          dealerName: editFormData.name,
          contactPerson: editFormData.contactPerson,
          mobile: editFormData.mobile,
          location: editFormData.location
        };
      }
      return d;
    }));
    setIsEditOpen(false);
  };

  const openTarget = (dealer) => {
    setSelectedDealer(dealer);
    setTargetAmount('');
    setIsTargetOpen(true);
  };

  const handleSetTarget = () => {
    if (!selectedDealer || !targetAmount) return;
    setDealers(dealers.map(d => {
      if (d.id === selectedDealer.id) {
        return { 
          ...d, 
          showSetTarget: false,
          stats: {
            ...d.stats,
            target: `₹${parseInt(targetAmount, 10).toLocaleString('en-IN')}`
          }
        };
      }
      return d;
    }));
    setIsTargetOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] relative overflow-hidden">
      {/* Page header - matches Flutter: back arrow + centered red title */}
      <div className="bg-white h-14 flex items-center px-4 border-b shrink-0 z-10 relative">
        <button onClick={() => navigate(-1)} className="mr-3" aria-label="Go back">
          <ChevronLeft size={21} className="text-black" />
        </button>
        <h1 className="text-base font-medium flex-1 text-center pr-8 text-[#D32F2F]">RM Dealer</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 relative z-0">
        {/* Month Selector */}
        <div className="flex justify-center my-3">
          <div className="flex items-center border border-black rounded-lg px-2 py-1">
            <button onClick={() => setMonthOffset(prev => prev - 1)} aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <span className="mx-3 text-xs font-bold text-[#ED1D24]">
              {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
            </span>
            <button 
              onClick={() => monthOffset < 0 && setMonthOffset(prev => prev + 1)}
              disabled={monthOffset >= 0}
              aria-label="Next month"
            >
              <ChevronRight size={20} className={monthOffset >= 0 ? 'text-[#D9D9D9]' : 'text-black'} />
            </button>
          </div>
        </div>

        {/* Target Added & Collection Cards */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px] font-bold text-[#ED1D24]">Target Added</span>
              <span className="text-[10px] text-[#ED1D24]">(50%)</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-sm font-bold">₹ 12,50,000</span>
              <span className="text-[10px] text-gray-400 ml-1">/30L</span>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[10px] font-bold text-[#008000]">Collection</span>
              <span className="text-[10px] text-[#008000]">(20%)</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-sm font-bold">₹ 10,00,000</span>
              <span className="text-[10px] text-gray-400 ml-1">/47.5L</span>
            </div>
          </div>
        </div>

        {/* Search Box + Filter Button */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by dealer id..."
              className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#D32F2F]"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`h-10 px-4 rounded-lg border flex items-center gap-1.5 text-xs font-bold ${
              isFilterOpen ? 'bg-black text-white border-black' : 'bg-white text-[#627085] border-gray-300'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white border border-[#D9D9D9] rounded-lg p-4 mb-3">
            <p className="text-sm font-semibold mb-3">Filter By Date</p>
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="text-[11px] text-[#627085] font-medium">Date from</label>
                <input type="date" className="w-full h-9 border border-gray-300 rounded px-2 text-[10px] mt-1" />
              </div>
              <div className="flex-1">
                <label className="text-[11px] text-[#627085] font-medium">Date to</label>
                <input type="date" className="w-full h-9 border border-gray-300 rounded px-2 text-[10px] mt-1" />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 h-9 bg-[#D32F2F] text-white text-xs font-medium rounded-lg">Apply</button>
              <button onClick={() => setIsFilterOpen(false)} className="flex-1 h-9 border border-gray-300 text-xs font-medium rounded-lg">Reset All</button>
            </div>
          </div>
        )}

        {/* Dealer Cards */}
        {dealers.map((dealer) => (
          <div key={dealer.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-5 mb-4 shadow-sm relative">
            {/* Dealer ID Badge */}
            <div className="absolute top-0 right-0 bg-[#2664EB]/10 border border-[#2664EB] rounded-bl-2xl rounded-tr-2xl px-5 py-1">
              <span className="text-[10px] font-semibold">ID:{dealer.id}</span>
            </div>

            <div className="mt-3" />

            {/* Dealer Name + Edit icon */}
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-black text-gray-900">{dealer.dealerName}</h3>
              <button onClick={() => openEdit(dealer)} className="w-6 h-6 rounded-full bg-[#D9D9D9]/60 flex items-center justify-center active:scale-90" aria-label="Edit dealer">
                <Edit size={12} className="text-[#757575]" />
              </button>
            </div>

            {/* Contact Person + Location */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-start gap-1.5 shrink-0">
                <User size={14} className="text-[#757575] mt-0.5" />
                <span className="text-[11px] text-[#757575] font-semibold">{dealer.contactPerson}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin size={14} className="text-[#757575] mt-0.5 shrink-0" />
                <span className="text-[11px] text-[#757575] font-semibold leading-relaxed">{dealer.location}</span>
              </div>
            </div>

            {/* WhatsApp & Call Buttons */}
            <div className="flex gap-3 mb-4">
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#008000] rounded-lg py-2.5 text-[#008000] active:bg-green-50">
                <MessageCircle size={16} />
                <span className="text-sm font-medium">Whatsapp</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#2664EB] rounded-lg py-2.5 text-[#2664EB] active:bg-blue-50">
                <Phone size={16} />
                <span className="text-sm font-medium">Call</span>
              </button>
            </div>

            {/* Stats Box */}
            <div className="bg-[#F7F9FA] rounded-lg p-4 mb-4">
              {/* Row 1 */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">MONTH</p>
                  <p className="text-sm font-bold">{dealer.stats.month}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">%Age</p>
                  <p className="text-sm font-bold">{dealer.stats.age}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">TOTAL</p>
                  <p className="text-sm font-bold">{dealer.stats.total}</p>
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">GMV</p>
                  <p className="text-sm font-bold">{dealer.stats.gmv}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">COMPLETED</p>
                  <p className="text-sm font-bold">{dealer.stats.completed}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                    TARGET
                    <Clock size={10} className="text-gray-400" />
                  </p>
                  {dealer.showSetTarget ? (
                    <button onClick={() => openTarget(dealer)} className="border border-[#D32F2F] rounded px-2 py-0.5 mt-0.5 active:bg-red-50">
                      <span className="text-[11px] text-[#D32F2F] font-medium">+ Set Target</span>
                    </button>
                  ) : (
                    <p className="text-sm font-bold">{dealer.stats.target}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pending Payment Details Button */}
            {dealer.hasPendingPayment && (
              <button className="w-full bg-[#D32F2F] text-white rounded-full py-3 flex items-center justify-center gap-2 mb-3 active:scale-95 transition-transform">
                <FileText size={14} />
                <span className="text-sm font-semibold">Pending Payment Details</span>
              </button>
            )}

            {/* Credit Period Badge */}
            <div className="mb-3">
              <span className="inline-block bg-[#008000]/10 text-[#008000] text-[9px] font-bold px-2 py-1 rounded-full">
                CREDIT PERIOD: {dealer.creditPeriod}
              </span>
            </div>

            {/* Visit Logic */}
            {dealer.visitSchedule ? (
              <div className="mt-2 rounded-[20px] border border-[#EB5A0C] p-4 bg-white shadow-sm">
                 <div className="flex items-start space-x-2">
                   <div className="p-2 rounded-[10px] border border-[#EB5A0C]/40"><Calendar size={14} className="text-[#F44336]" /></div>
                   <div className="flex-1">
                      <h4 className="text-[13px] font-bold text-[#F44336]">Visit Schedule</h4>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                         <span className="text-[10px] font-bold text-black">{dealer.visitSchedule.date}</span>
                         <div className="bg-[#EB5A0C]/10 border border-[#EB5A0C] rounded px-1.5 py-0.5">
                            <span className="text-[8px] font-bold text-black">{dealer.visitSchedule.time}</span>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => openSchedule(dealer)} className="p-1.5 rounded-full border border-[#EB5A0C]/40"><Edit size={12} className="text-[#F44336]" /></button>
                 </div>
                 <div className="h-[1px] bg-[#EB5A0C] my-3 opacity-20" />
                 <button className="w-full bg-[#EB5A0C] text-white text-[11px] font-bold py-2 rounded-full shadow-md active:scale-95">Start Visit</button>
              </div>
            ) : (
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-[#D32F2F] font-medium">Pending Amount</p>
                  <p className="text-lg font-bold">₹{dealer.pendingAmount}</p>
                </div>
                <button onClick={() => openSchedule(dealer)} className="flex items-center gap-1.5 border border-[#D32F2F] rounded-lg px-4 py-2.5 active:bg-red-50">
                  <Calendar size={14} className="text-[#D32F2F]" />
                  <span className="text-sm font-medium text-[#D32F2F]">Schedule Visit</span>
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="h-4" />
      </div>

      {/* --- Bottom Sheets --- */}
      
      {/* Schedule Visit */}
      <BottomSheet isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Schedule Visit">
        <div className="space-y-5 pb-4">
          <div className="bg-[#F7F9FA] rounded-[10px] p-3 w-full">
            <span className="text-[11px] font-medium text-[#627085]">Visiting</span>
            <div className="text-[12px] font-bold text-black mt-0.5">{selectedDealer?.dealerName || ''}</div>
          </div>

          <div>
            <label className="block text-[14px] font-bold text-black mb-3">Select Reason</label>
            <div className="relative">
              <select defaultValue="Payment Collection" className="w-full appearance-none bg-white border border-[#E0E0E0] rounded-[10px] px-4 py-3.5 text-[14px] font-bold text-[#627085] outline-none">
                <option value="" disabled className="text-[#9E9E9E]">Select Reason</option>
                <option value="Payment Collection">Payment Collection</option>
                <option value="Order Collection">Order Collection</option>
                <option value="General Visit">General Visit</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-[#627085]" />
              </div>
            </div>
          </div>

          <div className="bg-[#F7F9FA] rounded-[10px] p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-[10px] px-2.5 py-1">
                  <span className="text-[12px] font-bold text-black">₹</span>
                </div>
                <span className="text-[14px] font-bold text-[#627085]">Total Pending</span>
              </div>
              <span className="text-[14px] font-[900] text-black">₹{selectedDealer?.pendingAmount || '0'}</span>
            </div>
            
            <div className="h-[1px] bg-[#D9D9D9] my-4" />
            
            <label className="block text-[12px] font-medium text-[#627085] mb-2">Collection Amount(₹)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-[14px] font-bold text-black">₹</span>
              </div>
              <input type="number" placeholder="" className="w-full bg-white border border-[#E0E0E0] rounded-[10px] pl-8 pr-4 py-3.5 text-[14px] font-bold text-black outline-none focus:border-[#E0E0E0]" />
            </div>

            <div className="flex items-center space-x-1.5 mt-4 mb-3">
              <CreditCard size={15} className="text-[#627085]" />
              <span className="text-[12px] font-medium text-[#627085]">Payment Mode</span>
            </div>
            <div className="flex space-x-3">
              {['Cash', 'Cheque', 'Online'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setSchedulePaymentMode(mode)}
                  className={`flex-1 text-[13px] font-semibold py-2 rounded-[10px] border ${
                    schedulePaymentMode === mode 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-black border-[#E0E0E0]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5 mb-3">
              <Calendar size={15} className="text-[#627085]" />
              <label className="text-[14px] font-bold text-black">Select Date</label>
            </div>
            <div className="flex space-x-3">
              {[
                { id: 'Today', label: 'Today', subLabel: 'Mon, Feb 24' },
                { id: 'Tomorrow', label: 'Tomorrow', subLabel: 'Tue, Feb 25' },
                { id: 'Pick Date', label: 'Pick Date', subLabel: 'Calendar' }
              ].map(date => {
                const isActive = scheduleDate === date.id;
                return (
                  <button 
                    key={date.id}
                    onClick={() => setScheduleDate(date.id)}
                    className={`flex-1 rounded-[10px] py-2 flex flex-col items-center ${
                      isActive ? 'bg-white border-2 border-[#F44336]' : 'bg-white border border-[#E0E0E0]'
                    }`}
                  >
                    <span className={`text-[11px] font-bold ${isActive ? 'text-[#F44336]' : 'text-black'}`}>{date.label}</span>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-black' : 'text-[#627085]'}`}>{date.subLabel}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5 mb-3">
              <Clock size={16} className="text-[#627085]" />
              <label className="text-[14px] font-bold text-black">Select Time Slot</label>
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
                    className={`w-full flex justify-between items-center bg-white rounded-[10px] px-4 py-3.5 ${
                      isActive ? 'border-2 border-[#F44336]' : 'border border-[#E0E0E0]'
                    }`}
                  >
                    <span className={`text-[14px] font-medium ${isActive ? 'text-[#F44336]' : 'text-black'}`}>{slot}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isActive ? 'border border-[#F44336]' : 'border border-[#E0E0E0]'}`}>
                       {isActive && <div className="w-2.5 h-2.5 bg-[#F44336] rounded-full"></div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <button onClick={handleConfirmSchedule} className="w-full bg-[#F44336] text-white py-3.5 rounded-[10px] text-[14px] font-semibold mt-2 active:scale-95">Confirm Schedule</button>
        </div>
      </BottomSheet>

      {/* Edit Dealer */}
      <BottomSheet isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Dealer Details">
        <div className="space-y-6 pb-6">
          
          {/* Basic Details */}
          <div>
            <h4 className="text-[14px] font-bold text-[#9E9E9E] mb-3">Basic Details</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">Dealer Name</label>
                <div className="w-full px-3 py-3 bg-[#F7F9FA] rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-black">
                  {selectedDealer?.dealerName || ''}
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">Dealer ID</label>
                  <div className="w-full px-3 py-3 bg-[#F7F9FA] rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-black">
                    {selectedDealer?.id || ''}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">Mobile Number</label>
                  <div className="w-full px-3 py-3 bg-[#F7F9FA] rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-black">
                    {selectedDealer?.mobile || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-[12px] font-bold text-[#9E9E9E] mb-3">Location</h4>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">City</label>
                <div className="w-full px-3 py-3 bg-[#F7F9FA] rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-black overflow-hidden whitespace-nowrap text-ellipsis">
                  {selectedDealer?.location ? selectedDealer.location.split(',').slice(-2, -1)[0]?.trim() || 'N/A' : 'N/A'}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">Pincode</label>
                <div className="w-full px-3 py-3 bg-[#F7F9FA] rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-black">
                  122001
                </div>
              </div>
            </div>
          </div>

          {/* Segmentation */}
          <div>
            <h4 className="text-[14px] font-bold text-[#9E9E9E] mb-3">Segmentation</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">Dealer Type</label>
                <div className="relative">
                  <select className="w-full px-3 py-3 bg-white rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-[#9E9E9E] appearance-none outline-none focus:border-[#2664EB]">
                    <option>Select Dealer Type</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#627085] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">Outlet Type</label>
                <div className="relative">
                  <select className="w-full px-3 py-3 bg-white rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-[#9E9E9E] appearance-none outline-none focus:border-[#2664EB]">
                    <option>Select Outlet Type</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#627085] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Brand & Authorisation */}
          <div>
            <h4 className="text-[14px] font-bold text-[#9E9E9E] mb-3">Brand & Authorisation</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">Select Authorised Dealer</label>
                <div className="relative">
                  <select className="w-full px-3 py-3 bg-white rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-[#9E9E9E] appearance-none outline-none focus:border-[#2664EB]">
                    <option>Select Authorised Dealer</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#627085] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h4 className="text-[14px] font-bold text-[#9E9E9E] mb-3">Vehicle Categories</h4>
            <div className="flex flex-wrap gap-3">
              {['Car', 'Bike', 'Scooter', 'Commercial'].map((cat, i) => (
                <div key={cat} className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${i === 0 ? 'bg-[#2664EB]/10 border-[#2664EB]' : 'bg-white border-[#E0E0E0]'}`}>
                  <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center border ${i === 0 ? 'border-[#2664EB]' : 'border-[#9E9E9E]'}`}>
                    {i === 0 && <div className="w-[10px] h-[10px] bg-[#2664EB] rounded-full" />}
                  </div>
                  <span className={`text-[12px] font-semibold ${i === 0 ? 'text-[#2664EB]' : 'text-black'}`}>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div>
            <h4 className="text-[14px] font-bold text-[#9E9E9E] mb-3">Current Status</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#627085] mb-1.5">Current Status</label>
                <div className="relative">
                  <select className="w-full px-3 py-3 bg-white rounded-lg border border-[#E0E0E0] text-[12px] font-semibold text-[#9E9E9E] appearance-none outline-none focus:border-[#2664EB]">
                    <option>Select Current Status</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#627085] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => setIsEditOpen(false)} className="w-full bg-[#ED1D24] text-white py-3.5 rounded-[10px] text-[16px] font-bold mt-4 active:scale-95">Save Changes</button>
        </div>
      </BottomSheet>

      {/* Set Target */}
      <BottomSheet isOpen={isTargetOpen} onClose={() => setIsTargetOpen(false)} title="Set Monthly Target">
        <div className="space-y-6">
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <span className="text-[10px] font-bold text-blue-600 uppercase">Recommended Target</span>
             <div className="text-xl font-black text-blue-900 mt-1">₹ 12,45,000</div>
           </div>
           <div>
             <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Enter Target Amount</label>
             <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-lg">₹</span>
               <input 
                 autoFocus 
                 type="number" 
                 placeholder="0" 
                 value={targetAmount}
                 onChange={(e) => setTargetAmount(e.target.value)}
                 className="w-full p-4 pl-10 border-2 border-gray-200 rounded-xl text-xl font-black outline-none focus:border-black" 
               />
             </div>
           </div>
           <button onClick={handleSetTarget} className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-xl active:scale-95">Set Target for May</button>
        </div>
      </BottomSheet>
    </div>
  );
};

export default RmDealerView;