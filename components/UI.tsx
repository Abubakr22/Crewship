
import React, { useState, useMemo, useEffect } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100';
  
  const variants = {
    primary: 'bg-brand text-white shadow-lg shadow-slate-900/10 hover:opacity-90 dark:shadow-none',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-brand dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Tag: React.FC<{ label: string; active?: boolean; onClick?: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
      active 
        ? 'bg-brand text-white border-brand' 
        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand'
    }`}
  >
    {label}
  </button>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors ${className}`}>
    {children}
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string }> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          {title && (
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

interface CalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const CustomCalendar: React.FC<CalendarProps> = ({ selectedDate, onSelect, onClose, isOpen }) => {
  const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);

  const today = new Date();
  const minDate = new Date(today.getFullYear() - 19, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const isDateDisabled = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date < minDate || date > maxDate;
  };

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const years = useMemo(() => {
    const list = [];
    for (let y = today.getFullYear() - 22; y <= today.getFullYear() - 10; y++) {
      list.push(y);
    }
    return list.reverse();
  }, [today]);

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    const totalDays = daysInMonth(currentMonth, currentYear);

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth, currentYear]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end transition-all">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-md mx-auto rounded-t-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 mb-2" />
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <button 
                onClick={() => setShowYearPicker(!showYearPicker)}
                className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-brand transition-colors"
              >
                Year
                <svg className={`w-3 h-3 transition-transform ${showYearPicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {monthNames[currentMonth]} {currentYear}
              </h3>
            </div>
            
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 active:scale-90 transition-all border border-slate-100 dark:border-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={handleNextMonth} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 active:scale-90 transition-all border border-slate-100 dark:border-slate-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {showYearPicker ? (
            <div className="grid grid-cols-3 gap-2 h-72 overflow-y-auto no-scrollbar py-2">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => {
                    setViewDate(new Date(y, currentMonth, 1));
                    setShowYearPicker(false);
                  }}
                  className={`py-3 rounded-2xl text-sm font-black transition-all ${y === currentYear ? 'bg-brand text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                  <div key={d} className="text-center text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  if (!day) return <div key={idx} />;
                  const disabled = isDateDisabled(currentYear, currentMonth, day);
                  const isSelected = selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  
                  return (
                    <button
                      key={idx}
                      disabled={disabled}
                      onClick={() => {
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        onSelect(dateStr);
                        onClose();
                      }}
                      className={`
                        aspect-square flex items-center justify-center text-sm font-black rounded-2xl transition-all active:scale-90
                        ${isSelected ? 'bg-brand text-white shadow-lg shadow-brand/20 scale-110 z-10' : ''}
                        ${!isSelected && !disabled ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800' : ''}
                        ${disabled ? 'text-slate-200 dark:text-slate-700 opacity-30 pointer-events-none' : ''}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-10 flex gap-4">
            <Button variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
          </div>
          <div className="h-safe-area-bottom pb-4" />
        </div>
      </div>
    </div>
  );
};

export const LighthouseLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 2L8 22H16L12 2Z" fill="currentColor" opacity="0.8" />
    <path d="M12 6L14 16H10L12 6Z" fill="currentColor" />
    <circle cx="12" cy="5" r="1.5" fill="currentColor" />
    <path d="M7 22H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CrewShipLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 400 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-colors duration-300`}
  >
    <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="22" fill="none" />
    <circle cx="200" cy="200" r="40" fill="currentColor" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
      <g key={angle} transform={`rotate(${angle} 200 200)`}>
        <rect x="188" y="30" width="24" height="170" rx="12" fill="currentColor" />
        <circle cx="200" cy="25" r="22" fill="currentColor" />
      </g>
    ))}
  </svg>
);

export const CaptainHatLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 400 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-colors duration-300`}
  >
    {/* Refined Pirate Bicorne Hat silhouette matching the uploaded image */}
    <path 
      d="M200 80C140 80 80 120 40 210C35 220 30 240 10 245C50 240 100 230 200 230C300 230 350 240 390 245C370 240 365 220 360 210C320 120 260 80 200 80Z" 
      fill="currentColor" 
    />
    {/* Centered Skull and Crossbones Emblem */}
    <g transform="translate(170, 150) scale(1.1)">
      {/* Skull */}
      <circle cx="27" cy="25" r="14" fill="white" />
      <rect x="20" y="32" width="14" height="10" rx="3" fill="white" />
      <circle cx="21" cy="25" r="3.5" fill="currentColor" opacity="0.9" />
      <circle cx="33" cy="25" r="3.5" fill="currentColor" opacity="0.9" />
      
      {/* Crossbones */}
      <path 
        d="M2 12L52 38M52 12L2 38" 
        stroke="white" 
        strokeWidth="5" 
        strokeLinecap="round" 
      />
      {/* Bone tips */}
      <circle cx="2" cy="12" r="3.5" fill="white" />
      <circle cx="52" cy="38" r="3.5" fill="white" />
      <circle cx="52" cy="12" r="3.5" fill="white" />
      <circle cx="2" cy="38" r="3.5" fill="white" />
    </g>
  </svg>
);

export const ProfileLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 400 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-colors duration-300`}
  >
    <circle cx="200" cy="130" r="85" fill="currentColor" />
    <path d="M50 360C50 280 110 230 200 230C290 230 350 280 350 360H50V360Z" fill="currentColor" />
    <path d="M120 240L280 340" stroke="white" strokeWidth="20" opacity="0.4" strokeLinecap="round" />
  </svg>
);

export const Brand: React.FC<{ className?: string; hideText?: boolean; iconSize?: number }> = ({ className = '', hideText = false, iconSize = 28 }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <LighthouseLogo size={iconSize} className="text-brand dark:text-slate-100" />
    {!hideText && (
      <span className="text-brand dark:text-slate-200 font-black tracking-tighter text-xl uppercase">
        Crewships
      </span>
    )}
  </div>
);
