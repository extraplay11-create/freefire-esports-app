export type GameMode = 'Solo' | 'Duo' | 'Squad' | 'Clash Squad';
export type GameMap = 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'Nexterra';
export type RankTier = 'Grandmaster' | 'Heroic' | 'Diamond' | 'Platinum' | 'Gold';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  ffIgn: string; // Free Fire In-Game Name
  ffUid: string; // Free Fire User ID
  avatar: string;
  character: string;
  walletBalance: number; // In Rupees/Coins (₹)
  bonusCoins: number;
  level: number;
  rank: RankTier;
  role: 'player' | 'admin';
  stats: {
    matchesPlayed: number;
    totalWins: number;
    totalKills: number;
    totalWinnings: number;
  };
  referralCode: string;
  referredCount: number;
}

export type TournamentStatus = 
  | 'Upcoming' 
  | 'Joining Open' 
  | 'Room Full' 
  | 'Live' 
  | 'Completed' 
  | 'Cancelled';

export interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  mode: GameMode;
  map: GameMap;
  type: 'Battle Royale' | 'Clash Squad 4v4' | 'CS Ranked';
  entryFee: number; // 0 for free
  prizePool: number;
  perKillReward: number;
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
  totalSlots: number;
  filledSlots: number;
  startTime: string; // ISO string or human formatted
  status: TournamentStatus;
  roomId?: string;
  roomPassword?: string;
  image: string;
  badge?: string;
  rules: string[];
  organizer: string;
}

export interface MatchRegistration {
  id: string;
  tournamentId: string;
  userId: string;
  userIgn: string;
  userUid: string;
  teamName?: string;
  partnerIgn?: string;
  partnerUid?: string;
  squadMembers?: string[];
  slotNumber: number;
  registeredAt: string;
  status: 'Confirmed' | 'Disqualified';
  screenshotProof?: string;
  killsSubmitted?: number;
  placementSubmitted?: number;
  resultStatus?: 'None' | 'Pending' | 'Approved' | 'Rejected';
  prizeWon?: number;
  adminNote?: string;
}

export type TransactionType = 
  | 'Deposit' 
  | 'Withdrawal' 
  | 'Tournament Entry' 
  | 'Winning Credit' 
  | 'Referral Bonus'
  | 'Refund';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  timestamp: string;
  description: string;
  referenceId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  ffUid: string;
  method: 'UPI' | 'Paytm' | 'GPay' | 'PhonePe';
  paymentAddress: string;
  amount: number;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  txnHash?: string;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  ffIgn: string;
  ffUid: string;
  avatar: string;
  kills: number;
  wins: number;
  winnings: number;
  rankTier: RankTier;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  badge: string;
  date: string;
  image?: string;
}
