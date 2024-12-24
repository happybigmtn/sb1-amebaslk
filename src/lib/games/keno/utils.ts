// Add to existing utils.ts
export const generateQuickPick = (count: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * 80) + 1);
  }
  return Array.from(numbers);
};