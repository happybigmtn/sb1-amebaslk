use anchor_lang::prelude::*;
use crate::state::global_blackjack::*;
use crate::utils::vrf::*;
use crate::errors::CasinoError;

#[derive(Accounts)]
pub struct DrawCard<'info> {
    #[account(mut)]
    pub global_state: Account<'info, GlobalBlackjackState>,
    /// CHECK: Verified in VRF logic
    pub vrf: AccountInfo<'info>,
    /// CHECK: Verified in VRF logic
    pub authority: AccountInfo<'info>,
    /// CHECK: Verified in VRF logic
    pub switchboard_program: AccountInfo<'info>,
    /// CHECK: Verified in VRF logic
    pub payer: AccountInfo<'info>,
    /// CHECK: Verified in VRF logic
    pub recent_blockhash: AccountInfo<'info>,
}

pub fn draw_card(ctx: Context<DrawCard>) -> Result<()> {
    let global_state = &mut ctx.accounts.global_state;
    
    // Request new randomness
    request_randomness(
        &ctx.accounts.vrf,
        &ctx.accounts.authority,
        &ctx.accounts.switchboard_program,
        &ctx.accounts.payer,
        &ctx.accounts.recent_blockhash,
    )?;

    // Get random card using VRF result
    let card = get_random_card(&ctx.accounts.vrf)?;
    
    // Add card to dealer's hand
    global_state.dealer_cards.push(card);
    
    // Update dealer's score
    global_state.dealer_score = calculate_hand_value(&global_state.dealer_cards);
    
    Ok(())
}