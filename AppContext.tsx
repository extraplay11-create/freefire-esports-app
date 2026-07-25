import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  Tournament, 
  MatchRegistration, 
  Transaction, 
  WithdrawalRequest, 
  LeaderboardUser, 
  Announcement 
} from './types';
import { 
  INITIAL_USER, 
  ADMIN_USER, 
  INITIAL_TOURNAMENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_LEADERBOARD, 
  INITIAL_ANNOUNCEMENTS 
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  tournaments: Tournament[];
  registrations: MatchRegistration[];
  transactions: Transaction[];
  withdrawalRequests: WithdrawalRequest[];
  leaderboard: LeaderboardUser[];
  announcements: Announcement[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deviceViewMode: 'full' | 'mobile-phone';
  setDeviceViewMode: (mode: 'full' | 'mobile-phone') => void;
  deviceFrameType: 'iphone' | 'android';
  setDeviceFrameType: (type: 'iphone' | 'android') => void;
  
  // Auth methods
  loginAsDemoPlayer: () => void;
  loginAsAdmin: () => void;
  login: (email: string, pass: string) => boolean;
  signup: (userData: Partial<User>) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;

  // Player Actions
  joinTournament: (tournamentId: string, teamInfo?: { partnerIgn?: string; partnerUid?: string }) => { success: boolean; message: string };
  depositFunds: (amount: number, method: string, promoCode?: string) => { success: boolean; message: string };
  requestWithdrawal: (amount: number, method: 'UPI' | 'Paytm' | 'GPay' | 'PhonePe', paymentAddress: string) => { success: boolean; message: string };
  submitMatchResult: (registrationId: string, screenshotProof: string, killsSubmitted: number, placementSubmitted: number) => { success: boolean; message: string };

  // Admin Actions
  adminCreateTournament: (newTournament: Omit<Tournament, 'id' | 'filledSlots'>) => void;
  adminUpdateRoomInfo: (tournamentId: string, roomId: string, roomPassword: string) => void;
  adminApproveResult: (registrationId: string, prizeWon: number, adminNote?: string) => void;
  adminApproveWithdrawal: (requestId: string) => void;
  adminBroadcastAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from LocalStorage or Fallback to initial constants
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ff_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('ff_tournaments');
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
  });

  const [registrations, setRegistrations] = useState<MatchRegistration[]>(() => {
    const saved = localStorage.getItem('ff_registrations');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ff_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('ff_withdrawals');
    return saved ? JSON.parse(saved) : [];
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(() => {
    const saved = localStorage.getItem('ff_leaderboard');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('ff_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [deviceViewMode, setDeviceViewMode] = useState<'full' | 'mobile-phone'>('full');
  const [deviceFrameType, setDeviceFrameType] = useState<'iphone' | 'android'>('android');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('ff_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ff_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('ff_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('ff_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ff_withdrawals', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem('ff_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('ff_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // Auth Methods
  const loginAsDemoPlayer = () => {
    setCurrentUser(INITIAL_USER);
    setActiveTab('home');
  };

  const loginAsAdmin = () => {
    setCurrentUser(ADMIN_USER);
    setActiveTab('admin');
  };

  const login = (email: string, pass: string): boolean => {
    if (email.toLowerCase().includes('admin')) {
      setCurrentUser(ADMIN_USER);
      setActiveTab('admin');
      return true;
    }
    setCurrentUser(INITIAL_USER);
    setActiveTab('home');
    return true;
  };

  const signup = (userData: Partial<User>) => {
    const newUser: User = {
      ...INITIAL_USER,
      id: `usr_${Date.now()}`,
      name: userData.name || 'Free Fire Player',
      email: userData.email || 'player@freefire.com',
      phone: userData.phone || '+91 90000 00000',
      ffIgn: userData.ffIgn || 'New_Booyah_Player',
      ffUid: userData.ffUid || '9876543210',
      walletBalance: 100, // Welcome Bonus!
      bonusCoins: 50,
      stats: { matchesPlayed: 0, totalWins: 0, totalKills: 0, totalWinnings: 0 },
      referralCode: `FF${Math.floor(1000 + Math.random() * 9000)}`,
    };
    
    // Welcome Bonus Transaction
    const welcomeTxn: Transaction = {
      id: `txn_${Date.now()}`,
      userId: newUser.id,
      type: 'Deposit',
      amount: 100,
      status: 'Success',
      timestamp: new Date().toISOString(),
      description: '🎉 Welcome Signup Bonus Credited!',
    };

    setCurrentUser(newUser);
    setTransactions((prev) => [welcomeTxn, ...prev]);
    setActiveTab('home');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      ...updatedData,
    });
  };

  // Join Tournament
  const joinTournament = (tournamentId: string, teamInfo?: { partnerIgn?: string; partnerUid?: string }) => {
    if (!currentUser) return { success: false, message: 'Please login to join tournaments.' };

    const tr = tournaments.find((t) => t.id === tournamentId);
    if (!tr) return { success: false, message: 'Tournament not found.' };

    if (tr.filledSlots >= tr.totalSlots) {
      return { success: false, message: 'Tournament is already full!' };
    }

    // Check if user already registered
    const existing = registrations.find((r) => r.tournamentId === tournamentId && r.userId === currentUser.id);
    if (existing) {
      return { success: false, message: 'You have already joined this tournament.' };
    }

    // Check Wallet Balance
    if (currentUser.walletBalance < tr.entryFee) {
      return { 
        success: false, 
        message: `Insufficient wallet balance! Entry fee is ₹${tr.entryFee}. Please top up your wallet.` 
      };
    }

    // Deduct fee & register
    const updatedUser = {
      ...currentUser,
      walletBalance: currentUser.walletBalance - tr.entryFee,
      stats: {
        ...currentUser.stats,
        matchesPlayed: currentUser.stats.matchesPlayed + 1,
      },
    };

    const newSlot = tr.filledSlots + 1;

    const newReg: MatchRegistration = {
      id: `reg_${Date.now()}`,
      tournamentId,
      userId: currentUser.id,
      userIgn: currentUser.ffIgn,
      userUid: currentUser.ffUid,
      partnerIgn: teamInfo?.partnerIgn,
      partnerUid: teamInfo?.partnerUid,
      slotNumber: newSlot,
      registeredAt: new Date().toISOString(),
      status: 'Confirmed',
      resultStatus: 'None',
    };

    const newTxn: Transaction = {
      id: `txn_${Date.now()}`,
      userId: currentUser.id,
      type: 'Tournament Entry',
      amount: tr.entryFee,
      status: 'Success',
      timestamp: new Date().toISOString(),
      description: `Entry fee for ${tr.title}`,
      referenceId: tr.id,
    };

    // Update Tournament filled slots
    const updatedTournaments = tournaments.map((t) => {
      if (t.id === tournamentId) {
        const filled = t.filledSlots + 1;
        return {
          ...t,
          filledSlots: filled,
          status: filled >= t.totalSlots ? ('Room Full' as const) : t.status,
        };
      }
      return t;
    });

    setCurrentUser(updatedUser);
    setTournaments(updatedTournaments);
    setRegistrations((prev) => [newReg, ...prev]);
    setTransactions((prev) => [newTxn, ...prev]);

    return { 
      success: true, 
      message: `🎉 Successfully joined! Assigned Slot #${newSlot}. Check 'My Matches' tab for Room ID & Password.` 
    };
  };

  // Deposit Funds
  const depositFunds = (amount: number, method: string, promoCode?: string) => {
    if (!currentUser) return { success: false, message: 'Please login.' };

    let bonus = 0;
    if (promoCode?.toUpperCase() === 'BOOYAH50' || promoCode?.toUpperCase() === 'FREEFIRE50') {
      bonus = Math.floor(amount * 0.5);
    }

    const updatedUser = {
      ...currentUser,
      walletBalance: currentUser.walletBalance + amount,
      bonusCoins: currentUser.bonusCoins + bonus,
    };

    const newTxn: Transaction = {
      id: `txn_${Date.now()}`,
      userId: currentUser.id,
      type: 'Deposit',
      amount,
      status: 'Success',
      timestamp: new Date().toISOString(),
      description: `Add Cash via ${method}${bonus > 0 ? ` (+${bonus} Bonus Coins)` : ''}`,
    };

    setCurrentUser(updatedUser);
    setTransactions((prev) => [newTxn, ...prev]);

    return { 
      success: true, 
      message: `₹${amount} added to your wallet!${bonus > 0 ? ` +${bonus} Bonus Coins Credited!` : ''}` 
    };
  };

  // Request Cash Out / Withdrawal
  const requestWithdrawal = (amount: number, method: 'UPI' | 'Paytm' | 'GPay' | 'PhonePe', paymentAddress: string) => {
    if (!currentUser) return { success: false, message: 'Please login.' };

    if (amount < 50) {
      return { success: false, message: 'Minimum withdrawal amount is ₹50.' };
    }

    if (currentUser.walletBalance < amount) {
      return { success: false, message: 'Insufficient wallet balance.' };
    }

    // Deduct amount immediately to lock funds
    const updatedUser = {
      ...currentUser,
      walletBalance: currentUser.walletBalance - amount,
    };

    const newRequest: WithdrawalRequest = {
      id: `wth_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      ffUid: currentUser.ffUid,
      method,
      paymentAddress,
      amount,
      requestedAt: new Date().toISOString(),
      status: 'Pending',
    };

    const newTxn: Transaction = {
      id: `txn_${Date.now()}`,
      userId: currentUser.id,
      type: 'Withdrawal',
      amount,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      description: `Cashout request to ${method} (${paymentAddress})`,
      referenceId: newRequest.id,
    };

    setCurrentUser(updatedUser);
    setWithdrawalRequests((prev) => [newRequest, ...prev]);
    setTransactions((prev) => [newTxn, ...prev]);

    return { 
      success: true, 
      message: `Withdrawal request for ₹${amount} submitted! Auto-processing within 15 minutes.` 
    };
  };

  // Submit Match Screenshot & Result
  const submitMatchResult = (registrationId: string, screenshotProof: string, killsSubmitted: number, placementSubmitted: number) => {
    const updatedRegs = registrations.map((r) => {
      if (r.id === registrationId) {
        return {
          ...r,
          screenshotProof,
          killsSubmitted,
          placementSubmitted,
          resultStatus: 'Pending' as const,
        };
      }
      return r;
    });

    setRegistrations(updatedRegs);

    return {
      success: true,
      message: 'Match screenshot & result submitted! Sent to Admin for instant verification & prize credit.',
    };
  };

  // Admin: Create Tournament
  const adminCreateTournament = (newTrData: Omit<Tournament, 'id' | 'filledSlots'>) => {
    const newTournament: Tournament = {
      ...newTrData,
      id: `tr_${Date.now()}`,
      filledSlots: 0,
    };

    setTournaments((prev) => [newTournament, ...prev]);
  };

  // Admin: Update Room ID & Room Password
  const adminUpdateRoomInfo = (tournamentId: string, roomId: string, roomPassword: string) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            roomId,
            roomPassword,
            status: 'Live' as const,
          };
        }
        return t;
      })
    );
  };

  // Admin: Approve Player Match Result and Credit Prize
  const adminApproveResult = (registrationId: string, prizeWon: number, adminNote?: string) => {
    const targetReg = registrations.find((r) => r.id === registrationId);
    if (!targetReg) return;

    // Update registration status
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === registrationId) {
          return {
            ...r,
            resultStatus: 'Approved' as const,
            prizeWon,
            adminNote: adminNote || 'Approved by Admin',
          };
        }
        return r;
      })
    );

    // Credit Prize to User Wallet if user is active, or update state
    if (currentUser && currentUser.id === targetReg.userId) {
      setCurrentUser({
        ...currentUser,
        walletBalance: currentUser.walletBalance + prizeWon,
        stats: {
          ...currentUser.stats,
          totalWins: currentUser.stats.totalWins + (targetReg.placementSubmitted === 1 ? 1 : 0),
          totalKills: currentUser.stats.totalKills + (targetReg.killsSubmitted || 0),
          totalWinnings: currentUser.stats.totalWinnings + prizeWon,
        },
      });
    }

    // Add Transaction
    const winningTxn: Transaction = {
      id: `txn_${Date.now()}`,
      userId: targetReg.userId,
      type: 'Winning Credit',
      amount: prizeWon,
      status: 'Success',
      timestamp: new Date().toISOString(),
      description: `Prize Credited: ${prizeWon} Rupees for match registration #${registrationId}`,
      referenceId: targetReg.tournamentId,
    };

    setTransactions((prev) => [winningTxn, ...prev]);
  };

  // Admin: Approve Cashout
  const adminApproveWithdrawal = (requestId: string) => {
    setWithdrawalRequests((prev) =>
      prev.map((w) => {
        if (w.id === requestId) {
          return {
            ...w,
            status: 'Approved' as const,
            txnHash: `UPI_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          };
        }
        return w;
      })
    );

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.referenceId === requestId) {
          return {
            ...t,
            status: 'Success' as const,
          };
        }
        return t;
      })
    );
  };

  // Admin: Broadcast Announcement
  const adminBroadcastAnnouncement = (anc: Omit<Announcement, 'id' | 'date'>) => {
    const newAnc: Announcement = {
      ...anc,
      id: `anc_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setAnnouncements((prev) => [newAnc, ...prev]);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USER);
    setTournaments(INITIAL_TOURNAMENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setWithdrawalRequests([]);
    setLeaderboard(INITIAL_LEADERBOARD);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        tournaments,
        registrations,
        transactions,
        withdrawalRequests,
        leaderboard,
        announcements,
        activeTab,
        setActiveTab,
        deviceViewMode,
        setDeviceViewMode,
        deviceFrameType,
        setDeviceFrameType,
        loginAsDemoPlayer,
        loginAsAdmin,
        login,
        signup,
        logout,
        updateProfile,
        joinTournament,
        depositFunds,
        requestWithdrawal,
        submitMatchResult,
        adminCreateTournament,
        adminUpdateRoomInfo,
        adminApproveResult,
        adminApproveWithdrawal,
        adminBroadcastAnnouncement,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
