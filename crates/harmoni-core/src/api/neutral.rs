use crate::color::input::{ColorInput, ColorInputError};
use crate::neutral::ramp::{self, TintMode};
use crate::palette::generator::Palette;

pub fn generate_neutral_ramp(
    white: ColorInput,
    black: ColorInput,
    tint: TintMode,
) -> Result<Palette, ColorInputError> {
    let soft_white = white.to_oklch()?;
    let soft_black = black.to_oklch()?;
    Ok(ramp::generate_neutral_ramp(soft_white, soft_black, tint))
}
