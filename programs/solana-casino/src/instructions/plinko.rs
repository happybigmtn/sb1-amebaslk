use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use crate::state::plinko::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct PlacePlinkoBet<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = player,
        space = PlinkoBet::space()
    )]
    pub bet: Account<'info, PlinkoBet>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn place_plinko_bet(
    ctx: Context<PlacePlinkoBet>, 
    amount: u64,
    risk_level: RiskLevel
) -> Result<()> {
    require!(amount > 0, CasinoError::InvalidBetAmount);
    
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
    bet.risk_level = risk_level;
    bet.timestamp = Clock::get()?.unix_timestamp;
    bet.settled = false;

    Ok(())
}

#[derive(Accounts)]
pub struct DropBall<'info> {
    #[account(mut)]
    pub game: Account<'info, PlinkoGame>,
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
    /// CHECK: Verified in VRF logic
    pub switchboard_program: AccountInfo<'info>,
}

pub fn drop_ball(ctx: Context<DropBall>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    let clock = Clock::get()?;
    
    require!(
        clock.slot >= game.next_drop_block,
        CasinoError::ActionWindowNotExpired
    );

    // Generate random path using VRF
    let random_bytes = get_random_bytes(&ctx.accounts.vrf)?;
    let directions = generate_path(random_bytes);
    
    // Calculate multiplier based on path
    let multiplier = calculate_multiplier(&directions);
    
    game.current_ball = Some(PlinkoPath {
        directions,
        multiplier,
        settled: false
    });
    
    // Set next drop block
    game.next_drop_block = clock.slot + 15;

    Ok(())
}

fn generate_path(random_bytes: [u8; 32]) -> Vec<bool> {
    let mut directions = Vec::with_capacity(16);
    for i in 0..16 {
        let byte = random_bytes[i / 8];
        let bit = (byte >> (i % 8)) & 1;
        directions.push(bit == 1);
    }
    directions
}

fn calculate_multiplier(directions: &[bool]) -> u64 {
    // Count right moves to determine final position
    let rights = directions.iter().filter(|&&x| x).count();
    
    // Multiplier table based on position
    match rights {
        0 => 88,
        1 => 44,
        2 => 22,
        3 => 11,
        4..=12 => 5,
        13 => 11,
        14 => 22,
        15 => 44,
        16 => 88,
        _ => unreachable!()
    }
}