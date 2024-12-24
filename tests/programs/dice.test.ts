import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { SolanaCasino } from '../target/types/solana_casino';

describe('Dice', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaCasino as Program<SolanaCasino>;
  const player = Keypair.generate();

  before(async () => {
    await provider.connection.requestAirdrop(
      player.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
  });

  it('Can place an over/under bet', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('dice_bet'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .placeDiceBet(
        { over: {} },
        null,
        new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL)
      )
      .accounts({
        bet: betAccount,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    const bet = await program.account.diceBet.fetch(betAccount);
    assert.equal(bet.player.toString(), player.publicKey.toString());
    assert.equal(bet.prediction.over !== undefined, true);
  });

  it('Can place an exact number bet', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('dice_bet_exact'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .placeDiceBet(
        { exact: {} },
        6,
        new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL)
      )
      .accounts({
        bet: betAccount,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    const bet = await program.account.diceBet.fetch(betAccount);
    assert.equal(bet.targetValue, 6);
  });
});