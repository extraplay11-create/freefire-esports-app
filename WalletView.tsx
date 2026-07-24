import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode, 
  Gift, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  X,
  History,
  Copy,
  Check,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WalletView: React.FC = () => {
  const { 
    currentUser, 
    transactions, 
    withdrawalRequests, 
    depositFunds, 
    requestWithdrawal 
  } = useApp();

  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Add Money form state
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [upiApp, setUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'QR'>('GPay');
  const [utrRefNumber, setUtrRefNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(200);
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI' | 'Paytm' | 'GPay' | 'PhonePe'>('UPI');
  const [paymentAddress, setPaymentAddress] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter transactions
  const [txnFilter, setTxnFilter] = useState<'All' | 'Deposit' | 'Withdrawal' | 'Winning Credit'>('All');

  const userTransactions = transactions.filter((t) => currentUser && t.userId === currentUser.id);
  const userWithdrawals = withdrawalRequests.filter((w) => currentUser && w.userId === currentUser.id);

  const filteredTxns = userTransactions.filter((t) => txnFilter === 'All' || t.type === txnFilter);

  const OFFICIAL_UPI_ID = 'esports.booyah@upi';

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const res = depositFunds(depositAmount, `UPI (${upiApp})`, promoCode);
    setDepositSuccessMsg(res.message);
    setTimeout(() => {
      setDepositSuccessMsg('');
      setShowAddMoneyModal(false);
    }, 2200);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const res = requestWithdrawal(withdrawAmount, withdrawMethod, paymentAddress);
    if (res.success) {
      setWithdrawMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setWithdrawMsg(null);
        setShowWithdrawModal(false);
      }, 2500);
    } else {
      setWithdrawMsg({ type: 'error', text: res.message });
    }
  };

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-slate-400 py-16">
        Please login to view your wallet balance and cashout requests.
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-wide flex items-center gap-2">
          <Wallet className="w-6 h-6 text-[#ff5500]" />
          <span>ESPORTS INSTANT CASH WALLET</span>
        </h1>
        <p className="text-xs text-slate-400">Manage entry fees, tournament cash prizes, and instant 24/7 UPI withdrawals</p>
      </div>

      {/* Main Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#161b29] via-[#1c2236] to-[#0f131d] border-2 border-[#ff5500]/50 p-6 shadow-[0_0_35px_rgba(255,85,0,0.2)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7700] bg-[#ff5500]/20 px-2.5 py-0.5 rounded-full border border-[#ff5500]/40">
              AVAILABLE CASH BALANCE
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white italic">
                ₹{currentUser.walletBalance}
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Instant UPI Cashout Ready
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-300">
              <span>Bonus Coins: <strong className="text-amber-400">{currentUser.bonusCoins} 🪙</strong></span>
              <span>Total Withdrawn: <strong className="text-emerald-400">₹{currentUser.stats.totalWinnings}</strong></span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setDepositSuccessMsg('');
                setShowAddMoneyModal(true);
              }}
              className="ff-btn-primary px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg"
            >
              <ArrowDownLeft className="w-4 h-4 text-white" />
              <span>ADD CASH / UPI TOP UP</span>
            </button>

            <button
              onClick={() => {
                setWithdrawMsg(null);
                setShowWithdrawModal(true);
              }}
              className="px-5 py-3 bg-[#1e2638] hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-extrabold border border-emerald-500/50 hover:border-emerald-400 flex items-center gap-2 transition-all shadow-lg"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>CASHOUT TO UPI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Cashout Status Tracker */}
      {userWithdrawals.length > 0 && (
        <div className="bg-[#121622] p-4 rounded-2xl border border-[#232a3d] space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>RECENT CASHOUT REQUESTS</span>
          </h2>

          <div className="space-y-2">
            {userWithdrawals.slice(0, 3).map((w) => (
              <div
                key={w.id}
                className="bg-[#0c0f17] p-3 rounded-xl border border-[#1f2638] flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-extrabold text-white">₹{w.amount} via {w.method}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{w.paymentAddress}</p>
                </div>

                <div>
                  {w.status === 'Approved' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      Paid (Ref: {w.txnHash})
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" />
                      Pending Auto-Payout
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-black text-white italic uppercase tracking-wide flex items-center gap-2">
            <History className="w-5 h-5 text-[#ff5500]" />
            <span>TRANSACTION HISTORY</span>
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#121622] p-1 rounded-xl border border-[#232a3d] overflow-x-auto">
            {['All', 'Deposit', 'Winning Credit', 'Withdrawal'].map((f) => (
              <button
                key={f}
                onClick={() => setTxnFilter(f as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  txnFilter === f ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#121622] rounded-2xl border border-[#232a3d] overflow-hidden">
          {filteredTxns.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No transactions found in this category.</div>
          ) : (
            <div className="divide-y divide-[#1f2638]">
              {filteredTxns.map((txn) => {
                const isPositive = txn.type === 'Deposit' || txn.type === 'Winning Credit' || txn.type === 'Referral Bonus';

                return (
                  <div key={txn.id} className="p-3.5 flex items-center justify-between hover:bg-[#161c2b] transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {isPositive ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-white">{txn.description}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {new Date(txn.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-sm font-black font-mono ${
                          isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isPositive ? '+' : '-'}₹{txn.amount}
                      </p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{txn.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Money Modal (UPI Payment Integration) */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0e121b] border-2 border-[#ff5500]/60 rounded-3xl p-5 shadow-2xl space-y-4">
            <button
              onClick={() => setShowAddMoneyModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-[#181f2f] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <QrCode className="w-8 h-8 text-[#ff5500] mx-auto mb-1" />
              <h2 className="text-xl font-black text-white italic">UPI INSTANT TOP UP</h2>
              <p className="text-xs text-slate-400">Pay via GPay, PhonePe, Paytm, BHIM, or Scan UPI QR</p>
            </div>

            {depositSuccessMsg ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">{depositSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                {/* Amount Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Select Amount (₹)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                          depositAmount === amt
                            ? 'bg-[#ff5500] text-white border-[#ff5500]'
                            : 'bg-[#161b27] text-slate-300 border-[#232a3d] hover:border-slate-600'
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Custom Amount</label>
                  <input
                    type="number"
                    min={10}
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                {/* UPI App Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Select UPI App / Payment Mode</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { name: 'GPay', label: 'Google Pay', color: 'border-blue-500/50' },
                      { name: 'PhonePe', label: 'PhonePe', color: 'border-purple-500/50' },
                      { name: 'Paytm', label: 'Paytm UPI', color: 'border-cyan-500/50' },
                      { name: 'BHIM', label: 'BHIM UPI', color: 'border-amber-500/50' },
                      { name: 'QR', label: 'Scan UPI QR', color: 'border-emerald-500/50' },
                    ].map((app) => (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => setUpiApp(app.name as any)}
                        className={`p-2 rounded-xl border text-center font-bold transition-all ${
                          upiApp === app.name
                            ? 'bg-[#ff5500]/20 border-[#ff5500] text-white'
                            : `bg-[#161b27] ${app.color} text-slate-400 hover:text-white`
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* UPI QR Display if QR selected */}
                {upiApp === 'QR' && (
                  <div className="p-3 bg-[#121622] border border-[#232a3d] rounded-2xl text-center space-y-2">
                    <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${OFFICIAL_UPI_ID}&pn=FreeFireEsports&am=${depositAmount}&cu=INR`}
                        alt="UPI Payment QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono">Scan with any UPI App to pay ₹{depositAmount}</p>
                  </div>
                )}

                {/* Copy VPA Box */}
                <div className="p-2.5 bg-[#121622] border border-[#232a3d] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400">Official UPI VPA</p>
                    <p className="font-mono font-bold text-amber-400">{OFFICIAL_UPI_ID}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVpa}
                    className="px-2.5 py-1 bg-[#1c2336] hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-slate-700"
                  >
                    {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Promo Code input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Promo Code (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. BOOYAH50"
                      className="flex-1 bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl p-2.5 text-xs text-white uppercase focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setPromoCode('BOOYAH50')}
                      className="px-3 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold"
                    >
                      Use "BOOYAH50"
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full ff-btn-primary py-3 rounded-xl text-xs font-black uppercase shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{depositAmount} via {upiApp}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cashout / Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-[#0e121b] border-2 border-emerald-500/60 rounded-3xl p-5 shadow-2xl space-y-4">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-[#181f2f] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <ArrowUpRight className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <h2 className="text-xl font-black text-white italic">INSTANT CASHOUT TO UPI</h2>
              <p className="text-xs text-slate-400">Withdraw earnings directly to your UPI ID or Paytm</p>
            </div>

            {withdrawMsg ? (
              <div
                className={`p-4 rounded-2xl text-center space-y-2 border ${
                  withdrawMsg.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-red-950/80 border-red-500 text-red-300'
                }`}
              >
                {withdrawMsg.type === 'success' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                )}
                <p className="text-xs font-bold">{withdrawMsg.text}</p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                {/* Method selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['UPI', 'Paytm', 'GPay', 'PhonePe'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setWithdrawMethod(m as any)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          withdrawMethod === m
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-[#161b27] text-slate-300 border-[#232a3d]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {withdrawMethod} Address / Mobile VPA
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentAddress}
                    onChange={(e) => setPaymentAddress(e.target.value)}
                    placeholder={withdrawMethod === 'UPI' ? 'e.g. username@upi or 9876543210@ybl' : '10-digit mobile number'}
                    className="w-full bg-[#161b27] border border-[#232a3d] focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Withdrawal Amount (₹)</label>
                  <input
                    type="number"
                    min={50}
                    max={currentUser.walletBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-[#161b27] border border-[#232a3d] focus:border-emerald-500 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Available: ₹{currentUser.walletBalance}</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-xs uppercase shadow-lg flex items-center justify-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Request Cashout (₹{withdrawAmount})</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
