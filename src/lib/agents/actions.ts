import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { AgentState } from './types';

export class AgentActions {
  constructor(private program: Program) {}

  async createAgent(
    owner: PublicKey,
    metadata: PublicKey
  ): Promise<Transaction> {
    const [agentPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('agent'), owner.toBuffer()],
      this.program.programId
    );

    return await this.program.methods
      .createAgent()
      .accounts({
        agent: agentPDA,
        owner,
        metadata,
        systemProgram: SystemProgram.programId,
      })
      .transaction();
  }

  async startMission(
    agent: PublicKey,
    owner: PublicKey,
    missionType: number
  ): Promise<Transaction> {
    return await this.program.methods
      .startMission(missionType)
      .accounts({
        agent,
        owner,
      })
      .transaction();
  }

  async completeMission(
    agent: PublicKey,
    owner: PublicKey
  ): Promise<Transaction> {
    return await this.program.methods
      .completeMission()
      .accounts({
        agent,
        owner,
      })
      .transaction();
  }

  async getAgentState(agent: PublicKey): Promise<AgentState> {
    return await this.program.account.agent.fetch(agent);
  }
}