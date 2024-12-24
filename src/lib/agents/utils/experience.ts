export const calculateLevel = (experience: number): number => {
  // Level formula: level = floor(sqrt(experience / 100))
  return Math.floor(Math.sqrt(experience / 100));
};

export const getExperienceForNextLevel = (currentLevel: number): number => {
  const nextLevel = currentLevel + 1;
  return nextLevel * nextLevel * 100;
};

export const calculateProgress = (experience: number, currentLevel: number): number => {
  const currentLevelExp = currentLevel * currentLevel * 100;
  const nextLevelExp = getExperienceForNextLevel(currentLevel);
  const levelProgress = experience - currentLevelExp;
  const levelRange = nextLevelExp - currentLevelExp;
  return (levelProgress / levelRange) * 100;
};