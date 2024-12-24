import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { SolanaCasino } from '../target/types/solana_casino';

describe('Crash', () => {
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

  it('Can place a bet', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('crash_bet'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .placeCrashBet(
        new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL),
        new anchor.BN(2 * 100) // 2x auto cashout
      )
      .accounts({
        bet: betAccount,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    const bet = await program.account.crashBet.fetch(betAccount);
    assert.equal(bet.player.toString(), player.publicKey.toString());
    assert.equal(bet.autoExitMultiplier?.toNumber(), 200);
  });

  it('Can cash out', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('crash_bet'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .cashOut()
      .accounts({
        bet: betAccount,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    const bet = await program.account.crashBet.fetch(betAccount);
    assert(bet.exited);
  });
});