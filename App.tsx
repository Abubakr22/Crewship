
import React, { useState, useEffect } from 'react';
import { Onboarding } from './screens/Onboarding';
import { Announcements } from './screens/Announcements';
import { Discover } from './screens/Discover';
import { ProfileScreen } from './screens/Profile';
import { AppState, TabType, UserProfile } from './types';
import { MOCK_USERS } from './constants';
import { Brand, CrewShipLogo, CaptainHatLogo, ProfileLogo } from './components/UI';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Load initial state from local storage
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('crewships_user');
      const isOnboarded = localStorage.getItem('crewships_onboarded') === 'true';
      if (savedUser && isOnboarded) {
        return {
          isOnboarded: true,
          currentUser: JSON.parse(savedUser),
          activeTab: 'discover',
          discoverMode: 'swipe'
        };
      }
    }
    return {
      isOnboarded: false,
      currentUser: null,
      activeTab: 'discover',
      discoverMode: 'swipe'
    };
  });

  const [matches, setMatches] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleOnboardingComplete = (userData: any) => {
    const newUser: UserProfile = {
      id: 'me',
      ...userData,
      photoUrl: 'https://picsum.photos/seed/me/400/600'
    };
    
    // Persist to local storage
    localStorage.setItem('crewships_user', JSON.stringify(newUser));
    localStorage.setItem('crewships_onboarded', 'true');

    setState(prev => ({
      ...prev,
      isOnboarded: true,
      currentUser: newUser
    }));
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    localStorage.setItem('crewships_user', JSON.stringify(updatedUser));
    setState(prev => ({
      ...prev,
      currentUser: updatedUser
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('crewships_user');
    localStorage.removeItem('crewships_onboarded');
    setState(prev => ({ 
      ...prev, 
      isOnboarded: false, 
      currentUser: null,
      activeTab: 'discover'
    }));
  };

  const handleMatch = (user: UserProfile) => {
    setMatches(prev => [...prev, user]);
  };

  if (!state.isOnboarded) {
    return (
      <div className={theme}>
        <Onboarding onComplete={handleOnboardingComplete} theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 max-w-md mx-auto shadow-2xl relative overflow-hidden transition-colors duration-300">
      {/* Top Header */}
      <header className="px-6 pt-4 pb-2 flex justify-between items-center z-50">
        <Brand iconSize={24} />
        <button 
          onClick={toggleTheme}
          className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-all hover:scale-105 active:scale-95"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {state.activeTab === 'announcements' && <Announcements currentUser={state.currentUser!} />}
        {state.activeTab === 'discover' && (
          <Discover 
            mode={state.discoverMode} 
            setMode={(m) => setState(s => ({ ...s, discoverMode: m }))}
            currentUser={state.currentUser!}
            onMatch={handleMatch}
          />
        )}
        {state.activeTab === 'profile' && (
          <ProfileScreen 
            user={state.currentUser!} 
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout} 
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center safe-area-bottom z-40 transition-colors duration-300">
        <NavButton 
          active={state.activeTab === 'announcements'} 
          onClick={() => setState(s => ({ ...s, activeTab: 'announcements' }))}
          icon={<CrewShipLogo size={34} />}
          label="Join Crew"
        />
        <NavButton 
          active={state.activeTab === 'discover'} 
          onClick={() => setState(s => ({ ...s, activeTab: 'discover' }))}
          icon={<CaptainHatLogo size={34} />}
          label="New Friends"
        />
        <NavButton 
          active={state.activeTab === 'profile'} 
          onClick={() => setState(s => ({ ...s, activeTab: 'profile' }))}
          icon={<ProfileLogo size={34} />}
          label="Profile"
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className={`p-2 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-brand dark:bg-slate-200 text-white dark:text-brand' 
        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
    }`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-brand dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
      {label}
    </span>
  </button>
);

export default App;
