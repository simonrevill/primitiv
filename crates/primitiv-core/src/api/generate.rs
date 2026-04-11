// Palette generation entry points for adapters.

use crate::color::input::{ColorInput, ColorInputError};
use crate::palette::generator::{generate_palette, Palette};

pub fn generate(input: ColorInput) -> Result<Vec<Palette>, ColorInputError> {
    let oklch = input.to_oklch()?;
    Ok(generate_palette(oklch, 0.0, 0.0))
}
