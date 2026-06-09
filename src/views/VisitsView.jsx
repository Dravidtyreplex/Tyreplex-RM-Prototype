import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin,
  Clock,
  X,
  Plus,
  Trash2,
  Pencil,
  Navigation,
  ClipboardX,
  MoreVertical,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  Eye,
  Phone,
  MessageSquare,
  Banknote,
  Upload
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

const getDistanceBetween = (dealerA, dealerB) => {
  const distances = {
    'Start Point-Modern Tyres & Service': 4.2,
    'Start Point-Super Wheel Care': 8.5,
    'Start Point-SAI RAM TYRES': 10.0,
    'Start Point-Lucky Tyre House': 7.2,
    'Start Point-Sharma Auto': 12.1,
    'Modern Tyres & Service-Super Wheel Care': 2.8,
    'Modern Tyres & Service-SAI RAM TYRES': 6.5,
    'Modern Tyres & Service-Lucky Tyre House': 5.0,
    'Modern Tyres & Service-Sharma Auto': 9.2,
    'Super Wheel Care-SAI RAM TYRES': 4.7,
    'Super Wheel Care-Lucky Tyre House': 3.9,
    'Super Wheel Care-Sharma Auto': 8.0,
    'SAI RAM TYRES-Lucky Tyre House': 2.5,
    'SAI RAM TYRES-Sharma Auto': 5.8,
    'Lucky Tyre House-Sharma Auto': 4.3,
  };
  const key = `${dealerA}-${dealerB}`;
  const reverseKey = `${dealerB}-${dealerA}`;
  return distances[key] || distances[reverseKey] || 3.5;
};

