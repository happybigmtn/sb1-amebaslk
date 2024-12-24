import { MULTIPLIERS } from './constants';

export const calculateMultiplier = (
  mineCount: number,
  revealedCount: number
): number => {
  if (!MULTIPLIERS[mineCount] || revealedCount >= MULTIPLIERS[mineCount].length) {
    return 0;
  }
  return MULTIPLIERS[mineCount][revealedCount];
};

export const generateMineLocations = (
  gridSize: number,
  mineCount: number,
  firstClick: number
): number[] => {
  const totalCells = gridSize * gridSize;
  const mineLocations = new Set<number>();
  
  // Ensure first click is safe
  const availableCells = Array.from(
    { length: totalCells }, 
    (_, i) => i
  ).filter(i => i !== firstClick);

  while (mineLocations.size < mineCount) {
    const index = Math.floor(Math.random() * availableCells.length);
    mineLocations.add(availableCells[index]);
    availableCells.splice(index, 1);
  }

  return Array.from(mineLocations).sort((a, b) => a - b);
};

export const isMine = (
  cell: number,
  mineLocations: number[]
): boolean => {
  return mineLocations.includes(cell);
};