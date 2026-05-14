import React from 'react';
import { Home, MapPin, Pointer, Menu } from 'lucide-react';

const BottomNav = ({ selectedIndex, onSelect, onMenuClick }) => {
  const items = [
    { label: 'Home', icon: <Home size={28} />, index: 0 },
    { label: 'Visits', icon: <MapPin size={28} />, index: 1 },
    { label: 'Ask Quote', icon: <Pointer size={28} />, index: 2 },
    { label: 'Menu', icon: <Menu size={28} />, index: 3 },
  ];

  return (
    <nav className="bg-white border-t flex justify-around items-center h-16 pb-2 shrink-0">
      {items.map((item) => (
        <button
          key={item.index}
          onClick={() => item.index === 3 ? onMenuClick() : onSelect(item.index)}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            selectedIndex === item.index ? 'text-[#D32F2F]' : 'text-[#666666]'
          }`}
        >
          <div className="mb-1">{item.icon}</div>
          <span className="text-[10px]">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
