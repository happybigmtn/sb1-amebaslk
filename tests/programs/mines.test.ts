import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { SolanaCasino } from '../target/types/solana_casino';

describe('Mines', () => {
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

  it('Can start a game', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('mines_bet'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .placeMinesBet(
        new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL),
        5, // grid size
        3  // mine count
      )
      .accounts({
        bet: betAccount,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    const bet = await program.account.minesBet.fetch(betAccount);
    assert.equal(bet.gridSize, 5);
    assert.equal(bet.mineCount, 3);
  });

  it('Can reveal cells', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('mines_bet'), player.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .revealCell(0)
      .accounts({
        bet: betAccount,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    const bet = await program.account.minesBet.fetch(betAccount);
    assert(bet.revealedCells[0]);
  });

  it('Can cash out', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('mines_bet'), player.publicKey.toBuffer()],
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

    const bet = await program.account.minesBet.fetch(betAccount);
    assert(bet.settled);
  });
});