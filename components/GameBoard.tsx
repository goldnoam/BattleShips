
// components/GameBoard.tsx: Visual representation of the battleship grid with hit/miss effects.

import React from 'react';
import { GRID_SIZE } from '../constants';
import { CellState, Ship, PlayerType } from '../types';
import Explosion from './Explosion';

interface GameBoardProps {
  player: PlayerType;
  board: CellState[];
  ships: Ship[];
  onFire: (index: number, player: PlayerType) => void;
  isTargetable: boolean;
  lastHit: { index: number, isSunk: boolean } | null;
  showShips?: boolean;
  cursorIndex?: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, ships, onFire, isTargetable, lastHit, player, showShips, cursorIndex }) => {
  return (
    <div className="relative group">
      {/* Target Crosshair Decoration */}
      <div className={`absolute -inset-2 border border-cyan-500/10 pointer-events-none rounded-2xl transition-all duration-500 ${isTargetable ? 'border-cyan-500/40 opacity-100 scale-100' : 'opacity-0 scale-95'}`}></div>
      <div className={`absolute top-0 -left-6 bottom-0 flex flex-col justify-between py-2 text-[10px] font-mono text-slate-500 select-none ${isTargetable ? 'text-cyan-600' : ''}`}>
        {Array.from({length: 10}).map((_, i) => <span key={i}>{i+1}</span>)}
      </div>
      <div className={`absolute -top-6 left-0 right-0 flex justify-between px-2 text-[10px] font-mono text-slate-500 select-none ${isTargetable ? 'text-cyan-600' : ''}`}>
        {['א','ב','ג','ד','ה','ו','ז','ח','ט','י'].map((l, i) => <span key={i}>{l}</span>)}
      </div>

      <div className={`grid grid-cols-10 gap-1 bg-slate-900/80 p-2 rounded-xl border-2 transition-all ${
        isTargetable ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-slate-800'
      }`}>
        {board.map((cell, idx) => {
          const ship = cell.shipId ? ships.find(s => s.id === cell.shipId) : null;
          const isSunk = ship && ship.hits.length === ship.size;
          const isLastHitCell = lastHit?.index === idx;
          const isCursor = cursorIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => isTargetable && onFire(idx, player)}
              className={`relative w-8 h-8 md:w-12 md:h-12 rounded-lg transition-all duration-300 flex items-center justify-center overflow-hidden border ${
                isCursor ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 z-10 scale-110' : ''
              } ${
                cell.isHit
                  ? isSunk 
                    ? 'bg-black/60 border-red-600 grayscale brightness-50' 
                    : 'bg-orange-600/30 border-orange-500 animate-hit'
                  : cell.isMiss
                  ? 'bg-slate-800/50 border-slate-700'
                  : (cell.hasShip && showShips)
                  ? 'bg-slate-700 border-slate-600'
                  : 'bg-slate-800 border-slate-700/40 hover:bg-slate-700/50 cursor-crosshair'
              }`}
            >
              {/* Hit/Miss Indicators */}
              {cell.isMiss && (
                <div className="w-2 h-2 bg-slate-400/50 rounded-full animate-pulse"></div>
              )}
              {cell.isHit && (
                <div className="flex items-center justify-center relative w-full h-full">
                  {!isSunk ? (
                    <span className="text-white text-xl font-bold select-none drop-shadow-md">✕</span>
                  ) : (
                    <div className="w-full h-full bg-red-950/20 absolute inset-0 flex items-center justify-center">
                       <span className="text-red-500 text-2xl font-black select-none opacity-40">†</span>
                    </div>
                  )}
                  
                  {isLastHitCell && (
                    <div className="absolute inset-0 z-20">
                      <Explosion />
                    </div>
                  )}
                </div>
              )}

              {/* Fog of war effect */}
              {!cell.isHit && !cell.isMiss && isTargetable && (
                <div className="absolute inset-0 bg-cyan-500/0 hover:bg-cyan-500/10 transition-colors"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Sunk Overlay Label */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2 overflow-x-auto py-1 no-scrollbar min-h-[30px]">
        {ships.filter(s => s.hits.length === s.size).map(s => (
          <span key={s.id} className="bg-red-900/40 border border-red-500/50 text-[10px] px-2 py-0.5 rounded text-red-200 uppercase font-black whitespace-nowrap animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
            {s.name} הוטבעה!
          </span>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
