import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
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
  Upload,
  GripVertical
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
    'Start Point-VANSUN VENTURES PRIVATE LIMITED': 6.0,
    'VANSUN VENTURES PRIVATE LIMITED-Modern Tyres & Service': 8.5,
    'VANSUN VENTURES PRIVATE LIMITED-Super Wheel Care': 11.2,
    'VANSUN VENTURES PRIVATE LIMITED-SAI RAM TYRES': 14.5,
    'VANSUN VENTURES PRIVATE LIMITED-Lucky Tyre House': 9.8,
    'VANSUN VENTURES PRIVATE LIMITED-Sharma Auto': 15.0,
    'Start Point-Modern Tyres & Service': 4.2,
    'Start Point-Super Wheel Care': 8.5,
    'Start Point-SAI RAM TYRES': 10.0,
    'Start Point-Lucky Tyre House': 7.2,
    'Start Point-Sharma Auto': 12.1,
    'Modern Tyres & Service-Super Wheel Care': 4.2,
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

const recalculatedDistances = (visitsList) => {
  return visitsList.map((v, i) => {
    if (i === visitsList.length - 1) {
      return { ...v, distance: null };
    }
    const dist = getDistanceBetween(v.name, visitsList[i + 1].name);
    return { ...v, distance: `${dist} KM` };
  });
};

