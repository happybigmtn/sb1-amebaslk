use anchor_lang::prelude::*;
use crate::state::blackjack::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct Hit<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        constraint = game.player == player.key(),
        constraint = game.status == BlackjackStatus::Active
    )]
    pub game: Account<'info, BlackjackGame>,
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
}

pub fn hit(ctx: Context<Hit>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    
    // Draw card using VRF
    let card = get_random_card(&ctx.accounts.vrf)?;
    game.player_cards.push(card);
    
    // Calculate new score
    game.player_score = calculate_hand_value(&game.player_cards);
    
    // Check for bust
    if game.player_score > 21 {
        game.status = BlackjackStatus::PlayerBust;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct Stand<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut,
        constraint = game.player == player.key(),
        constraint = game.status == BlackjackStatus::Active
    )]
    pub game: Account<'info, BlackjackGame>,
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
}

pub fn stand(ctx: Context<Stand>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    
    // Dealer draws until 17 or higher
    while game.dealer_score < 17 {
        let card = get_random_card(&ctx.accounts.vrf)?;
        game.dealer_cards.push(card);
        game.dealer_score = calculate_hand_value(&game.dealer_cards);
    }
    
    // Determine winner
    if game.dealer_score > 21 {
        game.status = BlackjackStatus::DealerBust;
    } else if game.dealer_score > game.player_score {
        game.status = BlackjackStatus::DealerWin;
    } else if game.dealer_score < game.player_score {
        game.status = BlackjackStatus::PlayerWin;
    } else {
        game.status = BlackjackStatus::Push;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct Double<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = game.player == player.key(),
        constraint = game.status == BlackjackStatus::Active,
        constraint = game.player_cards.len() == 2
    )]
    pub game: Account<'info, BlackjackGame>,
    pub token_program: Program<'info, Token>,
}

pub fn double(ctx: Context<Double>) -> Result<()> {
    let game = &mut ctx.accounts.game;
    
    // Double the bet
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.player_token_account.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        ),
        game.bet_amount,
    )?;
    
    game.bet_amount *= 2;
    
    // Draw one final card and stand
    let card = get_random_card(&ctx.accounts.vrf)?;
    game.player_cards.push(card);
    game.player_score = calculate_hand_value(&game.player_cards);
    
    if game.player_score > 21 {
        game.status = BlackjackStatus::PlayerBust;
    } else {
        // Continue with dealer's turn
        stand(ctx)?;
    }

    Ok(())
}