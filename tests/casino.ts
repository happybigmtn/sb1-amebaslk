import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { SolanaCasino } from '../target/types/solana_casino';

describe('Solana Casino', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaCasino as Program<SolanaCasino>;
  const player = Keypair.generate();

  before(async () => {
    // Fund player account
    await provider.connection.requestAirdrop(
      player.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
  });

  describe('Blackjack', () => {
    it('Can start a game', async () => {
      const [game] = PublicKey.findProgramAddressSync(
        [Buffer.from('blackjack'), player.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .startBlackjack(new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL))
        .accounts({
          player: player.publicKey,
          game,
          systemProgram: SystemProgram.programId,
        })
        .signers([player])
        .rpc();

      const gameState = await program.account.blackjackGame.fetch(game);
      assert.equal(gameState.player.toString(), player.publicKey.toString());
      assert.equal(gameState.status, 0); // Active
    });

    it('Can hit and stand', async () => {
      // Test hit and stand actions
    });
  });

  describe('Roulette', () => {
    it('Can place bets', async () => {
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from('roulette'), player.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .placeRouletteBet(0, [17], new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL))
        .accounts({
          player: player.publicKey,
          bet,
          systemProgram: SystemProgram.programId,
        })
        .signers([player])
        .rpc();

      const betState = await program.account.rouletteBet.fetch(bet);
      assert.equal(betState.player.toString(), player.publicKey.toString());
      assert.equal(betState.numbers[0], 17);
    });

    it('Can spin and settle', async () => {
      // Test spin and settlement
    });
  });
});