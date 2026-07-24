import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Megaphone, 
  Users, 
  Trophy, 
  Wallet, 
  Upload, 
  Clock,
  Swords,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GameMode, GameMap, Tournament } from '../types';

export const AdminPanelView: React.FC = () => {
  const { 
    tournaments, 
    registrations, 
    withdrawalRequests, 
    adminCreateTournament, 
    adminUpdateRoomInfo, 
    adminApproveResult, 
    adminApproveWithdrawal, 
    adminBroadcastAnnouncement 
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'create' | 'rooms' | 'results' | 'withdrawals' | 'broadcast'>('results');

  // Create Tournament State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [mode, setMode] = useState<GameMode>('Solo');
  const [map, setMap] = useState<GameMap>('Bermuda');
  const [entryFee, setEntryFee] = useState<number>(30);
  const [prizePool, setPrizePool] = useState<number>(1200);
  const [perKillReward, setPerKillReward] = useState<number>(15);
  const [firstPrize, setFirstPrize] = useState<number>(400);
  const [secondPrize, setSecondPrize] = useState<number>(200);
  const [totalSlots, setTotalSlots] = useState<number>(48);
  const [startTime, setStartTime] = useState<string>(
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // Room ID state
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(tournaments[0]?.id || '');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPassInput, setRoomPassInput] = useState('');
  const [roomUpdateSuccess, setRoomUpdateSuccess] = useState(false);

  // Broadcast state
  const [ancTitle, setAncTitle] = useState('');
  const [ancContent, setAncContent] = useState('');
  const [ancBadge, setAncBadge] = useState('EVENT');

  // Pending results submissions
  const pendingResults = registrations.filter((r) => r.resultStatus === 'Pending');
  const pendingWithdrawals = withdrawalRequests.filter((w) => w.status === 'Pending');

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    adminCreateTournament({
      title: title || '🔥 Bermuda Battle Royale',
      subtitle: subtitle || 'Official Custom Room Tournament',
      mode,
      map,
      type: mode === 'Clash Squad' ? 'Clash Squad 4v4' : 'Battle Royale',
      entryFee,
      prizePool,
      perKillReward,
      firstPrize,
      secondPrize,
      thirdPrize: 50,
      totalSlots,
      startTime: new Date(startTime).toISOString(),
      status: 'Joining Open',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      badge: 'NEW TOURNAMENT',
      organizer: 'Admin Arena',
      rules: ['No emulators allowed.', 'Take result screenshot.'],
    });

    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setTitle('');
    }, 2000);
  };

  const handlePublishRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournamentId || !roomIdInput || !roomPassInput) return;

    adminUpdateRoomInfo(selectedTournamentId, roomIdInput, roomPassInput);
    setRoomUpdateSuccess(true);
    setTimeout(() => {
      setRoomUpdateSuccess(false);
      setRoomIdInput('');
      setRoomPassInput('');
    }, 2000);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle || !ancContent) return;

    adminBroadcastAnnouncement({
      title: ancTitle,
      content: ancContent,
      badge: ancBadge,
    });

    setAncTitle('');
    setAncContent('');
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121622] p-4 rounded-3xl border border-red-500/40">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-500" />
            <span>ADMIN CONTROL PANEL</span>
          </h1>
          <p className="text-xs text-slate-400">Publish Room IDs, verify player Booyah screenshots, and process cash withdrawals</p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingResults.length} Pending Results</span>
          </span>

          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>{pendingWithdrawals.length} Cashouts</span>
          </span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveAdminTab('results')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'results' ? 'bg-red-600 text-white shadow-lg' : 'bg-[#121622] text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Approve Results ({pendingResults.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('rooms')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'rooms' ? 'bg-red-600 text-white shadow-lg' : 'bg-[#121622] text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Set Room ID & Pass</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('create')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'create' ? 'bg-red-600 text-white shadow-lg' : 'bg-[#121622] text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Tournament</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('withdrawals')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'withdrawals' ? 'bg-red-600 text-white shadow-lg' : 'bg-[#121622] text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Approve Cashouts ({pendingWithdrawals.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('broadcast')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeAdminTab === 'broadcast' ? 'bg-red-600 text-white shadow-lg' : 'bg-[#121622] text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Broadcast News</span>
        </button>
      </div>

      {/* Tab 1: Approve Player Screenshot Results */}
      {activeAdminTab === 'results' && (
        <div className="space-y-4">
          <h2 className="text-base font-black text-white italic uppercase flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>PLAYER MATCH RESULT VERIFICATION</span>
          </h2>

          {pendingResults.length === 0 ? (
            <div className="bg-[#121622] p-8 text-center rounded-2xl border border-[#232a3d] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-white">All Screenshot Submissions Cleared!</p>
              <p className="text-[11px] text-slate-400">When players submit Booyah screenshots from 'My Matches', they appear here for 1-click cash credit.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingResults.map((reg) => {
                const tr = tournaments.find((t) => t.id === reg.tournamentId);

                return (
                  <div key={reg.id} className="bg-[#121622] p-4 rounded-2xl border border-red-500/40 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                      <div>
                        <p className="font-extrabold text-white">{reg.userIgn}</p>
                        <p className="text-[10px] text-amber-400 font-mono">FF UID: {reg.userUid}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{tr?.title}</span>
                    </div>

                    {/* Screenshot image */}
                    {reg.screenshotProof && (
                      <div className="relative h-36 rounded-xl overflow-hidden border border-slate-700 bg-black">
                        <img src={reg.screenshotProof} alt="Match Proof" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400">
                          Reported: {reg.killsSubmitted} Kills • Place #{reg.placementSubmitted}
                        </div>
                      </div>
                    )}

                    {/* Approval Form */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          const estimatedPrize = ((reg.killsSubmitted || 0) * (tr?.perKillReward || 15)) + (reg.placementSubmitted === 1 ? (tr?.firstPrize || 400) : 0);
                          adminApproveResult(reg.id, estimatedPrize || 250, 'Verified Booyah Screenshot!');
                        }}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 shadow"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>1-Click Approve & Credit Cash</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Publish Room ID & Room Password */}
      {activeAdminTab === 'rooms' && (
        <div className="bg-[#121622] p-5 rounded-3xl border border-[#232a3d] space-y-4 max-w-lg">
          <h2 className="text-base font-black text-white italic uppercase flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <span>PUBLISH CUSTOM ROOM ID & PASSWORD</span>
          </h2>

          {roomUpdateSuccess ? (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-center text-xs font-bold text-emerald-300">
              Room Details Published! Unlocked for all registered players.
            </div>
          ) : (
            <form onSubmit={handlePublishRoom} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Tournament</label>
                <select
                  value={selectedTournamentId}
                  onChange={(e) => setSelectedTournamentId(e.target.value)}
                  className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.filledSlots}/{t.totalSlots} Slots)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Room ID</label>
                <input
                  type="text"
                  required
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  placeholder="e.g. 8829104"
                  className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Room Password</label>
                <input
                  type="text"
                  required
                  value={roomPassInput}
                  onChange={(e) => setRoomPassInput(e.target.value)}
                  placeholder="e.g. BOOYAH2026"
                  className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs uppercase shadow-lg flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Publish Room Key To Players</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Create Tournament */}
      {activeAdminTab === 'create' && (
        <div className="bg-[#121622] p-5 rounded-3xl border border-[#232a3d] space-y-4 max-w-2xl">
          <h2 className="text-base font-black text-white italic uppercase flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-red-500" />
            <span>CREATE NEW FREE FIRE TOURNAMENTS</span>
          </h2>

          {createdSuccess ? (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-center text-xs font-bold text-emerald-300">
              Tournament Created Successfully! Live on Home & Tournaments feed.
            </div>
          ) : (
            <form onSubmit={handleCreateTournament} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tournament Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 🔥 Bermuda Solo Showdown"
                    className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    required
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="High Kill Bonus Match"
                    className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Game Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Duo">Duo</option>
                    <option value="Squad">Squad</option>
                    <option value="Clash Squad">Clash Squad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Map</label>
                  <select
                    value={map}
                    onChange={(e) => setMap(e.target.value as any)}
                    className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Alpine">Alpine</option>
                    <option value="Nexterra">Nexterra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Total Slots</label>
                  <input
                    type="number"
                    required
                    value={totalSlots}
                    onChange={(e) => setTotalSlots(Number(e.target.value))}
                    className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Entry Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    className="w-full bg-[#0c0f17] border border-[#232a3d] rounded-xl p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Prize Pool (₹)</label>
                  <input
                    type="number"
                    required
                    value={prizePool}
                    onChange={(e) => setPrizePool(Number(e.target.value))}
                    className="w-full bg-[#0c0f17] border border-[#232a3d] rounded-xl p-2 text-xs text-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Per Kill (₹)</label>
                  <input
                    type="number"
                    required
                    value={perKillReward}
                    onChange={(e) => setPerKillReward(Number(e.target.value))}
                    className="w-full bg-[#0c0f17] border border-[#232a3d] rounded-xl p-2 text-xs text-orange-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 mb-1">1st Booyah (₹)</label>
                  <input
                    type="number"
                    required
                    value={firstPrize}
                    onChange={(e) => setFirstPrize(Number(e.target.value))}
                    className="w-full bg-[#0c0f17] border border-[#232a3d] rounded-xl p-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs uppercase shadow-lg flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Tournament</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 4: Approve Cashouts */}
      {activeAdminTab === 'withdrawals' && (
        <div className="space-y-3">
          <h2 className="text-base font-black text-white italic uppercase flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>PENDING CASHOUT PAYOUTS</span>
          </h2>

          {pendingWithdrawals.length === 0 ? (
            <div className="bg-[#121622] p-8 text-center rounded-2xl border border-[#232a3d]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-white">No Pending Cashout Requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingWithdrawals.map((w) => (
                <div
                  key={w.id}
                  className="bg-[#121622] p-3.5 rounded-2xl border border-emerald-500/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-extrabold text-white">{w.userName} — ₹{w.amount}</p>
                    <p className="text-[10px] text-emerald-400 font-mono">{w.method}: {w.paymentAddress}</p>
                  </div>

                  <button
                    onClick={() => adminApproveWithdrawal(w.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Mark Paid (Auto-UPI)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Broadcast News */}
      {activeAdminTab === 'broadcast' && (
        <div className="bg-[#121622] p-5 rounded-3xl border border-[#232a3d] space-y-4 max-w-lg">
          <h2 className="text-base font-black text-white italic uppercase flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <span>BROADCAST LIVE ANNOUNCEMENT BANNER</span>
          </h2>

          <form onSubmit={handleBroadcastSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={ancTitle}
                onChange={(e) => setAncTitle(e.target.value)}
                placeholder="e.g. 🔥 Weekend Grand ₹10,000 Cup!"
                className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Announcement Details</label>
              <textarea
                required
                value={ancContent}
                onChange={(e) => setAncContent(e.target.value)}
                placeholder="Write news content..."
                className="w-full bg-[#0c0f17] border border-[#232a3d] focus:border-red-500 rounded-xl p-2.5 text-xs text-white h-20"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs uppercase shadow-lg"
            >
              Broadcast To All Players
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