const VisitsView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: Upcoming, 1: Need Attention, 2: History
  const [month, setMonth] = useState('Jan, 2025');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Form states for schedule bottom sheet
  const [selectedDealer, setSelectedDealer] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('Collection');
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleTime, setScheduleTime] = useState('');
  const [paymentMode, setPaymentMode] = useState('Online');

  // Multi-visit stacked stops state
  const [stackedStops, setStackedStops] = useState([]);

  // Stacking handlers
  const handleAddStopToRoute = () => {
    if (!selectedDealer) return;
    const newStop = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      name: selectedDealer,
      reason: visitPurpose,
      time: scheduleTime || '09:00AM - 12:00PM'
    };
    setStackedStops([...stackedStops, newStop]);
    setSelectedDealer('');
    setVisitPurpose('Collection');
    setScheduleTime('');
  };

  const handleRemoveStop = (id) => {
    setStackedStops(stackedStops.filter(stop => stop.id !== id));
  };

  const handleMoveStopUp = (index) => {
    if (index === 0) return;
    const newStops = [...stackedStops];
    const temp = newStops[index];
    newStops[index] = newStops[index - 1];
    newStops[index - 1] = temp;
    setStackedStops(newStops);
  };

  const handleMoveStopDown = (index) => {
    if (index === stackedStops.length - 1) return;
    const newStops = [...stackedStops];
    const temp = newStops[index];
    newStops[index] = newStops[index + 1];
    newStops[index + 1] = temp;
    setStackedStops(newStops);
  };

  const getRouteDetails = () => {
    let stops = [...stackedStops];
    if (selectedDealer) {
      stops.push({
        id: 'active-form',
        name: selectedDealer,
        reason: visitPurpose,
        time: scheduleTime || '09:00AM - 12:00PM'
      });
    }

    let totalDist = 0;
    let prev = 'Start Point';

    stops.forEach((stop) => {
      totalDist += getDistanceBetween(prev, stop.name);
      prev = stop.name;
    });

    return {
      stopsCount: stops.length,
      totalDistance: parseFloat(totalDist.toFixed(1))
    };
  };

  // Nearby suggested dealers database
  const allDealersList = [
    { name: 'Modern Tyres & Service', locality: 'Sector 18, Noida', pending: '₹23,290' },
    { name: 'Super Wheel Care', locality: 'Gurgaon, Haryana', pending: '₹15,400' },
    { name: 'SAI RAM TYRES', locality: 'Rohini, Delhi', pending: '₹12,800' },
    { name: 'Lucky Tyre House', locality: 'Dwarka, Delhi', pending: '₹9,200' },
    { name: 'Sharma Auto', locality: 'Vijay Nagar, Ghaziabad', pending: '₹18,500' }
  ];

  const getSuggestedDealers = () => {
    if (stackedStops.length === 0) return [];

    const refDealer = stackedStops[stackedStops.length - 1].name;
    const stackedNames = stackedStops.map(s => s.name);
    
    return allDealersList
      .filter(d => d.name !== refDealer && !stackedNames.includes(d.name))
      .map(d => {
        const dist = getDistanceBetween(refDealer, d.name);
        
        // Determine smart badge: high pending balance gets "Collection Due" (green), short distance gets "Super Close" (blue)
        const numericPending = parseInt(d.pending.replace(/[^\d]/g, ''));
        let badge = { text: '⭐ Recommended', bg: 'bg-slate-50 text-slate-650 border-slate-100/50' };
        if (numericPending >= 15000) {
          badge = { text: '💰 Collection Due', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100/50' };
        } else if (dist <= 3.0) {
          badge = { text: '📍 Super Close', bg: 'bg-violet-50 text-violet-700 border-violet-100/50' };
        }

        return { ...d, distance: dist, badge };
      })
      .filter(d => d.distance <= 10.0)
      .sort((a, b) => a.distance - b.distance);
  };

  const suggestedDealers = getSuggestedDealers();

  // One-Tap Add Handler
  const handleAddSuggestedDealer = (dealerName) => {
    const timeSlots = ['09:00AM - 12:00PM', '12:00PM - 03:00PM', '03:00PM - 06:00PM'];
    let nextSlot = '12:00PM - 03:00PM';

    if (stackedStops.length > 0) {
      const lastSlot = stackedStops[stackedStops.length - 1].time;
      const lastIndex = timeSlots.indexOf(lastSlot);
      if (lastIndex !== -1 && lastIndex < timeSlots.length - 1) {
        nextSlot = timeSlots[lastIndex + 1];
      } else {
        nextSlot = '03:00PM - 06:00PM';
      }
    }

    const newStop = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      name: dealerName,
      reason: 'Collection', // default
      time: nextSlot
    };

    setStackedStops([...stackedStops, newStop]);
    setSelectedDealer('');
    setVisitPurpose('Collection');
    setScheduleTime('');
  };

  // active visit punch-in state
  const [punchedInVisitId, setPunchedInVisitId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'paid' or 'unpaid'
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Log Payment bottom sheet states
  const [isLogPaymentOpen, setIsLogPaymentOpen] = useState(false);
  const [selectedVisitForPayment, setSelectedVisitForPayment] = useState(null);
  const [logPaymentAmount, setLogPaymentAmount] = useState('');
  const [logPaymentMode, setLogPaymentMode] = useState('Online');
  const [logPaymentRemarks, setLogPaymentRemarks] = useState('');
  const [loggedPayments, setLoggedPayments] = useState({});
  const [punchInTimes, setPunchInTimes] = useState({});

  // Grouped days of visits
  const [days, setDays] = useState([
    {
      id: 'today',
      title: 'Today, Nov 23',
      visitsCount: 3,
      isCollapsed: false,
      visits: [
        {
          id: '20456',
          name: 'VANSUN VENTURES PRIVATE LIMITED',
          locality: 'Haryana',
          time: '9:00AM - 12:00PM',
          type: 'Collection',
          status: 'Scheduled',
          distance: '8.5 KM'
        },
        {
          id: '20489',
          name: 'Modern Tyres & Service',
          locality: 'Sector 18, Noida',
          time: '12:00PM - 03:00PM',
          type: 'Collection',
          status: 'Scheduled',
          distance: '4.2 KM'
        },
        {
          id: '20501',
          name: 'Super Wheel Care',
          locality: 'Gurgaon, Haryana',
          time: '03:00PM - 06:00PM',
          type: 'General Visit',
          status: 'Scheduled',
          distance: null
        }
      ]
    },
    {
      id: 'tomorrow',
      title: 'Tomorrow, Nov 24',
      visitsCount: 5,
      isCollapsed: true,
      visits: [
        {
          id: '20502',
          name: 'SAI RAM TYRES',
          locality: 'Rohini, Delhi',
          time: '09:00AM - 12:00PM',
          type: 'Collection',
          status: 'Scheduled',
          distance: '10.0 KM'
        },
        {
          id: '20503',
          name: 'Lucky Tyre House',
          locality: 'Dwarka, Delhi',
          time: '12:00PM - 03:00PM',
          type: 'Order Follow-up',
          status: 'Scheduled',
          distance: '5.5 KM'
        },
        {
          id: '20504',
          name: 'Sharma Auto',
          locality: 'Vijay Nagar, Ghaziabad',
          time: '03:00PM - 06:00PM',
          type: 'New Order',
          status: 'Scheduled',
          distance: null
        }
      ]
    }
  ]);

  const [needAttentionVisits, setNeedAttentionVisits] = useState([
    {
      id: '20412',
      name: 'SAI RAM TYRES',
      locality: 'Rohini, Delhi',
      time: '04:00 PM - 05:00 PM',
      date: '12 May, 2026',
      status: 'Missed',
      reason: 'Dealer was not available at the store',
      description: 'Scheduled collection visit but owner had to leave early.',
    }
  ]);

  const [historyVisits, setHistoryVisits] = useState([
    {
      id: '20398',
      name: 'Gupta Tyres & Accessories',
      locality: 'Dwarka, Delhi',
      time: '10:00 AM - 11:30 AM',
      date: 'Mon, Nov 5',
      status: 'Completed',
      collected: '₹11,400',
      completedTime: '01:54 PM',
      description: 'The scheduled visit completed.',
    },
    {
      id: '20399',
      name: 'Gupta Tyres & Accessories',
      locality: 'Dwarka, Delhi',
      time: '12:00 PM - 01:30 PM',
      date: 'Mon, Nov 5',
      status: 'Cancelled',
      reason: 'Shop Closed / Unavailable',
      completedTime: '12:54 PM',
      description: 'The scheduled is cancelled',
    }
  ]);

  // Collapsible handler
  const toggleDayCollapse = (dayId) => {
    setDays(days.map(d => d.id === dayId ? { ...d, isCollapsed: !d.isCollapsed } : d));
  };

  // Stats matching mockup dynamically
  const activeVisitsCount = days.reduce((acc, d) => acc + d.visits.length, 0);
  const addedActiveVisits = Math.max(0, activeVisitsCount - 6); // base original active is 6
  const totalVisitsCount = 22 + historyVisits.length + addedActiveVisits;
  const completedVisitsCount = 17 + historyVisits.filter(v => v.status === 'Completed').length;
  const pendingVisitsCount = (11 - historyVisits.filter(v => v.status === 'Completed').length) + addedActiveVisits;
  const cancelVisitsCount = 17 + historyVisits.filter(v => v.status === 'Cancelled').length;

  const stats = [
    { label: 'Total Visits', value: totalVisitsCount.toString(), color: 'text-[#ED1D24]' },
    { label: 'Completed', value: completedVisitsCount.toString(), color: 'text-black' },
    { label: 'Pending', value: pendingVisitsCount.toString(), color: 'text-black' },
    { label: 'Cancel', value: cancelVisitsCount.toString(), color: 'text-black' },
  ];

  // Start Visit (Punch In)
  const handlePunchIn = (visitId) => {
    setPunchedInVisitId(visitId);
    setPaymentStatus(null);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPunchInTimes(prev => ({
      ...prev,
      [visitId]: now
    }));
  };

  // Open Log Payment Sheet
  const handleOpenLogPayment = (visit) => {
    setSelectedVisitForPayment(visit);
    const existing = loggedPayments[visit.id];
    if (existing) {
      setLogPaymentAmount(existing.amount);
      setLogPaymentMode(existing.mode);
      setLogPaymentRemarks(existing.remarks);
    } else {
      setLogPaymentAmount('');
      setLogPaymentMode('Online');
      setLogPaymentRemarks('');
    }
    setIsLogPaymentOpen(true);
  };

  // Submit Log Payment
  const handleLogPaymentSubmit = () => {
    if (!selectedVisitForPayment || !logPaymentAmount) return;
    setLoggedPayments(prev => ({
      ...prev,
      [selectedVisitForPayment.id]: {
        amount: logPaymentAmount,
        mode: logPaymentMode,
        remarks: logPaymentRemarks
      }
    }));
    setIsLogPaymentOpen(false);
  };

  // End Visit (Punch Out)
  const handlePunchOut = (visitId) => {
    let completedVisit = null;
    const lp = loggedPayments[visitId];
    
    // Find in days list
    let visitFound = false;
    const updatedDays = days.map(day => {
      const v = day.visits.find(visit => visit.id === visitId);
      if (v) {
        completedVisit = {
          ...v,
          status: 'Completed',
          date: day.title.split(', ')[1] || 'Today',
          collected: lp ? `₹${parseInt(lp.amount).toLocaleString('en-IN')}` : null,
          paymentStatus: lp ? 'paid' : 'unpaid',
          completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        visitFound = true;
        return {
          ...day,
          visitsCount: Math.max(0, day.visitsCount - 1),
          visits: day.visits.filter(visit => visit.id !== visitId)
        };
      }
      return day;
    });

    if (visitFound) {
      setDays(updatedDays);
      if (completedVisit) {
        setHistoryVisits([completedVisit, ...historyVisits]);
      }
    }

    setPunchedInVisitId(null);
    setActiveTab(1); // Redirect to History
  };

  // Cancel Visit Action
  const handleCancelVisit = (visitId) => {
    let cancelledVisit = null;
    let visitFound = false;

    const updatedDays = days.map(day => {
      const v = day.visits.find(visit => visit.id === visitId);
      if (v) {
        cancelledVisit = {
          ...v,
          status: 'Cancelled',
          date: day.title.split(', ')[1] || 'Today',
          reason: 'Cancelled by user'
        };
        visitFound = true;
        return {
          ...day,
          visitsCount: Math.max(0, day.visitsCount - 1),
          visits: day.visits.filter(visit => visit.id !== visitId)
        };
      }
      return day;
    });

    if (visitFound) {
      setDays(updatedDays);
      if (cancelledVisit) {
        setHistoryVisits([cancelledVisit, ...historyVisits]);
      }
    }
    setActiveMenuId(null);
  };

  // Edit Visit action
  const handleEditVisit = (visitId) => {
    let visitToEdit = null;
    days.forEach(day => {
      const v = day.visits.find(visit => visit.id === visitId);
      if (v) visitToEdit = v;
    });

    if (visitToEdit) {
      setSelectedDealer(visitToEdit.name);
      setVisitPurpose(visitToEdit.type);
      setIsScheduleOpen(true);
    }
    setActiveMenuId(null);
  };

  // Bottom Sheet confirm schedule
  const handleConfirmSchedule = () => {
    if (stackedStops.length === 0 && !selectedDealer) return;

    const visitsToAdd = [];
    let prevDealer = 'Start Point';

    const getLocality = (name) => {
      if (name === 'Modern Tyres & Service') return 'Sector 18, Noida';
      if (name === 'Super Wheel Care') return 'Gurgaon, Haryana';
      if (name === 'SAI RAM TYRES') return 'Rohini, Delhi';
      if (name === 'Lucky Tyre House') return 'Dwarka, Delhi';
      if (name === 'Sharma Auto') return 'Vijay Nagar, Ghaziabad';
      return 'Noida';
    };

    // Add stacked stops
    stackedStops.forEach((stop) => {
      const dist = getDistanceBetween(prevDealer, stop.name);
      visitsToAdd.push({
        id: stop.id,
        name: stop.name,
        locality: getLocality(stop.name),
        time: stop.time,
        type: stop.reason,
        status: 'Scheduled',
        distance: `${dist} KM`
      });
      prevDealer = stop.name;
    });

    // Add active form stop if selected
    if (selectedDealer) {
      const dist = getDistanceBetween(prevDealer, selectedDealer);
      visitsToAdd.push({
        id: Math.floor(10000 + Math.random() * 90000).toString(),
        name: selectedDealer,
        locality: getLocality(selectedDealer),
        time: scheduleTime || '09:00AM - 12:00PM',
        type: visitPurpose || 'General Visit',
        status: 'Scheduled',
        distance: `${dist} KM`
      });
    }

    // Add to Today or Tomorrow based on selection
    const targetDayId = scheduleDate === 'Today' ? 'today' : 'tomorrow';
    setDays(days.map(day => {
      if (day.id === targetDayId) {
        return {
          ...day,
          visitsCount: day.visitsCount + visitsToAdd.length,
          visits: [...visitsToAdd, ...day.visits]
        };
      }
      return day;
    }));

    setIsScheduleOpen(false);
    setStackedStops([]);
    setSelectedDealer('');
    setVisitPurpose('Collection');
    setScheduleDate('Today');
    setScheduleTime('');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F9FAFB]">
      {/* Centered App Bar */}
      <header className="bg-white h-14 flex items-center justify-between px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-50 rounded-full transition-colors" aria-label="Go back">
          <ChevronLeft size={21} className="text-slate-800" />
        </button>
        <h1 className="text-slate-800 text-[16px] font-bold">My Route</h1>
        <div className="w-9" /> {/* Spacer to align title */}
      </header>

      {/* Month Selector */}
      <div className="flex justify-center mt-3">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-xs">
          <button className="p-1 hover:bg-slate-50 rounded-md transition-colors"><ChevronLeft size={16} className="text-slate-650" /></button>
          <span className="mx-4 text-xs font-bold text-[#ED1D24] uppercase tracking-wider">{month}</span>
          <button className="p-1 hover:bg-slate-50 rounded-md transition-colors"><ChevronRight size={16} className="text-slate-300" /></button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mx-4 mt-4 bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between py-3">
        {stats.map((stat, i) => (
          <React.Fragment key={i}>
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className={`text-[11px] font-semibold leading-none mb-2 ${i === 0 ? 'text-[#ED1D24]' : 'text-slate-400'}`}>
                {stat.label}
              </span>
              <span className={`text-[15px] font-bold leading-none ${i === 0 ? 'text-[#ED1D24]' : 'text-slate-800'}`}>
                {stat.value}
              </span>
            </div>
            {i < stats.length - 1 && (
              <div className="w-[1px] h-8 bg-slate-100" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 px-4 mt-4 shrink-0">
        {['Route Planning', 'History'].map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
              activeTab === i 
                ? 'bg-white border-[#ED1D24] text-[#ED1D24]' 
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 0 && (
          <div className="space-y-4">
            <h2 className="text-slate-500 text-sm font-bold pl-1">Schedule</h2>

            {days.map((day) => {
              const hasPunchedInInside = day.visits.some(v => v.id === punchedInVisitId);
              
              return (
                <div key={day.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100">
                  {/* Collapsible Header */}
                  <div 
                    onClick={() => toggleDayCollapse(day.id)}
                    className="flex items-center justify-between px-4 py-3.5 bg-white cursor-pointer active:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Calendar size={14} className="text-slate-500" />
                      </div>
                      <span className="text-[13px] font-extrabold text-slate-800">
                        {day.title}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {day.visitsCount} Visit
                      </span>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-slate-400 transition-transform duration-200 ${
                        day.isCollapsed ? '-rotate-90' : ''
                      }`} 
                    />
                  </div>

                  {/* List of Visits */}
                  {!day.isCollapsed && (
                    <div className="px-4 pb-4 pt-2 bg-white">
                      <div className="space-y-3">
                        {day.visits.map((visit, index) => {
                          const isPunchedIn = punchedInVisitId === visit.id;
                          const isAnyPunchedIn = punchedInVisitId !== null;

                          return (
                            <div key={visit.id}>
                              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs relative">

                                <div className="flex justify-between items-start mb-2">
                                  {/* Type badge on top left */}
                                  <div className="flex items-center gap-2">
                                    <span className="bg-orange-50/80 border border-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                      {visit.type}
                                    </span>
                                    {isPunchedIn && (
                                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Active Visit
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Three-dots menu */}
                                  <div className="relative">
                                    <button
                                      onClick={() => setActiveMenuId(activeMenuId === visit.id ? null : visit.id)}
                                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                      <MoreVertical size={16} />
                                    </button>
                                    
                                    <AnimatePresence>
                                      {activeMenuId === visit.id && (
                                        <>
                                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                                          <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 overflow-hidden"
                                          >
                                            <button
                                              onClick={() => {
                                                navigate('/dealer-detail');
                                                setActiveMenuId(null);
                                              }}
                                              className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-50 font-medium"
                                            >
                                              <Eye size={13} className="text-slate-400" />
                                              View Dealer Details
                                            </button>
                                            <button
                                              onClick={() => handleEditVisit(visit.id)}
                                              className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-50 font-medium"
                                            >
                                              <Pencil size={13} className="text-slate-400" />
                                              Edit Visit Details
                                            </button>
                                            <button
                                              onClick={() => handleCancelVisit(visit.id)}
                                              className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                            >
                                              <X size={13} className="text-red-400" />
                                              Cancel Visit
                                            </button>
                                          </motion.div>
                                        </>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                                {/* Time line with clock */}
                                <div className="flex items-center gap-1.5 text-slate-400 mt-2">
                                  <Clock size={13} />
                                  <span className="text-[11px] font-medium text-slate-400">
                                    {visit.time.replace(' - ', '- ')}{isPunchedIn && punchInTimes[visit.id] ? ` • Punched in at ${punchInTimes[visit.id]}` : ''}
                                  </span>
                                </div>

                                {/* Dealer Name */}
                                <h3 className="font-bold text-sm text-black leading-snug mt-2">
                                  {visit.name.toUpperCase()}
                                </h3>
                                <p className="text-slate-400 text-xs font-semibold mt-1">
                                  ({visit.locality})
                                </p>

                                {/* Logged Payment Banner */}
                                {loggedPayments[visit.id] && (
                                  <div className="mt-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-emerald-600">Payment Logged:</span>
                                    <span>₹{parseInt(loggedPayments[visit.id].amount).toLocaleString('en-IN')} ({loggedPayments[visit.id].mode})</span>
                                  </div>
                                )}

                                {/* Actions Row */}
                                <div className="flex gap-3 mt-4">
                                  {isPunchedIn ? (
                                    <button 
                                      onClick={() => handleOpenLogPayment(visit)}
                                      className="flex-1 py-2 rounded-full border border-[#ED1D24] text-[#ED1D24] text-xs font-bold hover:bg-red-50/20 flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                      <CreditCard size={13} className="text-[#ED1D24]" />
                                      Add Payment
                                    </button>
                                  ) : (
                                    <button className="flex-1 py-2 rounded-full border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
                                      <Navigation size={13} className="rotate-45 text-slate-400" />
                                      Navigate
                                    </button>
                                  )}

                                  <button
                                    onClick={() => isPunchedIn ? handlePunchOut(visit.id) : handlePunchIn(visit.id)}
                                    disabled={!isPunchedIn && isAnyPunchedIn}
                                    className={`flex-1 py-2 rounded-full text-xs font-bold transition-all active:scale-[0.98] ${
                                      isPunchedIn
                                        ? 'bg-[#ED1D24] text-white hover:bg-red-600'
                                        : isAnyPunchedIn
                                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                          : 'bg-[#ED1D24] text-white hover:bg-red-600'
                                    }`}
                                  >
                                    {isPunchedIn ? 'Punch Out' : 'Punch In'}
                                  </button>
                                </div>
                              </div>

                              {/* Distance separator line */}
                              {index < day.visits.length - 1 && day.visits[index].distance && (
                                <div className="flex items-center my-3.5 px-2">
                                  <div className="flex-1 border-t border-dashed border-slate-200" />
                                  <div className="flex items-center gap-1 mx-3 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-xs text-[10px] font-bold text-slate-500">
                                    <MapPin size={10} className="text-slate-400" />
                                    <span>{day.visits[index].distance}</span>
                                  </div>
                                  <div className="flex-1 border-t border-dashed border-slate-200" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {days.every(d => d.visitsCount === 0) && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <CheckCircle2 size={40} className="mb-3 opacity-20 text-green-500" />
                <span className="text-sm font-semibold">All visits for today completed!</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-4">
            {historyVisits.map((visit) => {
              const isCompleted = visit.status === 'Completed';
              return (
                <div key={visit.id} className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#E5E9EB] relative">
                  {/* Header Row */}
                  <div className="flex justify-between items-center mb-2.5">
                    <h3 className="font-extrabold text-[15px] text-black leading-snug max-w-[70%] uppercase tracking-wide">
                      {visit.name.toUpperCase()}
                    </h3>
                    <span className={`text-[12px] font-semibold px-4 py-1.5 rounded-full border transition-all ${
                      isCompleted 
                        ? 'border-[#28A745] text-[#28A745] bg-white' 
                        : 'border-[#FF4D4D] text-[#FF4D4D] bg-white'
                    }`}>
                      {visit.status}
                    </span>
                  </div>

                  {/* Time row with clock icon */}
                  <div className="flex items-center gap-2 text-slate-500 mb-4">
                    <div className="w-[22px] h-[22px] rounded bg-[#FFF9E6] flex items-center justify-center border border-[#FFF3D1]/40 shrink-0">
                      <Clock size={12} className="text-[#627085]" />
                    </div>
                    <span className="text-[13px] font-medium text-[#627085]">
                      {visit.date} • Punch-out at {visit.completedTime || (isCompleted ? '01:54 PM' : '12:54 PM')}
                    </span>
                  </div>

                  {/* Bottom box inside light gray container */}
                  <div className="bg-[#F8F9FA] rounded-[16px] p-4 border border-[#F1F3F5]">
                    <p className="text-[#627085] text-[13px] font-medium mb-2.5">
                      {isCompleted ? 'The scheduled visit completed.' : 'The scheduled is cancelled'}
                    </p>
                    <div className="h-[1px] bg-[#EAECEF] w-full mb-3" />
                    
                    {isCompleted ? (
                      <div className="text-[13.5px] font-semibold">
                        <span className="text-[#00875A] font-extrabold">Collected:</span>{' '}
                        <span className="text-black font-extrabold">{visit.collected || '₹11,400'}</span>
                      </div>
                    ) : (
                      <div className="text-[13.5px] font-semibold">
                        <span className="text-[#ED1D24] font-extrabold">Reason:</span>{' '}
                        <span className="text-black font-extrabold">{visit.reason || 'Shop Closed / Unavailable'}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {historyVisits.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Calendar size={40} className="mb-3 opacity-20" />
                <span className="text-sm font-semibold">No history visits yet.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Button */}
      <div className="bg-[#F9FAFB] px-4 py-3 border-t border-slate-50 shrink-0 sticky bottom-0 z-10">
        <button 
          onClick={() => setIsScheduleOpen(true)}
          className="w-full bg-[#ED1D24] text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:bg-red-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Schedule New Visit
        </button>
      </div>

      {/* Schedule Visit Bottom Sheet */}
      <AnimatePresence>
        {isScheduleOpen && (
          <motion.div key="schedule-sheet" className="fixed inset-0 z-[100] flex flex-col justify-end items-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsScheduleOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-[25px] flex flex-col max-h-[90vh] overflow-hidden w-full max-w-[430px] z-50 shadow-2xl"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2 shrink-0">
                <div className="w-[40px] h-1.5 bg-slate-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex justify-between items-center px-5 pb-4 border-b border-slate-50 shrink-0">
                <h3 className="text-[17px] font-extrabold text-slate-800">Schedule New Visit</h3>
                <button onClick={() => setIsScheduleOpen(false)} className="p-1 hover:bg-slate-50 rounded-full transition-colors">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4 no-scrollbar">
                {/* Simplified Route Stops list */}
                {stackedStops.length > 0 && (
                  <div className="mb-5 space-y-2">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wide block">
                      Route Stops ({stackedStops.length})
                    </span>
                    <div className="space-y-2">
                      {stackedStops.map((stop, index) => {
                        const prevDealer = index === 0 ? 'Start Point' : stackedStops[index - 1].name;
                        const segmentDist = getDistanceBetween(prevDealer, stop.name);

                        return (
                          <div key={stop.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-2xs">
                            <div className="flex-1 pr-3">
                              <div className="flex items-baseline gap-2">
                                <span className="text-[11px] font-extrabold text-[#ED1D24]">Stop {index + 1}</span>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate max-w-[170px]">
                                  {stop.name}
                                </h4>
                              </div>
                              <p className="text-[10px] text-slate-400 font-semibold mt-1">
                                🕒 {stop.time.replace(' - ', '-')} • {stop.reason} • {segmentDist} KM
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveStop(stop.id)}
                              className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                              title="Remove"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Form fields section */}
                <div className="space-y-4">
                  {/* Select Dealer */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">Select Dealer</label>
                    <div className="relative">
                      <select 
                        value={selectedDealer}
                        onChange={(e) => setSelectedDealer(e.target.value)}
                        className="w-full h-[48px] px-4 border border-slate-200 rounded-full text-[13px] text-slate-800 appearance-none outline-none bg-white font-medium focus:border-red-500"
                      >
                        <option value="">Choose a dealer...</option>
                        <option value="Modern Tyres & Service">Modern Tyres & Service</option>
                        <option value="Super Wheel Care">Super Wheel Care</option>
                        <option value="SAI RAM TYRES">SAI RAM TYRES</option>
                        <option value="Lucky Tyre House">Lucky Tyre House</option>
                        <option value="Sharma Auto">Sharma Auto</option>
                      </select>
                      <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                    </div>
                  </div>

                  {/* Suggested Nearby Dealers */}
                  {suggestedDealers.length > 0 && (
                    <div className="mt-2.5 mb-2">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Suggested Nearby Dealers (Under 10 KM)</label>
                      <div className="flex gap-3 overflow-x-auto pb-2.5 no-scrollbar scroll-smooth">
                        {suggestedDealers.map((dealer) => (
                          <button
                            key={dealer.name}
                            type="button"
                            onClick={() => handleAddSuggestedDealer(dealer.name)}
                            className="bg-white border border-slate-200 rounded-2xl p-4 min-w-[170px] max-w-[185px] flex flex-col justify-between text-left hover:border-red-500 shadow-2xs shrink-0 transition-all active:scale-[0.98]"
                          >
                            <div className="flex justify-between items-start gap-1 w-full">
                              <span className="font-extrabold text-[12px] text-slate-800 uppercase tracking-tight line-clamp-2 leading-tight">
                                {dealer.name}
                              </span>
                              <span className="text-[10px] font-extrabold text-[#ED1D24] shrink-0 bg-red-50 px-1.5 py-0.5 rounded-md">
                                {dealer.distance} KM
                              </span>
                            </div>
                            <div className="mt-1">
                              <span className="text-[10px] font-semibold text-slate-400 block">
                                {dealer.locality}
                              </span>
                              <span className="text-[9px] font-bold text-slate-450 mt-0.5 block">
                                Bal: {dealer.pending}
                              </span>
                            </div>
                            <div className={`${dealer.badge.bg} rounded-md px-2 py-0.5 mt-3 text-[9px] font-extrabold self-start flex items-center gap-1 border`}>
                              <span>{dealer.badge.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Select Reason */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">Select Reason</label>
                    <div className="relative">
                      <select 
                        value={visitPurpose}
                        onChange={(e) => setVisitPurpose(e.target.value)}
                        className="w-full h-[48px] px-4 border border-slate-200 rounded-full text-[13px] text-slate-800 appearance-none outline-none bg-white font-medium focus:border-red-500"
                      >
                        <option value="Collection">Collection</option>
                        <option value="New Order">New Order</option>
                        <option value="General Visit">General Visit</option>
                        <option value="Order Follow-up">Order Follow-up</option>
                      </select>
                      <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                    </div>
                  </div>

                  {/* Conditional Payment details: only shown if Visit Purpose is Collection */}
                  {visitPurpose === 'Collection' && (
                    <>
                      {/* Total Pending */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-slate-500">₹</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Pending</span>
                          </div>
                          <span className="text-[16px] font-black text-slate-800">₹23,290</span>
                        </div>
                      </div>

                      {/* Payment Mode */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wide">Payment Mode</label>
                        <div className="flex gap-2">
                          {['Online', 'Cash', 'Cheque'].map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setPaymentMode(mode)}
                              className={`flex-1 py-2.5 rounded-full text-[12px] font-bold border transition-all ${
                                paymentMode === mode
                                  ? 'bg-slate-900 text-white border-transparent shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Select Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wide">Select Date</label>
                    <div className="flex gap-2">
                      {[
                        { label: 'Today', sub: 'Wed, Jan 7' },
                        { label: 'Tomorrow', sub: 'Thu, Jan 8' },
                      ].map((date) => (
                        <button
                          key={date.label}
                          type="button"
                          onClick={() => setScheduleDate(date.label)}
                          className={`flex-1 py-2 rounded-2xl text-center border transition-all ${
                            scheduleDate === date.label
                              ? 'border-red-500 bg-red-50/30 text-[#ED1D24] shadow-xs'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50 bg-white'
                          }`}
                        >
                          <span className="text-[12px] font-bold block">{date.label}</span>
                          <span className="text-[10px] block opacity-80">{date.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Time Slot */}
                  <div className="pb-2">
                    <label className="block text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wide">Select Time Slot</label>
                    <div className="space-y-2">
                      {['09:00AM - 12:00PM', '12:00PM - 03:00PM', '03:00PM - 06:00PM'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setScheduleTime(time)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-full border transition-all ${
                            scheduleTime === time
                              ? 'border-red-500 bg-red-50/20 text-[#ED1D24] font-bold shadow-xs'
                              : 'border-slate-200 hover:bg-slate-50 bg-white text-slate-700'
                          }`}
                        >
                          <span className="text-xs font-semibold">{time}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            scheduleTime === time ? 'border-red-500 bg-red-500' : 'border-slate-350'
                          }`}>
                            {scheduleTime === time && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add Stop Button */}
                {selectedDealer && (
                  <div className="my-5">
                    <button
                      type="button"
                      onClick={handleAddStopToRoute}
                      className="w-full py-3 rounded-full border border-dashed border-[#ED1D24] text-[#ED1D24] bg-red-50/5 text-xs font-extrabold hover:bg-red-50/10 flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                    >
                      + Add Another Visit to Route
                    </button>
                  </div>
                )}

                {/* Route Summary */}
                {stackedStops.length > 0 && (() => {
                  const details = getRouteDetails();
                  return (
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mt-5 mb-4 shadow-2xs">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <span>
                          Total Stops: <span className="text-slate-800 font-extrabold text-[13px] ml-1">{details.stopsCount}</span>
                        </span>
                        <span>
                          Total Route: <span className="text-slate-800 font-extrabold text-[13px] ml-1">{details.totalDistance} KM</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Confirm Button */}
                <button 
                  onClick={handleConfirmSchedule}
                  disabled={stackedStops.length === 0 && !selectedDealer}
                  className="w-full bg-[#ED1D24] text-white py-4 rounded-full text-sm font-bold shadow-md hover:bg-red-600 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] mt-4"
                >
                  {stackedStops.length > 0 ? 'Confirm Route & Schedule' : 'Confirm Schedule'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log Payment Bottom Sheet */}
      <BottomSheet 
        isOpen={isLogPaymentOpen} 
        onClose={() => setIsLogPaymentOpen(false)} 
        title="Log Payment"
        subtitle={selectedVisitForPayment?.name}
      >
        <div className="space-y-5">
          {/* Payment Mode */}
          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2 uppercase tracking-wide">Payment Mode <span className="text-[#ED1D24]">*</span></label>
            <div className="flex gap-3">
              {['Cash', 'Online', 'Cheque'].map(mode => (
                <button 
                  key={mode}
                  type="button"
                  onClick={() => setLogPaymentMode(mode)}
                  className={`flex-1 py-3 rounded-full text-[13px] font-bold border transition-all ${
                    logPaymentMode === mode 
                      ? 'border-[#ED1D24] text-[#ED1D24] bg-red-50/20' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Collected */}
          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2 uppercase tracking-wide">Amount Collected <span className="text-[#ED1D24]">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input 
                type="number" 
                value={logPaymentAmount}
                onChange={(e) => setLogPaymentAmount(e.target.value)}
                placeholder="Enter Amount" 
                className="w-full h-[48px] pl-9 pr-4 rounded-full border border-slate-200 text-[14px] font-medium outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Payment Proof */}
          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2 uppercase tracking-wide">Payment Proof <span className="text-[#ED1D24]">*</span></label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl py-8 flex flex-col items-center justify-center bg-[#F9FAFB] cursor-pointer">
              <Upload size={24} className="text-slate-400 mb-2" />
              <p className="text-[13px] font-bold text-slate-800">Click To Upload</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">SVG, PNG, JPG, PDF</p>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-[13px] font-bold text-slate-800 mb-2 uppercase tracking-wide">Remarks</label>
            <textarea 
              rows="3" 
              value={logPaymentRemarks}
              onChange={(e) => setLogPaymentRemarks(e.target.value)}
              placeholder="Add your Remarks Here" 
              className="w-full p-4 rounded-2xl border border-slate-200 text-[13px] outline-none resize-none focus:border-red-500"
            ></textarea>
          </div>

          <button 
            type="button"
            onClick={handleLogPaymentSubmit}
            disabled={!logPaymentAmount}
            className={`w-full py-4 rounded-full text-[14px] font-bold text-white transition-colors ${
              logPaymentAmount 
                ? 'bg-[#ED1D24] hover:bg-[#d31c22] active:scale-[0.98]' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};

export default VisitsView;
