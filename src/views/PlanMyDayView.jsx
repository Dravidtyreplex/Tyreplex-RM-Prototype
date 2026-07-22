import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Clock,
  Banknote,
  Route,
  Sparkles,
  Hand,
  RotateCcw,
  GripVertical,
  Trash2,
  Plus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
  Pencil
} from 'lucide-react';

// ─── MOCK DATA: Delhi NCR Dealer Coordinates ───
const DEALERS_DB = [
  { id: 'D001', name: 'VANSUN VENTURES PRIVATE LIMITED', locality: 'Haryana', lat: 28.4595, lng: 77.0266, pending: 11400, lastVisitDays: 3, creditPeriod: 30 },
  { id: 'D002', name: 'Modern Tyres & Service', locality: 'Sector 18, Noida', lat: 28.5706, lng: 77.3218, pending: 23290, lastVisitDays: 7, creditPeriod: 30 },
  { id: 'D003', name: 'Super Wheel Care', locality: 'Gurgaon, Haryana', lat: 28.4292, lng: 77.0130, pending: 15400, lastVisitDays: 12, creditPeriod: 15 },
  { id: 'D004', name: 'SAI RAM TYRES', locality: 'Rohini, Delhi', lat: 28.7325, lng: 77.1107, pending: 12800, lastVisitDays: 18, creditPeriod: 30 },
  { id: 'D005', name: 'Lucky Tyre House', locality: 'Dwarka, Delhi', lat: 28.5921, lng: 77.0460, pending: 9200, lastVisitDays: 5, creditPeriod: 30 },
  { id: 'D006', name: 'Sharma Auto', locality: 'Vijay Nagar, Ghaziabad', lat: 28.6380, lng: 77.4126, pending: 18500, lastVisitDays: 22, creditPeriod: 15 },
  { id: 'D007', name: 'Delhi Tyre World', locality: 'Janakpuri, Delhi', lat: 28.6219, lng: 77.0815, pending: 0, lastVisitDays: 25, creditPeriod: 30 },
  { id: 'D008', name: 'Capital Wheels', locality: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167, pending: 0, lastVisitDays: 30, creditPeriod: 30 },
  { id: 'D009', name: 'Raj Tyres & Alignment', locality: 'Lajpat Nagar, Delhi', lat: 28.5700, lng: 77.2400, pending: 31000, lastVisitDays: 4, creditPeriod: 30 },
  { id: 'D010', name: 'Bharat Rubber Works', locality: 'Karol Bagh, Delhi', lat: 28.6519, lng: 77.1905, pending: 7500, lastVisitDays: 9, creditPeriod: 15 },
  { id: 'D011', name: 'Gupta Tyres & Accessories', locality: 'Dwarka, Delhi', lat: 28.5830, lng: 77.0550, pending: 4200, lastVisitDays: 2, creditPeriod: 30 },
  { id: 'D012', name: 'Punjab Tyre House', locality: 'Pitampura, Delhi', lat: 28.7020, lng: 77.1330, pending: 19800, lastVisitDays: 16, creditPeriod: 30 },
];

const RM_START = { lat: 28.5355, lng: 77.3910, label: 'Your Location (Noida)' };

// ─── UTILITY FUNCTIONS ───
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getDealerPriority = (dealer) => {
  if (dealer.pending > 10000) return 'collection';
  if (dealer.lastVisitDays >= 15) return 'stale';
  if (dealer.pending > 0) return 'collection';
  return 'healthy';
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'collection': return '#ED1D24';
    case 'stale': return '#F59E0B';
    case 'healthy': return '#10B981';
    default: return '#94A3B8';
  }
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'collection': return 'Collection Due';
    case 'stale': return 'Overdue Visit';
    case 'healthy': return 'Healthy';
    default: return '';
  }
};

// Nearest-neighbor TSP heuristic for route optimization
const optimizeRoute = (dealers, startPoint) => {
  if (dealers.length <= 1) return dealers;
  const remaining = [...dealers];
  const ordered = [];
  let current = startPoint;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((d, i) => {
      const dist = getDistance(current.lat, current.lng, d.lat, d.lng);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    });
    ordered.push(remaining[nearestIdx]);
    current = remaining[nearestIdx];
    remaining.splice(nearestIdx, 1);
  }
  return ordered;
};

const getTotalDistance = (stops, start) => {
  if (stops.length === 0) return 0;
  let total = getDistance(start.lat, start.lng, stops[0].lat, stops[0].lng);
  for (let i = 0; i < stops.length - 1; i++) {
    total += getDistance(stops[i].lat, stops[i].lng, stops[i + 1].lat, stops[i + 1].lng);
  }
  return total;
};

const getEstimatedTime = (stops, totalKm) => {
  const drivingHours = totalKm / 25; // avg 25 km/h in city
  const visitHours = stops.length * 0.5; // 30 min per visit
  return drivingHours + visitHours;
};

const formatCurrency = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

