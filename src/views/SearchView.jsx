import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, Mic, X } from 'lucide-react';

const SearchView = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const recentSearches = [
    'MRF ZLX 165/80 R14',
    'Apollo Alnac 4G',
    'CEAT Milaze X3',
    'Bridgestone Turanza'
  ];

  const suggestedTyres = [
    { name: 'MRF Wanderer Street', size: '215/65 R16', price: '₹6,400' },
    { name: 'Apollo Amazer XP', size: '155/80 R13', price: '₹3,200' },
    { name: 'CEAT SecuraDrive', size: '195/55 R16', price: '₹5,800' }
  ];

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Search Header */}
      <header className="h-16 flex items-center px-4 border-b shrink-0 sticky top-0 z-10 bg-white">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={21} className="text-[#D32F2F]" />
        </button>
        <div className="flex-1 bg-gray-100 rounded-lg flex items-center px-3 py-2">
          <SearchIcon size={18} className="text-gray-400 mr-2" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search by Tyre Size or Name"
            className="bg-transparent border-none outline-none text-sm w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button onClick={() => setQuery('')}><X size={18} className="text-gray-400" /></button>
          ) : (
            <Mic size={18} className="text-[#D32F2F]" />
          )}
        </div>
      </header>

      <div className="p-4 flex-1">
        {!query ? (
          <>
            <div className="mb-6">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-xs text-gray-700">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested for you</h3>
              <div className="space-y-4">
                {suggestedTyres.map((tyre, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">{tyre.name}</span>
                      <span className="text-[10px] text-gray-500">{tyre.size}</span>
                    </div>
                    <span className="text-sm font-bold text-[#D32F2F]">{tyre.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 mt-20">
             <SearchIcon size={48} className="mx-auto mb-4 opacity-10" />
             <p className="text-sm">Searching for "{query}"...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
