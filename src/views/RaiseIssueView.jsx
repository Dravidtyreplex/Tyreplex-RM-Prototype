import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RaiseIssueView = () => {
  const navigate = useNavigate();
  const issues = [
    {
      id: 'ISS-1234',
      title: 'Payment Mismatch',
      status: 'In Progress',
      date: '12 May, 2026',
      description: 'The payment for order #89234 is not reflecting in the portal.'
    },
    {
      id: 'ISS-1230',
      title: 'Wrong Item Delivered',
      status: 'Resolved',
      date: '10 May, 2026',
      description: 'Received 155/80 R13 instead of 165/80 R14.'
    }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* AppBar */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="mr-4">
          <ArrowLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-gray-800 text-lg font-medium">Issues Listed</h1>
      </header>

      {/* Issues List */}
      <div className="flex-1 p-2.5 space-y-3">
        {issues.map((issue, index) => (
          <div key={index} className="bg-white rounded-md p-4 shadow-[0_3px_3px_rgba(30,38,60,0.15)] flex flex-col">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-400">#{issue.id}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                issue.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {issue.status}
              </span>
            </div>
            
            <h3 className="text-sm font-bold text-gray-800 mt-2">{issue.title}</h3>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{issue.description}</p>
            
            <div className="h-[1px] bg-gray-50 my-2" />
            
            <div className="flex justify-end text-[10px] text-gray-400">
              {issue.date}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/raise-issue/form')}
        className="absolute bottom-20 right-4 bg-[#D32F2F] text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 active:scale-95 transition-transform z-20"
      >
        <AlertCircle size={20} />
        <span className="font-bold text-sm">Raise Issue</span>
      </button>
    </div>
  );
};

export default RaiseIssueView;
