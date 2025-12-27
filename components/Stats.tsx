
import React from 'react';
import { PlayerType, Ship } from '../types';

interface StatsProps {
  player: PlayerType;
  isActive: boolean;
  ships: Ship[];
  timeLeft: number | null;
}

const Stats: React.FC<StatsProps> = ({ player, isActive, ships, timeLeft }) => {
  const totalHits = ships.reduce((acc, s) => acc + s.hits.length, 0);
  const totalSize = ships.reduce((acc, s) => acc + s.size, 0);
  const progress = (totalHits / totalSize) * 100;
  
  const playerName = player === 'player1' ? 'שחקן 1' : player === 'player2' ? 'שחקן 2' : 'המחשב';
  const isP1 = player === 'player1';

  return (
    <div className={`w-full p-4 rounded-2xl transition-all duration-500 border-2 ${
      isActive 
        ? (isP1 ? 'bg-slate-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)] turn-active-p1' : 'bg-slate-900 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)] turn-active-p2') 
        : 'bg-slate-950 border-slate-800 opacity-60 scale-95'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className={`text-xl font-black transition-colors ${
          isActive 
            ? (isP1 ? 'text-cyan-400' : 'text-orange-400') 
            : 'text-slate-500'
        }`}>{playerName}</h4>
        
        {timeLeft !== null && (
          <div className="flex items-center gap-2">
             <span className={`text-2xl font-mono font-bold ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Health Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div 
            className={`h-full transition-all duration-1000 ${progress > 70 ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${100 - progress}%` }}
          ></div>
        </div>

        {/* Ships Fleet Status */}
        <div className="flex gap-2 justify-center flex-wrap">
          {ships.map(ship => {
            const sunk = ship.hits.length === ship.size;
            return (
              <div 
                key={ship.id}
                title={ship.name}
                className={`flex gap-0.5 p-1 rounded border transition-all ${
                  sunk ? 'border-red-500/50 bg-red-900/20 opacity-50' : 'border-slate-700 bg-slate-800'
                }`}
              >
                {Array.from({ length: ship.size }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-3 rounded-sm ${
                      sunk ? 'bg-red-600' : i < ship.hits.length ? 'bg-orange-500' : 'bg-slate-600'
                    }`}
                  ></div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      
      {isActive && (
        <div className="mt-4 text-center">
          <span className={`text-[10px] uppercase font-black tracking-widest animate-pulse ${
            isP1 ? 'text-cyan-500' : 'text-orange-500'
          }`}>תורך כעת</span>
        </div>
      )}
    </div>
  );
};

export default Stats;
