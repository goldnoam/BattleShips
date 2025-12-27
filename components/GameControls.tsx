
import React from 'react';
import { GameSettings } from '../types';

interface GameControlsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onStart: () => void;
  canStart: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ settings, onSettingsChange, onStart, canStart }) => {
  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md w-full max-w-lg">
      <div className="flex gap-4 w-full">
        {/* Mode Toggle */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 mb-2 mr-1 uppercase tracking-widest">מצב משחק</label>
          <div className="flex p-1 bg-slate-950 rounded-xl">
            <button
              onClick={() => onSettingsChange({ ...settings, mode: 'PvC' })}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                settings.mode === 'PvC' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              נגד המחשב
            </button>
            <button
              onClick={() => onSettingsChange({ ...settings, mode: 'PvP' })}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                settings.mode === 'PvP' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              שני שחקנים
            </button>
          </div>
        </div>

        {/* Time Toggle */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 mb-2 mr-1 uppercase tracking-widest">מגבלת זמן</label>
          <div className="flex p-1 bg-slate-950 rounded-xl">
            <button
              onClick={() => onSettingsChange({ ...settings, isTimed: false })}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                !settings.isTimed ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ללא הגבלה
            </button>
            <button
              onClick={() => onSettingsChange({ ...settings, isTimed: true })}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                settings.isTimed ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              על זמן
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        {!canStart && (
          <p className="text-center text-xs text-orange-400 mb-4 animate-pulse">
            נא למקם את כל הצוללות בלוח כדי להתחיל
          </p>
        )}
        <button
          onClick={onStart}
          disabled={!canStart}
          className={`w-full py-4 text-xl font-black rounded-xl transition-all uppercase tracking-tighter ${
            canStart 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-95 text-white shadow-[0_0_40px_rgba(6,182,212,0.3)]' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
          }`}
        >
          צא לקרב!
        </button>
      </div>
    </div>
  );
};

export default GameControls;