// ─── MODE SELECTION SCREEN ───
const ModeSelection = ({ onSelectMode, stats }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex-1 p-5 flex flex-col"
  >
    {/* Morning Brief */}
    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <Zap size={16} className="text-[#ED1D24]" />
        </div>
        <span className="text-[13px] font-bold text-slate-800">Good Morning!</span>
      </div>
      <div className="space-y-1.5">
        <p className="text-[12px] text-slate-700">
          <span className="font-bold text-[#ED1D24]">{stats.collectionDealers} dealers</span> with{' '}
          <span className="font-bold text-[#ED1D24]">{formatCurrency(stats.totalPending)}</span> pending collection
        </p>
        <p className="text-[12px] text-slate-700">
          <span className="font-bold text-amber-600">{stats.overdueDealers} dealers</span> not visited in 15+ days
        </p>
        <p className="text-[12px] text-slate-700">
          <span className="font-bold">{stats.totalDealers} dealers</span> assigned to you
        </p>
      </div>
    </div>

    <h2 className="text-[15px] font-bold text-slate-800 mb-4">How do you want to plan today?</h2>

    {/* Mode Cards */}
    <div className="space-y-3">
      {/* Smart Plan */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectMode('smart')}
        className="w-full bg-white border-2 border-slate-100 hover:border-[#ED1D24]/30 rounded-2xl p-4 text-left transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ED1D24]/10 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-[#ED1D24]" />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-slate-800">Smart Plan</h3>
            <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
              AI-optimized route based on collections, proximity & visit history
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Recommended</span>
              <span className="text-[10px] text-slate-400">~30 sec to plan</span>
            </div>
          </div>
          <ChevronLeft size={16} className="text-slate-300 rotate-180 mt-3" />
        </div>
      </motion.button>

      {/* Manual Plan */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectMode('manual')}
        className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 rounded-2xl p-4 text-left transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Hand size={20} className="text-slate-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-slate-800">Manual Plan</h3>
            <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
              Pick your own dealers from the map and build your route
            </p>
          </div>
          <ChevronLeft size={16} className="text-slate-300 rotate-180 mt-3" />
        </div>
      </motion.button>

      {/* Repeat Last Route */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectMode('repeat')}
        className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 rounded-2xl p-4 text-left transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <RotateCcw size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-slate-800">Repeat Last Route</h3>
            <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
              Same as Monday, Jan 5 — 5 stops • 28 KM
            </p>
          </div>
          <ChevronLeft size={16} className="text-slate-300 rotate-180 mt-3" />
        </div>
      </motion.button>
    </div>
  </motion.div>
);

