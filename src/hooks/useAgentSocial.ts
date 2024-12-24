import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { generatePost } from '../lib/agents/social/templates';
import { SocialPost, StakeInfo } from '../lib/agents/social/types';
import { supabase } from '../lib/supabase';

export const useAgentSocial = (agentId: string) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);

  const getPosts = async (): Promise<SocialPost[]> => {
    const { data, error } = await supabase
      .from('agent_posts')
      .select('*')
      .eq('agent_id', agentId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  };

  const createPost = async (
    type: 'missionStart' | 'missionComplete' | 'levelUp' | 'stakingUpdate',
    variables: Record<string, string | number>
  ) => {
    if (!publicKey) return;
    
    const content = generatePost(type, variables);
    
    const { error } = await supabase
      .from('agent_posts')
      .insert({
        agent_id: agentId,
        content,
        platform: 'twitter',
        timestamp: Date.now(),
        engagement: { likes: 0, replies: 0, shares: 0 }
      });

    if (error) throw error;
  };

  const getStakers = async (): Promise<StakeInfo[]> => {
    const { data, error } = await supabase
      .from('agent_stakes')
      .select('*')
      .eq('agent_id', agentId);

    if (error) throw error;
    return data;
  };

  const stake = async (amount: number) => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      // Create staking transaction
      const { error } = await supabase
        .from('agent_stakes')
        .insert({
          agent_id: agentId,
          staker: publicKey.toString(),
          amount,
          timestamp: Date.now(),
          share: 0 // Will be calculated by backend
        });

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    getPosts,
    createPost,
    getStakers,
    stake,
    loading
  };
};