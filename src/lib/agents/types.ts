import { PublicKey } from '@solana/web3.js';

export interface AgentMetadata {
  name: string;
  description: string;
  image: string;
  attributes: AgentAttribute[];
}

export interface AgentAttribute {
  trait_type: string;
  value: string | number;
}

export interface AgentState {
  owner: PublicKey;
  metadata: PublicKey;
  lastAction: number;
  experience: number;
  level: number;
  status: AgentStatus;
}

export enum AgentStatus {
  Idle = 0,
  Training = 1,
  OnMission = 2,
  Cooldown = 3
}