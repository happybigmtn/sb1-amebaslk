use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::mines::*;
use crate::errors::CasinoError;
use crate::utils::vrf::*;

#[derive(Accounts)]
pub struct InitializeMines<'info> {
    #[account(
        init,
        payer = authority,
        space = MinesGame::SPACE
    )]
    pub game: Account<'info, MinesGame>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceMinesBet<'info> {
    #[account(mut)]
    pub game: Account<'info, MinesGame>,
    #[account(
        init,
        payer = player,
        space = MinesBet::SPACE
    )]
    pub bet: Account<'info, MinesBet>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevealCell<'info> {
    #[account(mut)]
    pub game: Account<'info, MinesGame>,
    #[account(
        mut,
        constraint = bet.player == player.key(),
        constraint = !bet.settled
    )]
    pub bet: Account<'info, MinesBet>,
    #[account(mut)]
    pub player: Signer<'info>,
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CashOut<'info> {
    #[account(mut)]
    pub game: Account<'info, MinesGame>,
    #[account(
        mut,
        constraint = bet.player == player.key(),
        constraint = !bet.settled,
        close = player
    )]
    pub bet: Account<'info, MinesBet>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

pub fn initialize_mines(ctx: Context<InitializeMines>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let clock = Clock::get()?;
    
    game.start_block = clock.slot;
    game.next_round_block = clock.slot + ROUND_SPACING;
    game.total_bets = 0;
    game.total_players = 0;

    Ok(())
}

pub fn place_mines_bet(
    ctx: Context<PlaceMinesBet>,
    amount: u64,
    grid_size: u8,
    mine_count: u8
) -> Result<()> {
    require!(amount >= MIN_BET && amount <= MAX_BET, CasinoError::InvalidBetAmount);
    require!(
        grid_size >= 5 && grid_size <= 7 && 
        mine_count >= 1 && mine_count <= 24,
        CasinoError::InvalidBetAmount
    );

    // Transfer tokens to treasury
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.player_token_account.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        ),
        amount,
    )?;

    let bet = &mut ctx.accounts.bet;
    bet.player = ctx.accounts.player.key();
    bet.amount = amount;
    bet.grid_size = grid_size;
    bet.mine_count = mine_count;
    bet.revealed_cells = vec![false; (grid_size * grid_size) as usize];
    bet.timestamp = Clock::get()?.unix_timestamp;
    bet.settled = false;

    Ok(())
}

pub fn reveal_cell(
    ctx: Context<RevealCell>,
    cell_index: u8
) -> Result<()> {
    let bet = &mut ctx.accounts.bet;
    require!(!bet.revealed_cells[cell_index as usize], CasinoError::InvalidGameState);

    // Generate mine locations on first reveal
    if bet.mine_locations.is_empty() {
        let random_bytes = get_random_bytes(&ctx.accounts.vrf)?;
        bet.mine_locations = generate_mine_locations(
            bet.grid_size,
            bet.mine_count,
            cell_index,
            random_bytes
        );
    }

    bet.revealed_cells[cell_index as usize] = true;

    // Check if mine hit
    if bet.mine_locations.contains(&cell_index) {
        bet.settled = true;
    }

    Ok(())
}

pub fn cash_out(ctx: Context<CashOut>) -> Result<()> {
    let bet = &ctx.accounts.bet;
    let revealed_count = bet.revealed_cells.iter().filter(|&&x| x).count();
    
    let multiplier = calculate_multiplier(
        bet.mine_count as usize,
        revealed_count
    );

    let payout = bet.amount
        .checked_mul(multiplier)
        .ok_or(CasinoError::Overflow)?;

    // Transfer winnings
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.treasury.to_account_info(),
                to: ctx.accounts.player_token_account.to_account_info(),
                authority: ctx.accounts.game.to_account_info(),
            },
            &[&[b"mines", &[bump]]],
        ),
        payout,
    )?;

    bet.settled = true;

    Ok(())
}