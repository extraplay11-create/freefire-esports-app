import React, { useState } from 'react';
import { X, CheckCircle2, Gamepad2, AlertCircle, Wallet, Plus, ShieldCheck, Flame } from 'lucide-react';
import { useApp } from '../AppContext';
import { Tournament } from '../types';

interface JoinTournamentModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const JoinTournamentModal: React.FC<JoinTournamentModalProps> = ({
  tournament,
  onClose,
  onOpenAuth,
}) => {
  const { currentUser, joinTournament, setActiveTab } = useApp();

  const [partnerIgn, setPartnerIgn] = useState('');
  const [partnerUid, setPartnerUid] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tournament) return null;

  const isDuoOrSquad = tournament.mode === 'Duo' || tournament.mode === 'Squad' || tournament.mode === 'Clash Squad';
  const hasSufficientBalance = currentUser && currentUser.walletBalance >= tournament.entryFee;

  const handleConfirmJoin = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = joinTournament(tournament.id, {
      partnerIgn: partnerIgn || undefined,
      partnerUid: partnerUid || undefined,
    });

    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setActiveTab('matches');
      }, 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0e121b] border-2 border-[#ff5500]/60 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(255,85,0,0.3)] space-y-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-[#181f2f] hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#ff5500]/20 text-[#ff5500] mb-2 border border-[#ff5500]/40">
            <Flame className="w-6 h-6 animate-flame" />
          </div>
          <h2 className="text-xl font-black text-white italic uppercase tracking-wide">CONFIRM REGISTRATION</h2>
          <p className="text-xs text-slate-400 mt-0.5">{tournament.title}</p>
        </div>

        {/* Success Banner */}
        {successMsg ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500 rounded-2xl text-center space-y-2 animate-pulse">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-emerald-300">{successMsg}</p>
            <p className="text-[10px] text-slate-300">Redirecting to 'My Matches'...</p>
          </div>
        ) : (
          <>
            {/* Player Info Summary Box */}
            {currentUser ? (
              <div className="bg-[#121622] p-3.5 rounded-2xl border border-[#232a3d] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Gamepad2 className="w-4 h-4 text-[#ff5500]" />
                    <span>Free Fire Player:</span>
                  </span>
                  <span className="text-white font-mono">{currentUser.ffIgn}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Free Fire UID:</span>
                  <span className="text-amber-400">{currentUser.ffUid}</span>
                </div>

                {isDuoOrSquad && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Partner / Teammate IGN & UID (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={partnerIgn}
                        onChange={(e) => setPartnerIgn(e.target.value)}
                        placeholder="Teammate IGN"
                        className="bg-[#0b0e16] border border-[#232a3d] rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff5500]"
                      />
                      <input
                        type="text"
                        value={partnerUid}
                        onChange={(e) => setPartnerUid(e.target.value)}
                        placeholder="Teammate UID"
                        className="bg-[#0b0e16] border border-[#232a3d] rounded-xl p-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#ff5500]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-amber-950/40 border border-amber-500/50 p-3.5 rounded-2xl text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                <p className="text-xs font-bold text-amber-300">Authentication Required</p>
                <p className="text-[11px] text-slate-300">Please login to join this tournament.</p>
                <button
                  onClick={onOpenAuth}
                  className="ff-btn-primary px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Login / Signup Now
                </button>
              </div>
            )}

            {/* Fee & Balance Comparison */}
            <div className="bg-[#0b0e16] p-3.5 rounded-2xl border border-[#1f2638] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Entry Fee:</span>
                <span className="font-extrabold text-white">
                  {tournament.entryFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${tournament.entryFee}`}
                </span>
              </div>

              {currentUser && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Your Wallet Balance:</span>
                  <span className={`font-extrabold ${hasSufficientBalance ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{currentUser.walletBalance}
                  </span>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500 rounded-xl text-xs text-red-300 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Low Balance Top Up Shortcut */}
            {currentUser && !hasSufficientBalance && (
              <div className="p-3 bg-[#181f2f] rounded-2xl border border-orange-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Need More Balance?</p>
                  <p className="text-[10px] text-slate-400">Top up ₹{tournament.entryFee - currentUser.walletBalance} to join</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('wallet');
                  }}
                  className="px-3 py-1.5 bg-[#ff5500] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Cash</span>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            {currentUser && (
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#161b27] hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-[#232a3d]"
                >
                  Cancel
                </button>

                <button
                  disabled={!hasSufficientBalance || isSubmitting}
                  onClick={handleConfirmJoin}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg ${
                    hasSufficientBalance
                      ? 'ff-btn-primary'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Joining...' : 'Confirm & Pay'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
                      
