
import React, { useState, useEffect } from 'react';
import { GRID_SIZE } from '../constants';
import { CellState, Ship, Orientation, PlayerType } from '../types';

interface SetupBoardProps {
  player: PlayerType;
  board: CellState[];
  ships: Ship[];
  setBoard: React.Dispatch<React.SetStateAction<CellState[]>>;
  setShips: React.Dispatch<React.SetStateAction<Ship[]>>;
  title: string;
}

const SetupBoard: React.FC<SetupBoardProps> = ({ board, ships, setBoard, setShips, title }) => {
  const [selectedShipId, setSelectedShipId] = useState<string | null>(ships.find(s => !s.placed)?.id || null);
  const [orientation, setOrientation] = useState<Orientation>('H');
  const [hoverIndices, setHoverIndices] = useState<number[]>([]);
  const [hoveredExistingShip, setHoveredExistingShip] = useState<Ship | null>(null);
  const [cursorPos, setCursorPos] = useState<number>(0);

  const selectedShip = ships.find(s => s.id === selectedShipId);

  const getPlacementIndices = (index: number, size: number, orient: Orientation, currentBoard: CellState[]) => {
    const indices: number[] = [];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    if (orient === 'H') {
      if (col + size > GRID_SIZE) return null;
      for (let i = 0; i < size; i++) indices.push(index + i);
    } else {
      if (row + size > GRID_SIZE) return null;
      for (let i = 0; i < size; i++) indices.push(index + i * GRID_SIZE);
    }
    return indices;
  };

  const updateHoverState = (index: number) => {
    setCursorPos(index);
    const cell = board[index];
    if (cell.hasShip && cell.shipId) {
      const ship = ships.find(s => s.id === cell.shipId);
      if (ship) setHoveredExistingShip(ship);
    } else {
      setHoveredExistingShip(null);
    }
    if (!selectedShip || selectedShip.placed) {
      setHoverIndices([]);
      return;
    }
    const indices = getPlacementIndices(index, selectedShip.size, orientation, board);
    setHoverIndices(indices || []);
  };

  const handleMouseEnter = (index: number) => {
    updateHoverState(index);
  };

  const handlePlaceShip = (index: number) => {
    if (!selectedShip || selectedShip.placed) return;
    const indices = getPlacementIndices(index, selectedShip.size, orientation, board);
    if (!indices || indices.some(i => board[i].hasShip)) return;
    const newBoard = [...board];
    indices.forEach(i => { newBoard[i].hasShip = true; newBoard[i].shipId = selectedShip.id; });
    const newShips = ships.map(s => s.id === selectedShip.id ? { ...s, placed: true, orientation, positions: indices } : s);
    setBoard(newBoard);
    setShips(newShips);
    const nextUnplaced = newShips.find(s => !s.placed);
    setSelectedShipId(nextUnplaced ? nextUnplaced.id : null);
    setHoverIndices([]);
  };

  const autoPlaceRemaining = () => {
    const newBoard = [...board];
    const newShips = ships.map(s => ({ ...s }));
    newShips.forEach(ship => {
      if (ship.placed) return;
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 200) {
        attempts++;
        const orient: Orientation = Math.random() > 0.5 ? 'H' : 'V';
        const index = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
        const indices = getPlacementIndices(index, ship.size, orient, newBoard);
        if (indices && indices.every(i => !newBoard[i].hasShip)) {
          indices.forEach(i => { newBoard[i].hasShip = true; newBoard[i].shipId = ship.id; });
          ship.placed = true; ship.orientation = orient; ship.positions = indices; placed = true;
        }
      }
    });
    setBoard(newBoard);
    setShips(newShips);
    setSelectedShipId(null);
    setHoverIndices([]);
  };

  const resetShip = (id: string) => {
    const ship = ships.find(s => s.id === id);
    if (!ship || !ship.placed) return;
    const newBoard = [...board];
    ship.positions.forEach(i => { newBoard[i].hasShip = false; newBoard[i].shipId = null; });
    const newShips = ships.map(s => s.id === id ? { ...s, placed: false, positions: [] } : s);
    setBoard(newBoard);
    setShips(newShips);
    setSelectedShipId(id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') moveCursor('u');
      if (key === 's' || key === 'arrowdown') moveCursor('d');
      if (key === 'a' || key === 'arrowleft') moveCursor('l');
      if (key === 'd' || key === 'arrowright') moveCursor('r');
      if (key === 'r') setOrientation(prev => prev === 'H' ? 'V' : 'H');
      if (key === ' ' || key === 'enter') handlePlaceShip(cursorPos);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorPos, orientation, selectedShipId, ships, board]);

  const moveCursor = (dir: 'u'|'d'|'l'|'r') => {
    setCursorPos(prev => {
      let next = prev;
      if (dir === 'u') next = Math.max(0, prev - GRID_SIZE);
      if (dir === 'd') next = Math.min(GRID_SIZE * GRID_SIZE - 1, prev + GRID_SIZE);
      if (dir === 'l') next = prev % GRID_SIZE === 0 ? prev : prev - 1;
      if (dir === 'r') next = prev % GRID_SIZE === GRID_SIZE - 1 ? prev : prev + 1;
      updateHoverState(next);
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center w-full px-2">
      <h3 className="text-xl font-bold mb-4 text-slate-300">{title}</h3>
      <div className="flex flex-col lg:flex-row gap-6 w-full justify-center">
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-1 custom-scrollbar">
            {ships.map(ship => (
              <button key={ship.id} onClick={() => setSelectedShipId(ship.id)} className={`p-3 rounded-lg text-right flex justify-between items-center transition-all ${selectedShipId === ship.id ? 'bg-cyan-600/20 border-cyan-500 border shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50'} ${ship.placed ? 'opacity-50 grayscale cursor-default' : ''}`}>
                <div className="flex gap-1">{Array.from({ length: ship.size }).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-cyan-400"></div>)}</div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-sm">{ship.name}</span>
                  {ship.placed && <span className="text-[10px] text-red-400 hover:underline cursor-pointer" onClick={(e) => { e.stopPropagation(); resetShip(ship.id); }}>בטל מיקום</span>}
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button onClick={() => setOrientation(prev => prev === 'H' ? 'V' : 'H')} className="p-3 bg-slate-100 text-slate-900 rounded-lg font-black hover:bg-white transition-all flex items-center justify-center gap-2">
              <span>סובב (R): {orientation === 'H' ? 'אופקי' : 'אנכי'}</span>
            </button>
            {ships.some(s => !s.placed) && (
              <button 
                onClick={autoPlaceRemaining} 
                className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg active:scale-95"
              >
                מיקום אקראי אוטומטי
              </button>
            )}
          </div>
          <div className="mt-4 p-4 bg-slate-800/50 rounded-xl lg:hidden flex flex-col items-center gap-2">
            <div className="grid grid-cols-3 gap-2">
              <div></div><button onClick={() => moveCursor('u')} className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">▲</button><div></div>
              <button onClick={() => moveCursor('l')} className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">◀</button>
              <button onClick={() => handlePlaceShip(cursorPos)} className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center font-bold">OK</button>
              <button onClick={() => moveCursor('r')} className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">▶</button>
              <div></div><button onClick={() => moveCursor('d')} className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">▼</button><div></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-10 gap-1 bg-slate-900/80 p-2 rounded-xl border border-slate-700/50 shadow-2xl relative" onMouseLeave={() => { setHoverIndices([]); setHoveredExistingShip(null); }}>
            {board.map((cell, idx) => {
              const isHover = hoverIndices.includes(idx);
              const isCursor = cursorPos === idx;
              return (
                <div key={idx} onMouseEnter={() => handleMouseEnter(idx)} onClick={() => handlePlaceShip(idx)} className={`w-8 h-8 md:w-10 md:h-10 rounded-sm border transition-all cursor-pointer flex items-center justify-center ${cell.hasShip ? 'bg-slate-600 border-slate-500' : isHover ? 'bg-cyan-500/40 border-cyan-400 scale-105 z-10' : isCursor ? 'bg-slate-700 border-slate-600' : 'bg-slate-800 border-slate-700/30'}`}>
                  {cell.hasShip && <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
                </div>
              );
            })}
          </div>
          <div className="h-10 flex items-center justify-center">
            {hoveredExistingShip ? <div className="text-sm font-bold text-cyan-400 animate-in">{hoveredExistingShip.name}</div> : selectedShip && hoverIndices.length > 0 ? <div className="text-sm font-bold text-slate-400 animate-in">מציב {selectedShip.name}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupBoard;
