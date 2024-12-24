import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { SolanaCasino } from '../target/types/solana_casino';

describe('Roulette', () => {
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

  it('Can place a straight bet', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('roulette_bet'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .placeRouletteBet(0, [17], new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        bet: betAccount,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    const bet = await program.account.rouletteBet.fetch(betAccount);
    assert.equal(bet.player.toString(), player.publicKey.toString());
    assert.equal(bet.numbers[0], 17);
  });

  it('Can place multiple bets', async () => {
    const [betAccount1] = PublicKey.findProgramAddressSync(
      [Buffer.from('roulette_bet_1'), player.publicKey.toBuffer()],
      program.programId
    );

    const [betAccount2] = PublicKey.findProgramAddressSync(
      [Buffer.from('roulette_bet_2'), player.publicKey.toBuffer()],
      program.programId
    );

    await Promise.all([
      program.methods
        .placeRouletteBet(1, [1, 2], new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL))
        .accounts({
          bet: betAccount1,
          player: player.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([player])
        .rpc(),

      program.methods
        .placeRouletteBet(2, [1, 2, 3], new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL))
        .accounts({
          bet: betAccount2,
          player: player.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([player])
        .rpc(),
    ]);

    const [bet1, bet2] = await Promise.all([
      program.account.rouletteBet.fetch(betAccount1),
      program.account.rouletteBet.fetch(betAccount2),
    ]);

    assert.equal(bet1.numbers.length, 2);
    assert.equal(bet2.numbers.length, 3);
  });
});