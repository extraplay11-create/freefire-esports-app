import {
  User,
  Tournament,
  MatchRegistration,
  Transaction,
  LeaderboardUser,
  Announcement,
} from '../types';

export const INITIAL_USER: User = {
  id: 'usr_demo',
  name: 'Demo Player',
  email: 'player@freefire.com',
  phone: '+91 90000 00000',
  ffIgn: 'Demo_Player',
  ffUid: '9876543210',
  walletBalance: 500,
  bonusCoins: 100,
  stats: {
    matchesPlayed: 5,
    totalWins: 2,
    totalKills: 25,
    totalWinnings: 1000,
  },
  referralCode: 'FF1234',
};

export const ADMIN_USER: User = {
  ...INITIAL_USER,
  id: 'usr_admin',
  name: 'Admin',
  email: 'admin@freefire.com',
  ffIgn: 'Admin',
  ffUid: '0000000000',
};

export const INITIAL_TOURNAMENTS: Tournament[] = [];

export const INITIAL_REGISTRATIONS: MatchRegistration[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];
