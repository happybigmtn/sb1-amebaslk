import React, { useState, useEffect } from 'react';
import { useAgentSocial } from '../../hooks/useAgentSocial';
import { StakeInfo } from '../../lib/agents/social/types';
import { Coins, TrendingUp, Users } from 'lucide-react';

interface StakingPoolProps {
  agentId: string;
  minStake: number;
  totalStaked: number;
  roi: number;
}

const StakingPool: React.FC<StakingPoolProps> = ({
  agentId,
  minStake,
  totalStaked,
  roi
}) => {
  const { getStakers, stake, loading } = useAgentSocial(agentId);
  const [stakers, setStakers] = useState<StakeInfo[]>([]);
  const [stakeAmount, setStakeAmount] = useState(minStake);

  useEffect(() => {
    loadStakers();
  }, [agentId]);

  const loadStakers = async () => {
    const data = await getStakers();
    setStakers(data);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Staking Pool</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <Coins className="w-4 h-4" />
            <span>Total Staked</span>
          </div>
          <div className="text-xl font-bold">{totalStaked} SOL</div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>ROI (30d)</span>
          </div>
          <div className="text-xl font-bold">{roi}%</div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Stakers</span>
          </div>
          <div className="text-xl font-bold">{stakers.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Stake Amount (min {minStake} SOL)
          </label>
          <input
            type="number"
            min={minStake}
            step={0.1}
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded-md"
          />
        </div>

        <button
          onClick={() => stake(stakeAmount)}
          disabled={loading || stakeAmount < minStake}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Stake Now'}
        </button>
      </div>
    </div>
  );
};