import { HOUSE_EDGE_MULTIPLIER, MIN_CRASH_POINT } from './constants';

export const generateCrashPoint = (randomValue: number): number => {
  const e = 2 ** 32;
  const h = HOUSE_EDGE_MULTIPLIER;
  
  return Math.max(
    MIN_CRASH_POINT,
    Math.floor(100 * h / (1 - randomValue / e)) / 100
  );
};

export const calculateMultiplier = (
  startTime: number,
  currentTime: number
): number => {
  const elapsed = (currentTime - startTime) / 1000;
  return Math.floor(100 * Math.pow(Math.E, 0.06 * elapsed)) / 100;
};

export const formatMultiplier = (multiplier: number): string => {
  return `${multiplier.toFixed(2)}x`;
};