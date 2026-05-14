import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Calendar, 
  Search,
  MapPin,
  Clock,
  Phone,
  MessageSquare
} from 'lucide-react';

const VisitsView = () => {
  const [activeTab, setActiveTab] = useState(0); // 0: Upcoming, 1: History
  const [month, setMonth] = useState('May, 2026');

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
      {/* AppBar */}
      <header className="bg-white h-14 flex items-center justify-between px-4 border-b shrink-0 sticky top-0 z-10">
        <div className="w-10" /> {/* Spacer */}
        <h1 className="text-gray-800 text-lg font-medium">My Route</h1>
        <button className="p-2">
          <RefreshCw size={20} className="text-gray-600" />
        </button>
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

      {/* Floating Action Button */}
      <button className="fixed bottom-20 right-4 bg-[#ED1D24] text-white px-5 py-2.5 rounded-full shadow-lg flex items-center space-x-2 active:scale-95 transition-transform z-20">
        <Calendar size={16} />
        <span className="font-bold text-sm">Schedule New Visit</span>
      </button>

      <div className="h-20" />
    </div>
  );
};

export default VisitsView;
