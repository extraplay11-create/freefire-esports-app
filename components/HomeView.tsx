import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Crosshair, 
  Swords, 
  Wallet, 
  ChevronRight, 
  Clock, 
  Gift, 
  Users, 
  Award, 
  Play, 
  CheckCircle,
  Zap,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useApp } from '../AppContext';
import { Tournament } from '../types';

interface HomeViewProps {
  onOpenJoinModal: (tournament: Tournament) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenJoinModal }) => {
  const { 
    currentUser, 
    tournaments, 
    announcements, 
    setActiveTab,
    registrations 
  } = useApp();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto carousel banner rotation
  useEffect(() => {
    if (announcements.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements]);

  const upcomingTournaments = tournaments.filter(t => t.status !== 'Completed').slice(0, 4);

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Announcement Banner Slider */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141824] via-[#1a2030] to-[#0f131d] border border-[#ff5500]/40 shadow-[0_0_25px_rgba(255,85,0,0.15)]">
        {announcements.length > 0 && (
          <div className="p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5500]/20 border border-[#ff5500]/50 text-[#ff7700] text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-[#ff5500] animate-bounce" />
                <span>{announcements[currentBannerIndex].badge}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-white italic tracking-wide uppercase leading-tight">
                {announcements[currentBannerIndex].title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {announcements[currentBannerIndex].content}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => setActiveTab('tournaments')}
                  className="ff-btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg"
                >
                  <Swords className="w-4 h-4" />
                  <span>Browse Tournaments</span>
                </button>

                <button
                  onClick={() => setActiveTab('wallet')}
                  className="px-4 py-2.5 bg-[#1f2738] hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-[#232a3d] flex items-center gap-2 transition-all"
                >
                  <Gift className="w-4 h-4 text-amber-400" />
                  <span>Redeem "BOOYAH50"</span>
                </button>
              </div>
            </div>

            {/* Banner Right Feature Image / Badge */}
            <div className="relative w-full md:w-64 h-36 rounded-2xl overflow-hidden border border-[#ff5500]/30 shadow-2xl flex-shrink-0 bg-[#0a0c10]">
              <img
                src={announcements[currentBannerIndex].image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80'}
                alt="Free Fire Banner"
                className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono font-bold text-amber-400">
                <span>OFFICIAL ARENA</span>
                <span>{announcements[currentBannerIndex].date}</span>
              </div>
            </div>
          </div>
        )}

        {/* Carousel Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pb-1">
          {announcements.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBannerIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentBannerIndex ? 'w-6 bg-[#ff5500]' : 'w-2 bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. User Stats Bar (if logged in) */}
      {currentUser && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="ff-card-bg p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#ff5500] flex items-center justify-center flex-shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Wallet Balance</p>
              <p className="text-base sm:text-lg font-black text-white">₹{currentUser.walletBalance}</p>
            </div>
          </div>

          <div className="ff-card-bg p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Winnings</p>
              <p className="text-base sm:text-lg font-black text-amber-400">₹{currentUser.stats.totalWinnings}</p>
            </div>
          </div>

          <div className="ff-card-bg p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Career Kills</p>
              <p className="text-base sm:text-lg font-black text-white">{currentUser.stats.totalKills}</p>
            </div>
          </div>

          <div className="ff-card-bg p-3.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Matches Played</p>
              <p className="text-base sm:text-lg font-black text-white">{currentUser.stats.matchesPlayed}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Quick Mode Switcher Category Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveTab('tournaments')}
          className="ff-card-bg p-3 rounded-2xl hover:border-[#ff5500] text-left group transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-[9px] font-extrabold text-[#ff5500] bg-[#ff5500]/20 px-1.5 py-0.5 rounded">SOLO</span>
            <p className="text-xs font-bold text-white mt-1 group-hover:text-[#ff7700]">Battle Royale</p>
          </div>
          <Crosshair className="w-5 h-5 text-slate-400 group-hover:text-[#ff5500] group-hover:rotate-45 transition-transform" />
        </button>

        <button
          onClick={() => setActiveTab('tournaments')}
          className="ff-card-bg p-3 rounded-2xl hover:border-[#ff5500] text-left group transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-[9px] font-extrabold text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded">CS 4v4</span>
            <p className="text-xs font-bold text-white mt-1 group-hover:text-[#ff7700]">Clash Squad</p>
          </div>
          <Swords className="w-5 h-5 text-slate-400 group-hover:text-[#ff5500] group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setActiveTab('tournaments')}
          className="ff-card-bg p-3 rounded-2xl hover:border-[#ff5500] text-left group transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">FREE ENTRY</span>
            <p className="text-xs font-bold text-white mt-1 group-hover:text-[#ff7700]">₹0 Fee Matches</p>
          </div>
          <Gift className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className="ff-card-bg p-3 rounded-2xl hover:border-[#ff5500] text-left group transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">TOP PLAYERS</span>
            <p className="text-xs font-bold text-white mt-1 group-hover:text-[#ff7700]">Grandmasters</p>
          </div>
          <Trophy className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* 4. Live Winners Activity Ticker */}
      <div className="bg-[#121622] border border-[#232a3d] p-3 rounded-2xl flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ff5500]/20 text-[#ff5500] text-xs font-extrabold uppercase whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
          <span>LIVE WINNERS</span>
        </div>
        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap text-xs text-slate-300 font-mono flex items-center gap-6">
          <span className="inline-flex items-center gap-1 text-amber-400">
            🏆 <strong className="text-white">Apex_God_99</strong> won ₹1,500 in Bermuda Solo
          </span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-emerald-400">
            ⚡ <strong className="text-white">Viper_Booyah99</strong> cashed out ₹860 via UPI
          </span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-orange-400">
            🔥 <strong className="text-white">Queen_Priya_FF</strong> took 14 Kills in CS 4v4
          </span>
        </div>
      </div>

      {/* 5. Featured Tournaments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white italic uppercase tracking-wide flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#ff5500]" />
              <span>FEATURED TOURNAMENTS</span>
            </h2>
            <p className="text-xs text-slate-400">Join upcoming matches before slots fill out</p>
          </div>

          <button
            onClick={() => setActiveTab('tournaments')}
            className="text-xs font-bold text-[#ff5500] hover:text-[#ff7700] flex items-center gap-1"
          >
            <span>View All ({tournaments.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingTournaments.map((tr) => {
            const isFull = tr.filledSlots >= tr.totalSlots;
            const progress = Math.min(100, Math.round((tr.filledSlots / tr.totalSlots) * 100));

            return (
              <div
                key={tr.id}
                className="ff-card-bg ff-card-bg-hover rounded-2xl p-4 space-y-3 relative overflow-hidden"
              >
                {/* Badge Tag */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff5500]/20 text-[#ff7700] border border-[#ff5500]/40">
                    {tr.badge || `${tr.mode} - ${tr.map}`}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-amber-400 font-mono font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(tr.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-extrabold text-white leading-snug">{tr.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{tr.subtitle}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#0c0f17] p-2.5 rounded-xl border border-[#1f2638] text-center">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">PRIZE POOL</p>
                    <p className="text-sm font-black text-amber-400">₹{tr.prizePool}</p>
                  </div>
                  <div className="border-x border-slate-800">
                    <p className="text-[9px] uppercase font-bold text-slate-400">PER KILL</p>
                    <p className="text-sm font-black text-[#ff5500]">₹{tr.perKillReward}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">ENTRY FEE</p>
                    <p className="text-sm font-black text-white">
                      {tr.entryFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${tr.entryFee}`}
                    </p>
                  </div>
                </div>

                {/* Slots Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Slots Joined</span>
                    </span>
                    <span className={isFull ? 'text-red-400' : 'text-slate-300'}>
                      {tr.filledSlots} / {tr.totalSlots}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#0a0c10] rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-[#ff5500]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Join CTA */}
                <div className="pt-1 flex items-center justify-between gap-3">
                  <div className="text-[10px] text-slate-400 font-mono">
                    <span>Map: </span>
                    <strong className="text-white">{tr.map}</strong>
                  </div>

                  <button
                    disabled={isFull}
                    onClick={() => onOpenJoinModal(tr)}
                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'ff-btn-primary'
                    }`}
                  >
                    <span>{isFull ? 'ROOM FULL' : 'JOIN TOURNAMENT'}</span>
                    {!isFull && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. How To Join & Rules Infographic */}
      <div className="ff-card-bg p-5 rounded-3xl space-y-4">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <span className="text-[10px] font-extrabold text-[#ff5500] uppercase tracking-widest bg-[#ff5500]/20 px-2.5 py-0.5 rounded-full">
            EASY 4-STEP GUIDE
          </span>
          <h2 className="text-lg font-black text-white italic uppercase">HOW TO PLAY & WIN REAL CASH</h2>
          <p className="text-xs text-slate-400">Step by step process to register, claim Room ID, and receive instant payouts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0b0e16] p-3.5 rounded-2xl border border-[#1f2638] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#ff5500]/20 text-[#ff5500] font-black flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="text-xs font-extrabold text-white">Join Tournament</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Select any Solo, Duo or Squad match and pay entry fee using wallet balance.
            </p>
          </div>

          <div className="bg-[#0b0e16] p-3.5 rounded-2xl border border-[#1f2638] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="text-xs font-extrabold text-white">Get Room Key</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Room ID & Password unlocks in 'My Matches' tab 15 minutes before start.
            </p>
          </div>

          <div className="bg-[#0b0e16] p-3.5 rounded-2xl border border-[#1f2638] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-black flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="text-xs font-extrabold text-white">Play Free Fire</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Join custom room in game, score kills & Booyah. Take a final result screenshot!
            </p>
          </div>

          <div className="bg-[#0b0e16] p-3.5 rounded-2xl border border-[#1f2638] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="text-xs font-extrabold text-white">Instant Cashout</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upload screenshot proof & get winnings credited instantly to your UPI or Paytm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
          
