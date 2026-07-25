import React, { useState } from 'react';
import { Flame, Wallet, Shield, User as UserIcon, Smartphone, Monitor, Bell, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TopHeaderProps {
  onOpenAuth: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenAuth }) => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    deviceViewMode, 
    setDeviceViewMode, 
    deviceFrameType, 
    setDeviceFrameType,
    resetDemoData
  } = useApp();

  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0c10]/95 backdrop-blur-md border-b border-[#232a3d] px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo Section */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#ff5500] to-[#ff8800] p-0.5 flex items-center justify-center shadow-lg shadow-orange-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d1018] rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff5500] animate-flame" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white uppercase italic">
                FREE <span className="text-[#ff5500]">FIRE</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ff5500]/20 text-[#ff7700] border border-[#ff5500]/30 hidden sm:inline-block">
                ESPORTS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-1 hidden xs:block font-mono">Mobile Arena</p>
          </div>
        </div>

        {/* Center: Device Simulator Controls & Quick Actions */}
        <div className="hidden md:flex items-center gap-2 bg-[#121622] p-1 rounded-xl border border-[#232a3d]">
          <button
            onClick={() => setDeviceViewMode('full')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              deviceViewMode === 'full' 
                ? 'bg-[#ff5500] text-white shadow-md shadow-orange-950' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
            title="Full Web Screen Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Responsive Web</span>
          </button>

          <button
            onClick={() => setDeviceViewMode('mobile-phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              deviceViewMode === 'mobile-phone' 
                ? 'bg-[#ff5500] text-white shadow-md shadow-orange-950' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
            title="Mobile Device Mockup View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device</span>
          </button>

          {deviceViewMode === 'mobile-phone' && (
            <div className="flex items-center gap-1 border-l border-slate-700/60 pl-2 ml-1">
              <button
                onClick={() => setDeviceFrameType('android')}
                className={`text-[10px] px-2 py-1 rounded font-mono uppercase ${
                  deviceFrameType === 'android' ? 'bg-[#ff5500]/30 text-orange-400 font-bold' : 'text-slate-400'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => setDeviceFrameType('iphone')}
                className={`text-[10px] px-2 py-1 rounded font-mono uppercase ${
                  deviceFrameType === 'iphone' ? 'bg-[#ff5500]/30 text-orange-400 font-bold' : 'text-slate-400'
                }`}
              >
                iPhone
              </button>
            </div>
          )}
        </div>

        {/* Right Section: User Status / Wallet / Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Wallet Pill Button */}
              <button
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-2 bg-[#161c2b] hover:bg-[#1f283d] border border-[#ff5500]/40 hover:border-[#ff5500] px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-sm group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#ff5500]/20 flex items-center justify-center text-[#ff5500] group-hover:scale-110 transition-transform">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Wallet</p>
                  <p className="text-xs sm:text-sm font-extrabold text-white leading-none mt-0.5">
                    ₹{currentUser.walletBalance}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#ff5500] text-white flex items-center justify-center ml-0.5 shadow">
                  <Plus className="w-3 h-3" />
                </div>
              </button>

              {/* Notification bell */}
              <button
                onClick={() => triggerToast("⚡ Room IDs and Match updates will be notified here!")}
                className="relative p-2 rounded-xl bg-[#121622] hover:bg-[#1c2234] border border-[#232a3d] text-slate-300 hover:text-white transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff5500] animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff5500]" />
              </button>

              {/* User Avatar / Profile Trigger */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#ff5500]/20 border-[#ff5500] text-white'
                    : 'bg-[#121622] border-[#232a3d] hover:border-slate-600'
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-[#ff5500]/50"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white truncate max-w-[100px] leading-tight">
                    {currentUser.ffIgn}
                  </p>
                  <p className="text-[10px] text-amber-400 font-mono font-semibold leading-tight flex items-center gap-1">
                    <span>{currentUser.rank}</span>
                    {currentUser.role === 'admin' && (
                      <span className="bg-red-500/30 text-red-400 px-1 rounded text-[8px]">ADMIN</span>
                    )}
                  </p>
                </div>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="ff-btn-primary px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Reset Demo Button */}
          <button
            onClick={resetDemoData}
            className="p-2 rounded-xl bg-[#121622] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#232a3d] transition-colors"
            title="Reset All Tournament & Wallet Demo Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification Toast Popup */}
      {showNotificationToast && (
        <div className="fixed top-16 right-4 z-50 bg-[#161c2b] border border-[#ff5500] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#ff5500]" />
          <p className="text-xs font-semibold">{toastMsg}</p>
        </div>
      )}
    </header>
  );
};
              
