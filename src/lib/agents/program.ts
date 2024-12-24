import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { IDL } from './idl';

const PROGRAM_ID = new PublicKey('AgentKitXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

export const getAgentProgram = (connection: Connection, wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, {});
  return new Program(IDL, PROGRAM_ID, provider);
};