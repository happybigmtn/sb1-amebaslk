import { SpinResult } from './types';

export const getHotNumbers = (history: SpinResult[], limit = 5): number[] => {
  const frequency: Record<number, number> = {};
  history.forEach(result => {
    frequency[result.number] = (frequency[result.number] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([num]) => parseInt(num));
};

export const getColdNumbers = (history: SpinResult[], limit = 5): number[] => {
  const frequency: Record<number, number> = {};
  // Initialize all numbers with 0
  for (let i = 0; i <= 36; i++) {
    frequency[i] = 0;
  }
  
  history.forEach(result => {
    frequency[result.number]++;
  });
  
  return Object.entries(frequency)
    .sort(([, a], [, b]) => a - b)
    .slice(0, limit)
    .map(([num]) => parseInt(num));
};