import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Battery, MapPin, HelpCircle, LogOut, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './BottomNav';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { title: 'Battery Optimization', icon: <Battery size={20} className="text-[#D32F2F]" />, action: () => {} },
    { title: 'Background Location', icon: <MapPin size={20} className="text-[#D32F2F]" />, action: () => {} },
    { title: 'FAQ', icon: <HelpCircle size={20} />, action: () => { navigate('/faq') } },
    { title: 'Logout', icon: <LogOut size={20} />, action: () => { navigate('/login') } },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-4/5 max-w-[300px] bg-white z-50 flex flex-col"
          >
            <div className="py-6 flex flex-col items-center border-b border-[#D32F2F]">
              <img src="/logo.png" alt="Logo" className="h-10 mb-4" />
              <div className="w-full h-[1px] bg-[#D32F2F] mb-4" />
              <div className="flex items-center w-full px-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-[#D32F2F]">
                  <User size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">TyrePlex RM</span>
                </div>
              </div>
            </div>

            <div className="flex-1 py-4 overflow-y-auto no-scrollbar">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => { item.action(); onClose(); }}
                  className="flex items-center px-6 py-4 active:bg-gray-100 cursor-pointer"
                >
                  <span className="mr-4">{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.title}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t text-right text-[10px] text-gray-400">
              2.0.31 Build 31
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AppShell = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bottomNavIndex, setBottomNavIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isLoginPage = location.pathname === '/login';

  const handleBottomNavChange = (index) => {
    setBottomNavIndex(index);
    if (index === 0) navigate('/dashboard');
    else if (index === 1) navigate('/visits');
    else if (index === 2) navigate('/ask-quote');
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-start overflow-hidden">
      <div className="relative w-full max-w-[430px] h-[100vh] bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* AppBar (only show if not login) */}
        {!isLoginPage && (
          <header className="bg-white h-14 flex items-center justify-between px-4 border-b shrink-0">
            <h1 className="text-[#D32F2F] text-lg font-medium">Tyreplex RM</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2 rounded-full bg-red-50 text-[#D32F2F]"
              >
                <Bell size={20} />
              </button>
            </div>
          </header>
        )}

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#F2F2F2]">
          {children}
        </main>

        {/* Bottom Nav (only show if not login) */}
        {!isLoginPage && (
          <BottomNav 
            selectedIndex={bottomNavIndex} 
            onSelect={handleBottomNavChange}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AppShell;
