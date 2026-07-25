import React from 'react';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';
import { useApp } from './AppContext';

interface DeviceWrapperProps {
  children: React.ReactNode;
}

export const DeviceWrapper: React.FC<DeviceWrapperProps> = ({ children }) => {
  const { deviceViewMode, deviceFrameType, setDeviceViewMode, setDeviceFrameType } = useApp();

  if (deviceViewMode === 'full') {
    return <div className="w-full min-h-[calc(100vh-65px)] pb-20">{children}</div>;
  }

  const isIphone = deviceFrameType === 'iphone';

  return (
    <div className="py-6 px-2 min-h-[calc(100vh-65px)] flex flex-col items-center justify-start bg-[#050608]">
      {/* Frame Controls Header */}
      <div className="mb-4 flex items-center justify-between gap-4 w-full max-w-[420px] bg-[#121622] p-2.5 rounded-2xl border border-[#232a3d]">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#ff5500]" />
          <span className="text-xs font-bold text-white">
            {isIphone ? 'iPhone 15 Pro Frame' : 'Android Gaming Phone Frame'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDeviceFrameType('android')}
            className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-colors ${
              !isIphone ? 'bg-[#ff5500] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Android
          </button>
          <button
            onClick={() => setDeviceFrameType('iphone')}
            className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-colors ${
              isIphone ? 'bg-[#ff5500] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            iPhone
          </button>
          <button
            onClick={() => setDeviceViewMode('full')}
            className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Exit Frame
          </button>
        </div>
      </div>

      {/* Outer Device Chassis */}
      <div 
        className={`relative w-full max-w-[400px] h-[780px] bg-[#0c0e14] rounded-[48px] p-3 shadow-[0_0_50px_rgba(255,85,0,0.2)] border-4 ${
          isIphone ? 'border-slate-700' : 'border-slate-800'
        } flex flex-col overflow-hidden transition-all`}
      >
        {/* Device Notch / Punch Hole */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
          {isIphone ? (
            /* Dynamic Island */
            <div className="w-28 h-6 bg-black rounded-full border border-slate-800 flex items-center justify-end px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            </div>
          ) : (
            /* Camera Punchhole */
            <div className="w-4 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900" />
            </div>
          )}
        </div>

        {/* Mobile Status Bar */}
        <div className="pt-2 px-6 pb-2 bg-[#0a0c10] text-slate-300 text-[11px] font-mono flex items-center justify-between select-none z-40 border-b border-[#1f2638]">
          <span className="font-bold text-white">09:41</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="text-[9px] font-bold text-[#ff5500] bg-[#ff5500]/20 px-1 rounded">5G</span>
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Inner Device Screen (Scrollable area) */}
        <div className="flex-1 overflow-y-auto bg-[#07090e] pb-16 custom-scrollbar relative">
          {children}
        </div>

        {/* Home Bar Indicator (iPhone style) */}
        {isIphone && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full z-50" />
        )}
      </div>
    </div>
  );
};
