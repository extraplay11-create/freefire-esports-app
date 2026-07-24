import React, { useState } from 'react';
import { 
  Crosshair, 
  Key, 
  Copy, 
  Check, 
  Upload, 
  Clock, 
  Trophy, 
  AlertCircle, 
  CheckCircle2, 
  Gamepad2, 
  ExternalLink,
  ShieldAlert,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MatchRegistration, Tournament } from '../types';

export const MyMatchesView: React.FC = () => {
  const { registrations, tournaments, currentUser, submitMatchResult, setActiveTab } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Result submission modal state
  const [selectedReg, setSelectedReg] = useState<MatchRegistration | null>(null);
  const [kills, setKills] = useState<number>(0);
  const [placement, setPlacement] = useState<number>(1);
  const [screenshotUrl, setScreenshotUrl] = useState<string>(
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter player registrations
  const userRegistrations = registrations.filter((r) => currentUser && r.userId === currentUser.id);

  const getTournament = (trId: string): Tournament | undefined => {
    return tournaments.find((t) => t.id === trId);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReg) return;

    submitMatchResult(selectedReg.id, screenshotUrl, kills, placement);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setSelectedReg(null);
    }, 2000);
  };

  const filteredRegs = userRegistrations.filter((r) => {
    const tr = getTournament(r.tournamentId);
    if (!tr) return false;

    if (activeTabFilter === 'upcoming') {
      return tr.status === 'Upcoming' || tr.status === 'Joining Open' || tr.status === 'Room Full';
    } else if (activeTabFilter === 'live') {
      return tr.status === 'Live' || Boolean(tr.roomId);
    } else {
      return tr.status === 'Completed' || r.resultStatus === 'Approved';
    }
  });

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-wide flex items-center gap-2">
            <Crosshair className="w-6 h-6 text-[#ff5500]" />
            <span>MY MATCHES & ROOM KEYS</span>
          </h1>
          <p className="text-xs text-slate-400">Access Room ID/Password and submit Booyah screenshots for cash credit</p>
        </div>

        <button
          onClick={() => setActiveTab('tournaments')}
          className="ff-btn-primary px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Crosshair className="w-4 h-4" />
          <span>Join More Matches</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 bg-[#121622] p-1.5 rounded-2xl border border-[#232a3d] max-w-md">
        <button
          onClick={() => setActiveTabFilter('upcoming')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabFilter === 'upcoming'
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Joined Upcoming
        </button>

        <button
          onClick={() => setActiveTabFilter('live')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTabFilter === 'live'
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-amber-300" />
          <span>Room Keys</span>
        </button>

        <button
          onClick={() => setActiveTabFilter('completed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabFilter === 'completed'
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          History & Results
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredRegs.length === 0 ? (
          <div className="text-center py-12 bg-[#121622] rounded-3xl border border-[#232a3d] space-y-3">
            <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Registered Matches in this Category</h3>
            <p className="text-xs text-slate-400">Join a tournament to view Room ID, password, and claim winnings</p>
            <button
              onClick={() => setActiveTab('tournaments')}
              className="px-4 py-2 bg-[#ff5500]/20 text-[#ff7700] rounded-xl text-xs font-bold border border-[#ff5500]/30 hover:bg-[#ff5500]/30"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          filteredRegs.map((reg) => {
            const tr = getTournament(reg.tournamentId);
            if (!tr) return null;

            const hasRoomKey = Boolean(tr.roomId && tr.roomPassword);

            return (
              <div
                key={reg.id}
                className="ff-card-bg rounded-2xl p-4 space-y-3 border-2 border-[#ff5500]/40 shadow-xl relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#ff5500]/20 text-[#ff7700] text-[10px] font-black uppercase">
                      {tr.mode} • {tr.map}
                    </span>
                    <h3 className="text-base font-black text-white italic mt-1">{tr.title}</h3>
                    <p className="text-xs text-slate-400">Assigned Slot Number: <strong className="text-amber-400">#{reg.slotNumber}</strong></p>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {reg.resultStatus === 'Approved' ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Prize ₹{reg.prizeWon} Credited</span>
                      </span>
                    ) : reg.resultStatus === 'Pending' ? (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-extrabold flex items-center gap-1">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Result Under Review</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-bold">
                        {tr.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Room ID & Password Display Card */}
                {hasRoomKey ? (
                  <div className="bg-[#101522] p-3.5 rounded-2xl border-2 border-[#ff5500] space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                        <Key className="w-4 h-4" />
                        <span>ROOM DETAILS UNLOCKED</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">Status: Room Live</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Room ID Copy Box */}
                      <div className="bg-[#080a10] p-2.5 rounded-xl border border-[#232a3d] flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">ROOM ID</p>
                          <p className="text-sm font-black text-white font-mono tracking-widest">{tr.roomId}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(tr.roomId!, 'Room ID')}
                          className="px-3 py-1.5 bg-[#ff5500]/20 hover:bg-[#ff5500]/30 text-[#ff7700] rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === 'Room ID' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Room Password Copy Box */}
                      <div className="bg-[#080a10] p-2.5 rounded-xl border border-[#232a3d] flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">ROOM PASSWORD</p>
                          <p className="text-sm font-black text-amber-400 font-mono tracking-widest">{tr.roomPassword}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(tr.roomPassword!, 'Room Password')}
                          className="px-3 py-1.5 bg-[#ff5500]/20 hover:bg-[#ff5500]/30 text-[#ff7700] rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          {copiedKey === 'Room Password' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Password</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0a0c10] p-3 rounded-xl border border-slate-800 text-center space-y-1">
                    <p className="text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Room Key Releases 15 Mins Before Match</span>
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Match Time: {new Date(tr.startTime).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Footer Actions & Screenshot Submission */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">
                    <span>Per Kill Bonus: </span>
                    <strong className="text-[#ff5500]">₹{tr.perKillReward}</strong>
                  </div>

                  {reg.resultStatus === 'Approved' ? (
                    <div className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/30">
                      {reg.adminNote || 'Winnings credited to wallet'}
                    </div>
                  ) : reg.resultStatus === 'Pending' ? (
                    <div className="text-xs text-amber-400 font-semibold bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-500/30">
                      Submitted (Kills: {reg.killsSubmitted}, Place: #{reg.placementSubmitted})
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedReg(reg);
                        setKills(0);
                        setPlacement(1);
                      }}
                      className="ff-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit Match Result Screenshot</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Result Screenshot Submission Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-[#0e121b] border-2 border-[#ff5500]/60 rounded-3xl p-5 shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-[#181f2f] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1" />
              <h2 className="text-xl font-black text-white italic">SUBMIT MATCH PROOF</h2>
              <p className="text-xs text-slate-400">Upload screenshot & stats for admin cash verification</p>
            </div>

            {submitSuccess ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">Screenshot Submitted Successfully!</p>
                <p className="text-[10px] text-slate-300">Admin will verify and credit cash to your wallet.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitResult} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Kills Count</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={kills}
                      onChange={(e) => setKills(Number(e.target.value))}
                      className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Final Placement (#)</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={placement}
                      onChange={(e) => setPlacement(Number(e.target.value))}
                      className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Screenshot Proof URL</label>
                  <input
                    type="url"
                    required
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Sample Booyah result screenshot auto-loaded for easy testing.
                  </p>
                </div>

                {/* Screenshot Preview */}
                <div className="relative h-32 rounded-xl overflow-hidden border border-[#232a3d] bg-black">
                  <img src={screenshotUrl} alt="Match Proof" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[9px] font-mono text-amber-400">
                    Preview
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full ff-btn-primary py-3 rounded-xl text-xs font-black uppercase shadow-lg flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit For Cash Verification</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