// ─── MAP VIEW WITH PINS ───
const MapView = ({ dealers, selectedIds, onPinTap, routeStops, startPoint, isExpanded, onMapTap }) => {
  // Simple SVG-based map for prototype (no external API needed)
  const allPoints = [...dealers, startPoint];
  const minLat = Math.min(...allPoints.map(p => p.lat)) - 0.02;
  const maxLat = Math.max(...allPoints.map(p => p.lat)) + 0.02;
  const minLng = Math.min(...allPoints.map(p => p.lng)) - 0.02;
  const maxLng = Math.max(...allPoints.map(p => p.lng)) + 0.02;

  const mapToSvg = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const startPos = mapToSvg(startPoint.lat, startPoint.lng);

  // Build route polyline
  const routePoints = routeStops.map(s => mapToSvg(s.lat, s.lng));
  const fullRoute = [startPos, ...routePoints];
  const routePath = fullRoute.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div
      onClick={() => onMapTap && onMapTap()}
      className="relative w-full bg-[#E8F4E8] rounded-2xl overflow-hidden border border-slate-200 cursor-pointer transition-all duration-300"
      style={{ height: isExpanded ? '280px' : '150px' }}
    >
      {/* Expand hint */}
      {!isExpanded && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 bg-white/80 backdrop-blur-sm rounded-full px-3 py-0.5">
          <span className="text-[9px] font-medium text-slate-500">Tap to expand map</span>
        </div>
      )}
      {/* Grid background to simulate map */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="absolute border-t border-slate-300" style={{ top: `${i * 10}%`, left: 0, right: 0 }} />
            <div className="absolute border-l border-slate-300" style={{ left: `${i * 10}%`, top: 0, bottom: 0 }} />
          </React.Fragment>
        ))}
      </div>

      {/* Map area labels */}
      <div className="absolute top-2 left-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider">Delhi NCR</div>

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Route line */}
        {routeStops.length > 0 && (
          <path
            d={routePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="0.6"
            strokeDasharray="1.5,0.8"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Start point marker */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${startPos.x}%`, top: `${startPos.y}%` }}
      >
        <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white shadow-lg flex items-center justify-center">
          <Navigation size={10} className="text-white" />
        </div>
      </div>

      {/* Dealer pins */}
      {dealers.map((dealer) => {
        const pos = mapToSvg(dealer.lat, dealer.lng);
        const isSelected = selectedIds.includes(dealer.id);
        const priority = getDealerPriority(dealer);
        const color = isSelected ? '#ED1D24' : getPriorityColor(priority);
        const sequenceNum = routeStops.findIndex(s => s.id === dealer.id) + 1;

        return (
          <motion.div
            key={dealer.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onPinTap(dealer)}
            whileTap={{ scale: 1.3 }}
          >
            {isSelected ? (
              <div className="relative">
                <div className="w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style={{ backgroundColor: color }}>
                  <span className="text-[9px] font-black text-white">{sequenceNum}</span>
                </div>
                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: color }} />
              </div>
            ) : (
              <div className="relative group">
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-md transition-transform"
                  style={{ backgroundColor: color }}
                />
                {dealer.pending > 10000 && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ED1D24]" />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex gap-3">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ED1D24]" />
          <span className="text-[8px] text-slate-600">Collection</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="text-[8px] text-slate-600">Overdue</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span className="text-[8px] text-slate-600">Healthy</span>
        </div>
      </div>
    </div>
  );
};

// ─── DEALER INFO CARD (on pin tap) ───
const DealerInfoCard = ({ dealer, isSelected, onAdd, onRemove, onClose }) => {
  const priority = getDealerPriority(dealer);
  const distFromStart = getDistance(RM_START.lat, RM_START.lng, dealer.lat, dealer.lng);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 mx-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getPriorityColor(priority) }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getPriorityColor(priority) }}>
              {getPriorityLabel(priority)}
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-slate-800 leading-tight">{dealer.name}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{dealer.locality}</p>
        </div>
        <button onClick={onClose} className="p-1 bg-slate-100 rounded-full">
          <X size={14} className="text-slate-500" />
        </button>
      </div>

      <div className="flex items-center gap-4 mt-3 py-2 border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">Pending</span>
          <span className="text-[13px] font-bold text-[#ED1D24]">{dealer.pending > 0 ? formatCurrency(dealer.pending) : '—'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">Last Visit</span>
          <span className="text-[13px] font-bold text-slate-700">{dealer.lastVisitDays}d ago</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400">Distance</span>
          <span className="text-[13px] font-bold text-slate-700">{distFromStart.toFixed(1)} KM</span>
        </div>
      </div>

      <div className="mt-3">
        {isSelected ? (
          <button
            onClick={() => onRemove(dealer.id)}
            className="w-full py-2.5 rounded-xl border-2 border-red-200 text-[#ED1D24] text-[13px] font-bold flex items-center justify-center gap-2"
          >
            <Trash2 size={14} /> Remove from Route
          </button>
        ) : (
          <button
            onClick={() => onAdd(dealer)}
            className="w-full py-2.5 rounded-xl bg-[#ED1D24] text-white text-[13px] font-bold flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add to Route
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── ROUTE SUMMARY PANEL ───
const RouteSummaryPanel = ({ stops, totalKm, estimatedHrs, totalCollectable, onRemoveStop, onReorder, onConfirm, isExpanded, onToggleExpand, nearbyDealers, onAddNearby }) => {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const handleDragStart = (idx) => {
    setDragIdx(idx);
  };

  const handleDragOver = (idx) => {
    if (dragIdx === null || dragIdx === idx) return;
    setOverIdx(idx);
  };

  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    // Swap the two stops
    const newStops = [...stops];
    const temp = newStops[dragIdx];
    newStops[dragIdx] = newStops[idx];
    newStops[idx] = temp;
    onReorder(newStops);
    setDragIdx(null);
    setOverIdx(null);
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    const newStops = [...stops];
    [newStops[idx - 1], newStops[idx]] = [newStops[idx], newStops[idx - 1]];
    onReorder(newStops);
  };

  const handleMoveDown = (idx) => {
    if (idx === stops.length - 1) return;
    const newStops = [...stops];
    [newStops[idx], newStops[idx + 1]] = [newStops[idx + 1], newStops[idx]];
    onReorder(newStops);
  };

  return (
  <div className="bg-white rounded-t-2xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
    {/* Drag Handle */}
    <div className="flex justify-center pt-2 pb-1 cursor-pointer" onClick={onToggleExpand}>
      <div className="w-10 h-1 bg-slate-200 rounded-full" />
    </div>

    {/* Stats Bar */}
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Route size={13} className="text-[#ED1D24]" />
          <span className="text-[12px] font-bold text-slate-800">{stops.length} stops</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-slate-400" />
          <span className="text-[12px] font-bold text-slate-800">{totalKm.toFixed(1)} KM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-slate-400" />
          <span className="text-[12px] font-bold text-slate-800">~{estimatedHrs.toFixed(1)}h</span>
        </div>
      </div>
    </div>

    {/* Expandable Stop List */}
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="px-4 py-3 max-h-[240px] overflow-y-auto no-scrollbar">
            {stops.length === 0 ? (
              <p className="text-[12px] text-slate-400 text-center py-4">Tap dealers on the map to build your route</p>
            ) : (
              <>
              <div className="space-y-2">
                {stops.map((stop, index) => (
                  <motion.div
                    key={stop.id}
                    layout
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-grab active:cursor-grabbing transition-colors ${
                      overIdx === index ? 'bg-blue-50 border border-blue-200' : dragIdx === index ? 'bg-slate-100 opacity-60' : 'bg-slate-50'
                    }`}
                  >
                    {/* Grip Handle */}
                    <div className="flex flex-col items-center gap-0.5 text-slate-300 shrink-0">
                      <GripVertical size={14} className="text-slate-400" />
                    </div>
                    {/* Sequence number */}
                    <div className="w-6 h-6 rounded-full bg-[#ED1D24] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-slate-800 truncate">{stop.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">{stop.locality}</span>
                        {stop.pending > 0 && (
                          <span className="text-[10px] font-bold text-[#ED1D24]">{formatCurrency(stop.pending)}</span>
                        )}
                      </div>
                      {/* Reason tags */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {stop.pending > 0 && (
                          <span className="text-[9px] bg-red-50 text-[#ED1D24] font-medium px-1.5 py-0.5 rounded">Collection due</span>
                        )}
                        {stop.lastVisitDays >= 15 && (
                          <span className="text-[9px] bg-amber-50 text-amber-700 font-medium px-1.5 py-0.5 rounded">Not visited {stop.lastVisitDays}d</span>
                        )}
                        {stop.creditPeriod === 15 && stop.pending > 0 && (
                          <span className="text-[9px] bg-orange-50 text-orange-700 font-medium px-1.5 py-0.5 rounded">Credit expiring</span>
                        )}
                      </div>
                    </div>
                    {/* Delete button */}
                    <button onClick={() => onRemoveStop(stop.id)} className="p-1.5 bg-red-50 rounded-lg shrink-0">
                      <Trash2 size={12} className="text-[#ED1D24]" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Nearby Dealers Section */}
              {stops.length > 0 && nearbyDealers && nearbyDealers.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2.5">
                    <MapPin size={13} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Nearby Dealers</span>
                  </div>
                  <div className="space-y-2">
                    {nearbyDealers.map((dealer) => (
                      <div key={dealer.id} className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                        <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center shrink-0">
                          <Plus size={10} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{dealer.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">{dealer.locality}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{dealer.dist.toFixed(1)} KM away</span>
                            {dealer.pending > 0 && (
                              <span className="text-[10px] font-bold text-[#ED1D24]">{formatCurrency(dealer.pending)}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onAddNearby(dealer)}
                          className="px-3 py-1.5 bg-[#ED1D24] rounded-lg text-white text-[10px] font-bold shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Confirm Button */}
    <div className="px-4 pb-4 pt-2">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onConfirm}
        disabled={stops.length === 0}
        className={`w-full py-3.5 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-colors ${
          stops.length > 0
            ? 'bg-[#ED1D24] text-white shadow-lg shadow-red-200'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        Confirm My Route ({stops.length} {stops.length === 1 ? 'stop' : 'stops'})
      </motion.button>
    </div>
  </div>
  );
};

// ─── SMART SUGGESTION CARD — 3 ROUTE OPTIONS (ACCORDION) ───
const SmartSuggestionCard = ({ routes, selectedRouteId, expandedRouteId, onSelectRoute, routeStops, onRemoveStop, onReorder, onAddDealerClick, showDealerList, onCloseDealerList, nearbyDealers, onAddNearby, showManualForm, onManualFormToggle, manualDealer, onManualDealerChange, manualPurpose, onManualPurposeChange, onManualAdd }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mx-4 mb-3"
  >
    <div className="flex items-center gap-2 mb-3 px-1">
      <span className="text-[12px] font-bold text-slate-700">Suggested Routes</span>
      <span className="text-[10px] text-slate-400 ml-auto">Ranked by collections</span>
    </div>
    <div className="space-y-2">
      {routes.map((route) => {
        const totalKm = getTotalDistance(route.dealers, RM_START);
        const hrs = getEstimatedTime(route.dealers, totalKm);
        const isSelected = selectedRouteId === route.id;
        const isExpanded = expandedRouteId === route.id;

        return (
          <div key={route.id} className={`overflow-hidden rounded-2xl border transition-all ${isSelected ? 'border-[#ED1D24]/40' : 'border-slate-150'} ${selectedRouteId && !isSelected ? 'opacity-40' : 'opacity-100'}`}>
            <button
              onClick={() => onSelectRoute(route.id)}
              className={`w-full p-3.5 text-left transition-all ${
                isSelected ? 'bg-[#ED1D24]/5' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[13px] font-bold text-slate-800">Route {route.id}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{route.dealers.length} Stops • {totalKm.toFixed(0)} km • {formatCurrency(route.dealers.reduce((s, d) => s + d.pending, 0))}</p>
                </div>
                <div className="text-right">
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ml-auto ${isExpanded ? 'rotate-180' : ''}`} />
                  <div className="mt-1.5 space-y-0.5">
                    {route.collectionCount > 0 && (
                      <p className="text-[11px] text-slate-700 font-medium">{route.collectionCount} Collection pending</p>
                    )}
                    {route.dealers.filter(d => d.lastVisitDays >= 15 && d.pending === 0).length > 0 && (
                      <p className="text-[11px] text-slate-500">{route.dealers.filter(d => d.lastVisitDays >= 15 && d.pending === 0).length} General Visit</p>
                    )}
                  </div>
                </div>
              </div>
            </button>

            {/* Accordion content — shows dealers when expanded */}
            <AnimatePresence>
              {isExpanded && isSelected && routeStops.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-slate-100"
                >
                  <div className="p-3 space-y-0 bg-slate-50/50">
                    {routeStops.map((stop, index) => {
                      const timeSlots = ['9:00AM-12:00PM', '12:00PM-03:00PM', '03:00PM-06:00PM'];
                      const timeSlot = timeSlots[index % timeSlots.length];
                      const purpose = stop.pending > 0 ? 'Collection' : 'General Visit';
                      // Distance to next stop
                      let distToNext = null;
                      if (index < routeStops.length - 1) {
                        distToNext = getDistance(stop.lat, stop.lng, routeStops[index + 1].lat, routeStops[index + 1].lng).toFixed(1);
                      }

                      return (
                        <React.Fragment key={stop.id}>
                          <div
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData('dragIdx', index); }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              const fromIdx = parseInt(e.dataTransfer.getData('dragIdx'));
                              if (fromIdx !== index) {
                                const newStops = [...routeStops];
                                const [moved] = newStops.splice(fromIdx, 1);
                                newStops.splice(index, 0, moved);
                                onReorder(newStops);
                              }
                            }}
                            className="flex items-center gap-3 bg-white rounded-xl px-3 py-3.5 border border-slate-100 cursor-grab active:cursor-grabbing active:opacity-60"
                          >
                            {/* Grip */}
                            <GripVertical size={16} className="text-slate-400 shrink-0" />
                            {/* Stop badge */}
                            <div className="w-11 h-11 rounded-lg border border-red-200 bg-white flex flex-col items-center justify-center shrink-0">
                              <span className="text-[7px] font-bold text-[#ED1D24] leading-none">Stop</span>
                              <span className="text-[15px] font-black text-[#ED1D24] leading-none">{String(index + 1).padStart(2, '0')}</span>
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-slate-800 truncate">{stop.name}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">🕐 {timeSlot} • {purpose}</p>
                              {stop.pending > 0 ? (
                                <span className="inline-block mt-1.5 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">₹{(stop.pending / 1000).toFixed(1)}K pending</span>
                              ) : (
                                <span className="inline-block mt-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">General Visit</span>
                              )}
                            </div>
                            {/* Edit + Delete */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button className="p-1.5 text-slate-400">
                                <Pencil size={14} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); onRemoveStop(stop.id); }} className="p-1.5 text-slate-400">
                                <X size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Distance between stops */}
                          {distToNext && (
                            <div className="flex items-center py-2 px-4">
                              <div className="flex-1 border-t border-dashed border-slate-200" />
                              <span className="px-3 text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                <MapPin size={10} /> {distToNext} KM
                              </span>
                              <div className="flex-1 border-t border-dashed border-slate-200" />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                    {/* Add Dealer Button — only shows when dealer list is NOT open */}
                    {!showDealerList && (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (onAddDealerClick) onAddDealerClick();
                      }}
                      className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-lg text-[11px] font-bold text-slate-500 flex items-center justify-center gap-1.5 hover:border-[#ED1D24] hover:text-[#ED1D24] transition-colors"
                    >
                      <Plus size={14} /> Add Dealer
                    </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nearby Dealers — outside accordion, below the selected route card */}
            {isSelected && isExpanded && showDealerList && (
              <div className="px-3 pb-3 pt-1 relative">
                {/* Close button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onCloseDealerList(); }}
                  className="absolute top-2 right-3 p-1 bg-slate-100 rounded-full"
                >
                  <X size={14} className="text-slate-500" />
                </button>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Suggested Nearby Dealers</span>
                </div>
                {nearbyDealers && nearbyDealers.length > 0 ? (
                <>
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin size={12} className="text-[#ED1D24]" />
                  <span className="text-[10px] text-slate-600">Near <span className="font-bold">{routeStops[routeStops.length - 1]?.name || 'your route'}</span></span>
                </div>
                {/* Horizontal swiper */}
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                  {nearbyDealers.map((dealer) => (
                    <div key={dealer.id} className="bg-white rounded-xl border border-slate-150 p-3 flex flex-col min-w-[160px] shrink-0">
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded self-start mb-2">
                        {dealer.pending > 0 ? 'Collection' : 'Never Visited'}
                      </span>
                      <p className="text-[11px] font-bold text-slate-800 truncate">{dealer.name}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{dealer.locality} ({dealer.dist.toFixed(1)} KM)</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">Not visited from {dealer.lastVisitDays} days</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); onAddNearby(dealer); }}
                        className="mt-2.5 w-full py-2 bg-red-50 border border-[#ED1D24]/20 rounded-lg text-[10px] font-bold text-[#ED1D24]"
                      >
                        Add to Route
                      </button>
                    </div>
                  ))}
                </div>
                </>
                ) : (
                  <p className="text-[10px] text-slate-400 text-center py-3">All nearby dealers are already in your route</p>
                )}

                {/* Add Visit Manually Button + Form */}
                <div className="mt-3">
                  {!showManualForm ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); onManualFormToggle(); }}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} /> Add Visit Manually
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                      <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-3">Add Visit Manually</p>
                      
                      <select
                        value={manualDealer}
                        onChange={(e) => onManualDealerChange(e.target.value)}
                        className="w-full h-11 px-4 border border-slate-200 rounded-full text-[12px] text-slate-700 bg-slate-50 outline-none mb-3 appearance-none"
                      >
                        <option value="">Choose a dealer…</option>
                        {DEALERS_DB.filter(d => !routeStops.find(s => s.id === d.id)).map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>

                      <select
                        value={manualPurpose}
                        onChange={(e) => onManualPurposeChange(e.target.value)}
                        className="w-full h-11 px-4 border border-slate-200 rounded-full text-[12px] text-slate-700 bg-slate-50 outline-none mb-3 appearance-none"
                      >
                        <option value="Collection">Collection</option>
                        <option value="New Order">New Order</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="General Visit">General Visit</option>
                      </select>

                      {manualDealer && manualPurpose === 'Collection' && (() => {
                        const d = DEALERS_DB.find(x => x.id === manualDealer);
                        if (d && d.pending > 0) return (
                          <div className="flex items-center justify-between bg-slate-50 rounded-full px-4 py-3 mb-3">
                            <span className="text-[11px] font-medium text-slate-500">₹ TOTAL PENDING</span>
                            <span className="text-[14px] font-bold text-slate-800">{formatCurrency(d.pending)}</span>
                          </div>
                        );
                        return null;
                      })()}

                      <button
                        onClick={(e) => { e.stopPropagation(); onManualAdd(); }}
                        disabled={!manualDealer}
                        className={`w-full py-3 rounded-full text-[12px] font-bold ${
                          manualDealer ? 'bg-[#ED1D24] text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        Add to Route
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </motion.div>
);

// ─── NUDGE CARD ───
const NudgeCard = ({ dealer, onAdd, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="mx-4 mb-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-center gap-3"
  >
    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-slate-700 truncate">
        <span className="font-bold">{dealer.name}</span> is nearby
        {dealer.pending > 0 && <span className="text-[#ED1D24] font-bold"> • {formatCurrency(dealer.pending)} pending</span>}
      </p>
    </div>
    <button onClick={() => onAdd(dealer)} className="text-[11px] font-bold text-[#ED1D24] shrink-0">Add</button>
    <button onClick={onDismiss} className="p-0.5"><X size={12} className="text-slate-400" /></button>
  </motion.div>
);

// ─── MAIN COMPONENT ───
const PlanMyDayView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRepeatMode = searchParams.get('mode') === 'repeat';

  const [mode, setMode] = useState('smart');
  const [routeStops, setRouteStops] = useState(() => {
    // If repeat mode, pre-load last route for verification
    if (isRepeatMode) {
      return optimizeRoute(DEALERS_DB.slice(0, 5), RM_START);
    }
    return [];
  });
  const [selectedPinDealer, setSelectedPinDealer] = useState(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [showSuggestion, setShowSuggestion] = useState(!isRepeatMode);
  const [nudgeDealer, setNudgeDealer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showReplaceWarning, setShowReplaceWarning] = useState(false);
  const [planDate, setPlanDate] = useState('Today');
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Compute stats for morning brief
  const stats = {
    totalDealers: DEALERS_DB.length,
    collectionDealers: DEALERS_DB.filter(d => d.pending > 0).length,
    totalPending: DEALERS_DB.reduce((sum, d) => sum + d.pending, 0),
    overdueDealers: DEALERS_DB.filter(d => d.lastVisitDays >= 15).length,
  };

  // Generate 3 AI-suggested routes ranked by collection dealers count
  const generateThreeRoutes = () => {
    const scored = DEALERS_DB.map(d => ({
      ...d,
      score: (d.pending / 1000) * 2 + (d.lastVisitDays > 15 ? 20 : 0) + (d.lastVisitDays > 7 ? 5 : 0)
    }));
    scored.sort((a, b) => b.score - a.score);

    // Route 1: Top 4 by priority + 1 general visit dealer (mix)
    const route1 = optimizeRoute([...scored.slice(0, 4), DEALERS_DB.find(d => d.pending === 0)].filter(Boolean), RM_START);
    // Route 2: Mix of collection + overdue (4 dealers)
    const route2Candidates = scored.filter(d => d.pending > 0 || d.lastVisitDays >= 15).slice(0, 4);
    const route2 = optimizeRoute(route2Candidates, RM_START);
    // Route 3: Shortest distance route (closest 4 dealers)
    const byDistance = DEALERS_DB.map(d => ({ ...d, dist: getDistance(RM_START.lat, RM_START.lng, d.lat, d.lng) })).sort((a, b) => a.dist - b.dist);
    const route3 = optimizeRoute(byDistance.slice(0, 4), RM_START);

    return [
      { id: 1, name: 'Route 1', dealers: route1, collectionCount: route1.filter(d => d.pending > 0).length },
      { id: 2, name: 'Route 2', dealers: route2, collectionCount: route2.filter(d => d.pending > 0).length },
      { id: 3, name: 'Route 3', dealers: route3, collectionCount: route3.filter(d => d.pending > 0).length },
    ];
  };

  const [suggestedRoutes] = useState(() => generateThreeRoutes());
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  // Derived: the currently selected route's dealers
  const selectedRouteData = suggestedRoutes.find(r => r.id === selectedRouteId);

  const suggestedTotalKm = selectedRouteData ? getTotalDistance(selectedRouteData.dealers, RM_START) : getTotalDistance(suggestedRoutes[0].dealers, RM_START);
  const suggestedHrs = selectedRouteData ? getEstimatedTime(selectedRouteData.dealers, suggestedTotalKm) : getEstimatedTime(suggestedRoutes[0].dealers, suggestedTotalKm);

  // Handle mode selection (no longer used from UI but kept for logic)
  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  // Select a route option
  // Tap same = just toggle expand/collapse (keep selection)
  // Tap different = switch selection + expand
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [showDealerList, setShowDealerList] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualDealer, setManualDealer] = useState('');
  const [manualPurpose, setManualPurpose] = useState('Collection');

  const handleSelectRoute = (routeId) => {
    if (selectedRouteId === routeId) {
      // Same route tapped — just toggle accordion visibility
      setExpandedRouteId(expandedRouteId === routeId ? null : routeId);
      return;
    }
    // Different route — switch selection and expand
    setSelectedRouteId(routeId);
    setExpandedRouteId(routeId);
    const route = suggestedRoutes.find(r => r.id === routeId);
    if (route) {
      setRouteStops(route.dealers);
      setShowSuggestion(false);
      setIsPanelExpanded(true);
    }
  };

  // Accept AI suggestion — loads first route
  const handleAcceptSuggestion = () => {
    handleSelectRoute(1);
  };

  // Manual add dealer handler
  const handleManualAdd = () => {
    if (!manualDealer) return;
    const dealer = DEALERS_DB.find(d => d.id === manualDealer);
    if (dealer) {
      handleAddToRoute(dealer);
      setManualDealer('');
      setManualPurpose('Collection');
      setShowManualForm(false);
    }
  };

  // Customize (dismiss suggestion, keep map open)
  const handleCustomize = () => {
    setShowSuggestion(false);
  };

  // Add dealer to route
  const handleAddToRoute = (dealer) => {
    if (routeStops.find(s => s.id === dealer.id)) return;
    const newStops = [...routeStops, dealer];
    const optimized = optimizeRoute(newStops, RM_START);
    setRouteStops(optimized);
    setSelectedPinDealer(null);

    // Show nudge for nearby dealer not on route
    const remaining = DEALERS_DB.filter(d => !optimized.find(s => s.id === d.id));
    const lastStop = optimized[optimized.length - 1];
    const nearby = remaining
      .map(d => ({ ...d, dist: getDistance(lastStop.lat, lastStop.lng, d.lat, d.lng) }))
      .filter(d => d.dist < 5)
      .sort((a, b) => a.dist - b.dist)[0];

    if (nearby && nearby.pending > 0) {
      setNudgeDealer(nearby);
    } else {
      setNudgeDealer(null);
    }
  };

  // Remove dealer from route
  const handleRemoveFromRoute = (dealerId) => {
    setRouteStops(routeStops.filter(s => s.id !== dealerId));
    setSelectedPinDealer(null);
    setNudgeDealer(null);
  };

  // Pin tap handler
  const handlePinTap = (dealer) => {
    setSelectedPinDealer(dealer);
  };

  // Confirm plan — show warning if existing visits exist for same day
  const handleConfirm = () => {
    // Check if user has existing visits for the selected day (mock: Today has 3 visits)
    if (planDate === 'Today') {
      setShowReplaceWarning(true);
      return;
    }
    // No conflict — confirm directly
    setIsConfirmed(true);
    setTimeout(() => {
      navigate('/visits');
    }, 1500);
  };

  // User confirms replacement of existing route
  const handleConfirmReplace = () => {
    setShowReplaceWarning(false);
    setIsConfirmed(true);
    setTimeout(() => {
      navigate('/visits');
    }, 1500);
  };

  // Computed route stats
  const totalKm = getTotalDistance(routeStops, RM_START);
  const estimatedHrs = getEstimatedTime(routeStops, totalKm);
  const totalCollectable = routeStops.reduce((sum, d) => sum + d.pending, 0);
  const selectedIds = routeStops.map(s => s.id);

  // Compute nearby dealers (not already on route, within 15 KM of last stop)
  const nearbyDealers = (() => {
    if (routeStops.length === 0) return [];
    const lastStop = routeStops[routeStops.length - 1];
    return DEALERS_DB
      .filter(d => !selectedIds.includes(d.id))
      .map(d => ({ ...d, dist: getDistance(lastStop.lat, lastStop.lng, d.lat, d.lng) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 4);
  })();

  // Replace Warning Popup
  if (showReplaceWarning) {
    return (
      <div className="flex flex-col min-h-full bg-[#F9FAFB] relative">
        <header className="bg-white h-14 flex items-center justify-between px-4 border-b shrink-0 sticky top-0 z-30 opacity-50">
          <div className="p-2"><ChevronLeft size={21} className="text-slate-800" /></div>
          <h1 className="text-[16px] font-bold text-slate-800">Smart Plan</h1>
          <div className="w-9" />
        </header>

        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative bg-white rounded-3xl p-7 mx-8 max-w-[340px] w-full flex flex-col items-center shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={() => setShowReplaceWarning(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
              aria-label="Close warning"
            >
              <X size={20} />
            </button>

            {/* Warning icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4"
            >
              <AlertCircle size={32} className="text-amber-500" />
            </motion.div>

            {/* Title */}
            <h2 className="text-[18px] font-bold text-slate-800 text-center">Replace Existing Route?</h2>
            <p className="text-[13px] text-slate-500 mt-2.5 text-center leading-relaxed">
              You already have <span className="font-bold text-slate-700">3 visits</span> scheduled for{' '}
              <span className="font-bold text-slate-700">{planDate}</span> that were created manually.
            </p>
            <p className="text-[12px] text-slate-500 mt-2 text-center leading-relaxed">
              Confirming this route will <span className="font-bold text-[#ED1D24]">remove your existing visits</span> and replace them with the new {routeStops.length}-stop plan.
            </p>

            {/* Action buttons */}
            <div className="w-full mt-6 space-y-2.5">
              <button
                onClick={handleConfirmReplace}
                className="w-full py-3.5 bg-[#ED1D24] text-white rounded-xl text-[13px] font-bold shadow-lg shadow-red-200"
              >
                Yes, Replace My Route
              </button>
              <button
                onClick={() => setShowReplaceWarning(false)}
                className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl text-[13px] font-bold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Confirmation overlay
  if (isConfirmed) {
    return (
      <div className="flex flex-col min-h-full bg-[#F9FAFB] relative">
        {/* Keep the existing screen behind */}
        <header className="bg-white h-14 flex items-center justify-between px-4 border-b shrink-0 sticky top-0 z-30 opacity-50">
          <div className="p-2"><ChevronLeft size={21} className="text-slate-800" /></div>
          <h1 className="text-[16px] font-bold text-slate-800">Smart Plan</h1>
          <div className="w-9" />
        </header>

        {/* Dark overlay + popup */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative bg-white rounded-3xl p-8 mx-8 max-w-[340px] w-full flex flex-col items-center shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={() => navigate('/visits')}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            {/* Check icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5"
            >
              <div className="w-14 h-14 rounded-full border-[3px] border-green-500 flex items-center justify-center">
                <Check size={28} className="text-green-500" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-[20px] font-bold text-slate-800">Plan Confirmed!</h2>
            <p className="text-[13px] text-slate-500 mt-2 text-center">
              {routeStops.length} visits scheduled for today
            </p>

            {/* Stats card */}
            <div className="w-full bg-slate-50 rounded-xl p-4 mt-5 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">Total Distance</span>
                <span className="text-[12px] font-bold text-slate-800">{totalKm.toFixed(1)} KM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">Estimated Time</span>
                <span className="text-[12px] font-bold text-slate-800">~{estimatedHrs.toFixed(1)} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-slate-500">Dealers to Visit</span>
                <span className="text-[12px] font-bold text-slate-800">{routeStops.length}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/visits')}
              className="w-full mt-5 bg-[#ED1D24] text-white py-3.5 rounded-xl text-[13px] font-bold"
            >
              Go to My Route
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white h-14 flex items-center justify-between px-4 border-b shrink-0 sticky top-0 z-30">
        <button
          onClick={() => navigate('/visits')}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={21} className="text-slate-800" />
        </button>
        <h1 className="text-[16px] font-bold text-slate-800">{isRepeatMode ? 'Verify Route' : 'Smart Plan'}</h1>
        <div className="w-9" />
      </header>

      {/* Planning View — always show map */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Map */}
          <div className="p-4 pb-2">
            <MapView
              dealers={selectedRouteId ? routeStops : DEALERS_DB}
              selectedIds={selectedIds}
              onPinTap={handlePinTap}
              routeStops={routeStops}
              startPoint={RM_START}
              isExpanded={isMapExpanded}
              onMapTap={() => setIsMapExpanded(!isMapExpanded)}
            />
          </div>

          {/* Date Selector Pills */}
          <div className="flex items-center justify-center gap-2 px-4 py-2.5">
            {['Today', 'Tomorrow', 'Day After'].map((d) => (
              <button
                key={d}
                onClick={() => setPlanDate(d)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                  planDate === d
                    ? 'bg-[#ED1D24] text-white'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Warning: existing visits for today */}
          {planDate === 'Today' && (
            <div className="mx-4 mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[12px] font-bold text-amber-800">You already have 3 visits scheduled for today</p>
                <p className="text-[10px] text-amber-600 mt-0.5">Confirming a new route will replace your existing schedule. Go back to edit current visits or select a different day.</p>
              </div>
            </div>
          )}

          {/* Route Options as Accordions */}
          <SmartSuggestionCard
            routes={suggestedRoutes}
            selectedRouteId={selectedRouteId}
            expandedRouteId={expandedRouteId}
            onSelectRoute={handleSelectRoute}
            routeStops={routeStops}
            onRemoveStop={handleRemoveFromRoute}
            onReorder={(newStops) => setRouteStops(newStops)}
            onAddDealerClick={() => setShowDealerList(true)}
            showDealerList={showDealerList}
            onCloseDealerList={() => { setShowDealerList(false); setShowManualForm(false); }}
            nearbyDealers={nearbyDealers}
            onAddNearby={handleAddToRoute}
            showManualForm={showManualForm}
            onManualFormToggle={() => setShowManualForm(!showManualForm)}
            manualDealer={manualDealer}
            onManualDealerChange={setManualDealer}
            manualPurpose={manualPurpose}
            onManualPurposeChange={setManualPurpose}
            onManualAdd={handleManualAdd}
          />

          {/* Dealer list is now inside the accordion — no separate section needed */}
        </div>

          {/* Sticky Confirm Button at bottom */}
          {routeStops.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-[60] flex justify-center pointer-events-none">
            <div className="w-full max-w-[430px] pointer-events-auto px-4 pb-4 pt-2 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB] to-transparent">
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-[#ED1D24] rounded-xl text-white text-[14px] font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Confirm My Route ({routeStops.length} stops)
              </button>
            </div>
          </div>
          )}
        </div>
    </div>
  );
};

export default PlanMyDayView;
