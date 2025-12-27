
export type PlayerType = 'player1' | 'player2' | 'computer';
export type GameMode = 'PvC' | 'PvP';
export type Orientation = 'H' | 'V';

export interface Ship {
  id: string;
  name: string;
  size: number;
  placed: boolean;
  orientation: Orientation;
  positions: number[]; // Grid indices
  hits: number[];
}

export interface CellState {
  index: number;
  hasShip: boolean;
  isHit: boolean;
  isMiss: boolean;
  shipId: string | null;
}

export type GameStatus = 'setup' | 'playing' | 'gameOver';

export interface GameSettings {
  mode: GameMode;
  isTimed: boolean;
  turnLimit: number; // Seconds
  isMuted: boolean;
}
