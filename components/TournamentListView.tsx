import React, { useState } from 'react';
import { 
  Search, 
  Swords, 
  Crosshair, 
  Filter, 
  MapPin, 
  Trophy, 
  Clock, 
  Users, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  X,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tournament, GameMode, GameMap } from '../types';

interface TournamentListViewProps {
  onOpenJoinModal: (tournament: Tournament) => void;
}

export const TournamentListView: React.FC<TournamentListViewProps> = ({ onOpenJoinModal }) => {
  const { tournaments, registrations, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedMap, setSelectedMap] = useState<string>('All');
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [detailTournament, setDetailTournament] = useState<Tournament | null>(null);

  // Filter logic
  const filteredTournaments = tournaments.filter((tr) => {
    const matchesSearch = tr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tr.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tr.map.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMode = selectedMode === 'All' || tr.mode === selectedMode;
    const matchesMap = selectedMap === 'All' || tr.map === selectedMap;
    const matchesFree = !freeOnly || tr.entryFee === 0;

    return matchesSearch && matchesMode && matchesMap && matchesFree;
  });

  const modes: (GameMode | 'All')[] = ['All', 'Solo', 'Duo', 'Squad', 'Clash Squad'];
  const maps: (GameMap | 'All')[] = ['All', 'Bermuda', 'Purgatory', 'Kalahari', 'Alpine', 'Nexterra'];

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-5">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-wide flex items-center gap-2">
            <Swords className="w-6 h-6 text-[#ff5500]" />
            <span>FREE FIRE TOURNAMENTS</span>
          </h1>
          <p className="text-xs text-slate-400">Select a match, reserve your slot, and battle for real cash rewards</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search map, mode or title..."
            className="w-full bg-[#121622] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#121622] border border-[#232a3d] p-3 rounded-2xl space-y-3">
        {/* Game Mode Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#ff5500]" />
            <span>Mode:</span>
          </span>

          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMode(m)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedMode === m
                  ? 'bg-[#ff5500] text-white shadow-md'
                  : 'bg-[#181e2e] text-slate-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}

          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              freeOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                : 'bg-[#181e2e] text-slate-400 border-[#232a3d]'
            }`}
          >
            🎁 Free Entry Matches Only
          </button>
        </div>

        {/* Map Selection Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-[#1f2638]">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Map:</span>
          </span>

          {maps.map((mp) => (
            <button
              key={mp}
              onClick={() => setSelectedMap(mp)}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                selectedMap === mp
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mp}
            </button>
          ))}
        </div>
      </div>

      {/* Tournament Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTournaments.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-[#121622] rounded-3xl border border-[#232a3d] space-y-3">
            <Swords className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Tournaments Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your mode, map, or search query</p>
            <button
              onClick={() => {
                setSelectedMode('All');
                setSelectedMap('All');
                setSearchQuery('');
                setFreeOnly(false);
              }}
              className="px-4 py-2 bg-[#ff5500]/20 text-[#ff7700] rounded-xl text-xs font-bold border border-[#ff5500]/30 hover:bg-[#ff5500]/30"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTournaments.map((tr) => {
            const isJoined = currentUser && registrations.some((r) => r.tournamentId === tr.id && r.userId === currentUser.id);
            const isFull = tr.filledSlots >= tr.totalSlots;
            const progress = Math.min(100, Math.round((tr.filledSlots / tr.totalSlots) * 100));

            return (
              <div
                key={tr.id}
                className={`ff-card-bg ff-card-bg-hover rounded-2xl p-4 flex flex-col justify-between space-y-3 relative ${
                  isJoined ? 'border-[#ff5500] ring-1 ring-[#ff5500]/40' : ''
                }`}
              >
                {/* Top Badge & Time */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#ff5500]/20 border border-[#ff5500]/30 text-[#ff7700] text-[10px] font-black uppercase">
                    {tr.badge || `${tr.mode} • ${tr.map}`}
                  </span>

                  {isJoined ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>JOINED</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(tr.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                  )}
                </div>

                {/* Tournament Title & Subtitle */}
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-1">{tr.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{tr.subtitle}</p>
                </div>

                {/* Prize Breakdown Box */}
                <div className="grid grid-cols-3 gap-1 bg-[#0c0f17] p-2 rounded-xl border border-[#1f2638] text-center">
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">PRIZE POOL</p>
                    <p className="text-xs font-black text-amber-400">₹{tr.prizePool}</p>
                  </div>
                  <div className="border-x border-slate-800">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">PER KILL</p>
                    <p className="text-xs font-black text-[#ff5500]">₹{tr.perKillReward}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">ENTRY FEE</p>
                    <p className="text-xs font-black text-white">
                      {tr.entryFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${tr.entryFee}`}
                    </p>
                  </div>
                </div>

                {/* Slot Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span>Slots</span>
                    </span>
                    <span className={isFull ? 'text-red-400' : 'text-slate-300'}>
                      {tr.filledSlots} / {tr.totalSlots}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#0a0c10] rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull ? 'bg-red-500' : 'bg-[#ff5500]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Card Footer Action Buttons */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => setDetailTournament(tr)}
                    className="p-2 bg-[#181f2f] hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                    title="View Rules & Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    disabled={isFull && !isJoined}
                    onClick={() => onOpenJoinModal(tr)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md ${
                      isJoined
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'ff-btn-primary'
                    }`}
                  >
                    <span>{isJoined ? 'VIEW MATCH' : isFull ? 'ROOM FULL' : 'JOIN MATCH'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tournament Details Modal */}
      {detailTournament && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-[#0e121b] border-2 border-[#ff5500]/60 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailTournament(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-[#181f2f] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded bg-[#ff5500]/20 text-[#ff7700] text-[10px] font-black uppercase">
                {detailTournament.mode} • {detailTournament.map}
              </span>
              <h2 className="text-xl font-black text-white italic mt-1">{detailTournament.title}</h2>
              <p className="text-xs text-slate-400">{detailTournament.subtitle}</p>
            </div>

            {/* Prize Table */}
            <div className="bg-[#121622] p-3 rounded-2xl border border-[#232a3d] space-y-2">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>PRIZE DISTRIBUTION</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#0b0e16] p-2 rounded-xl">
                  <p className="text-[9px] text-slate-400 uppercase">1ST BOOYAH</p>
                  <p className="font-extrabold text-amber-400">₹{detailTournament.firstPrize}</p>
                </div>
                <div className="bg-[#0b0e16] p-2 rounded-xl">
                  <p className="text-[9px] text-slate-400 uppercase">2ND PLACE</p>
                  <p className="font-extrabold text-slate-300">₹{detailTournament.secondPrize}</p>
                </div>
                <div className="bg-[#0b0e16] p-2 rounded-xl">
                  <p className="text-[9px] text-slate-400 uppercase">PER KILL</p>
                  <p className="font-extrabold text-[#ff5500]">₹{detailTournament.perKillReward}</p>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#ff5500]" />
                <span>TOURNAMENT RULES</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300 bg-[#0c0f17] p-3 rounded-2xl border border-[#1f2638]">
                {detailTournament.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#ff5500] font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                const tr = detailTournament;
                setDetailTournament(null);
                onOpenJoinModal(tr);
              }}
              className="w-full ff-btn-primary py-3 rounded-xl text-xs font-black uppercase shadow-lg"
            >
              Proceed to Join Tournament
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
                                                                        
