import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Filter, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Edit2,
  User,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Receipt,
  Clock,
  Home,
  IndianRupee,
  CheckCircle2,
  Plus,
  CreditCard
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
      <motion.div key="bottom-sheet-wrapper" className="absolute inset-0 z-50 flex flex-col justify-end">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />
        <motion.div 
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative bg-white rounded-t-[25px] flex flex-col max-h-[90vh] overflow-hidden"
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
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [month, setMonth] = useState('May, 2026');

  // --- Schedule Visit States ---
  const [schedulePaymentMode, setSchedulePaymentMode] = useState('Cash');
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleTimeSlot, setScheduleTimeSlot] = useState('11:00 AM - 12:00 PM');

  // --- Edit Dealer States ---
  const [editFormData, setEditFormData] = useState({});

  // --- Target States ---
  const [targetAmount, setTargetAmount] = useState('');

  const [dealers, setDealers] = useState([
    {
      id: '20456',
      name: 'Modern Tyres & Service',
      location: 'Sector 18, Noida, 201301',
      creditPeriod: '15',
      mobile: '9876543210',
      contactPerson: 'Rahul Sharma',
      pendingAmount: '2,45,000',
      performanceHistory: [
        { month: 'May', agePercentage: '75%', total: 12, completed: 10, target: 1500000, gmv: 1120000 }
      ],
      visitSchedule: {
        date: '14 May, 2026',
        time: '11:30 AM - 12:30 PM'
      }
    },
    {
      id: '20489',
      name: 'Super Wheel Care',
      location: 'Gurgaon, Haryana, 122001',
      creditPeriod: '30',
      mobile: '9123456789',
      contactPerson: 'Amit Gupta',
      pendingAmount: '0',
      performanceHistory: [
        { month: 'May', agePercentage: '45%', total: 8, completed: 4, target: 0, gmv: 450000 }
      ],
      visitSchedule: null
    }
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
      name: dealer.name,
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
        return { ...d, ...editFormData };
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
        const updatedPerf = [...d.performanceHistory];
        updatedPerf[0].target = parseInt(targetAmount, 10);
        return { ...d, performanceHistory: updatedPerf };
      }
      return d;
    }));
    setIsTargetOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F9FAFB]">
      <header className="bg-white h-14 flex items-center justify-between px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="p-2"><ArrowLeft size={21} className="text-[#D32F2F]" /></button>
        <h1 className="text-gray-800 text-lg font-medium">RM Dealer</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 overflow-y-auto no-scrollbar">
        {/* Top Controls */}
        <div className="flex justify-center mt-3">
          <div className="flex items-center bg-white border border-black rounded-lg px-2 py-0.5">
            <button className="p-1"><ChevronLeft size={18} /></button>
            <span className="mx-3 text-[12px] font-bold text-[#ED1D24] uppercase">{month}</span>
            <button className="p-1"><ChevronRight size={18} className="text-gray-300" /></button>
          </div>
        </div>

        <div className="flex space-x-2 mt-3">
          <MetricCard title="Target Added" percentage="(50.0%)" amount="₹ 12,50,000" subAmount="/30L" icon={Home} color="text-[#ED1D24]" />
          <MetricCard title="Collection" percentage="(20.00%)" amount="₹ 10,00,000" subAmount="/47.5L" icon={IndianRupee} color="text-[#008000]" />
        </div>

        {/* Search & Filter */}
        <div className="flex space-x-2.5 mt-3">
          <div className={`flex-1 flex items-center px-3 py-2.5 rounded-lg border transition-colors h-10 ${isFilterExpanded ? 'bg-[#F0F0F0] border-[#627085]' : 'bg-white border-[#62708580]'}`}>
            <Search size={16} className={isFilterExpanded ? 'text-[#BDBDBD]' : 'text-[#717782]'} />
            <input disabled={isFilterExpanded} placeholder="Search by dealer id..." className="bg-transparent border-none outline-none text-xs ml-2 w-full placeholder:text-[#627085]" />
          </div>
          <button onClick={() => setIsFilterExpanded(!isFilterExpanded)} className={`flex items-center px-4 rounded-lg border h-10 transition-all ${isFilterExpanded ? 'bg-black border-black text-white' : 'bg-white border-[#CCCCCC] text-[#627085]'}`}>
            {isFilterExpanded ? <X size={15} /> : <Filter size={15} className="mr-1.5" />}
            <span className="text-xs font-bold">Filters</span>
          </button>
        </div>

        {/* List Header */}
        <div className="flex justify-between items-center px-2 mt-4 mb-3">
          <span className="text-sm font-semibold text-gray-800 font-bold">Dealer Assigned</span>
          <div className="w-5.5 h-5.5 rounded-full bg-[#2664EB]/10 flex items-center justify-center">
            <span className="text-[10px] font-[900] text-black px-2">{dealers.length}</span>
          </div>
        </div>

        {/* Dealer Cards */}
        <div className="space-y-4 pb-20">
          {dealers.map((dealer, index) => (
            <div key={index} className="relative mb-6">
              <div className="absolute top-0 right-0 bg-[#2664EB]/10 border border-[#2664EB] rounded-bl-[20px] rounded-tr-[20px] px-5 py-1 z-10">
                <span className="text-[10px] font-bold text-[#2664EB]">{dealer.id}</span>
              </div>

              <div className="bg-white rounded-[20px] border border-[#E0E0E0] shadow-sm p-5 pt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-base font-[900] text-gray-900 leading-tight">{dealer.name}</h3>
                  <button onClick={() => openEdit(dealer)} className="w-6.5 h-6.5 rounded-full bg-gray-100 flex items-center justify-center">
                    <Edit2 size={13} className="text-gray-500" />
                  </button>
                </div>

                <div className="flex space-x-4 mb-4">
                  <div className="flex-1 flex items-start">
                    <User size={16} className="text-gray-400 mr-1.5 mt-0.5" />
                    <span className="text-[11px] font-semibold text-gray-500">{dealer.contactPerson}</span>
                  </div>
                  <div className="flex-[2] flex items-start">
                    <MapPin size={16} className="text-gray-400 mr-1.5 mt-0.5" />
                    <span className="text-[11px] font-semibold text-gray-500 leading-tight">{dealer.location}</span>
                  </div>
                </div>

                <div className="flex space-x-3 mb-4">
                  <button className="flex-1 border border-[#008000] rounded-lg py-2 flex items-center justify-center space-x-2 text-[#008000] active:bg-green-50">
                    <MessageSquare size={16} className="fill-[#008000]" />
                    <span className="text-xs font-bold">Whatsapp</span>
                  </button>
                  <button className="flex-1 border border-[#2664EB] rounded-lg py-2 flex items-center justify-center space-x-2 text-[#2664EB] active:bg-blue-50">
                    <Phone size={16} className="fill-[#2664EB]" />
                    <span className="text-xs font-bold">Call</span>
                  </button>
                </div>

                {/* Performance Box */}
                <div className="bg-[#F7F9FA] rounded-[10px] p-4 mb-4">
                  <div className="grid grid-cols-3 gap-y-5">
                     {['MONTH', '%AGE', 'TOTAL'].map((h, i) => (
                       <div key={i} className={`flex flex-col ${i===1?'items-center':i===2?'items-end':''}`}>
                         <span className="text-[9px] font-bold text-gray-400 uppercase">{h}</span>
                         <span className="text-[11px] font-bold text-gray-800">{dealer.performanceHistory[0].month}</span>
                       </div>
                     ))}
                     <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">GMV</span>
                        <span className="text-[11px] font-bold text-gray-800">₹{dealer.performanceHistory[0].gmv.toLocaleString()}</span>
                     </div>
                     <div className="flex flex-col items-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">COMPLETED</span>
                        <span className="text-[11px] font-bold text-gray-800">{dealer.performanceHistory[0].completed}</span>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">TARGET</span>
                        {dealer.performanceHistory[0].target === 0 ? (
                           <button onClick={() => openTarget(dealer)} className="text-[10px] font-bold text-[#2664EB]">+ Set Target</button>
                        ) : (
                           <span className="text-[11px] font-bold text-gray-800">₹{dealer.performanceHistory[0].target.toLocaleString()}</span>
                        )}
                     </div>
                  </div>
                </div>

                {dealer.pendingAmount !== '0' && (
                  <button className="w-full bg-[#D32F2F] text-white rounded-lg py-2.5 flex items-center justify-center space-x-2 mb-4">
                    <Receipt size={14} />
                    <span className="text-xs font-bold">Pending Payment Details</span>
                  </button>
                )}

                <div className="inline-block bg-[#008000]/10 rounded-full px-2 py-1 mb-4">
                  <span className="text-[9px] font-bold text-[#008000] uppercase">CREDIT PERIOD: {dealer.creditPeriod} DAYS</span>
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
                       <button onClick={() => openSchedule(dealer)} className="p-1.5 rounded-full border border-[#EB5A0C]/40"><Edit2 size={12} className="text-[#F44336]" /></button>
                     </div>
                     <div className="h-[1px] bg-[#EB5A0C] my-3 opacity-20" />
                     <button className="w-full bg-[#EB5A0C] text-white text-[11px] font-bold py-2 rounded-full shadow-md active:scale-95">Start Visit</button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <button onClick={() => openSchedule(dealer)} className="w-full border-2 border-dashed border-[#EB5A0C]/40 text-[#EB5A0C] py-3 rounded-[15px] flex items-center justify-center space-x-2 font-bold text-xs active:bg-orange-50">
                      <Plus size={16} />
                      <span>Schedule Visit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Bottom Sheets --- */}
      
      {/* Schedule Visit */}
      <BottomSheet isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Schedule Visit">
        <div className="space-y-5 pb-4">
          {/* Visiting Section */}
          <div className="bg-[#F7F9FA] rounded-[10px] p-3 w-full">
            <span className="text-[11px] font-medium text-[#627085]">Visiting</span>
            <div className="text-[12px] font-bold text-black mt-0.5">{selectedDealer?.name || ''}</div>
          </div>

          {/* Select Reason */}
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
                <ChevronRight size={18} className="text-[#627085] rotate-90" />
              </div>
            </div>
          </div>

          {/* Payment Collection Section */}
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

          {/* Select Date */}
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

          {/* Select Time Slot */}
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
        <div className="space-y-5">
           {[
             { label: 'DEALER NAME', key: 'name', value: editFormData.name },
             { label: 'CONTACT PERSON', key: 'contactPerson', value: editFormData.contactPerson },
             { label: 'MOBILE NUMBER', key: 'mobile', value: editFormData.mobile },
             { label: 'LOCATION', key: 'location', value: editFormData.location },
           ].map(f => (
             <div key={f.label}>
               <label className="block text-[10px] font-black text-gray-400 mb-1.5 uppercase">{f.label}</label>
               <input 
                 value={f.value || ''} 
                 onChange={(e) => setEditFormData({...editFormData, [f.key]: e.target.value})}
                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 outline-none focus:border-gray-400" 
               />
             </div>
           ))}
           <button onClick={handleSaveChanges} className="w-full bg-[#D32F2F] text-white py-3.5 rounded-xl font-bold mt-4 active:scale-95">Save Changes</button>
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

      <div className="h-20" />
    </div>
  );
};

export default RmDealerView;
