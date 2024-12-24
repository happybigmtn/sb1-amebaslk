export const MISSION_TYPES = {
  TRAINING: 0,
  GAMBLING: 1,
  STAKING: 2,
  TRADING: 3
} as const;

export const MISSION_DETAILS = {
  [MISSION_TYPES.TRAINING]: {
    name: 'Training',
    description: 'Learn new skills and gain experience',
    duration: 3600, // 1 hour in seconds
    minLevel: 1,
    expReward: 100
  },
  [MISSION_TYPES.GAMBLING]: {
    name: 'Gambling',
    description: 'Test your luck in the casino',
    duration: 7200, // 2 hours
    minLevel: 2,
    expReward: 250
  },
  [MISSION_TYPES.STAKING]: {
    name: 'Staking',
    description: 'Earn passive rewards',
    duration: 86400, // 24 hours
    minLevel: 3,
    expReward: 500
  },
  [MISSION_TYPES.TRADING]: {
    name: 'Trading',
    description: 'Trade assets on the market',
    duration: 14400, // 4 hours
    minLevel: 4,
    expReward: 350
  }
} as const;