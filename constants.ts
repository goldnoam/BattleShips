
import { Ship } from './types';

export const GRID_SIZE = 10;
export const TURN_TIME_LIMIT = 15; // 15 seconds per turn in timed mode

export const SHIPS_TEMPLATE: Omit<Ship, 'placed' | 'orientation' | 'positions' | 'hits'>[] = [
  { id: 'carrier', name: 'נושאת מטוסים', size: 5 },
  { id: 'battleship', name: 'משחתת', size: 4 },
  { id: 'cruiser', name: 'סיירת', size: 3 },
  { id: 'submarine', name: 'צוללת', size: 3 },
  { id: 'destroyer', name: 'ספינת טורפדו', size: 2 },
];