const VisitsView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0: Upcoming, 1: Need Attention, 2: History
  const [month, setMonth] = useState('Jan, 2025');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Form states for schedule bottom sheet
  const [selectedDealer, setSelectedDealer] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('Collection');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [paymentMode, setPaymentMode] = useState('Online');

  // Suggestion card expanding states
  const [expandingDealerName, setExpandingDealerName] = useState(null);
  const [inlineReason, setInlineReason] = useState('Collection');
  const [inlineTime, setInlineTime] = useState('09:00AM - 12:00PM');
  const [showManualForm, setShowManualForm] = useState(false);

  // Multi-visit stacked stops state
  const [stackedStops, setStackedStops] = useState([]);
  const [selectedRadius, setSelectedRadius] = useState(10);

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
    setShowManualForm(false);
  };

  const handleRemoveStop = (id) => {
    setStackedStops(stackedStops.filter(stop => stop.id !== id));
  };

  const handleEditStagedStop = (stop) => {
    setSelectedDealer(stop.name);
    setVisitPurpose(stop.reason);
    setScheduleTime(stop.time);
    setStackedStops(stackedStops.filter(s => s.id !== stop.id));
  };

  const handleReorderStackedStops = (newStopsOrder) => {
    const originalTimes = stackedStops.map(s => s.time);
    const updatedStops = newStopsOrder.map((stop, idx) => ({
      ...stop,
      time: originalTimes[idx] || stop.time
    }));
    setStackedStops(updatedStops);
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

  const getDayRouteDistance = (visitsList) => {
    if (!visitsList || visitsList.length === 0) return 0;
    let totalDist = 0;
    let prev = 'Start Point';
    visitsList.forEach((v) => {
      totalDist += getDistanceBetween(prev, v.name);
      prev = v.name;
    });
    return parseFloat(totalDist.toFixed(1));
  };

  // Nearby suggested dealers database
  const allDealersList = [
    { name: 'Modern Tyres & Service', locality: 'Sector 18, Noida', pending: '₹23,290' },
    { name: 'Super Wheel Care', locality: 'Gurgaon, Haryana', pending: '₹15,400' },
    { name: 'SAI RAM TYRES', locality: 'Rohini, Delhi', pending: '₹12,800' },
    { name: 'Lucky Tyre House', locality: 'Dwarka, Delhi', pending: '₹9,200' },
    { name: 'Sharma Auto', locality: 'Vijay Nagar, Ghaziabad', pending: '₹18,500' },
    { name: 'Delhi Tyre World', locality: 'Dwarka, Delhi', pending: '₹0', notVisitedDays: 10 },
    { name: 'Capital Wheels', locality: 'Dwarka, Delhi', pending: '₹0', notVisitedDays: 15 }
  ];

  const getSuggestedDealers = () => {
    if (stackedStops.length === 0) return [];

    const refDealer = stackedStops[stackedStops.length - 1].name;
    const stackedNames = stackedStops.map(s => s.name);
    
    return allDealersList
      .filter(d => d.name !== refDealer && !stackedNames.includes(d.name))
      .map(d => {
        const dist = getDistanceBetween(refDealer, d.name);
        
        // Determine smart badge: pending balance gets "Collection", short distance gets "Super Close", others get "Never Visited"
        const numericPending = parseInt(d.pending.replace(/[^\d]/g, '')) || 0;
        let badgeText = 'Never Visited';
        
        if (numericPending > 0) {
          badgeText = 'Collection';
        } else if (dist <= 3.0) {
          badgeText = 'Super Close';
        }

        const badge = { text: badgeText, bg: 'bg-slate-50 text-slate-650 border-slate-100/50' };

        return { ...d, distance: dist, badge };
      })
      .filter(d => d.distance <= selectedRadius)
      .sort((a, b) => a.distance - b.distance);
  };

  const suggestedDealers = getSuggestedDealers();

  // Handle suggestion selection - instantly schedules/adds visit to route stops
  const handleAddSuggestedDealer = (dealerName) => {
    const timeSlots = ['09:00AM - 12:00PM', '12:00PM - 03:00PM', '03:00PM - 06:00PM'];
    let nextSlot = '09:00AM - 12:00PM';

    if (stackedStops.length > 0) {
      const lastSlot = stackedStops[stackedStops.length - 1].time;
      const lastIndex = timeSlots.indexOf(lastSlot);
      if (lastIndex !== -1 && lastIndex < timeSlots.length - 1) {
        nextSlot = timeSlots[lastIndex + 1];
      } else {
        nextSlot = '03:00PM - 06:00PM';
      }
    }

    // Auto-detect if they have collection due and default the purpose
    const dealerData = allDealersList.find(d => d.name === dealerName);
    let autoReason = 'General Visit';
    if (dealerData) {
      const numericPending = parseInt(dealerData.pending.replace(/[^\d]/g, '')) || 0;
      if (numericPending > 0) {
        autoReason = 'Collection';
      }
    }

    const newStop = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      name: dealerName,
      reason: autoReason,
      time: nextSlot
    };

    setStackedStops([...stackedStops, newStop]);
    // Reset any partial active form selection fields
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
        const filteredVisits = day.visits.filter(visit => visit.id !== visitId);
        const recalculated = recalculatedDistances(filteredVisits);
        return {
          ...day,
          visitsCount: Math.max(0, day.visitsCount - 1),
          visits: recalculated
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
        const filteredVisits = day.visits.filter(visit => visit.id !== visitId);
        const recalculated = recalculatedDistances(filteredVisits);
        return {
          ...day,
          visitsCount: Math.max(0, day.visitsCount - 1),
          visits: recalculated
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

  // Reorder visits in route (drag & drop)
  const handleReorderVisits = (dayId, newVisitsOrder) => {
    setDays(prevDays => prevDays.map(day => {
      if (day.id === dayId) {
        // Keep original chronological time slots intact
        const originalTimes = day.visits.map(v => v.time);
        const updatedVisits = newVisitsOrder.map((visit, idx) => ({
          ...visit,
          time: originalTimes[idx] || visit.time
        }));
        
        const recalculated = recalculatedDistances(updatedVisits);
        return {
          ...day,
          visits: recalculated
        };
      }
      return day;
    }));
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

  const loadStopsForDate = (dateLabel) => {
    const targetDayId = dateLabel === 'Today' ? 'today' : 'tomorrow';
    const day = days.find(d => d.id === targetDayId);
    if (day && day.visits) {
      const loaded = day.visits.map(v => ({
        id: v.id,
        name: v.name,
        reason: v.type,
        time: v.time
      }));
      setStackedStops(loaded);
    } else {
      setStackedStops([]);
    }
  };

  const handleSelectDateChange = (dateLabel) => {
    setScheduleDate(dateLabel);
    setSelectedDealer('');
    setVisitPurpose('Collection');
    setScheduleTime('');
    setExpandingDealerName(null);
    setShowManualForm(false);
    loadStopsForDate(dateLabel);
  };

  const handleConfirmInlineAdd = (dealerName, reason, time) => {
    const newStop = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      name: dealerName,
      reason: reason,
      time: time
    };

    setStackedStops([...stackedStops, newStop]);
    setExpandingDealerName(null);
  };

  const handleOpenSchedule = () => {
    setSelectedDealer('');
    setVisitPurpose('Collection');
    setScheduleTime('');
    setScheduleDate('');
    setIsScheduleOpen(true);
    setStackedStops([]);
    setExpandingDealerName(null);
    setShowManualForm(false);
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

    // Replace target day's visits with the newly planned route
    const targetDayId = scheduleDate === 'Today' ? 'today' : 'tomorrow';
    setDays(days.map(day => {
      if (day.id === targetDayId) {
        const recalculated = recalculatedDistances(visitsToAdd);
        return {
          ...day,
          visitsCount: visitsToAdd.length,
          visits: recalculated
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
    setShowManualForm(false);
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
                      {day.visits.length > 0 && (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {getDayRouteDistance(day.visits)} KM
                        </span>
                      )}
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-slate-400 transition-transform duration-200 ${
                        day.isCollapsed ? '-rotate-90' : ''
                      }`} 
                    />
                  </div>

                  {!day.isCollapsed && (
                    <div className="px-4 pb-4 pt-2 bg-white">
                      <Reorder.Group 
                        axis="y" 
                        values={day.visits} 
                        onReorder={(newOrder) => handleReorderVisits(day.id, newOrder)}
                        className="space-y-3"
                      >
                        {day.visits.map((visit, index) => {
                          const isPunchedIn = punchedInVisitId === visit.id;
                          const isAnyPunchedIn = punchedInVisitId !== null;

                          return (
                            <Reorder.Item 
                              key={visit.id} 
                              value={visit}
                              className="relative animate-none"
                            >
                              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs relative cursor-grab active:cursor-grabbing">
                                <div className="flex justify-between items-start mb-2">
                                  {/* Left side: Grip, Large Number, Badges */}
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                      {/* Drag Grip Handle */}
                                      <div className="p-1 -ml-1 text-slate-355 hover:text-slate-500 transition-colors flex items-center justify-center cursor-grab active:cursor-grabbing">
                                        <GripVertical size={16} className="stroke-[2.5]" />
                                      </div>

                                      {/* Large Minimalist Number */}
                                      <span className="text-[20px] font-black text-slate-300 font-mono leading-none tracking-tight">
                                        0{index + 1}
                                      </span>
                                    </div>

                                    {/* Type badge */}
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
                                  
                                  {/* Right side: Menu */}
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setActiveMenuId(activeMenuId === visit.id ? null : visit.id)}
                                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center"
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
                                      type="button"
                                      onClick={() => handleOpenLogPayment(visit)}
                                      className="flex-1 py-2 rounded-full border border-[#ED1D24] text-[#ED1D24] text-xs font-bold hover:bg-red-50/20 flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                      <CreditCard size={13} className="text-[#ED1D24]" />
                                      Add Payment
                                    </button>
                                  ) : (
                                    <button type="button" className="flex-1 py-2 rounded-full border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors">
                                      <Navigation size={13} className="rotate-45 text-slate-400" />
                                      Navigate
                                    </button>
                                  )}

                                  <button
                                    type="button"
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
                                  <div className="flex items-center gap-1 mx-3 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-xs text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                    <MapPin size={10} className="text-slate-400" />
                                    <span>{day.visits[index].distance}</span>
                                  </div>
                                  <div className="flex-1 border-t border-dashed border-slate-200" />
                                </div>
                              )}
                            </Reorder.Item>
                          );
                        })}
                      </Reorder.Group>
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
          onClick={handleOpenSchedule}
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
                <h3 className="text-[17px] font-extrabold text-slate-800">Schedule New Visit{scheduleDate ? ` for ${scheduleDate.toLowerCase()}` : ''}</h3>
                <button onClick={() => setIsScheduleOpen(false)} className="p-1 hover:bg-slate-50 rounded-full transition-colors">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4 no-scrollbar">
                {/* Select Date */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wide">Select Date</label>
                  <div className="flex gap-2">
                    {[
                      { label: 'Today', sub: 'Wed, Jan 7' },
                      { label: 'Tomorrow', sub: 'Thu, Jan 8' },
                    ].map((date) => (
                      <button
                        key={date.label}
                        type="button"
                        onClick={() => handleSelectDateChange(date.label)}
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

                {scheduleDate && (
                  <>
                    {/* Simplified Route Stops list */}
                    {stackedStops.length > 0 && (
                      <div className="mb-5 space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wide block">
                            Route Stops ({stackedStops.length})
                          </span>
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            {getRouteDetails().totalDistance} KM
                          </span>
                        </div>
                           <div className="relative border border-slate-100 rounded-2xl p-3.5 bg-slate-50/20">
                          <div className="max-h-[205px] overflow-y-auto no-scrollbar pr-0.5">
                            <Reorder.Group
                              axis="y"
                              values={stackedStops}
                              onReorder={handleReorderStackedStops}
                              className="space-y-2"
                            >
                              {stackedStops.map((stop, index) => {
                                return (
                                  <Reorder.Item
                                    key={stop.id}
                                    value={stop}
                                    className="relative animate-none"
                                  >
                                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-2xs cursor-grab active:cursor-grabbing">
                                      <div className="flex items-center flex-1 min-w-0 pr-3">
                                        {/* Left side: Grip and Stop Label */}
                                        <div className="flex items-center gap-2.5 mr-2.5 shrink-0">
                                          <div className="p-0.5 -ml-1 text-slate-305 hover:text-slate-500 transition-colors flex items-center justify-center cursor-grab active:cursor-grabbing">
                                            <GripVertical size={14} className="stroke-[2.5]" />
                                          </div>
                                          <div className="w-11 h-11 rounded-xl border border-red-200 flex flex-col items-center justify-center shrink-0">
                                            <span className="text-[8px] font-bold text-[#ED1D24] leading-none">Stop</span>
                                            <span className="text-[13px] font-black text-[#ED1D24] font-mono leading-none mt-1">0{index + 1}</span>
                                          </div>
                                        </div>
     
                                        {/* Stop details */}
                                        <div className="min-w-0 flex-1">
                                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate">
                                            {stop.name}
                                          </h4>
                                          <p className="text-[10px] text-slate-400 font-semibold mt-1">
                                            🕒 {stop.time.replace(' - ', '-')} • {stop.reason}
                                          </p>
                                        </div>
                                      </div>
     
                                      {/* Edit & Remove buttons */}
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleEditStagedStop(stop)}
                                          className="p-1.5 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                          title="Edit Stop"
                                        >
                                          <Pencil size={13} className="stroke-[2.5]" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveStop(stop.id)}
                                          className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                                          title="Remove"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    </div>
     
                                    {/* Distance separator in between cards */}
                                    {index < stackedStops.length - 1 && (
                                      <div className="flex items-center my-2.5 px-2">
                                        <div className="flex-1 border-t border-dashed border-slate-200" />
                                        <div className="flex items-center gap-1 mx-3 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-xs text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                          <MapPin size={10} className="text-slate-400" />
                                          <span>{getDistanceBetween(stop.name, stackedStops[index + 1].name)} KM</span>
                                        </div>
                                        <div className="flex-1 border-t border-dashed border-slate-200" />
                                      </div>
                                    )}
                                  </Reorder.Item>
                                );
                              })}
                            </Reorder.Group>
                          </div>
                          {/* Top/Bottom Fade Overlays inside the border */}
                          <div className="absolute top-0.5 left-0.5 right-0.5 h-4 bg-gradient-to-b from-slate-50/60 to-transparent pointer-events-none z-10 rounded-t-2xl" />
                          <div className="absolute bottom-0.5 left-0.5 right-0.5 h-8 bg-gradient-to-t from-slate-50/60 to-transparent pointer-events-none z-10 rounded-b-2xl" />
                        </div>
                      </div>
                    )}
    
                    {/* Suggested Nearby Dealers */}
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Suggested Nearby Dealers</label>
                        
                        {/* Radius Filter Pills */}
                        <div className="flex bg-slate-100 p-0.5 rounded-full border border-slate-200/50">
                          {[5, 10, 15].map((radius) => (
                            <button
                              key={radius}
                              type="button"
                              onClick={() => setSelectedRadius(radius)}
                              className={`px-3 py-1 rounded-full text-[9px] font-extrabold transition-all duration-150 ${
                                selectedRadius === radius
                                  ? 'bg-white text-slate-800 shadow-xs border border-slate-100'
                                  : 'text-slate-500 hover:text-slate-700 border border-transparent'
                              }`}
                            >
                              {radius} KM
                            </button>
                          ))}
                        </div>
                      </div>
                      {stackedStops.length > 0 && (
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 rounded-full px-2.5 py-1 text-[9.5px] text-slate-500 font-semibold mt-1 mb-2.5 w-fit select-none">
                          <MapPin size={10} className="text-[#ED1D24] shrink-0" />
                          <span>Near <strong className="text-slate-800 font-extrabold">{stackedStops[stackedStops.length - 1].name}</strong></span>
                        </div>
                      )}
                      {suggestedDealers.length > 0 ? (
                        <>
                          <div className="flex gap-3 overflow-x-auto pb-2.5 no-scrollbar scroll-smooth">
                            {suggestedDealers.map((dealer) => {
                              const isSelected = expandingDealerName === dealer.name;

                              return (
                                <div
                                  key={dealer.name}
                                  className={`bg-white border rounded-2xl p-4 min-w-[195px] max-w-[210px] min-h-[160px] flex flex-col justify-between text-left shadow-2xs shrink-0 transition-all duration-200 ${
                                    isSelected ? 'border-[#ED1D24] ring-2 ring-[#ED1D24]/10 shadow-md' : 'border-slate-200'
                                  }`}
                                >
                                  <div>
                                    {/* Top Row: Badge */}
                                    <div className="flex items-center mb-2.5 w-full">
                                      <div className={`${dealer.badge.bg} rounded-md px-2 py-0.5 text-[9px] font-extrabold flex items-center gap-1 border`}>
                                        <span>{dealer.badge.text}</span>
                                      </div>
                                    </div>
        
                                    <span className="font-extrabold text-[12px] text-slate-800 uppercase tracking-tight line-clamp-2 leading-tight block">
                                      {dealer.name}
                                    </span>
                                    <div className="mt-1.5">
                                      <span className="text-[10px] font-semibold text-slate-400 block">
                                        {dealer.locality} ({dealer.distance} KM)
                                      </span>
                                      {dealer.badge.text === 'Collection' && (
                                        <div className="text-[9.5px] font-bold text-slate-500 mt-1 block">
                                          Bal: <strong className="text-slate-700 font-extrabold">{dealer.pending}</strong>
                                        </div>
                                      )}
                                      {dealer.badge.text === 'Never Visited' && (
                                        <div className="text-[8.5px] font-bold text-slate-400 mt-1 block">
                                          Not visited from <strong className="text-slate-500 font-extrabold">{dealer.notVisitedDays || 12} days</strong>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExpandingDealerName(dealer.name);
                                      setShowManualForm(false);
                                      
                                      // Determine auto default reason
                                      const pendingAmount = parseInt(dealer.pending.replace(/[^\d]/g, '')) || 0;
                                      setInlineReason(pendingAmount > 0 ? 'Collection' : 'General Visit');
                                      
                                      // Determine next logical time slot
                                      const timeSlots = ['09:00AM - 12:00PM', '12:00PM - 03:00PM', '03:00PM - 06:00PM'];
                                      let nextSlot = '09:00AM - 12:00PM';
                                      if (stackedStops.length > 0) {
                                        const lastSlot = stackedStops[stackedStops.length - 1].time;
                                        const lastIndex = timeSlots.indexOf(lastSlot);
                                        if (lastIndex !== -1 && lastIndex < timeSlots.length - 1) {
                                          nextSlot = timeSlots[lastIndex + 1];
                                        } else {
                                          nextSlot = '03:00PM - 06:00PM';
                                        }
                                      }
                                      setInlineTime(nextSlot);
                                    }}
                                    className={`mt-3.5 w-full py-1.5 rounded-lg text-[10px] font-bold transition-colors text-center border active:scale-[0.97] ${
                                      isSelected
                                        ? 'bg-[#ED1D24] text-white border-transparent'
                                        : 'bg-red-50 text-[#ED1D24] hover:bg-red-100 border-red-100/30'
                                    }`}
                                  >
                                    {isSelected ? 'Configuring...' : 'Add to Route'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          {/* Full-width configuration drawer below the carousel */}
                          <AnimatePresence>
                            {expandingDealerName && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-slate-50/50 border-2 border-[#ED1D24] rounded-2xl p-5 shadow-sm text-left space-y-4 relative">
                                  {/* Close Button top-right */}
                                  <button
                                    type="button"
                                    onClick={() => setExpandingDealerName(null)}
                                    className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                  >
                                    <X size={16} />
                                  </button>

                                  {/* Heading Block */}
                                  <div>
                                    <span className="text-[9px] font-extrabold text-[#ED1D24] uppercase tracking-widest block mb-1">
                                      Configure Visit Stop
                                    </span>
                                    <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">
                                      {expandingDealerName}
                                    </h4>
                                    <p className="text-[11px] font-semibold text-slate-400 mt-1">
                                      {(() => {
                                        const d = allDealersList.find(x => x.name === expandingDealerName);
                                        if (!d) return '';
                                        const pendingVal = parseInt(d.pending.replace(/[^\d]/g, '')) || 0;
                                        const dist = getDistanceBetween(stackedStops[stackedStops.length - 1]?.name, d.name);
                                        if (pendingVal > 0) {
                                          return `${d.locality} (${dist} KM) • Balance: ${d.pending}`;
                                        } else {
                                          const days = d.notVisitedDays || 12;
                                          return `${d.locality} (${dist} KM) • Not visited from ${days} days`;
                                        }
                                      })()}
                                    </p>
                                  </div>

                                  {/* Input Selects Side-by-Side */}
                                  <div className="grid grid-cols-2 gap-3.5">
                                    {/* Reason Selector */}
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Select Reason
                                      </label>
                                      <div className="relative">
                                        <select
                                          value={inlineReason}
                                          onChange={(e) => setInlineReason(e.target.value)}
                                          className="w-full text-[12px] border border-slate-200 rounded-xl h-[42px] pl-3 pr-8 bg-white outline-none focus:border-red-500 font-bold text-slate-700 appearance-none transition-colors"
                                        >
                                          <option value="Collection">Collection</option>
                                          <option value="New Order">New Order</option>
                                          <option value="General Visit">General Visit</option>
                                          <option value="Order Follow-up">Order Follow-up</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                      </div>
                                    </div>

                                    {/* Time Slot Selector */}
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Select Time Slot
                                      </label>
                                      <div className="relative">
                                        <select
                                          value={inlineTime}
                                          onChange={(e) => setInlineTime(e.target.value)}
                                          className="w-full text-[12px] border border-slate-200 rounded-xl h-[42px] pl-3 pr-8 bg-white outline-none focus:border-red-500 font-bold text-slate-700 appearance-none transition-colors"
                                        >
                                          <option value="09:00AM - 12:00PM">09:00AM-12:00PM</option>
                                          <option value="12:00PM - 03:00PM">12:00PM-03:00PM</option>
                                          <option value="03:00PM - 06:00PM">03:00PM-06:00PM</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions Row */}
                                  <div className="flex gap-3 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setExpandingDealerName(null)}
                                      className="flex-1 py-2.5 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-center"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleConfirmInlineAdd(expandingDealerName, inlineReason, inlineTime)}
                                      className="flex-1 py-2.5 rounded-xl bg-[#ED1D24] text-white text-xs font-bold hover:bg-red-650 transition-colors text-center shadow-sm active:scale-[0.98]"
                                    >
                                      Confirm Stop
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <div className="bg-slate-50/50 border border-slate-200/40 rounded-2xl py-6 px-4 text-center">
                          <p className="text-xs font-bold text-slate-400">
                            No suggested dealers found within {selectedRadius} KM radius.
                          </p>
                        </div>
                      )}
                    </div>
    
                    {/* Form fields section */}
                    {showManualForm ? (
                      <div className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/20 mt-2">
                        {/* Header of Manual Form */}
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Add Visit Manually</span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowManualForm(false);
                              setSelectedDealer('');
                              setVisitPurpose('Collection');
                              setScheduleTime('');
                            }}
                            className="text-[11px] text-slate-450 hover:text-slate-600 font-bold"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Select Dealer */}
                        <div>
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

                        {/* Select Reason */}
                        <div>
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
                                  scheduleTime === time ? 'border-red-555 bg-red-500' : 'border-slate-350'
                                }`}>
                                  {scheduleTime === time && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Add Stop Button */}
                        {selectedDealer && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleAddStopToRoute}
                              className="w-full py-3.5 rounded-full bg-[#ED1D24] text-white text-xs font-extrabold hover:bg-red-600 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-1.5"
                            >
                              + Add Stop to Route
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowManualForm(true);
                            setExpandingDealerName(null);
                          }}
                          className="w-full py-3.5 rounded-xl border border-dashed border-slate-300 text-slate-650 hover:text-slate-800 hover:border-slate-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                          + Add Visit Manually
                        </button>
                      </div>
                    )}
    
                    {/* Confirm Button */}
                    <button 
                      onClick={handleConfirmSchedule}
                      disabled={stackedStops.length === 0 && !selectedDealer}
                      className="w-full bg-[#ED1D24] text-white py-4 rounded-full text-sm font-bold shadow-md hover:bg-red-600 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] mt-4"
                    >
                      {stackedStops.length > 0 ? 'Confirm Route & Schedule' : 'Confirm Schedule'}
                    </button>
                  </>
                )}
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
