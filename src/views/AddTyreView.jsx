import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, Mic, ChevronDown } from 'lucide-react';

const AddTyreView = () => {
  const navigate = useNavigate();
  const [selectedDealer, setSelectedDealer] = useState('');
  const [isProceeded, setIsProceeded] = useState(false);
  const [tyreForms, setTyreForms] = useState([
    { id: 1, make: '', variant: '', quantity: '', price: '' }
  ]);

  const dealers = [
    { name: 'newww', id: '173469' },
    { name: 'Modern Tyres', id: '20456' },
    { name: 'Super Wheel Care', id: '20489' },
    { name: 'Amit Tyres', id: '30100' },
  ];

  const makes = ['Bridgestone', 'MRF', 'CEAT', 'Apollo', 'JK Tyre', 'Pirelli', 'Goodyear'];
  
  const variants = [
    'Bridgestone B390 205/65 R16 95S TL',
    'Bridgestone DUELER D693 265/65 R17 112 S TL',
    'MRF ZLX 165/80 R14',
    'CEAT MILAZE LT 155 R13 TL',
    'Apollo Alnac 4G 195/55 R16',
  ];

  const quantities = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20', '25', '50'];

  const handleAddMore = () => {
    setTyreForms([...tyreForms, { id: Date.now(), make: '', variant: '', quantity: '', price: '' }]);
  };

  const updateForm = (id, field, value) => {
    setTyreForms(tyreForms.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="bg-white h-14 flex items-center px-4 border-b shrink-0 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="mr-3" aria-label="Close">
          <X size={22} className="text-black" />
        </button>
        <h1 className="text-[#D32F2F] text-[17px] font-bold flex-1 text-center pr-8">Add Tyre</h1>
      </header>

      {/* Select B2B Dealer */}
      <div className="bg-white px-4 py-4 border-b">
        <label className="block text-[14px] font-bold text-black mb-2">Select B2B Dealer</label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <select
              disabled={isProceeded}
              value={selectedDealer}
              onChange={(e) => setSelectedDealer(e.target.value)}
              className="w-full h-[44px] px-3 border border-gray-300 rounded-lg text-[14px] text-black appearance-none outline-none bg-white disabled:bg-gray-100"
            >
              <option value="">Select Dealer</option>
              {dealers.map(d => (
                <option key={d.id} value={d.id}>{d.name}({d.id})</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            disabled={!selectedDealer || isProceeded}
            onClick={() => setIsProceeded(true)}
            className={`px-6 h-[44px] rounded-lg text-[14px] font-bold text-white ${
              !selectedDealer || isProceeded ? 'bg-gray-400' : 'bg-[#ED1D24]'
            }`}
          >
            Proceed
          </button>
        </div>
      </div>

      {/* Content after Proceed */}
      {isProceeded && (
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {/* Search Tyres */}
          <div className="px-4 py-4 bg-[#F2F2F2]">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg h-[44px] px-3">
              <Search size={20} className="text-gray-400 mr-2" />
              <span className="flex-1 text-[14px] text-gray-400">Search Tyres</span>
              <Mic size={20} className="text-gray-400" />
            </div>
          </div>

          {/* Tyre Forms */}
          <div className="px-4 pt-4">
            {tyreForms.map((form, index) => (
              <div key={form.id} className="mb-6">
                {/* Section Title */}
                <p className="text-[14px] font-medium text-black mb-4">
                  Tyre {index + 1}: Select tyre for the best quote
                </p>

                <div className="space-y-4">
                  {/* Select Make */}
                  <div className="relative">
                    <select
                      value={form.make}
                      onChange={(e) => updateForm(form.id, 'make', e.target.value)}
                      className="w-full h-[52px] px-4 border border-gray-300 rounded-md text-[14px] text-black appearance-none outline-none bg-white"
                    >
                      <option value="" disabled>Select Make *</option>
                      {makes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    {form.make && (
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-500">
                        Select Make <span className="text-[#D32F2F]">*</span>
                      </label>
                    )}
                  </div>

                  {/* Select Variant */}
                  <div className="relative">
                    <select
                      value={form.variant}
                      onChange={(e) => updateForm(form.id, 'variant', e.target.value)}
                      className="w-full h-[52px] px-4 border border-gray-300 rounded-md text-[14px] text-black appearance-none outline-none bg-white"
                    >
                      <option value="" disabled>Select Variant *</option>
                      {variants.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    {form.variant && (
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-500">
                        Select Variant <span className="text-[#D32F2F]">*</span>
                      </label>
                    )}
                  </div>

                  {/* Select Quantity */}
                  <div className="relative">
                    <select
                      value={form.quantity}
                      onChange={(e) => updateForm(form.id, 'quantity', e.target.value)}
                      className="w-full h-[52px] px-4 border border-gray-300 rounded-md text-[14px] text-black appearance-none outline-none bg-white"
                    >
                      <option value="" disabled>Select Quantity *</option>
                      {quantities.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    {form.quantity && (
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] text-gray-500">
                        Select Quantity <span className="text-[#D32F2F]">*</span>
                      </label>
                    )}
                  </div>

                  {/* Price */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Price"
                      value={form.price}
                      onChange={(e) => updateForm(form.id, 'price', e.target.value)}
                      className="w-full h-[52px] px-4 border border-gray-300 rounded-md text-[14px] text-black outline-none bg-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add More */}
            <button
              onClick={handleAddMore}
              className="text-[14px] font-bold text-[#2CBDFE] mb-6"
            >
              + Add More
            </button>
          </div>
        </div>
      )}

      {/* Bottom Ask Quote Button */}
      {isProceeded && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <div className="w-full max-w-[430px] px-4 pb-4 pointer-events-auto">
            <button
              className="w-full bg-[#ED1D24] text-white font-bold text-[16px] py-4 rounded-lg shadow-lg active:scale-[0.98] transition-transform"
            >
              Ask Quote
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTyreView;
