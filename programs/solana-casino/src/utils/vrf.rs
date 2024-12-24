use anchor_lang::prelude::*;
use switchboard_v2::{VrfAccountData, VrfRequestRandomness};

pub fn request_randomness(
    vrf: &AccountInfo,
    authority: &AccountInfo,
    switchboard_program: &AccountInfo,
    payer: &AccountInfo,
    recent_blockhash: &AccountInfo,
) -> Result<()> {
    let vrf_account = VrfAccountData::new(vrf)?;
    let request_randomness = VrfRequestRandomness {
        vrf,
        authority,
        switchboard_program,
        payer,
        recent_blockhash,
    };

    request_randomness.invoke()?;
    Ok(())
}

pub fn get_random_card(vrf_account: &AccountInfo) -> Result<u8> {
    let vrf = VrfAccountData::new(vrf_account)?;
    let result_buffer = vrf.get_result()?;
    let value = result_buffer.iter().fold(0u32, |acc, x| acc.wrapping_add(*x as u32));
    
    // Map the random value to a card (0-51)
    Ok((value % 52) as u8)
}