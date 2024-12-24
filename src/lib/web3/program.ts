import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { IDL } from '../idl';

const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export class CasinoProgram {
  private program: Program;

  constructor(connection: Connection, wallet: any) {
    const provider = new AnchorProvider(connection, wallet, {});
    this.program = new Program(IDL, PROGRAM_ID, provider);
  }

  // Blackjack Methods
  async joinBlackjackGame(betAmount: number): Promise<string> {
    const [gameState] = PublicKey.findProgramAddressSync(
      [Buffer.from('blackjack_state')],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .joinGame(new web3.BN(betAmount))
      .accounts({
        gameState,
        player: this.program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  async hit(): Promise<string> {
    const [playerState] = PublicKey.findProgramAddressSync(
      [Buffer.from('player_state'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .hit()
      .accounts({
        playerState,
        player: this.program.provider.publicKey,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  async stand(): Promise<string> {
    const [playerState] = PublicKey.findProgramAddressSync(
      [Buffer.from('player_state'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .stand()
      .accounts({
        playerState,
        player: this.program.provider.publicKey,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  // Roulette Methods
  async placeRouletteBet(betType: number, numbers: number[], amount: number): Promise<string> {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('roulette_bet'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .placeRouletteBet(betType, numbers, new web3.BN(amount))
      .accounts({
        bet: betAccount,
        player: this.program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  // Crash Methods
  async placeCrashBet(amount: number, autoExitMultiplier?: number): Promise<string> {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('crash_bet'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .placeCrashBet(
        new web3.BN(amount),
        autoExitMultiplier ? new web3.BN(autoExitMultiplier) : null
      )
      .accounts({
        bet: betAccount,
        player: this.program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  async crashCashout(): Promise<string> {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('crash_bet'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .cashOut()
      .accounts({
        bet: betAccount,
        player: this.program.provider.publicKey,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  // Keno Methods
  async placeKenoBet(selectedNumbers: number[], amount: number): Promise<string> {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('keno_bet'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .placeKenoBet(selectedNumbers, new web3.BN(amount))
      .accounts({
        bet: betAccount,
        player: this.program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  // Dice Methods
  async placeDiceBet(
    prediction: 'over' | 'under' | 'exact',
    targetValue: number | undefined,
    amount: number
  ): Promise<string> {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('dice_bet'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .placeDiceBet(prediction, targetValue, new web3.BN(amount))
      .accounts({
        bet: betAccount,
        player: this.program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  // HiLo Methods
  async placeHiloBet(amount: number): Promise<string> {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('hilo_bet'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .placeHiloBet(new web3.BN(amount))
      .accounts({
        bet: betAccount,
        player: this.program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  async hiloChoice(choice: 'higher' | 'lower' | 'equal'): Promise<string> {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('hilo_bet'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .makeChoice(choice)
      .accounts({
        bet: betAccount,
        player: this.program.provider.publicKey,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  async hiloCashout(): Promise<string> {
    const [betAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('hilo_bet'), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );

    const tx = await this.program.methods
      .cashOut()
      .accounts({
        bet: betAccount,
        player: this.program.provider.publicKey,
      })
      .transaction();

    return await this.program.provider.sendAndConfirm(tx);
  }

  // Account subscription methods
  onGameStateChange(game: string, callback: (state: any) => void) {
    const accountName = `${game}Game`;
    return this.program.account[accountName].subscribe(callback);
  }

  onPlayerStateChange(game: string, callback: (state: any) => void) {
    const [playerState] = PublicKey.findProgramAddressSync(
      [Buffer.from(`${game}_player`), this.program.provider.publicKey.toBuffer()],
      PROGRAM_ID
    );
    return this.program.account[`${game}Bet`].subscribe(playerState, callback);
  }
}