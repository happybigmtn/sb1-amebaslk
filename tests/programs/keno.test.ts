import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { assert } from 'chai';
import { SolanaCasino } from '../target/types/solana_casino';

describe('Keno', () => {
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

  it('Can place a bet with selected numbers', async () => {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('keno_bet'), player.publicKey.toBuffer()],
      program.programId
    );

    const selectedNumbers = [1, 5, 10, 15, 20];
    await program.methods
      .placeKenoBet(
        selectedNumbers,
        new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL)
      )
      .accounts({
        bet: betAccount,
        player: player.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player])
      .rpc();

    const bet = await program.account.kenoBet.fetch(betAccount);
    assert.equal(bet.player.toString(), player.publicKey.toString());
    assert.deepEqual(bet.selectedNumbers, selectedNumbers);
  });
});