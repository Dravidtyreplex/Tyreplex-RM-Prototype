import React from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RaiseIssueView = () => {
  const navigate = useNavigate();

  const issues = [
    {
      dealerId: '37097',
      dealerName: 'J. B. TRADERS',
      date: '14-04-2026',
      priority: 'Urgent',
      issueId: '#3905',
      selectedBU: 'Credit Note Request',
      orderType: 'OTHER',
      issueDescription: 'extra billed',
      orderId: '#1215289',
      status: 'admin',
    },
    {
      dealerId: '17201',
      dealerName: 'Shri Shyam Traders',
      date: '10-04-2026',
      priority: 'Urgent',
      issueId: '#3878',
      selectedBU: 'Credit Note Request',
      orderType: 'OTHER',
      issueDescription: 'Ober billed',
      orderId: '#1210450',
      status: 'admin',
    },
    {
      dealerId: '17201',
      dealerName: 'Shri Shyam Traders',
      date: '10-04-2026',
      priority: 'Urgent',
      issueId: '#3877',
      selectedBU: 'Credit Note Request',
      orderType: 'OTHER',
      issueDescription: 'Ober billed',
      orderId: '#1210452',
      status: 'admin',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F2F2F2] relative">
      {/* Header */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard')} className="mr-3" aria-label="Go back">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-[#D32F2F] text-[17px] font-bold flex-1 text-center pr-8">Issues Listed</h1>
      </header>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 no-scrollbar">
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Priority Badge */}
              <div className="flex justify-end px-4 pt-3">
                <span className={`text-[13px] font-bold ${
                  issue.priority === 'Urgent' ? 'text-[#F59E0B]' : 'text-green-600'
                }`}>
                  {issue.priority}
                </span>
              </div>

              {/* Dealer Info Row */}
              <div className="flex justify-between items-center px-4 pb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] text-gray-400 font-medium">#{issue.dealerId}</span>
                  <h3 className="text-[15px] font-bold text-black">{issue.dealerName}</h3>
                </div>
                <span className="text-[13px] font-medium text-black">{issue.date}</span>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gray-200 mx-4" />

              {/* Table Header */}
              <div className="grid grid-cols-3 px-4 pt-3 pb-1">
                <span className="text-[11px] font-medium text-gray-400">Issue Id</span>
                <span className="text-[11px] font-medium text-gray-400 text-center">Selected BU</span>
                <span className="text-[11px] font-medium text-gray-400 text-right">Order Type</span>
              </div>

              {/* Table Values */}
              <div className="grid grid-cols-3 px-4 pb-3">
                <span className="text-[13px] font-bold text-black">{issue.issueId}</span>
                <span className="text-[13px] font-medium text-black text-center">{issue.selectedBU}</span>
                <span className="text-[13px] font-medium text-black text-right">{issue.orderType}</span>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gray-200 mx-4" />

              {/* Issue Description */}
              <div className="px-4 py-3">
                <p className="text-[13px] text-black">
                  <span className="font-medium">Issue ({issue.orderId}):</span>{' '}
                  <span>{issue.issueDescription}</span>
                </p>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gray-200 mx-4" />

              {/* Status */}
              <div className="px-4 py-3">
                <p className="text-[13px]">
                  <span className="font-medium text-black">Status:</span>{' '}
                  <span className="text-green-600 font-medium">{issue.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Raise Issue Button */}
      <div className="absolute bottom-20 right-4 z-20">
        <button
          onClick={() => navigate('/raise-issue/form')}
          className="bg-[#ED1D24] text-white px-6 py-3.5 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
        >
          <AlertCircle size={20} />
          <span className="font-bold text-[14px]">Raise Issue</span>
        </button>
      </div>
    </div>
  );
};

export default RaiseIssueView;
