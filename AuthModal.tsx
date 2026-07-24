import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  ArrowRight, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FREE_FIRE_CHARACTERS } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, loginAsDemoPlayer, loginAsAdmin } = useApp();

  const [authMode, setAuthMode] = useState<'otp' | 'email' | 'signup'>('otp');

  // Mobile OTP State
  const [phoneNum, setPhoneNum] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpStepNewUser, setOtpStepNewUser] = useState(false);

  // Registration state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ffIgn, setFfIgn] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(FREE_FIRE_CHARACTERS[0].name);

  if (!isOpen) return null;

  // Handle Request SMS OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNum || phoneNum.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setOtpError('');
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
    }, 1200);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length !== 6) {
      setOtpError('Invalid OTP code. Enter 123456 for instant verification.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    setTimeout(() => {
      setIsVerifyingOtp(false);
      
      // If user hasn't provided IGN yet, ask for details or create account directly
      signup({
        name: name || `Player_${phoneNum.slice(-4)}`,
        phone: phoneNum.startsWith('+91') ? phoneNum : `+91 ${phoneNum}`,
        ffIgn: ffIgn || `Booyah_${phoneNum.slice(-4)}`,
        ffUid: ffUid || `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        character: selectedCharacter,
      });

      onClose();
    }, 1000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup') {
      signup({
        name: name || 'Booyah Player',
        email,
        phone: phoneNum || '+91 98765 43210',
        ffIgn: ffIgn || 'FreeFirePro99',
        ffUid: ffUid || '8291048210',
        character: selectedCharacter,
      });
    } else {
      login(email, password);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0e121b] border-2 border-[#ff5500]/60 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(255,85,0,0.3)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-[#181f2f] hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff5500] to-[#ff9900] p-0.5 shadow-lg mb-2">
            <div className="w-full h-full bg-[#0e121b] rounded-[14px] flex items-center justify-center">
              <Flame className="w-7 h-7 text-[#ff5500] animate-flame" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white italic tracking-wide uppercase">
            {authMode === 'otp' ? 'MOBILE OTP LOGIN' : authMode === 'signup' ? 'CREATE PLAYER ACCOUNT' : 'FREE FIRE LOGIN'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {authMode === 'otp'
              ? 'Instant SMS OTP login for fast tournament access & cashouts'
              : authMode === 'signup'
              ? 'Claim ₹100 Welcome Bonus & unlock custom room keys'
              : 'Enter your credentials to access room keys & wallet'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#121622] rounded-xl border border-[#232a3d] mb-4 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setOtpError('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'otp' ? 'bg-[#ff5500] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('email');
              setOtpError('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode !== 'otp' ? 'bg-[#ff5500] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email / Password</span>
          </button>
        </div>

        {/* Quick Demo Access Buttons */}
        <div className="mb-4 p-2.5 bg-[#161d2c] border border-[#ff5500]/30 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center mb-1.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>1-Click Quick Demo Login</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsDemoPlayer();
                onClose();
              }}
              className="py-1.5 px-3 bg-[#ff5500]/20 hover:bg-[#ff5500]/30 border border-[#ff5500]/50 rounded-xl text-xs font-bold text-orange-400 flex items-center justify-center gap-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Demo Player</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsAdmin();
                onClose();
              }}
              className="py-1.5 px-3 bg-red-950/40 hover:bg-red-900/40 border border-red-500/50 rounded-xl text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Mobile OTP Form */}
        {authMode === 'otp' && (
          <div className="space-y-3.5">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number (India +91)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono font-bold text-orange-400">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 pl-12 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">SMS code will be sent for instant 1-click verification</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Free Fire IGN (Optional)</label>
                  <input
                    type="text"
                    value={ffIgn}
                    onChange={(e) => setFfIgn(e.target.value)}
                    placeholder="e.g. Booyah_King"
                    className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Free Fire UID (Optional)</label>
                  <input
                    type="text"
                    value={ffUid}
                    onChange={(e) => setFfUid(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 8291048210"
                    className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>

                {otpError && (
                  <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full ff-btn-primary py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  {isSendingOtp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending SMS OTP...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Send OTP Code</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Code Input Step */
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-1">
                  <p className="text-xs font-bold text-emerald-300">OTP Code Sent via SMS!</p>
                  <p className="text-[11px] text-slate-300 font-mono">Sent to +91 {phoneNum}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-300">Enter 6-Digit OTP</label>
                    <button
                      type="button"
                      onClick={() => setOtpCode('123456')}
                      className="text-[10px] text-amber-400 hover:underline font-bold"
                    >
                      Use Test OTP (123456)
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-[#161b27] border border-[#232a3d] focus:border-emerald-500 rounded-xl py-3 text-center text-lg font-mono font-black text-emerald-400 tracking-[0.5em] focus:outline-none"
                  />
                </div>

                {otpError && (
                  <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  {isVerifyingOtp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Mobile OTP...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Claim ₹100 Bonus</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Change phone number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Mode 2: Email & Password Form */}
        {authMode !== 'otp' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number (UPI Cashout)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Free Fire IGN</label>
                    <div className="relative">
                      <Gamepad2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={ffIgn}
                        onChange={(e) => setFfIgn(e.target.value)}
                        placeholder="Viper_Booyah99"
                        className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 pl-9 pr-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Free Fire UID</label>
                    <input
                      type="text"
                      required
                      value={ffUid}
                      onChange={(e) => setFfUid(e.target.value)}
                      placeholder="8273910481"
                      className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@freefire.com"
                  className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#161b27] border border-[#232a3d] focus:border-[#ff5500] rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full ff-btn-primary py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-950/60 mt-2 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{authMode === 'signup' ? 'Claim ₹100 & Start Playing' : 'Login To Account'}</span>
            </button>

            {/* Toggle Sign up / Login */}
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signup' ? 'email' : 'signup')}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                {authMode === 'signup'
                  ? 'Already registered? Login to your account'
                  : 'New player? Create an account & get ₹100 Welcome Bonus'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
