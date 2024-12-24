import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAgentProgram } from '../lib/agents/program';
import { AgentActions } from '../lib/agents/actions';
import { AgentState } from '../lib/agents/types';

export const useAgent = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [agent, setAgent] = useState<AgentState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = getAgentProgram(connection, wallet);
  const actions = new AgentActions(program);

  useEffect(() => {
    if (wallet.publicKey) {
      loadAgent();
    }
  }, [wallet.publicKey]);

  const loadAgent = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);
    try {
      const [agentPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('agent'), wallet.publicKey.toBuffer()],
        program.programId
      );
      
      const agentState = await actions.getAgentState(agentPDA);
      setAgent(agentState);
    } catch (err) {
      setError('Failed to load agent');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (metadata: PublicKey) => {
    if (!wallet.publicKey || !wallet.signTransaction) return;

    setLoading(true);
    try {
      const tx = await actions.createAgent(wallet.publicKey, metadata);
      const signedTx = await wallet.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature);
      await loadAgent();
    } catch (err) {
      setError('Failed to create agent');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startMission = async (missionType: number) => {
    if (!wallet.publicKey || !wallet.signTransaction || !agent) return;

    setLoading(true);
    try {
      const [agentPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('agent'), wallet.publicKey.toBuffer()],
        program.programId
      );

      const tx = await actions.startMission(agentPDA, wallet.publicKey, missionType);
      const signedTx = await wallet.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature);
      await loadAgent();
    } catch (err) {
      setError('Failed to start mission');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    agent,
    loading,
    error,
    createAgent,
    startMission,
    loadAgent
  };
};