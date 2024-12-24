import { Connection, Commitment } from '@solana/web3.js';

const rpcUrl = 'http://localhost:8899';
const commitment: Commitment = 'confirmed';

export const getConnection = () => {
  return new Connection(rpcUrl, {
    commitment,
    wsEndpoint: rpcUrl.replace('http', 'ws')
  });
};