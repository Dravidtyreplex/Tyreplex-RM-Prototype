import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, FileText, MapPin, Clock } from 'lucide-react';

// Mock dealer data matching the Flutter app's dealer card structure
const mockDealers = [
  {
    id: 1,
    dealerName: 'NEW WHEELS WORLD',
    state: 'Punjab',
    contactPerson: 'NEW WHEELS WORLD',
    mobile: '9********1',
    gstNumber: null,
    address: 'Jalandhar',
    lastTxn: null,
    verified: false,
  },
  {
    id: 2,
    dealerName: 'Fixit Auto pvt. ltd',
    state: 'Haryana',
    contactPerson: 'Fixit Auto pvt. ltd',
    mobile: '9*********5',
    gstNumber: '0**************5',
    address: '781B, VPO, Wazirabad Rd, Wazirabad, Sector 52, Gurugram, Haryana 122003 Gurgaon',
    lastTxn: 'Jun 2023',
    verified: true,
  },
  {
    id: 3,
    dealerName: 'SRI VINAYAKA MOTORS',
    state: 'Telangana',
    contactPerson: 'SRI VINAYAKA MOTORS',
    mobile: '8********5',
    gstNumber: '3**************V',
    address: 'PLOT NO 1 WP, GOKULNAGAR MARRIGUDA, Mallapur, Hyderabad, Medchal Malkajgiri, Telangana, 500076 Hyderabad',
    lastTxn: null,
    verified: true,
  },
  {
    id: 4,
    dealerName: 'SHARMA TYRES',
    state: 'Rajasthan',
    contactPerson: 'SHARMA TYRES',
    mobile: '7********2',
    gstNumber: '0**************8',
    address: 'Near Bus Stand, Jaipur Road, Sikar, Rajasthan 332001',
    lastTxn: 'Mar 2024',
    verified: true,
  },
  {
    id: 5,
    dealerName: 'BALAJI TYRE HOUSE',
    state: 'Maharashtra',
    contactPerson: 'BALAJI TYRE HOUSE',
    mobile: '9********7',
    gstNumber: null,
    address: 'Shop No 12, Market Yard, Pune',
    lastTxn: 'Jan 2024',
    verified: false,
  },
];

const RmDealerView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { key: 'all', label: 'All Dealers' },
    { key: 'nearby', label: 'Near By' },
    { key: 'search', label: 'Search By' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* AppBar - matches Flutter: back arrow + centered title */}
      <div className="bg-white h-14 flex items-center px-4 border-b">
        <button onClick={() => navigate(-1)} className="mr-3" aria-label="Go back">
          <ChevronLeft size={21} className="text-[#D32F2F]" />
        </button>
        <h1 className="text-base font-medium flex-1 text-center pr-8">All Dealers</h1>
      </div>

      {/* Tab Bar - pill shaped tabs matching the app */}
      <div className="flex px-4 py-3 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-[#D32F2F] text-[#D32F2F] bg-white'
                : 'border-gray-300 text-gray-600 bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section Header with count */}
      <div className="flex items-center justify-between px-4 pb-2">
        <span className="text-base font-bold text-gray-800">
          {activeTab === 'all' ? 'All Dealers' : activeTab === 'nearby' ? 'Near By Dealers' : 'Search Results'}
        </span>
        <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded">
          {activeTab === 'all' ? '27579' : activeTab === 'nearby' ? '12' : '0'}
        </span>
      </div>

      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {activeTab === 'all' && (
          mockDealers.map((dealer) => (
            <DealerCard key={dealer.id} dealer={dealer} onTap={() => navigate('/dealer-detail')} />
          ))
        )}

        {activeTab === 'nearby' && (
          <div className="flex flex-col items-center justify-center py-12">
            <MapPin size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Fetching nearby dealers…</p>
            <p className="text-gray-400 text-xs mt-1">Based on your current location</p>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="mt-2">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by dealer name, ID, mobile…"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm pl-10 focus:outline-none focus:border-[#D32F2F]"
              />
              <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-400 text-sm">Type to search dealers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Dealer Card Component - matches Flutter's dealer_card_widget exactly
const DealerCard = ({ dealer, onTap }) => {
  return (
    <div 
      onClick={onTap}
      className="bg-white border border-gray-200 rounded-xl mb-4 p-5 shadow-sm relative cursor-pointer"
    >
      {/* Verified/Unverified Badge - top right */}
      <div className="absolute top-3 right-3">
        {dealer.verified ? (
          <span className="flex items-center text-xs font-medium text-green-600">
            <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            Verified
          </span>
        ) : (
          <span className="flex items-center text-xs font-medium text-red-500">
            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
            Unverified
          </span>
        )}
      </div>

      {/* Dealer Name (State) */}
      <h3 className="text-base font-bold text-gray-900 pr-20 mb-3">
        {dealer.dealerName} ({dealer.state})
      </h3>

      {/* Contact Person + Phone */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1.5 text-gray-600">
          <User size={14} className="text-gray-400" />
          <span className="text-xs">{dealer.contactPerson}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Phone size={14} className="text-gray-400" />
          <span className="text-xs">{dealer.mobile}</span>
        </div>
      </div>

      {/* GST Number */}
      {dealer.gstNumber && (
        <div className="flex items-center gap-1.5 text-gray-600 mb-2">
          <FileText size={14} className="text-gray-400" />
          <span className="text-xs">GST Number: {dealer.gstNumber}</span>
        </div>
      )}

      {/* Address */}
      <div className="flex items-start gap-1.5 text-gray-600 mb-2">
        <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
        <span className="text-xs leading-relaxed">{dealer.address}</span>
      </div>

      {/* Last Txn */}
      {dealer.lastTxn && (
        <div className="flex items-center gap-1.5 text-gray-600 mt-2">
          <Clock size={14} className="text-gray-400" />
          <span className="text-xs font-medium">Last Txn: {dealer.lastTxn}</span>
        </div>
      )}
    </div>
  );
};

export default RmDealerView;
