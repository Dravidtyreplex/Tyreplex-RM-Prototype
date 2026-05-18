import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const RaiseIssueFormView = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    selectBU: '',
    orderType: '',
    selectDealer: '',
    orderId: '',
    addIssue: '',
    priorityIssue: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/raise-issue');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3" aria-label="Go back">
          <ChevronLeft size={24} className="text-black" />
        </button>
        <h1 className="text-[#D32F2F] text-[17px] font-bold flex-1 text-center pr-8">Raise Issue</h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 no-scrollbar">
          <div className="space-y-5">
            {/* Select BU */}
            <div>
              <label className="block text-[14px] font-bold text-black mb-2">
                Select BU <span className="text-[#ED1D24]">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full h-[50px] px-4 border border-gray-300 rounded-lg text-[14px] text-black appearance-none outline-none focus:border-gray-400 bg-white"
                  value={formData.selectBU}
                  onChange={(e) => setFormData({ ...formData, selectBU: e.target.value })}
                >
                  <option value="" disabled>Select BU *</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Credit Note Request">Credit Note Request</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Order Type */}
            <div>
              <label className="block text-[14px] font-bold text-black mb-2">
                Order Type <span className="text-[#ED1D24]">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full h-[50px] px-4 border border-gray-300 rounded-lg text-[14px] text-black appearance-none outline-none focus:border-gray-400 bg-white"
                  value={formData.orderType}
                  onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                >
                  <option value="" disabled>Select Order Type *</option>
                  <option value="OLD">OLD</option>
                  <option value="NEW">NEW</option>
                  <option value="OTHER">OTHER</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Select Dealer */}
            <div>
              <label className="block text-[14px] font-bold text-black mb-2">
                Select Dealer <span className="text-[#ED1D24]">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full h-[50px] px-4 border border-gray-300 rounded-lg text-[14px] text-black appearance-none outline-none focus:border-gray-400 bg-white"
                  value={formData.selectDealer}
                  onChange={(e) => setFormData({ ...formData, selectDealer: e.target.value })}
                >
                  <option value="" disabled>Select Dealer *</option>
                  <option value="J. B. TRADERS">J. B. TRADERS</option>
                  <option value="Shri Shyam Traders">Shri Shyam Traders</option>
                  <option value="Modern Tyres & Service">Modern Tyres & Service</option>
                  <option value="Super Wheel Care">Super Wheel Care</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Order Id */}
            <div>
              <label className="block text-[14px] font-bold text-black mb-2">
                Order Id
              </label>
              <input
                type="text"
                placeholder="Order Id"
                className="w-full h-[50px] px-4 border border-gray-300 rounded-lg text-[14px] text-black outline-none focus:border-gray-400 bg-white placeholder:text-gray-400"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              />
            </div>

            {/* Add Issue */}
            <div>
              <label className="block text-[14px] font-bold text-black mb-2">
                Add Issue <span className="text-[#ED1D24]">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Add Issue *"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-[14px] text-black outline-none focus:border-gray-400 bg-white resize-none placeholder:text-gray-400"
                value={formData.addIssue}
                onChange={(e) => setFormData({ ...formData, addIssue: e.target.value })}
              />
            </div>

            {/* Priority Issue */}
            <div>
              <label className="block text-[14px] font-bold text-black mb-2">
                Priority Issue <span className="text-[#ED1D24]">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full h-[50px] px-4 border border-gray-300 rounded-lg text-[14px] text-black appearance-none outline-none focus:border-gray-400 bg-white"
                  value={formData.priorityIssue}
                  onChange={(e) => setFormData({ ...formData, priorityIssue: e.target.value })}
                >
                  <option value="" disabled>Select Priority Issue *</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-5 py-4 bg-white">
          <button
            type="submit"
            className="w-full bg-[#ED1D24] text-white font-bold text-[16px] py-4 rounded-lg active:scale-[0.98] transition-transform"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RaiseIssueFormView;
