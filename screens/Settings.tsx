
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button, Tag } from '../components/UI';
import { INTERESTS, GOALS } from '../constants';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onClose: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const SettingsScreen: React.FC<SettingsProps> = ({ 
  user, 
  onUpdateUser, 
  onClose, 
  onLogout,
  theme,
  onToggleTheme
}) => {
  const [editData, setEditData] = useState<UserProfile>({ ...user });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isVisibilityEnabled, setIsVisibilityEnabled] = useState(true);

  const handleSave = () => {
    if (!editData.instagramUsername?.trim()) {
      alert("Instagram username is required to connect with the crew!");
      return;
    }
    onUpdateUser(editData);
    onClose();
  };

  const toggleInterest = (interest: string) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleGoal = (goal: string) => {
    setEditData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="fixed inset-0 z-[70] bg-white dark:bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Settings</h2>
        <button 
          onClick={handleSave}
          className="text-brand dark:text-brand-light font-bold text-sm px-4 py-2 hover:bg-brand/5 rounded-xl transition-colors"
        >
          Save
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-10">
        {/* Edit Profile Section */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Edit Profile</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-2 px-1">First Name</label>
              <input 
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand transition-all"
                value={editData.firstName}
                onChange={(e) => setEditData({...editData, firstName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-2 px-1">Bio</label>
              <textarea 
                className="w-full h-24 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand transition-all resize-none"
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-2 px-1">Instagram Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                <input 
                  type="text"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pl-8 text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-brand transition-all"
                  value={editData.instagramUsername || ''}
                  onChange={(e) => setEditData({...editData, instagramUsername: e.target.value.replace('@', '')})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold text-slate-500 px-1">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(item => (
                <Tag 
                  key={item} 
                  label={item} 
                  active={editData.interests.includes(item)}
                  onClick={() => toggleInterest(item)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold text-slate-500 px-1">Goals</label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map(item => (
                <Tag 
                  key={item} 
                  label={item} 
                  active={editData.goals.includes(item)}
                  onClick={() => toggleGoal(item)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Privacy & Safety</h3>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Public Profile</span>
                <span className="text-[10px] text-slate-500">Allow others to find you in Discover</span>
              </div>
              <button 
                onClick={() => setIsVisibilityEnabled(!isVisibilityEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative ${isVisibilityEnabled ? 'bg-brand' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVisibilityEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Connection Controls</span>
                <span className="text-[10px] text-slate-500">Manage who can send you requests</span>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        {/* App Preferences */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Preferences</h3>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button 
              onClick={onToggleTheme}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Appearance</span>
                <span className="text-[10px] text-slate-500">Currently: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
              </div>
              <span className="text-lg">{theme === 'light' ? '☀️' : '🌙'}</span>
            </button>
            <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Notifications</span>
                <span className="text-[10px] text-slate-500">Configure alerts and reminders</span>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </section>

        {/* Support & Account */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Account</h3>
          <div className="space-y-3">
            <Button variant="secondary" fullWidth className="justify-between px-5">
              Help & Support
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </Button>
            <Button variant="ghost" fullWidth onClick={onLogout} className="text-slate-600 dark:text-slate-400">
              Log Out
            </Button>
            <Button 
              variant="danger" 
              fullWidth 
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-6"
            >
              Delete Account
            </Button>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-8 text-center animate-in zoom-in duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
            <h4 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">Are you sure?</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              This action is permanent. All your data, crew connections, and projects will be deleted forever.
            </p>
            <div className="space-y-3">
              <Button fullWidth variant="danger" onClick={() => {
                alert("Account deleted.");
                onLogout();
              }}>Yes, delete forever</Button>
              <Button fullWidth variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
