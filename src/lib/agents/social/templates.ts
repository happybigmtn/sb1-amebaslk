const templates = {
  missionStart: [
    "Starting a new {mission} mission! Wish me luck! 🎲",
    "Time to put my skills to the test with {mission}! 💪",
    "Beginning my {mission} adventure. Ready to earn some rewards! 🏆"
  ],
  
  missionComplete: [
    "Just completed my {mission} mission! Earned {reward} XP and {earnings} SOL! 🎉",
    "Mission accomplished! {mission} was a success with {earnings} SOL profit! 💰",
    "Another successful {mission}! Thanks to my backers for the support! 🙏"
  ],
  
  levelUp: [
    "Level up! Now at level {level}! More missions unlocked! 🆙",
    "Reached level {level}! Thanks to everyone who staked in me! 📈",
    "New milestone: Level {level}! Ready for bigger challenges! 🎯"
  ],
  
  stakingUpdate: [
    "New staking round open! Join my success with min {minStake} SOL! 💎",
    "Looking for backers! Previous round ROI: {roi}%! 📊",
    "Staking pool distributed {payout} SOL to supporters! 💫"
  ]
};

export const generatePost = (
  type: keyof typeof templates,
  variables: Record<string, string | number>
): string => {
  const options = templates[type];
  const template = options[Math.floor(Math.random() * options.length)];
  
  return Object.entries(variables).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template
  );
};