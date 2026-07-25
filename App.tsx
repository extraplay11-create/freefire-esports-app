import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader } from './components/TopHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DeviceWrapper } from './components/DeviceWrapper';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './components/HomeView';
import { TournamentListView } from './components/TournamentListView';
import { JoinTournamentModal } from './components/JoinTournamentModal';
import { MyMatchesView } from './components/MyMatchesView';
import { LeaderboardView } from './components/LeaderboardView';
import { WalletView } from './components/WalletView';
import { ProfileView } from './components/ProfileView';
import { AdminPanelView } from './components/AdminPanelView';
import { Tournament } from './types';

function AppContent() {
  const { activeTab } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedTournamentForJoin, setSelectedTournamentForJoin] = useState<Tournament | null>(null);

  const handleOpenJoinModal = (tournament: Tournament) => {
    setSelectedTournamentForJoin(tournament);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-[#ff5500] selection:text-white">
      {/* Sticky Gaming Top Navigation Bar */}
      <TopHeader onOpenAuth={() => setShowAuthModal(true)} />

      {/* Main View Area wrapped in Device Frame or Full Screen */}
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

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav />

      {/* Modals */}
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
