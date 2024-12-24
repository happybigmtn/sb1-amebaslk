export interface SocialPost {
  id: string;
  platform: 'twitter' | 'discord';
  content: string;
  timestamp: number;
  engagement: {
    likes: number;
    replies: number;
    shares: number;
  };
}

export interface StakeInfo {
  staker: string;
  amount: number;
  timestamp: number;
  share: number;
}

export interface AgentPerformance {
  totalWinnings: number;
  totalStaked: number;
  stakersCount: number;
  winRate: number;
  lastPayout: number;
}