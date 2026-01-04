
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Card, Button, Tag, Brand } from '../components/UI';
import { SettingsScreen } from './Settings';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const ProfileScreen: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout, theme, onToggleTheme }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-1">
          <Brand iconSize={24} />
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">My Profile</h1>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative mb-6">
          <img 
            src={user.photoUrl || "https://picsum.photos/seed/default/400/400"} 
            className="w-32 h-32 rounded-[40px] object-cover shadow-2xl border-4 border-white dark:border-slate-800"
            alt={user.firstName}
          />
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="absolute bottom-0 right-0 w-10 h-10 bg-brand text-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white dark:border-slate-800 active:scale-90 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{user.firstName}, {user.age}</h2>
        
        {user.instagramUsername ? (
          <div className="flex items-center gap-1.5 mt-1.5 text-brand dark:text-brand-light font-bold bg-brand/5 dark:bg-brand-light/10 px-4 py-1 rounded-full border border-brand/10 dark:border-brand-light/10">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
            </svg>
            <span className="text-sm">@{user.instagramUsername}</span>
          </div>
        ) : (
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 font-medium italic">Instagram not linked</p>
        )}

        <div className="flex gap-6 mt-8">
          <div className="text-center">
            <p className="text-xl font-black text-brand dark:text-brand-light">1</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Friends</p>
          </div>
          <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
          <div className="text-center">
            <p className="text-xl font-black text-brand dark:text-brand-light">1</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connections</p>
          </div>
          <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
          <div className="text-center">
            <p className="text-xl font-black text-brand dark:text-brand-light">1</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Crew</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 pb-10">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">About Me</h3>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="text-brand dark:text-brand-light text-sm font-bold bg-brand/5 dark:bg-brand-light/10 px-3 py-1 rounded-lg"
            >
              Edit
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-sm font-medium shadow-sm">
            {user.bio || "No bio yet. Add one to help people get to know you!"}
          </p>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">My Interests</h3>
          <div className="flex flex-wrap gap-1.5">
            {user.interests.map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-100/50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="pt-8 space-y-3">
          <Button fullWidth variant="secondary" onClick={() => setIsSettingsOpen(true)}>Safety & Privacy Center</Button>
          <Button fullWidth variant="danger" onClick={onLogout}>Log Out</Button>
        </section>
      </div>
      
      <div className="mt-8 text-center pb-8">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">Crewships v1.2.0</p>
      </div>

      {isSettingsOpen && (
        <SettingsScreen 
          user={user}
          onUpdateUser={onUpdateUser}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={onLogout}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      )}
    </div>
  );
};
