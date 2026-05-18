import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Material Icons as SVG - matching Flutter's MaterialIcons exactly
const MaterialIcon = ({ path, size = 50 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={path} />
  </svg>
);

// Material Icon paths matching Flutter's icon codes
const ICONS = {
  // touch_app - Ask Quote (Flutter: Icons.touch_app / 0xe5c8)
  touchApp: "M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zM18.84 15.87l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z",
  // people - RM Dealer (Flutter: Icons.people / 0xe7ef)
  people: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  // description - RM DSR (Flutter: Icons.description / 0xe873)
  description: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  // report_problem - Raise Issue (Flutter: Icons.report_problem / 0xe8b2)
  reportProblem: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  // shopping_cart - Order History (Flutter: Icons.shopping_cart / 0xe8cc)
  shoppingCart: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
  // trending_up - Sales Insight (Flutter: Icons.trending_up / 0xe8e5)
  trendingUp: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
};

const DashboardView = () => {
  const navigate = useNavigate();
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogColumns, setDialogColumns] = useState([]);
  const [dialogRows, setDialogRows] = useState([]);

  // Dialog data for each clickable stat
  const dialogData = {
    'Total Orders': {
      columns: ['Dealer Name', 'Order ID', 'Total Amount'],
      rows: [
        ['Modern Tyres & Service', 'ORD-89234', '₹12,400'],
        ['Super Wheel Care', 'ORD-89210', '₹42,000'],
        ['Amit Tyres', 'ORD-89198', '₹8,500'],
      ],
    },
    'Fully Paid': {
      columns: ['Dealer Name', 'Order ID', 'Amount Paid'],
      rows: [
        ['Modern Tyres & Service', 'ORD-89234', '₹12,400'],
        ['Sharma Auto', 'ORD-89180', '₹15,200'],
      ],
    },
    'Collection Pending': {
      columns: ['Dealer Name', 'Order ID', 'Amount Pending'],
      rows: [
        ['Super Wheel Care', 'ORD-89210', '₹42,000'],
        ['Lucky Tyre House', 'ORD-89150', '₹18,000'],
      ],
    },
    'Unique Txn Dealer': {
      columns: ['Dealer Name', 'Dealer ID'],
      rows: [
        ['Modern Tyres & Service', '20456'],
        ['Super Wheel Care', '20489'],
        ['Amit Tyres', '30100'],
      ],
    },
    'Unique Non Txn Dealer': {
      columns: ['Dealer Name', 'Dealer ID'],
      rows: [
        ['P N TRADERS', '173323'],
        ['Yash Tyre', '37110'],
        ['Malhotra motors', '37078'],
        ['Punjab Tyre', '37007'],
        ['LUXURY WHEELZ', '36975'],
        ['TYRE MASTERS', '36933'],
        ['ANAV ENTERPRISES', '36851'],
        ['MYTYREPOINT AND ACCESSORIES', '36747'],
        ['Tyreplex Technologies And Commerce Pvt Ltd', '36710'],
      ],
    },
  };

  const openDialog = (statTitle) => {
    const data = dialogData[statTitle];
    if (data) {
      setDialogTitle(statTitle);
      setDialogColumns(data.columns);
      setDialogRows(data.rows);
      setDialogOpen(true);
    }
  };
  
  // Month navigation - matches Flutter: starts at current month, can go back 3 months
  const [monthCount, setMonthCount] = useState(3);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (monthCount > 1) {
      if (month === 1) {
        setMonth(12);
        setYear(prev => prev - 1);
      } else {
        setMonth(prev => prev - 1);
      }
      setMonthCount(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthCount < 3) {
      if (month === 12) {
        setMonth(1);
        setYear(new Date().getFullYear());
      } else {
        setMonth(prev => prev + 1);
      }
      setMonthCount(prev => prev + 1);
    }
  };

  // Mock data
  const dashboardData = {
    1: {
      target: '₹35,00,000',
      achievement: '₹12,40,000',
      percent: 35,
      stats: [
        { title: 'Total Orders', value: '18' },
        { title: 'Fully Paid', value: '10' },
        { title: 'Total GMV', value: '₹10,50,000' },
        { title: 'Collection Pending', value: '₹8,45,000' },
        { title: 'Dealer Assigned', value: '145' },
        { title: 'Unique Txn Dealer', value: '12' },
        { title: 'Unique Non Txn Dealer', value: '133' },
      ]
    },
    2: {
      target: '₹40,00,000',
      achievement: '₹22,80,000',
      percent: 57,
      stats: [
        { title: 'Total Orders', value: '31' },
        { title: 'Fully Paid', value: '25' },
        { title: 'Total GMV', value: '₹18,20,000' },
        { title: 'Collection Pending', value: '₹10,10,000' },
        { title: 'Dealer Assigned', value: '148' },
        { title: 'Unique Txn Dealer', value: '21' },
        { title: 'Unique Non Txn Dealer', value: '127' },
      ]
    },
    3: {
      target: '₹45,00,000',
      achievement: '₹32,40,000',
      percent: 72,
      stats: [
        { title: 'Total Orders', value: '45' },
        { title: 'Fully Paid', value: '32' },
        { title: 'Total GMV', value: '₹24,50,000' },
        { title: 'Collection Pending', value: '₹12,45,000' },
        { title: 'Dealer Assigned', value: '150' },
        { title: 'Unique Txn Dealer', value: '28' },
        { title: 'Unique Non Txn Dealer', value: '122' },
      ]
    }
  };

  const currentData = dashboardData[monthCount];

  // Menu items - using Material Icons SVG paths to match Flutter exactly
  // Flutter renders these with: Icon(IconData(iconCode, fontFamily: 'MaterialIcons'), size: 50, color: Color.fromRGBO(0, 0, 0, 0.20))
  const menuItems = [
    { title: 'Ask Quote', icon: ICONS.touchApp, route: '/ask-quote' },
    { title: 'RM Dealer', icon: ICONS.people, route: '/rm-dealers' },
    { title: 'RM DSR', icon: ICONS.description, route: '/dsr' },
    { title: 'Raise Issue', icon: ICONS.reportProblem, route: '/raise-issue' },
    { title: 'Order History', icon: ICONS.shoppingCart, route: '/place-order' },
    { title: 'Sales Insight', icon: ICONS.trendingUp, route: '/sales-insight' },
  ];

  return (
    <div className="flex flex-col">
      {/* Target & Stats Section - white card with rounded bottom corners */}
      <div className="bg-white rounded-b-[17px] shadow-[0_3px_2px_rgba(30,38,60,0.15)] pb-4">
        {/* Month Selector */}
        <div className="flex justify-center mt-2">
          <div className="flex items-center bg-white rounded-b-[5px] shadow-[0_2px_1px_rgba(30,38,60,0.15)] px-4 py-1">
            <button onClick={handlePrevMonth} className="p-1 active:scale-90" aria-label="Previous month">
              <ChevronLeft size={25} className={monthCount > 1 ? 'text-[#D32F2F]' : 'text-[#666666]'} />
            </button>
            <span className="mx-4 font-medium text-[#D32F2F] min-w-[140px] text-center text-sm">
              {monthNames[month - 1]}, {year}
            </span>
            <button onClick={handleNextMonth} className="p-1 active:scale-90" aria-label="Next month">
              <ChevronRight size={25} className={monthCount < 3 ? 'text-[#D32F2F]' : 'text-[#666666]'} />
            </button>
          </div>
        </div>

        {/* Target & Stats Split */}
        <div className="flex px-4 mt-6">
          {/* Left: Target & Achievement (40%) */}
          <div className="w-[40%] flex flex-col items-center border-r border-gray-100 pr-2">
            <span className="text-sm text-gray-700">Target</span>
            <span className="text-sm font-bold mt-1">{currentData.target}</span>
            
            {/* Pie Chart ring */}
            <div className="relative w-24 h-24 my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                <motion.circle
                  initial={{ strokeDashoffset: 238.76 }}
                  animate={{ strokeDashoffset: 238.76 * (1 - (currentData.percent / 100)) }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  cx="48" cy="48" r="38"
                  stroke="#008000" strokeWidth="8"
                  strokeDasharray="238.76" strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-sm font-bold text-[#008000]">{currentData.percent}%</span>
            </div>

            <span className="text-sm text-[#008000]">Achievement</span>
            <span className="text-sm font-bold mt-1 text-[#008000]">{currentData.achievement}</span>
          </div>

          {/* Right: Stats Grid (60%) */}
          <div className="w-[60%] pl-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {currentData.stats.slice(0, 6).map((stat, i) => (
                <div 
                  key={i} 
                  onClick={() => openDialog(stat.title)}
                  className={`bg-[#9DD1EE]/20 p-2 rounded-[5px] flex flex-col items-center text-center ${
                    dialogData[stat.title] ? 'cursor-pointer active:scale-95 transition-transform' : ''
                  }`}
                >
                  <span className="text-[9px] text-gray-700 leading-tight h-6 flex items-center">{stat.title}</span>
                  <span className="text-xs font-bold mt-1">{stat.value}</span>
                </div>
              ))}
            </div>
            <div 
              onClick={() => openDialog(currentData.stats[6].title)}
              className="bg-[#9DD1EE]/20 p-2 rounded-[5px] flex flex-col items-center text-center w-full cursor-pointer active:scale-95 transition-transform"
            >
              <span className="text-[9px] text-gray-700">{currentData.stats[6].title}</span>
              <span className="text-xs font-bold mt-1">{currentData.stats[6].value}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid - matches Flutter's GridView.builder with Material Icons */}
      <div className="p-4 mt-4">
        <div className="bg-white rounded-[17px] shadow-[0_3px_2px_rgba(30,38,60,0.15)] px-1 pt-6 pb-2">
          <div className="grid grid-cols-3 gap-y-4 gap-x-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.route)}
                className="flex flex-col items-center cursor-pointer"
              >
                {/* Icon - matches Flutter: size 50, color rgba(0,0,0,0.20) */}
                <div className="p-2 text-black/20">
                  <MaterialIcon path={item.icon} size={50} />
                </div>
                {/* Title - matches Flutter: bodyMedium, center, maxLines 2 */}
                <span className="text-sm text-gray-700 text-center mt-2 leading-tight max-w-[80px]">
                  {item.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing for bottom nav */}
      <div className="h-20" />

      {/* Stats Dialog Modal */}
      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={() => setDialogOpen(false)} />
            
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-lg shadow-xl mx-6 p-5 max-w-[360px] w-full max-h-[70vh] flex flex-col"
            >
              {/* Title */}
              <h2 className="text-[18px] font-bold text-black mb-4">{dialogTitle}</h2>

              {/* Table */}
              <div className="flex-1 overflow-y-auto border border-gray-300">
                {/* Table Header */}
                <div className="grid border-b border-gray-300 bg-white sticky top-0" style={{ gridTemplateColumns: `repeat(${dialogColumns.length}, 1fr)` }}>
                  {dialogColumns.map((col, i) => (
                    <div key={i} className="px-3 py-2 text-[12px] font-bold text-black border-r border-gray-300 last:border-r-0">
                      {col}
                    </div>
                  ))}
                </div>
                {/* Table Rows */}
                {dialogRows.length > 0 ? (
                  dialogRows.map((row, rowIndex) => (
                    <div 
                      key={rowIndex} 
                      className="grid border-b border-gray-300 last:border-b-0"
                      style={{ gridTemplateColumns: `repeat(${dialogColumns.length}, 1fr)` }}
                    >
                      {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="px-3 py-2 text-[12px] text-black border-r border-gray-300 last:border-r-0">
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-[12px] text-gray-400 text-center">No data available</div>
                )}
              </div>

              {/* Close button */}
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setDialogOpen(false)}
                  className="text-[#D32F2F] text-[15px] font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardView;
