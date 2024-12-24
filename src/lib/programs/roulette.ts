import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { IDL } from './idl';

const PROGRAM_ID = new PublicKey('RouletteXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

export const getRouletteProgram = (connection: Connection) => {
  const provider = new AnchorProvider(connection, window.solana, {});
  return new Program(IDL, PROGRAM_ID, provider);
};