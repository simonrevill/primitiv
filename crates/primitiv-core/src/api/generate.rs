// Palette generation entry points for adapters.

use crate::color::input::{ColorInput, ColorInputError};
use crate::palette::generator::{generate_palette, Palette};

#[derive(Debug, Clone, Default, PartialEq)]
pub struct GenerateOptions {
    pub light_padding: f32,
    pub dark_padding: f32,
}

pub fn generate(input: ColorInput) -> Result<Vec<Palette>, ColorInputError> {
    generate_with_options(input, GenerateOptions::default())
}

pub fn generate_with_options(
    input: ColorInput,
    options: GenerateOptions,
) -> Result<Vec<Palette>, ColorInputError> {
    let oklch = input.to_oklch()?;
    Ok(generate_palette(
        oklch,
        options.light_padding,
        options.dark_padding,
    ))
}
