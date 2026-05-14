import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotificationCenterView = () => {
  const notifications = [
    {
      id: '1',
      title: 'Order Delivered',
      body: 'Order #ORD-12345 has been delivered successfully to Modern Tyres.',
      added: '2 mins ago',
      status: '0' // Unread
    },
    {
      id: '2',
      title: 'New Price Quote',
      body: 'Your price quote for MRF ZLX has been approved.',
      added: '1 hour ago',
      status: '1' // Read
    },
    {
      id: '3',
      title: 'Payment Received',
      body: 'Payment of ₹12,500 received from Super Wheel Care.',
      added: 'Yesterday',
      status: '1'
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* AppBar */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => window.history.back()} className="mr-4">
          <ArrowLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-gray-800 text-lg font-medium">Notifications</h1>
      </header>

      {/* Notification List */}
      <div className="flex-1 p-2.5 space-y-3">
        {notifications.map((notif, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-md p-3 shadow-[0_3px_3px_rgba(30,38,60,0.15)] flex flex-col"
          >
            <div className="flex justify-end">
              <span className={`text-[10px] ${notif.status === '0' ? 'text-black font-medium' : 'text-gray-400'}`}>
                {notif.added}
              </span>
            </div>
            
            <h3 className={`text-xs mt-1 ${notif.status === '0' ? 'text-black font-bold' : 'text-gray-500 font-semibold'}`}>
              {notif.title}
            </h3>
            
            <p className={`text-xs mt-1 leading-relaxed ${notif.status === '0' ? 'text-black font-medium' : 'text-gray-400 font-normal'}`}>
              {notif.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenterView;
