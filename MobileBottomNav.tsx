import React from 'react';
import { Home, Swords, Crosshair, Trophy, Wallet, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, registrations } = useApp();

  // Active joined matches count
  const joinedCount = registrations.filter(
    (r) => currentUser && r.userId === currentUser.id && r.resultStatus !== 'Approved'
  ).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tournaments', label: 'Tournaments', icon: Swords },
    { id: 'matches', label: 'My Matches', icon: Crosshair, badge: joinedCount > 0 ? joinedCount : undefined },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck, badge: undefined });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c10]/95 backdrop-blur-md border-t border-[#232a3d] px-2 py-1.5 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#ff5500] font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Top Glow Bar */}
              {isActive && (
                <div className="absolute -top-1.5 w-6 h-1 bg-[#ff5500] rounded-full shadow-[0_0_10px_#ff5500]" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#ff5500]' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#ff5500] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#0a0c10]">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 leading-none ${isActive ? 'text-white font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
