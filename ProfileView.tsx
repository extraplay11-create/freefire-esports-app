import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Gamepad2, 
  Trophy, 
  Crosshair, 
  Copy, 
  Check, 
  Share2, 
  LogOut, 
  ShieldCheck, 
  Edit3, 
  Save, 
  Sparkles,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FREE_FIRE_CHARACTERS } from '../data/initialData';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, logout, loginAsAdmin, setActiveTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [ffIgn, setFfIgn] = useState(currentUser?.ffIgn || '');
  const [ffUid, setFfUid] = useState(currentUser?.ffUid || '');
  const [selectedCharacter, setSelectedCharacter] = useState(currentUser?.character || 'Alok');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ffIgn,
      ffUid,
      character: selectedCharacter,
    });
    setIsEditing(false);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const winRate = currentUser.stats.matchesPlayed > 0
    ? Math.round((currentUser.stats.totalWins / currentUser.stats.matchesPlayed) * 100)
    : 0;

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Player Identity Header Card */}
      <div className="ff-card-bg p-6 rounded-3xl border-2 border-[#ff5500]/50 relative overflow-hidden shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar with Glow Frame */}
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#ff5500] shadow-[0_0_20px_rgba(255,85,0,0.4)]"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase font-mono">
              LVL {currentUser.level}
            </span>
          </div>

          {/* Details */}
          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white italic">{currentUser.ffIgn}</h1>
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase">
                {currentUser.rank}
              </span>
              {currentUser.role === 'admin' && (
                <span className="px-2.5 py-0.5 rounded bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-black uppercase">
                  ADMIN
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 font-mono">Free Fire UID: <strong className="text-amber-400">{currentUser.ffUid}</strong></p>
            <p className="text-xs text-slate-400">Account Name: {currentUser.name} • {currentUser.phone}</p>
          </div>

          {/* Action Edit Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 bg-[#181f2f] hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-[#232a3d] flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit IGN/UID'}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-3 border-t border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Free Fire IGN</label>
                <input
                  type="text"
                  required
                  value={ffIgn}
                  onChange={(e) => setFfIgn(e.target.value)}
                  className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-[#ff5500] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Free Fire UID</label>
                <input
                  type="text"
                  required
                  value={ffUid}
                  onChange={(e) => setFfUid(e.target.value)}
                  className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-[#ff5500] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Active Character</label>
              <div className="grid grid-cols-3 gap-2">
                {FREE_FIRE_CHARACTERS.map((char) => (
                  <button
                    key={char.name}
                    type="button"
                    onClick={() => setSelectedCharacter(char.name)}
                    className={`p-2 rounded-xl border text-left text-xs ${
                      selectedCharacter === char.name
                        ? 'bg-[#ff5500]/20 border-[#ff5500] text-white font-bold'
                        : 'bg-[#0c0f17] border-[#232a3d] text-slate-400'
                    }`}
                  >
                    <span>{char.icon} {char.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="ff-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        )}
      </div>

      {/* Career Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="ff-card-bg p-4 rounded-2xl text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">MATCHES PLAYED</p>
          <p className="text-xl font-black text-white font-mono">{currentUser.stats.matchesPlayed}</p>
        </div>

        <div className="ff-card-bg p-4 rounded-2xl text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">TOTAL WINS</p>
          <p className="text-xl font-black text-amber-400 font-mono">{currentUser.stats.totalWins}</p>
        </div>

        <div className="ff-card-bg p-4 rounded-2xl text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">CAREER KILLS</p>
          <p className="text-xl font-black text-red-400 font-mono">{currentUser.stats.totalKills}</p>
        </div>

        <div className="ff-card-bg p-4 rounded-2xl text-center space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">WIN RATE</p>
          <p className="text-xl font-black text-emerald-400 font-mono">{winRate}%</p>
        </div>
      </div>

      {/* Refer & Earn Section */}
      <div className="ff-card-bg p-5 rounded-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-black text-white italic uppercase">REFER & EARN ₹50 CASH</h2>
        </div>
        <p className="text-xs text-slate-400">Share your referral code with fellow Free Fire players. Get ₹50 cash bonus when they join their first match!</p>

        <div className="flex items-center gap-2 max-w-md">
          <div className="flex-1 bg-[#0b0e16] border border-[#232a3d] rounded-xl p-3 text-center font-mono font-black text-amber-400 text-sm tracking-widest">
            {currentUser.referralCode}
          </div>

          <button
            onClick={handleCopyReferral}
            className="px-4 py-3 bg-[#ff5500] hover:bg-[#ff7700] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Footer Controls / Logout */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {currentUser.role !== 'admin' && (
          <button
            onClick={loginAsAdmin}
            className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/50 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Admin Control Panel</span>
          </button>
        )}

        <button
          onClick={logout}
          className="px-4 py-2.5 bg-[#181f2f] hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-[#232a3d] flex items-center gap-2 transition-colors ml-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Account</span>
        </button>
      </div>
    </div>
  );
};
