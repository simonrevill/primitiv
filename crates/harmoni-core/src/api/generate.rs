// Palette generation entry points for adapters.

use crate::color::input::{ColorInput, ColorInputError};
use crate::palette::generator::{generate_palette, generate_palette_with_scale, Palette, TARGET_CHROMA_SCALE, validate_lightness_curve};

#[derive(Debug, Clone, Default, PartialEq)]
pub struct GenerateOptions {
    pub light_padding: f32,
    pub dark_padding: f32,
}

pub fn generate(input: ColorInput) -> Result<Palette, ColorInputError> {
    generate_with_options(input, GenerateOptions::default())
}

pub fn generate_with_options(
    input: ColorInput,
    options: GenerateOptions,
) -> Result<Palette, ColorInputError> {
    let oklch = input.to_oklch()?;
    Ok(generate_palette(
        oklch,
        options.light_padding,
        options.dark_padding,
    ))
}

pub fn generate_with_lightness(
    input: ColorInput,
    lightness: [f32; 10],
    options: GenerateOptions,
) -> Result<Palette, ColorInputError> {
    // Validate lightness curve before processing
    validate_lightness_curve(lightness)
        .map_err(|e| ColorInputError::InvalidCss(e))?;

    let oklch = input.to_oklch()?;
    Ok(generate_palette_with_scale(
        oklch,
        &lightness,
        &TARGET_CHROMA_SCALE,
        options.light_padding,
        options.dark_padding,
    ))
}
