export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getRemainingTime = (lastAction: number, duration: number): number => {
  const now = Math.floor(Date.now() / 1000);
  const endTime = lastAction + duration;
  return Math.max(0, endTime - now);
};