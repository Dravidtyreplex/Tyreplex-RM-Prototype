import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  X
} from 'lucide-react';

const VisitsView = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [month, setMonth] = useState('May, 2026');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('Payment Collection');
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleTime, setScheduleTime] = useState('');
  const [paymentMode, setPaymentMode] = useState('Online');

  const stats = [
    { label: 'Total Visits', value: '45', color: 'text-[#F44336]' },
    { label: 'Completed', value: '32', color: 'text-black' },
    { label: 'Pending', value: '13', color: 'text-black' },
  ];

  const upcomingVisits = [
    {
      id: '20456',
      name: 'Modern Tyres & Service',
      locality: 'Sector 18, Noida',
      time: '11:30 AM - 12:30 PM',
      date: '14 May, 2026',
      status: 'Scheduled'
    },
    {
      id: '20489',
      name: 'Super Wheel Care',
      locality: 'Gurgaon, Haryana',
      time: '02:00 PM - 03:00 PM',
      date: '14 May, 2026',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#F9FAFB]">
      {/* Page header - My Route */}
      <header className="bg-white h-14 flex items-center justify-center px-4 border-b shrink-0 sticky top-0 z-10">
        <h1 className="text-base font-medium">My Route</h1>
      </header>

      {/* Month Selector */}
      <div className="flex justify-center mt-3">
        <div className="flex items-center bg-white border border-black rounded-lg px-2 py-0.5">
          <button className="p-1"><ChevronLeft size={18} /></button>
          <span className="mx-4 text-xs font-bold text-[#ED1D24] uppercase">{month}</span>
          <button className="p-1"><ChevronRight size={18} className="text-gray-300" /></button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 px-5 mt-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-[#D9D9D9] rounded-xl p-2.5 flex flex-col items-center">
            <span className={`text-[11px] font-semibold mb-1 ${stat.label === 'Total Visits' ? 'text-[#ED1D24]' : 'text-[#627085]'}`}>
              {stat.label}
            </span>
            <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 px-5 mt-4">
        {['Upcoming', 'History'].map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
              activeTab === i 
                ? 'bg-white border-[#ED1D24] text-[#ED1D24]' 
                : 'bg-white border-[#627085] text-[#627085]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4">
        {activeTab === 0 ? (
          <div className="space-y-4">
            {upcomingVisits.map((visit, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                   <div className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold text-gray-400">#{visit.id}</div>
                   <div className="text-[10px] font-bold text-green-600">{visit.status}</div>
                </div>
                <h3 className="font-bold text-sm text-gray-800">{visit.name}</h3>
                <div className="flex items-start mt-2 text-gray-500">
                   <MapPin size={14} className="mr-1 mt-0.5 shrink-0" />
                   <span className="text-[11px]">{visit.locality}</span>
                </div>
                <div className="flex items-center mt-2 text-gray-500">
                   <Clock size={14} className="mr-1 shrink-0" />
                   <span className="text-[11px]">{visit.date} | {visit.time}</span>
                </div>

                <div className="h-[1px] bg-gray-50 my-3" />

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-green-50 text-green-600 rounded-full">
                      <Phone size={16} />
                    </button>
                    <button className="p-2 bg-blue-50 text-blue-600 rounded-full">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                  <button className="bg-[#ED1D24] text-white text-[11px] font-bold px-4 py-2 rounded-full shadow-md">
                    Start Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Calendar size={48} className="mb-4 opacity-20" />
            <span className="text-sm font-semibold">No History Visits</span>
          </div>
        )}
      </div>

      {/* Floating Action Button - inside viewport */}
      <div className="flex justify-end px-4 pb-4">
        <button 
          onClick={() => setIsScheduleOpen(true)}
          className="bg-[#ED1D24] text-white px-5 py-2.5 rounded-full shadow-lg flex items-center space-x-2 active:scale-95 transition-transform"
        >
          <Calendar size={16} />
          <span className="font-bold text-sm">Schedule New Visit</span>
        </button>
      </div>

      <div className="h-4" />

      {/* Schedule Visit Bottom Sheet */}
      <AnimatePresence>
        {isScheduleOpen && (
          <motion.div key="schedule-sheet" className="fixed inset-0 z-[100] flex flex-col justify-end items-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsScheduleOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-[25px] flex flex-col max-h-[90vh] overflow-hidden w-full max-w-[430px]"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-[40px] h-1 bg-[#D9D9D9] rounded-full" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-center px-5 pb-4">
                <h3 className="text-[18px] font-bold text-black">Schedule Visit</h3>
                <button onClick={() => setIsScheduleOpen(false)} className="p-1">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 pb-6 no-scrollbar">
                {/* Select Dealer */}
                <div className="mb-4">
                  <label className="block text-[14px] font-bold text-black mb-2">Select Dealer</label>
                  <div className="relative">
                    <select 
                      value={selectedDealer}
                      onChange={(e) => setSelectedDealer(e.target.value)}
                      className="w-full h-[48px] px-4 border border-gray-200 rounded-full text-[14px] text-gray-400 appearance-none outline-none bg-white"
                    >
                      <option value="">Select RM</option>
                      <option value="Modern Tyres & Service">Modern Tyres & Service</option>
                      <option value="Super Wheel Care">Super Wheel Care</option>
                      <option value="SAI RAM TYRES">SAI RAM TYRES</option>
                    </select>
                    <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                  </div>
                </div>

                {/* Select Reason */}
                <div className="mb-4">
                  <label className="block text-[14px] font-bold text-black mb-2">Select Reason</label>
                  <div className="relative">
                    <select 
                      value={visitPurpose}
                      onChange={(e) => setVisitPurpose(e.target.value)}
                      className="w-full h-[48px] px-4 border border-gray-200 rounded-full text-[14px] text-black appearance-none outline-none bg-white"
                    >
                      <option value="Payment Collection">Payment  Collection</option>
                      <option value="New Order">New Order</option>
                      <option value="General Visit">General Visit</option>
                      <option value="Order Follow-up">Order Follow-up</option>
                    </select>
                    <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                  </div>
                </div>

                {/* Total Pending */}
                <div className="bg-[#F8F9FA] rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-gray-600">₹</span>
                      <span className="text-[14px] font-semibold text-gray-700">Total Pending</span>
                    </div>
                    <span className="text-[16px] font-bold text-black">₹23,290</span>
                  </div>

                  {/* Collection Amount */}
                  <label className="block text-[12px] text-[#627085] mb-1.5">Collection Amount(₹)</label>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 h-[44px] mb-1">
                    <span className="text-[14px] font-medium text-black">₹ 21,290</span>
                    <div className="ml-auto text-right">
                      <span className="text-[10px] text-gray-400 italic">Remaining Amount</span>
                      <p className="text-[12px] font-bold text-[#ED1D24]">₹ 200</p>
                    </div>
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[14px]">💳</span>
                    <span className="text-[14px] font-semibold text-gray-700">Payment Mode</span>
                  </div>
                  <div className="flex gap-3">
                    {['Online', 'Cash', 'Cheque'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPaymentMode(mode)}
                        className={`px-5 py-2.5 rounded-full text-[13px] font-semibold ${
                          paymentMode === mode
                            ? 'bg-black text-white'
                            : 'bg-white border border-gray-300 text-gray-600'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Date */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-gray-600" />
                    <span className="text-[14px] font-semibold text-gray-700">Select Date</span>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { label: 'Today', sub: 'Wed, Jan 7' },
                      { label: 'Tomorrow', sub: 'Thu, Jan 8' },
                      { label: 'Friday', sub: 'Fri, Jan 9' },
                    ].map((date) => (
                      <button
                        key={date.label}
                        onClick={() => setScheduleDate(date.label)}
                        className={`flex-1 py-2 rounded-full text-center border ${
                          scheduleDate === date.label
                            ? 'border-[#ED1D24] text-[#ED1D24]'
                            : 'border-gray-200 text-gray-500'
                        }`}
                      >
                        <span className="text-[12px] font-semibold block">{date.label}</span>
                        <span className="text-[10px] block">{date.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Time Slot */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} className="text-gray-600" />
                    <span className="text-[14px] font-semibold text-gray-700">Select Time Slot</span>
                  </div>
                  <div className="space-y-2">
                    {['1:00 PM - 3:00 PM', '1:00 PM - 3:00 PM', '1:00 PM - 3:00 PM'].map((time, i) => (
                      <button
                        key={i}
                        onClick={() => setScheduleTime(time + i)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-full border ${
                          scheduleTime === time + i
                            ? 'border-[#ED1D24]'
                            : 'border-gray-200'
                        }`}
                      >
                        <span className="text-[13px] font-medium text-black">{time}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          scheduleTime === time + i ? 'border-[#ED1D24]' : 'border-gray-300'
                        }`}>
                          {scheduleTime === time + i && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ED1D24]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm Schedule Button */}
                <button 
                  onClick={() => setIsScheduleOpen(false)}
                  className="w-full bg-[#ED1D24] text-white py-4 rounded-full text-[15px] font-bold active:scale-[0.98] transition-transform"
                >
                  Confirm Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisitsView;
