
// App.tsx: Battleship game with turn management, dark theme, keyboard (WASD) and mobile controls.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, SHIPS_TEMPLATE, TURN_TIME_LIMIT } from './constants';
import { PlayerType, GameStatus, Ship, CellState, GameSettings, Orientation } from './types';
import Header from './components/Header';
import SetupBoard from './components/SetupBoard';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import Stats from './components/Stats';
import Modal from './components/Modal';
import { soundManager } from './utils/audio';

const createInitialBoard = () => Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
  index: i,
  hasShip: false,
  isHit: false,
  isMiss: false,
  shipId: null,
}));

const createInitialShips = (): Ship[] => SHIPS_TEMPLATE.map(s => ({
  ...s,
  placed: false,
  orientation: 'H',
  positions: [],
  hits: [],
}));

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>('setup');
  const [activePlayer, setActivePlayer] = useState<PlayerType>('player1');
  const [isPaused, setIsPaused] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'PvC',
    isTimed: false,
    turnLimit: TURN_TIME_LIMIT,
    isMuted: false,
  });

  const [player1Ships, setPlayer1Ships] = useState<Ship[]>(createInitialShips);
  const [player2Ships, setPlayer2Ships] = useState<Ship[]>(createInitialShips);
  const [player1Board, setPlayer1Board] = useState<CellState[]>(createInitialBoard);
  const [player2Board, setPlayer2Board] = useState<CellState[]>(createInitialBoard);
  
  const [timeLeft, setTimeLeft] = useState(TURN_TIME_LIMIT);
  const [winner, setWinner] = useState<PlayerType | null>(null);
  const [lastHit, setLastHit] = useState<{player: PlayerType, index: number, isSunk: boolean} | null>(null);
  const [turnFlash, setTurnFlash] = useState<PlayerType | null>(null);
  const [gameCursor, setGameCursor] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchTurn = useCallback(() => {
    setActivePlayer(prev => prev === 'player1' ? (settings.mode === 'PvC' ? 'computer' : 'player2') : 'player1');
    setTimeLeft(settings.turnLimit);
  }, [settings.mode, settings.turnLimit]);

  useEffect(() => {
    if (status === 'playing') {
      setTurnFlash(activePlayer);
      const timeout = setTimeout(() => setTurnFlash(null), 600);
      return () => clearTimeout(timeout);
    }
  }, [activePlayer, status]);

  useEffect(() => {
    if (status === 'playing' && settings.isTimed && !isPaused && !winner) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            switchTurn();
            return settings.turnLimit;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, settings.isTimed, isPaused, switchTurn, settings.turnLimit, winner]);

  const onFire = useCallback((index: number, targetPlayer: PlayerType) => {
    if (status !== 'playing' || isPaused || winner) return;
    if (activePlayer === targetPlayer) return;

    const board = targetPlayer === 'player1' ? player1Board : player2Board;
    const ships = targetPlayer === 'player1' ? player1Ships : player2Ships;
    const setBoard = targetPlayer === 'player1' ? setPlayer1Board : setPlayer2Board;
    const setShips = targetPlayer === 'player1' ? setPlayer1Ships : setPlayer2Ships;

    const cell = board[index];
    if (cell.isHit || cell.isMiss) return;

    const newBoard = [...board];
    const newShips = [...ships];
    let isSunk = false;

    if (cell.hasShip) {
      newBoard[index] = { ...cell, isHit: true };
      const shipIndex = newShips.findIndex(s => s.id === cell.shipId);
      newShips[shipIndex] = { ...newShips[shipIndex], hits: [...newShips[shipIndex].hits, index] };
      isSunk = newShips[shipIndex].hits.length === newShips[shipIndex].size;
      
      if (!settings.isMuted) isSunk ? soundManager.playSunk() : soundManager.playHit();
      setLastHit({ player: targetPlayer, index, isSunk });
      
      if (newShips.every(s => s.hits.length === s.size)) {
        setWinner(activePlayer);
        setStatus('gameOver');
      }
    } else {
      newBoard[index] = { ...cell, isMiss: true };
      if (!settings.isMuted) soundManager.playMiss();
      switchTurn();
    }
    setBoard(newBoard);
    setShips(newShips);
  }, [status, isPaused, winner, activePlayer, player1Board, player2Board, player1Ships, player2Ships, settings.isMuted, switchTurn]);

  // Handle keyboard events for gameplay
  useEffect(() => {
    if (status !== 'playing' || winner || isPaused) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') moveGameCursor('u');
      if (key === 's' || key === 'arrowdown') moveGameCursor('d');
      if (key === 'a' || key === 'arrowleft') moveGameCursor('l');
      if (key === 'd' || key === 'arrowright') moveGameCursor('r');
      if (key === ' ' || key === 'enter') handleFireCursor();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, winner, isPaused, gameCursor, activePlayer]);

  const moveGameCursor = (dir: 'u' | 'd' | 'l' | 'r') => {
    setGameCursor(prev => {
      let next = prev;
      if (dir === 'u') next = Math.max(0, prev - GRID_SIZE);
      if (dir === 'd') next = Math.min(GRID_SIZE * GRID_SIZE - 1, prev + GRID_SIZE);
      if (dir === 'l') next = prev % GRID_SIZE === 0 ? prev : prev - 1;
      if (dir === 'r') next = prev % GRID_SIZE === GRID_SIZE - 1 ? prev : prev + 1;
      return next;
    });
  };

  const handleFireCursor = () => {
    const targetPlayer = activePlayer === 'player1' ? (settings.mode === 'PvC' ? 'computer' : 'player2') : 'player1';
    onFire(gameCursor, targetPlayer);
  };

  const resetGame = () => {
    setStatus('setup');
    setActivePlayer('player1');
    setIsPaused(false);
    setWinner(null);
    setPlayer1Ships(createInitialShips());
    setPlayer2Ships(createInitialShips());
    setPlayer1Board(createInitialBoard());
    setPlayer2Board(createInitialBoard());
    setLastHit(null);
    setTimeLeft(settings.turnLimit);
    setGameCursor(0);
  };

  const placeShipsRandomly = (ships: Ship[], setBoard: React.Dispatch<React.SetStateAction<CellState[]>>, setShips: React.Dispatch<React.SetStateAction<Ship[]>>) => {
    const newBoard = createInitialBoard();
    const newShips = ships.map(s => ({ ...s, placed: false, positions: [], hits: [] }));
    newShips.forEach(ship => {
      let placed = false;
      while (!placed) {
        const orientation: Orientation = Math.random() > 0.5 ? 'H' : 'V';
        const index = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const indices: number[] = [];
        if (orientation === 'H') {
          if (col + ship.size <= GRID_SIZE) for (let i = 0; i < ship.size; i++) indices.push(index + i);
        } else {
          if (row + ship.size <= GRID_SIZE) for (let i = 0; i < ship.size; i++) indices.push(index + i * GRID_SIZE);
        }
        if (indices.length === ship.size && indices.every(i => !newBoard[i].hasShip)) {
          indices.forEach(i => { newBoard[i].hasShip = true; newBoard[i].shipId = ship.id; });
          ship.placed = true; ship.orientation = orientation; ship.positions = indices; placed = true;
        }
      }
    });
    setBoard(newBoard);
    setShips(newShips);
  };

  const handleStartGame = () => {
    if (settings.mode === 'PvC') placeShipsRandomly(player2Ships, setPlayer2Board, setPlayer2Ships);
    setStatus('playing');
    setActivePlayer('player1');
    setTimeLeft(settings.turnLimit);
  };

  // Computer AI logic
  useEffect(() => {
    if (status === 'playing' && activePlayer === 'computer' && !winner && !isPaused) {
      const timer = setTimeout(() => {
        const availableIndices = player1Board.filter(c => !c.isHit && !c.isMiss).map(c => c.index);
        if (availableIndices.length > 0) {
          onFire(availableIndices[Math.floor(Math.random() * availableIndices.length)], 'player1');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activePlayer, status, player1Board, onFire, winner, isPaused]);

  return (
    <div className={`min-h-screen grid-pattern flex flex-col ${theme === 'light' ? 'light-theme' : 'bg-slate-950 text-white'} ${turnFlash === 'player1' ? 'screen-flash-p1' : turnFlash ? 'screen-flash-p2' : ''}`}>
      <Header 
        theme={theme} 
        isMuted={settings.isMuted} 
        onToggleMute={() => setSettings(s => ({ ...s, isMuted: !s.isMuted }))}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      <main className="flex-grow container mx-auto px-4 py-8 z-10">
        {status === 'setup' && (
          <div className="flex flex-col items-center gap-12">
            <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
              <SetupBoard player="player1" board={player1Board} ships={player1Ships} setBoard={setPlayer1Board} setShips={setPlayer1Ships} title="הצב את הצי שלך" />
              {settings.mode === 'PvP' && <SetupBoard player="player2" board={player2Board} ships={player2Ships} setBoard={setPlayer2Board} setShips={setPlayer2Ships} title="שחקן 2 - הצב את הצי" />}
            </div>
            <GameControls settings={settings} onSettingsChange={setSettings} onStart={handleStartGame} canStart={player1Ships.every(s => s.placed) && (settings.mode === 'PvC' || player2Ships.every(s => s.placed))} />
          </div>
        )}

        {status === 'playing' && (
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl">
              <div className="flex-1 min-w-[320px]">
                <Stats player="player1" isActive={activePlayer === 'player1'} ships={player1Ships} timeLeft={activePlayer === 'player1' && settings.isTimed ? timeLeft : null} />
                <div className="mt-4">
                  <GameBoard player="player1" board={player1Board} ships={player1Ships} onFire={onFire} isTargetable={activePlayer !== 'player1' && activePlayer !== 'computer'} lastHit={lastHit?.player === 'player1' ? lastHit : null} showShips={true} cursorIndex={activePlayer !== 'player1' && activePlayer !== 'computer' ? gameCursor : undefined} />
                </div>
              </div>
              <div className="flex-1 min-w-[320px]">
                <Stats player={settings.mode === 'PvC' ? 'computer' : 'player2'} isActive={activePlayer !== 'player1'} ships={player2Ships} timeLeft={activePlayer !== 'player1' && settings.isTimed ? timeLeft : null} />
                <div className="mt-4">
                  <GameBoard player={settings.mode === 'PvC' ? 'computer' : 'player2'} board={player2Board} ships={player2Ships} onFire={onFire} isTargetable={activePlayer === 'player1'} lastHit={lastHit?.player !== 'player1' ? lastHit : null} showShips={winner !== null} cursorIndex={activePlayer === 'player1' ? gameCursor : undefined} />
                </div>
              </div>
            </div>

            {/* Mobile Controls & Cursor Pad */}
            {activePlayer !== 'computer' && (
              <div className="p-4 bg-slate-900/40 rounded-xl flex flex-col items-center gap-2 border border-slate-800 shadow-2xl backdrop-blur">
                <span className="text-xs text-slate-500 font-bold uppercase mb-2">שליטה בחיצים (WASD)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div></div><button onClick={() => moveGameCursor('u')} className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all">▲</button><div></div>
                  <button onClick={() => moveGameCursor('l')} className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all">◀</button>
                  <button onClick={handleFireCursor} className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center font-black hover:bg-orange-500 active:scale-95 transition-all shadow-lg shadow-orange-900/20">FIRE</button>
                  <button onClick={() => moveGameCursor('r')} className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all">▶</button>
                  <div></div><button onClick={() => moveGameCursor('d')} className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all">▼</button><div></div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setIsPaused(p => !p)} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all border border-slate-700 shadow-lg">{isPaused ? 'המשך' : 'השהה'}</button>
              <button onClick={resetGame} className="px-8 py-3 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-xl font-bold transition-all border border-red-500/30">אפס משחק</button>
            </div>
          </div>
        )}

        {status === 'gameOver' && winner && (
          <Modal title="הקרב הסתיים!" onClose={resetGame} primaryAction={{ label: 'משחק חדש', onClick: resetGame }}>
            <div className="text-center">
              <p className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
                {winner === 'player1' ? 'שחקן 1 ניצח!' : winner === 'computer' ? 'המחשב ניצח!' : 'שחקן 2 ניצח!'}
              </p>
              <p className="text-slate-400">כל הצוללות של היריב הושמדו בהצלחה.</p>
            </div>
          </Modal>
        )}
      </main>

      <footer className="w-full py-8 mt-auto border-t border-slate-800/50 flex flex-col items-center gap-2 text-slate-500">
        <div className="text-xs font-medium">(C) Noam Gold AI 2025</div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest">Send Feedback:</span>
          <a href="mailto:goldnoamai@gmail.com" className="text-cyan-500 hover:text-cyan-400 text-xs font-bold transition-colors">goldnoamai@gmail.com</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
