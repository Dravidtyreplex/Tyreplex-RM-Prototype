import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  Users,
  Pointer,
  History,
  TrendingUp
} from 'lucide-react';

const DashboardView = () => {
  const navigate = useNavigate();
  
  // Date State for 3-month window
  const [monthCount, setMonthCount] = useState(3);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4)); // Starts at May 2026

  const handlePrevMonth = () => {
    if (monthCount > 1) {
      setMonthCount(prev => prev - 1);
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() - 1);
        return d;
      });
    }
  };

  const handleNextMonth = () => {
    if (monthCount < 3) {
      setMonthCount(prev => prev + 1);
      setCurrentDate(prev => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() + 1);
        return d;
      });
    }
  };

  const formattedMonthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Mock data varying by monthCount (1 = March, 2 = April, 3 = May)
  const dashboardData = {
    1: {
      target: '₹35,00,000',
      achievement: '₹12,40,000',
      percent: 35,
      stats: [
        { title: 'Total Orders', value: '18', color: 'bg-blue-50' },
        { title: 'Fully Paid', value: '10', color: 'bg-blue-50' },
        { title: 'Total GMV', value: '₹10,50,000', color: 'bg-blue-50' },
        { title: 'Collection Pending', value: '₹8,45,000', color: 'bg-blue-50' },
        { title: 'Dealer Assigned', value: '145', color: 'bg-blue-50' },
        { title: 'Unique Txn Dealer', value: '12', color: 'bg-blue-50' },
        { title: 'Unique Non Txn Dealer', value: '133', color: 'bg-blue-50' },
      ]
    },
    2: {
      target: '₹40,00,000',
      achievement: '₹22,80,000',
      percent: 57,
      stats: [
        { title: 'Total Orders', value: '31', color: 'bg-blue-50' },
        { title: 'Fully Paid', value: '25', color: 'bg-blue-50' },
        { title: 'Total GMV', value: '₹18,20,000', color: 'bg-blue-50' },
        { title: 'Collection Pending', value: '₹10,10,000', color: 'bg-blue-50' },
        { title: 'Dealer Assigned', value: '148', color: 'bg-blue-50' },
        { title: 'Unique Txn Dealer', value: '21', color: 'bg-blue-50' },
        { title: 'Unique Non Txn Dealer', value: '127', color: 'bg-blue-50' },
      ]
    },
    3: {
      target: '₹45,00,000',
      achievement: '₹32,40,000',
      percent: 72,
      stats: [
        { title: 'Total Orders', value: '45', color: 'bg-blue-50' },
        { title: 'Fully Paid', value: '32', color: 'bg-blue-50' },
        { title: 'Total GMV', value: '₹24,50,000', color: 'bg-blue-50' },
        { title: 'Collection Pending', value: '₹12,45,000', color: 'bg-blue-50' },
        { title: 'Dealer Assigned', value: '150', color: 'bg-blue-50' },
        { title: 'Unique Txn Dealer', value: '28', color: 'bg-blue-50' },
        { title: 'Unique Non Txn Dealer', value: '122', color: 'bg-blue-50' },
      ]
    }
  };

  const currentData = dashboardData[monthCount];

  const menuItems = [
    { title: 'Ask Quote', icon: <Pointer size={50} />, route: '/ask-quote' },
    { title: 'RM Dealer', icon: <Users size={50} />, route: '/rm-dealers' },
    { title: 'RM DSR', icon: <FileText size={50} />, route: '/dsr' },
    { title: 'Raise Issue', icon: <AlertCircle size={50} />, route: '/raise-issue' },
    { title: 'Order History', icon: <History size={50} />, route: '/place-order' },
    { title: 'Sales Insight', icon: <TrendingUp size={50} />, route: '/sales-insight' },
  ];

  return (
    <div className="flex flex-col">
      {/* Header / Month Selector Section */}
      <div className="bg-white rounded-b-[17px] shadow-[0_3px_2px_rgba(30,38,60,0.15)] pb-4">
        <div className="flex justify-center mt-2">
          <div className="flex items-center bg-white rounded-b-[5px] shadow-[0_2px_1px_rgba(30,38,60,0.15)] px-4 py-1">
            <button onClick={handlePrevMonth} className="p-1 active:scale-90">
              <ChevronLeft size={24} className={monthCount > 1 ? 'text-[#D32F2F]' : 'text-gray-400'} />
            </button>
            <span className="mx-3 font-medium text-[#D32F2F] w-28 text-center">{formattedMonthYear}</span>
            <button onClick={handleNextMonth} className="p-1 active:scale-90">
              <ChevronRight size={24} className={monthCount < 3 ? 'text-[#D32F2F]' : 'text-gray-400'} />
            </button>
          </div>
        </div>

        {/* Target & Stats Split Section */}
        <div className="flex px-4 mt-6">
          {/* Left: Target & Achievement */}
          <div className="w-[40%] flex flex-col items-center border-r border-gray-100 pr-2">
            <span className="text-sm text-gray-700">Target</span>
            <span className="text-sm font-bold mt-1">{currentData.target}</span>
            
            {/* Pie Chart Representation */}
            <div className="relative w-24 h-24 my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  initial={{ strokeDashoffset: 238.76 }}
                  animate={{ strokeDashoffset: 238.76 * (1 - (currentData.percent / 100)) }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#008000"
                  strokeWidth="8"
                  strokeDasharray="238.76"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm font-bold text-[#008000]">{currentData.percent}%</span>
            </div>

            <span className="text-sm text-[#008000]">Achievement</span>
            <span className="text-sm font-bold mt-1 text-[#008000]">{currentData.achievement}</span>
          </div>

          {/* Right: Stats Grid */}
          <div className="w-[60%] pl-4 space-y-3">
             <div className="grid grid-cols-2 gap-2">
               {currentData.stats.slice(0, 6).map((stat, i) => (
                 <div key={i} className="bg-[#9DD1EE]/20 p-2 rounded-[5px] flex flex-col items-center text-center">
                   <span className="text-[9px] text-gray-700 leading-tight h-6 flex items-center">{stat.title}</span>
                   <span className="text-xs font-bold mt-1">{stat.value}</span>
                 </div>
               ))}
             </div>
             <div className="bg-[#9DD1EE]/20 p-2 rounded-[5px] flex flex-col items-center text-center w-full">
                <span className="text-[9px] text-gray-700">{currentData.stats[6].title}</span>
                <span className="text-xs font-bold mt-1">{currentData.stats[6].value}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Menu Grid Section */}
      <div className="p-4 mt-4">
        <div className="bg-white rounded-[17px] shadow-[0_3px_2px_rgba(30,38,60,0.15)] p-4 pt-6">
          <div className="grid grid-cols-3 gap-y-8 gap-x-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.route)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="p-2 text-black/20">
                  {item.icon}
                </div>
                <span className="text-sm text-gray-700 text-center mt-2 leading-tight">
                  {item.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing for bottom nav */}
      <div className="h-20" />
    </div>
  );
};

export default DashboardView;