
import React from 'react';

interface HeaderProps {
  theme: 'dark' | 'light';
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, isMuted, onToggleMute, onToggleTheme }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-between items-center px-4 py-2">
        {/* Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className={`group relative flex items-center justify-center p-3 rounded-2xl transition-all duration-300 border ${
            theme === 'dark' 
              ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
          }`}
          title={theme === 'dark' ? 'עבור למצב יום' : 'עבור למצב לילה'}
        >
          <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-in fade-in zoom-in duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-in fade-in zoom-in duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </div>
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            ערכת נושא
          </span>
        </button>

        {/* Logo Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-2xl">
            BATTLESHIP
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-cyan-500/30"></div>
            <p className="text-cyan-500 uppercase font-bold tracking-widest text-[10px] md:text-xs">צוללות אולטימטיבי</p>
            <div className="h-px w-8 bg-cyan-500/30"></div>
          </div>
        </div>

        {/* Sound Toggle */}
        <button 
          onClick={onToggleMute}
          className={`group relative p-3 rounded-2xl transition-all duration-300 border ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
          }`}
          title={isMuted ? "בטל השתקה" : "השתק"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          )}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            קולות
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
