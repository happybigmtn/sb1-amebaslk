import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { SolanaCasino } from '../target/types/solana_casino';

describe('Blackjack', () => {
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

  it('Can join a game', async () => {
    const [gameState] = PublicKey.findProgramAddressSync(
      [Buffer.from('blackjack_state')],
      program.programId
    );

    const [playerState] = PublicKey.findProgramAddressSync(
      [Buffer.from('player_state'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .joinGame(new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL))
      .accounts({
        gameState,
        playerState,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    const state = await program.account.playerState.fetch(playerState);
    assert.equal(state.player.toString(), player.publicKey.toString());
    assert.equal(state.status, 0); // Betting
  });

  it('Can hit and receive a card', async () => {
    const [playerState] = PublicKey.findProgramAddressSync(
      [Buffer.from('player_state'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .hit()
      .accounts({
        playerState,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    const state = await program.account.playerState.fetch(playerState);
    assert(state.cards.length > 0);
  });

  it('Can stand and end turn', async () => {
    const [playerState] = PublicKey.findProgramAddressSync(
      [Buffer.from('player_state'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .stand()
      .accounts({
        playerState,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    const state = await program.account.playerState.fetch(playerState);
    assert.equal(state.status, 2); // Standing
  });
});