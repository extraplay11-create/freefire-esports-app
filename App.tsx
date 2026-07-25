import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';

import { TopHeader } from './TopHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { DeviceWrapper } from './DeviceWrapper';
import { AuthModal } from './AuthModal';
import { HomeView } from './HomeView';
import { TournamentListView } from './TournamentListView';
import { JoinTournamentModal } from './JoinTournamentModal';
import { MyMatchesView } from './MyMatchesView';
import { LeaderboardView } from './LeaderboardView';
import { WalletView } from './WalletView';
import { ProfileView } from './ProfileView';
import { AdminPanelView } from './AdminPanelView';

import { Tournament } from './types';

function AppContent() {
  const { activeTab } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedTournamentForJoin, setSelectedTournamentForJoin] =
    useState<Tournament | null>(null);

  const handleOpenJoinModal = (tournament: Tournament) => {
    setSelectedTournamentForJoin(tournament);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-[#ff5500] selection:text-white">
      
      <TopHeader onOpenAuth={() => setShowAuthModal(true)} />

      <main className="flex-1">
        <DeviceWrapper>
          
          {activeTab === 'home' && (
            <HomeView onOpenJoinModal={handleOpenJoinModal} />
          )}

          {activeTab === 'tournaments' && (
            <TournamentListView onOpenJoinModal={handleOpenJoinModal} />
          )}

          {activeTab === 'matches' && <MyMatchesView />}

          {activeTab === 'leaderboard' && <LeaderboardView />}

          {activeTab === 'wallet' && <WalletView />}

          {activeTab === 'profile' && <ProfileView />}

          {activeTab === 'admin' && <AdminPanelView />}

        </DeviceWrapper>
      </main>

      <MobileBottomNav />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <JoinTournamentModal
        tournament={selectedTournamentForJoin}
        onClose={() => setSelectedTournamentForJoin(null)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
