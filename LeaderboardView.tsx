import React, { useState } from 'react';
import { Trophy, Medal, Search, Flame, Crown, Swords, Award, Star } from 'lucide-react';
import { useApp } from '../AppContext';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, currentUser } = useApp();

  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'alltime'>('alltime');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaderboard = leaderboard.filter(
    (player) =>
      player.ffIgn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.ffUid.includes(searchQuery)
  );

  const top3 = filteredLeaderboard.slice(0, 3);
  const remainingList = filteredLeaderboard.slice(3);

  const myPosition = currentUser
    ? leaderboard.find((p) => p.userId === currentUser.id || p.ffUid === currentUser.ffUid)
    : null;

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-wide flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>FREE FIRE HALL OF FAME</span>
          </h1>
          <p className="text-xs text-slate-400">Top esports fraggers and prize money champions</p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#121622] p-1.5 rounded-2xl border border-[#232a3d]">
          <button
            onClick={() => setTimeFilter('weekly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeFilter === 'weekly' ? 'bg-[#ff5500] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeFilter('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeFilter === 'monthly' ? 'bg-[#ff5500] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeFilter('alltime')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeFilter === 'alltime' ? 'bg-[#ff5500] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Free Fire IGN or UID..."
          className="w-full bg-[#121622] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 pb-2 items-end max-w-3xl mx-auto">
          {/* 2nd Place */}
          <div className="ff-card-bg p-3 sm:p-4 rounded-3xl border border-slate-600 text-center space-y-2 relative order-1 sm:order-1">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 text-black font-black flex items-center justify-center text-xs shadow-lg">
              2
            </div>
            <div className="pt-2">
              <img
                src={top3[1].avatar}
                alt={top3[1].ffIgn}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl mx-auto object-cover border-2 border-slate-400"
              />
            </div>
            <div>
              <p className="text-xs font-black text-white truncate">{top3[1].ffIgn}</p>
              <p className="text-[10px] text-amber-400 font-bold font-mono mt-0.5">₹{top3[1].winnings}</p>
              <p className="text-[9px] text-slate-400 font-mono">{top3[1].kills} Kills</p>
            </div>
          </div>

          {/* 1st Place (Grand Champion) */}
          <div className="ff-card-bg p-4 sm:p-5 rounded-3xl border-2 border-amber-400 text-center space-y-2 relative shadow-[0_0_30px_rgba(255,183,0,0.3)] order-2 sm:order-2 scale-105 bg-gradient-to-b from-[#1c170d] to-[#121622]">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <Crown className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce" />
            </div>
            <div className="pt-2">
              <img
                src={top3[0].avatar}
                alt={top3[0].ffIgn}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto object-cover border-2 border-amber-400 shadow-lg"
              />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase">
                {top3[0].rankTier}
              </span>
              <p className="text-sm font-black text-white truncate mt-1">{top3[0].ffIgn}</p>
              <p className="text-sm font-extrabold text-amber-400 font-mono">₹{top3[0].winnings}</p>
              <p className="text-[10px] text-slate-300 font-mono">{top3[0].kills} Kills • {top3[0].wins} Wins</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="ff-card-bg p-3 sm:p-4 rounded-3xl border border-amber-700/60 text-center space-y-2 relative order-3 sm:order-3">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-xs shadow-lg">
              3
            </div>
            <div className="pt-2">
              <img
                src={top3[2].avatar}
                alt={top3[2].ffIgn}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl mx-auto object-cover border-2 border-amber-700"
              />
            </div>
            <div>
              <p className="text-xs font-black text-white truncate">{top3[2].ffIgn}</p>
              <p className="text-[10px] text-amber-400 font-bold font-mono mt-0.5">₹{top3[2].winnings}</p>
              <p className="text-[9px] text-slate-400 font-mono">{top3[2].kills} Kills</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="bg-[#121622] rounded-3xl border border-[#232a3d] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#232a3d] bg-[#0e121b] flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-8">Rank</span>
            <span>Player</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Kills</span>
            <span>Winnings</span>
          </div>
        </div>

        <div className="divide-y divide-[#1f2638]">
          {filteredLeaderboard.map((player) => {
            const isCurrent = currentUser && (player.userId === currentUser.id || player.ffUid === currentUser.ffUid);

            return (
              <div
                key={player.rank}
                className={`p-3.5 flex items-center justify-between transition-colors ${
                  isCurrent ? 'bg-[#ff5500]/15 border-l-4 border-[#ff5500]' : 'hover:bg-[#181e2e]'
                }`}
              >
                {/* Left: Rank & Player info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      player.rank === 1
                        ? 'bg-amber-400 text-black'
                        : player.rank === 2
                        ? 'bg-slate-300 text-black'
                        : player.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-[#1a2133] text-slate-400'
                    }`}
                  >
                    {player.rank}
                  </div>

                  <img
                    src={player.avatar}
                    alt={player.ffIgn}
                    className="w-10 h-10 rounded-xl object-cover border border-[#232a3d]"
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white">{player.ffIgn}</p>
                      {isCurrent && (
                        <span className="bg-[#ff5500] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-bold">{player.rankTier}</span>
                      <span>UID: {player.ffUid}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Kills & Winnings */}
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-200 font-mono">{player.kills}</p>
                    <p className="text-[9px] text-slate-400 uppercase">Total Kills</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-black text-amber-400 font-mono">₹{player.winnings}</p>
                    <p className="text-[9px] text-slate-400 uppercase sm:hidden">{player.kills} Kills</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating User Position Banner */}
      {myPosition && (
        <div className="sticky bottom-16 sm:bottom-6 bg-[#161c2b] border-2 border-[#ff5500] p-3.5 rounded-2xl shadow-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ff5500]" />
            <div>
              <p className="font-bold text-white">Your Leaderboard Standing</p>
              <p className="text-[10px] text-slate-400 font-mono">Rank #{myPosition.rank} • {myPosition.kills} Kills</p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-extrabold text-amber-400 text-sm font-mono">₹{myPosition.winnings}</p>
            <p className="text-[10px] text-emerald-400 font-bold">Total Earned</p>
          </div>
        </div>
      )}
    </div>
  );
};
