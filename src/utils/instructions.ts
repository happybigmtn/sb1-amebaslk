import { 
  PublicKey, 
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RECENT_BLOCKHASH_PUBKEY
} from '@solana/web3.js';
import { PROGRAM_ID } from '../constants';

export const createJoinGameInstruction = (
  player: PublicKey,
  playerState: PublicKey,
  globalState: PublicKey,
  betAmount: number
): TransactionInstruction => {
  return new TransactionInstruction({
    keys: [
      { pubkey: globalState, isSigner: false, isWritable: true },
      { pubkey: playerState, isSigner: true, isWritable: true },
      { pubkey: player, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from([0, ...new Uint8Array(new Float64Array([betAmount]).buffer)]),
  });
};

export const createHitInstruction = (
  player: PublicKey,
  playerState: PublicKey,
  globalState: PublicKey,
  vrf: PublicKey,
): TransactionInstruction => {
  return new TransactionInstruction({
    keys: [
      { pubkey: globalState, isSigner: false, isWritable: true },
      { pubkey: playerState, isSigner: false, isWritable: true },
      { pubkey: player, isSigner: true, isWritable: false },
      { pubkey: vrf, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_RECENT_BLOCKHASH_PUBKEY, isSigner: false, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from([1]),
  });
};

export const createStandInstruction = (
  player: PublicKey,
  playerState: PublicKey,
  globalState: PublicKey,
): TransactionInstruction => {
  return new TransactionInstruction({
    keys: [
      { pubkey: globalState, isSigner: false, isWritable: true },
      { pubkey: playerState, isSigner: false, isWritable: true },
      { pubkey: player, isSigner: true, isWritable: false },
    ],
    programId: PROGRAM_ID,
    data: Buffer.from([2]),
  });
};