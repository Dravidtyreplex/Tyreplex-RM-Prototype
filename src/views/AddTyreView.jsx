import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Search, ChevronDown, Plus, Trash2 } from 'lucide-react';

const AddTyreView = () => {
  const navigate = useNavigate();
  const [selectedDealer, setSelectedDealer] = useState('');
  const [isProceeded, setIsProceeded] = useState(false);
  const [tyreForms, setTyreForms] = useState([{ id: 1, brand: '', variant: '', qty: 1, price: '' }]);

  const dealers = [
    'Modern Tyres & Service',
    'Super Wheel Care',
    'Amit Tyres',
    'Lucky Tyre House'
  ];

  const handleAddMore = () => {
    setTyreForms([...tyreForms, { id: Date.now(), brand: '', variant: '', qty: 1, price: '' }]);
  };

  const handleRemove = (id) => {
    if (tyreForms.length > 1) {
      setTyreForms(tyreForms.filter(f => f.id !== id));
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* AppBar */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-4">
          <X size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-gray-800 text-lg font-medium">Add Tyre</h1>
      </header>

      {/* Dealer Selection */}
      <div className="bg-white p-4 shadow-sm mb-4">
        <label className="block text-[11px] text-gray-500 mb-2">Select B2B Dealer</label>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <select 
              disabled={isProceeded}
              value={selectedDealer}
              onChange={(e) => setSelectedDealer(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm appearance-none bg-white disabled:bg-gray-100"
            >
              <option value="">Select Dealer</option>
              {dealers.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button 
            disabled={!selectedDealer || isProceeded}
            onClick={() => setIsProceeded(true)}
            className={`px-6 py-2 rounded text-sm font-bold text-white transition-colors ${
              !selectedDealer || isProceeded ? 'bg-gray-300' : 'bg-[#D32F2F]'
            }`}
          >
            Proceed
          </button>
        </div>
      </div>

      {isProceeded && (
        <div className="flex-1 p-2.5 space-y-4">
          {/* Search Bar */}
          <div className="bg-white p-3 rounded shadow-sm border border-gray-200 flex items-center">
            <Search size={20} className="text-gray-400 mr-2" />
            <span className="text-sm text-gray-400">Search Tyre...</span>
          </div>

          {/* Forms */}
          {tyreForms.map((form, index) => (
            <div key={form.id} className="bg-white rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="bg-[#D32F2F] h-1" />
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-[#D32F2F]">Item {index + 1}</span>
                  {tyreForms.length > 1 && (
                    <button onClick={() => handleRemove(form.id)}>
                      <Trash2 size={16} className="text-gray-400" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <label className="block text-[10px] text-gray-500 mb-1">Select Brand</label>
                    <select className="w-full p-2 border border-gray-300 rounded text-sm appearance-none bg-white">
                      <option>Select Brand</option>
                      <option>MRF</option>
                      <option>CEAT</option>
                      <option>Apollo</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-8 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] text-gray-500 mb-1">Select Variant</label>
                    <select className="w-full p-2 border border-gray-300 rounded text-sm appearance-none bg-white">
                      <option>Select Variant</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-8 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Quantity</label>
                      <input type="number" defaultValue={1} className="w-full p-2 border border-gray-300 rounded text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 mb-1">Price</label>
                      <input type="number" placeholder="₹" className="w-full p-2 border border-gray-300 rounded text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={handleAddMore}
            className="w-full py-3 flex items-center justify-center space-x-2 text-[#D32F2F] font-bold border-2 border-dashed border-[#D32F2F]/30 rounded-md"
          >
            <Plus size={20} />
            <span>Add More Tyre</span>
          </button>
        </div>
      )}

      {/* Bottom Bar Action */}
      {isProceeded && (
        <div className="sticky bottom-0 bg-white p-2 border-t shrink-0">
          <button className="w-full bg-[#D32F2F] text-white font-bold py-3 rounded-md shadow-lg active:scale-95 transition-transform">
            Ask Quote
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTyreView;
