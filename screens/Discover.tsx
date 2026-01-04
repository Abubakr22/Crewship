
import React, { useState, useMemo } from 'react';
import { UserProfile, DiscoverMode } from '../types';
import { MOCK_USERS } from '../constants';
import { Button, Card, Modal } from '../components/UI';
import { generateIcebreakers } from '../services/geminiService';
import { calculateMatch, MatchResult } from '../services/matchingService';

interface DiscoverProps {
  mode: DiscoverMode;
  setMode: (mode: DiscoverMode) => void;
  currentUser: UserProfile;
  onMatch: (user: UserProfile) => void;
}

export const Discover: React.FC<DiscoverProps> = ({ mode, setMode, currentUser, onMatch }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastMatchedUser, setLastMatchedUser] = useState<UserProfile | null>(null);
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingUser, setReportingUser] = useState<UserProfile | null>(null);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'super' | null>(null);

  const rankedSuggestions = useMemo(() => {
    const results: MatchResult[] = MOCK_USERS
      .filter(u => u.id !== currentUser.id)
      .map(u => calculateMatch(currentUser, u))
      .sort((a, b) => b.score - a.score);
    return results;
  }, [currentUser]);

  const currentUserData = MOCK_USERS[currentIndex];
  const isEnd = currentIndex >= MOCK_USERS.length;

  const handleConnectToInstagram = (user: UserProfile) => {
    if (user.instagramUsername) {
      const url = `https://instagram.com/${user.instagramUsername}`;
      window.open(url, '_blank');
      onMatch(user);
    } else {
      setShowErrorModal(true);
      setLastMatchedUser(user);
    }
  };

  const handleReport = (user: UserProfile) => {
    setReportingUser(user);
    setShowReportModal(true);
  };

  const submitReport = (reason: string) => {
    console.log(`Reported user ${reportingUser?.id} for: ${reason}`);
    alert(`Thank you for keeping the community safe. We have received your report for ${reportingUser?.firstName}.`);
    setShowReportModal(false);
    setReportingUser(null);
    if (mode === 'swipe' && reportingUser?.id === currentUserData?.id) {
       handleSwipe('left');
    }
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'super') => {
    if (exitDirection) return;
    
    setExitDirection(direction);
    
    setTimeout(async () => {
      if (direction === 'right' || direction === 'super') {
        const user = MOCK_USERS[currentIndex];
        setLastMatchedUser(user);
        
        if (user.instagramUsername) {
          setShowMatchModal(true);
          onMatch(user);
          setLoadingIcebreakers(true);
          const suggestions = await generateIcebreakers(currentUser.interests, user.interests, user.firstName);
          setIcebreakers(suggestions);
          setLoadingIcebreakers(false);
        } else {
          setShowErrorModal(true);
        }
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      setExitDirection(null);
    }, 300);
  };

  return (
    <div className="h-full flex flex-col px-6 overflow-hidden">
      <div className="flex flex-col gap-4 mb-4 mt-2 shrink-0">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Discover</h1>
        <div className="bg-slate-200/50 dark:bg-slate-800/80 p-1 rounded-2xl flex relative overflow-hidden transition-colors border border-slate-100 dark:border-slate-700/50">
          <button onClick={() => setMode('swipe')} className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all relative z-10 ${mode === 'swipe' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>Swipe{mode === 'swipe' && <div className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl shadow-sm -z-10" />}</button>
          <button onClick={() => setMode('suggestions')} className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all relative z-10 ${mode === 'suggestions' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500'}`}>Suggestions{mode === 'suggestions' && <div className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl shadow-sm -z-10" />}</button>
        </div>
      </div>

      {mode === 'swipe' ? (
        <div className="flex-1 flex flex-col relative pb-32 overflow-y-auto no-scrollbar">
          {!isEnd ? (
            <div 
              key={currentIndex}
              className={`flex-1 flex flex-col items-center transition-all duration-300 transform ease-out
                ${exitDirection === 'left' ? '-translate-x-[150%] -rotate-12 opacity-0 scale-90' : ''}
                ${exitDirection === 'right' ? 'translate-x-[150%] rotate-12 opacity-0 scale-90' : ''}
                ${exitDirection === 'super' ? '-translate-y-[150%] scale-110 opacity-0' : ''}
                ${!exitDirection ? 'animate-in zoom-in-95 duration-500' : ''}
              `}
            >
              <Card className="flex flex-col border-none dark:bg-slate-900 shadow-2xl rounded-[40px] overflow-hidden group w-full max-w-[340px] h-fit mb-8">
                {/* Compact Image Ratio */}
                <div className="relative aspect-square shrink-0 bg-brand-dark flex items-center justify-center overflow-hidden">
                  {currentUserData.photoUrl ? <img src={currentUserData.photoUrl} className="w-full h-full object-cover" alt="" /> : <div className="w-24 h-24 bg-brand rounded-full flex items-center justify-center text-white text-4xl">{currentUserData.firstName[0]}</div>}
                  
                  {/* Floating Action Buttons over Photo */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => handleReport(currentUserData)}
                      className="p-2.5 bg-black/30 backdrop-blur-md rounded-full text-white/70 hover:text-rose-400 hover:bg-black/50 transition-all shadow-sm"
                      title="Report User"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.45 4L12.15 2.5C12.06 2.06 11.66 1.75 11.21 1.75H4.25C3.7 1.75 3.25 2.2 3.25 2.75V19.75C3.25 20.3 3.7 20.75 4.25 20.75H5.75V12.75H10.15L10.45 14.25C10.54 14.69 10.94 15 11.39 15H18.75C19.3 15 19.75 14.55 19.75 14V5.25C19.75 4.7 19.3 4.25 18.75 4.25H12.45V4Z"/></svg>
                    </button>
                    <button className="p-2.5 bg-black/30 backdrop-blur-md rounded-full text-white/70 hover:bg-black/50 transition-all shadow-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg></button>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">{currentUserData.firstName}, {currentUserData.age}</h2>
                    {currentUserData.location && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mt-1 opacity-80">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {currentUserData.location}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed">
                    {currentUserData.bio}
                  </p>
                  
                  <section className="mt-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUserData.interests.slice(0, 4).map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-xl text-[10px] font-black border border-slate-200/50 dark:border-slate-700/50">
                          {tag}
                        </span>
                      ))}
                      {currentUserData.interests.length > 4 && (
                        <span className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 text-slate-400 rounded-xl text-[10px] font-black">
                          +{currentUserData.interests.length - 4}
                        </span>
                      )}
                    </div>
                  </section>
                </div>
              </Card>
              
              {/* Bottom Control Buttons closer to the card */}
              <div className="flex justify-center items-center gap-6 mt-4 pb-12">
                <button onClick={() => handleSwipe('left')} disabled={!!exitDirection} className="w-16 h-16 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 dark:hover:border-rose-900/30 transition-all active:scale-90 disabled:opacity-50"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <button onClick={() => handleSwipe('right')} disabled={!!exitDirection} className="w-20 h-20 bg-brand shadow-2xl shadow-brand/30 border-4 border-white dark:border-slate-800 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"><svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg></button>
                <button onClick={() => handleSwipe('super')} disabled={!!exitDirection} className="w-16 h-16 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl rounded-full flex items-center justify-center text-slate-400 hover:text-brand transition-all active:scale-90 disabled:opacity-50"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12"><div className="w-24 h-24 bg-brand/5 dark:bg-brand/20 text-brand rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✨</div><h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">You're all caught up!</h3><Button onClick={() => setCurrentIndex(0)}>Refresh List</Button></div>
          )}
        </div>
      ) : (
        <div className="flex-1 space-y-4 animate-in fade-in duration-300 no-scrollbar overflow-y-auto pb-32">
          <div className="px-2 py-4 border-b border-slate-100 dark:border-slate-800/50 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Smart Suggestions Based on Interests & Goals</span>
          </div>
          {rankedSuggestions.map(({ user, reasons, score }) => (
            <div key={user.id} className="bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-100 dark:border-slate-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <img src={user.photoUrl} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{user.firstName}, {user.age}</h4>
                    <span className="px-1.5 py-0.5 bg-brand/5 dark:bg-brand/20 text-brand dark:text-brand-light text-[8px] font-black rounded uppercase">Score: {score}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-500"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg></span>
                    <span className="text-[10px] font-bold text-slate-400">{user.instagramUsername ? `@${user.instagramUsername}` : 'No Insta linked'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleReport(user)} className="p-2 text-slate-300 hover:text-rose-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.45 4L12.15 2.5C12.06 2.06 11.66 1.75 11.21 1.75H4.25C3.7 1.75 3.25 2.2 3.25 2.75V19.75C3.25 20.3 3.7 20.75 4.25 20.75H5.75V12.75H10.15L10.45 14.25C10.54 14.69 10.94 15 11.39 15H18.75C19.3 15 19.75 14.55 19.75 14V5.25C19.75 4.7 19.3 4.25 18.75 4.25H12.45V4Z"/></svg>
                  </button>
                  <Button size="sm" variant="secondary" className="flex gap-2 items-center" onClick={() => handleConnectToInstagram(user)}>
                    Connect
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl">
                {reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
                    <div className="w-1 h-1 bg-brand rounded-full" />
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 leading-tight">{reason}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {user.interests.slice(0, 4).map(tag => (
                  <span key={tag} className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${currentUser.interests.includes(tag) ? 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Match Modal */}
      <Modal isOpen={showMatchModal} onClose={() => { setShowMatchModal(false); setCurrentIndex(prev => prev + 1); }}>
        <div className="text-center relative">
          <button 
            onClick={() => handleReport(lastMatchedUser!)}
            className="absolute -top-2 right-0 text-slate-300 hover:text-rose-500 p-2 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.45 4L12.15 2.5C12.06 2.06 11.66 1.75 11.21 1.75H4.25C3.7 1.75 3.25 2.2 3.25 2.75V19.75C3.25 20.3 3.7 20.75 4.25 20.75H5.75V12.75H10.15L10.45 14.25C10.54 14.69 10.94 15 11.39 15H18.75C19.3 15 19.75 14.55 19.75 14V5.25C19.75 4.7 19.3 4.25 18.75 4.25H12.45V4Z"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Report</span>
          </button>

          <div className="flex justify-center -space-x-4 mb-8 pt-4">
            <img src={currentUser.photoUrl} className="w-20 h-20 rounded-full border-4 border-white shadow-xl z-10" alt="" />
            <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center border-4 border-white shadow-xl z-20 text-white font-black text-2xl">🤝</div>
            <img src={lastMatchedUser?.photoUrl} className="w-20 h-20 rounded-full border-4 border-white shadow-xl z-10" alt="" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">It's a Crew!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Connect with {lastMatchedUser?.firstName} on Instagram to start building.</p>
          <Button fullWidth size="lg" className="flex gap-3 items-center justify-center mb-4" onClick={() => handleConnectToInstagram(lastMatchedUser!)}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
            Open Instagram
          </Button>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title={`Report ${reportingUser?.firstName}`}>
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Why are you reporting this profile? Your safety is our priority.</p>
          {[
            "Inappropriate content or bio",
            "Harassment or bullying",
            "Spam or fake account",
            "Underage user",
            "Something else"
          ].map((reason) => (
            <button 
              key={reason}
              onClick={() => submitReport(reason)}
              className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex justify-between items-center group"
            >
              {reason}
              <svg className="w-4 h-4 text-slate-300 group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          ))}
          <div className="pt-4">
            <Button variant="secondary" fullWidth onClick={() => setShowReportModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showErrorModal} onClose={() => { setShowErrorModal(false); if (mode === 'swipe') setCurrentIndex(prev => prev + 1); }}>
        <div className="text-center p-4">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">😕</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">No Instagram Linked</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">This user hasn't linked their Instagram yet. Try connecting with someone else!</p>
          <Button fullWidth size="lg" onClick={() => { setShowErrorModal(false); if (mode === 'swipe') setCurrentIndex(prev => prev + 1); }}>Keep exploring</Button>
        </div>
      </Modal>
    </div>
  );
};
