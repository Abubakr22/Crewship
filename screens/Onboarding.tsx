
import React, { useState, useMemo } from 'react';
import { Button, Tag, Brand, CustomCalendar } from '../components/UI';
import { INTERESTS, GOALS, GENDERS } from '../constants';
import { Gender } from '../types';
import { normalizeAndTokenize } from '../services/matchingService';

interface OnboardingProps {
  onComplete: (data: any) => void;
  theme?: string;
  toggleTheme?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, theme, toggleTheme }) => {
  const [step, setStep] = useState(1);
  const [customInterest, setCustomInterest] = useState('');
  const [interestSearch, setInterestSearch] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    gender: '' as Gender | '',
    dob: '',
    instagramUsername: '',
    interests: [] as string[],
    goals: [] as string[],
    bio: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const addCustomInterest = (term?: string) => {
    const interestToAdd = term || customInterest;
    const trimmed = interestToAdd.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmed]
      }));
      setCustomInterest('');
      if (!term) setInterestSearch(''); // Clear search if added from main search bar
    }
  };

  const handleCustomInterestKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomInterest();
    }
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 0;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.dob);
  const isTeen = age >= 13 && age <= 19;

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "Select Date";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const allAvailableInterests = useMemo(() => {
    return Array.from(new Set([...INTERESTS, ...formData.interests]));
  }, [formData.interests]);

  const filteredInterests = useMemo(() => {
    if (!interestSearch.trim()) return allAvailableInterests;
    return allAvailableInterests.filter(i => 
      i.toLowerCase().includes(interestSearch.toLowerCase())
    );
  }, [allAvailableInterests, interestSearch]);

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const isFinalStepValid = formData.bio.trim().length > 0 && formData.instagramUsername.trim().length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col p-8 max-w-md mx-auto relative overflow-hidden transition-colors duration-300">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand/5 dark:bg-brand/10 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-slate-50 dark:bg-slate-900/40 rounded-full blur-3xl opacity-60" />
      
      {/* Progress Bar */}
      <div className="relative w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-12 overflow-hidden">
        <div 
          className="bg-brand h-full transition-all duration-700 ease-out" 
          style={{ width: `${(step / 4) * 100}%` }} 
        />
      </div>

      <div className="relative flex-1 flex flex-col z-10">
        {step === 1 && (
          <div className="flex-1 animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-8">
              <Brand iconSize={32} />
              {toggleTheme && (
                <button onClick={toggleTheme} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400">
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              )}
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-6 leading-tight">Meet. Greet. <span className="text-brand dark:text-brand-light">Grow.</span></h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 font-medium leading-relaxed">Build projects, find study buddies, and grow your network with people your age. Platonic and professional.</p>
            <div className="space-y-4 mb-12">
              {[
                { icon: "🚀", title: "Project Based", desc: "Collaborate on real-world hacks." },
                { icon: "📚", title: "Study Buddies", desc: "Prep for tests together." },
                { icon: "🤝", title: "Safe Space", desc: "Verified teen-only community." }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 bg-slate-50 dark:bg-slate-900 p-5 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.02]">
                  <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl text-xl shadow-sm border border-slate-50 dark:border-slate-700">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <Button fullWidth size="lg" onClick={handleNext}>Get Started</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 animate-in slide-in-from-right duration-500 flex flex-col">
            <button onClick={handleBack} className="mb-6 p-2 -ml-2 text-slate-400 hover:text-brand transition-colors self-start">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2 leading-tight">Verification</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Crewships is exclusively for teens (13-19). We take safety seriously.</p>
            
            <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-4 outline-none focus:ring-2 focus:ring-brand transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 font-bold" 
                  placeholder="e.g. Jordan" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Gender (Required)</label>
                <div className="grid grid-cols-2 gap-3">
                  {GENDERS.map(g => (
                    <button
                      key={g}
                      onClick={() => setFormData({...formData, gender: g as Gender})}
                      className={`py-3.5 px-4 rounded-[18px] text-xs font-black border transition-all active:scale-95 ${g === 'Prefer not to say' ? 'col-span-2' : ''} ${formData.gender === g ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Date of Birth</label>
                <div className="relative">
                  <button 
                    onClick={() => setIsCalendarOpen(true)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-4 outline-none flex justify-between items-center transition-all active:scale-[0.98] text-left"
                  >
                    <span className={`font-bold ${formData.dob ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                      {formatDateLabel(formData.dob)}
                    </span>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>

                  <CustomCalendar 
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    selectedDate={formData.dob}
                    onSelect={(date) => setFormData({...formData, dob: date})}
                  />
                </div>
                
                {formData.dob && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {isTeen ? (
                      <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-[24px] flex items-center gap-4 shadow-sm">
                        <span className="text-2xl">⚓</span>
                        <div>
                          <p className="text-emerald-800 dark:text-emerald-300 text-sm font-black leading-tight">Join the Crew!</p>
                          <p className="text-emerald-600/80 dark:text-emerald-400/80 text-[11px] font-bold mt-0.5">Welcome! You're {age} years old.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-[24px] flex items-center gap-4 shadow-sm">
                        <span className="text-2xl">🛑</span>
                        <div>
                          <p className="text-rose-800 dark:text-rose-300 text-sm font-black leading-tight">Access Restricted</p>
                          <p className="text-rose-600/80 dark:text-rose-400/80 text-[11px] font-bold mt-0.5">Crewships is only for teens aged 13-19.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8">
              <Button fullWidth size="lg" onClick={handleNext} disabled={!isTeen || !formData.firstName || !formData.gender}>Next Step</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-10 flex flex-col">
            <button onClick={handleBack} className="mb-6 p-2 -ml-2 text-slate-400 hover:text-brand transition-colors flex shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2 shrink-0">Interests</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium shrink-0">What are you passionate about? Select at least 3.</p>
            
            <div className="relative mb-6 shrink-0">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search interests..." 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-11 pr-12 outline-none focus:ring-2 focus:ring-brand transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-bold shadow-sm" 
                value={interestSearch} 
                onChange={(e) => setInterestSearch(e.target.value)} 
              />
              {interestSearch && (
                <button 
                  onClick={() => setInterestSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-slate-200 dark:bg-slate-800 rounded-full text-slate-500"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2.5 mb-8 transition-all duration-300 min-h-[120px] items-start shrink-0">
              {filteredInterests.length > 0 ? (
                filteredInterests.map(interest => (
                  <Tag 
                    key={interest} 
                    label={interest} 
                    active={formData.interests.includes(interest)} 
                    onClick={() => toggleInterest(interest)} 
                  />
                ))
              ) : (
                <div className="w-full text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-4">No matching interests found.</p>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="gap-2"
                    onClick={() => addCustomInterest(interestSearch)}
                  >
                    Add "{interestSearch}" as custom
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Goals</h3>
              <div className="flex flex-wrap gap-2.5 mb-4">
                {GOALS.map(goal => (
                  <Tag 
                    key={goal} 
                    label={goal} 
                    active={formData.goals.includes(goal)} 
                    onClick={() => toggleGoal(goal)} 
                  />
                ))}
              </div>
            </div>
            
            {/* Added container with top margin and auto-push for the Continue button */}
            <div className="mt-auto pt-10">
              <Button fullWidth size="lg" onClick={handleNext} disabled={formData.interests.length < 3}>Continue</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-10">
            <button onClick={handleBack} className="mb-6 p-2 -ml-2 text-slate-400 hover:text-brand transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">Final Touches</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Link your Instagram to connect with the crew.</p>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Short Bio</label>
                <textarea 
                  className="w-full h-36 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] p-5 outline-none focus:ring-2 focus:ring-brand transition-all resize-none text-slate-900 dark:text-slate-100 text-sm font-bold leading-relaxed shadow-inner" 
                  placeholder="Tell us about what you're building or studying..." 
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Instagram Username</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-brand font-black text-lg pointer-events-none">@</span>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-4 pl-11 outline-none focus:ring-2 focus:ring-brand transition-all text-slate-900 dark:text-slate-100 text-sm font-black" 
                    placeholder="username" 
                    value={formData.instagramUsername} 
                    onChange={(e) => setFormData({...formData, instagramUsername: e.target.value.replace('@', '')})} 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <Button 
                fullWidth 
                size="lg" 
                onClick={() => onComplete({
                  ...formData, 
                  age: calculateAge(formData.dob), 
                  normalizedBioKeywords: normalizeAndTokenize(formData.bio)
                })} 
                disabled={!isFinalStepValid}
              >
                Set Sail
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
