import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, Search, Sparkles, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const tabs = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/map', label: 'Mapa', icon: Map },
    { to: '/search', label: 'Buscar', icon: Search },
    { to: '/plus', label: 'Plus', icon: Sparkles },
    { to: '/profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] py-1.5 px-2 shadow-lg">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#FF71C2] font-semibold scale-105'
                    : 'text-[#6B7280] hover:text-[#1A1A1A]'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
