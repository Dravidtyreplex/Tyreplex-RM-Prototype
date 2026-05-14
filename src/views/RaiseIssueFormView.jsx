import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const RaiseIssueFormView = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessUnit: '',
    isOldOrder: '',
    dealerId: '',
    orderId: '',
    issue: '',
    priority: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/raise-issue');
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      <header className="h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10 bg-white">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-gray-800 text-lg font-medium">Raise Issue</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 p-5 space-y-5 overflow-y-auto no-scrollbar">
          {/* Business Unit */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Business Unit *</label>
            <div className="relative">
              <select 
                required
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 appearance-none outline-none focus:border-gray-400"
                value={formData.businessUnit}
                onChange={(e) => setFormData({...formData, businessUnit: e.target.value})}
              >
                <option value="" disabled>Select BU</option>
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Is Old Order */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Is Old Order? *</label>
            <div className="relative">
              <select 
                required
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 appearance-none outline-none focus:border-gray-400"
                value={formData.isOldOrder}
                onChange={(e) => setFormData({...formData, isOldOrder: e.target.value})}
              >
                <option value="" disabled>Select Yes/No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Dealer Select */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Dealer Name *</label>
            <div className="relative">
              <select 
                required
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 appearance-none outline-none focus:border-gray-400"
                value={formData.dealerId}
                onChange={(e) => setFormData({...formData, dealerId: e.target.value})}
              >
                <option value="" disabled>Select Dealer</option>
                <option value="20456">Modern Tyres & Service</option>
                <option value="20489">Super Wheel Care</option>
                <option value="20500">Sharma Auto</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Order ID */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Order ID</label>
            <input 
              type="text"
              placeholder="Enter Order ID (Optional)"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 outline-none focus:border-gray-400"
              value={formData.orderId}
              onChange={(e) => setFormData({...formData, orderId: e.target.value})}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Priority *</label>
            <div className="relative">
              <select 
                required
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 appearance-none outline-none focus:border-gray-400"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="" disabled>Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Add Issue *</label>
            <textarea 
              required
              rows={4}
              placeholder="Describe the issue in detail..."
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 outline-none focus:border-gray-400 resize-none"
              value={formData.issue}
              onChange={(e) => setFormData({...formData, issue: e.target.value})}
            />
          </div>
          
          <div className="h-10" />
        </div>

        <div className="p-4 border-t bg-white sticky bottom-0">
          <button 
            type="submit"
            className="w-full bg-[#D32F2F] text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RaiseIssueFormView;
