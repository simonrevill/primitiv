// Color input abstraction — accepts colors in multiple formats and
// normalizes to OkLCH, which is the single internal representation
// used throughout primitiv-core.

use palette::{IntoColor, Oklch, Srgb};

#[derive(Debug, Clone, PartialEq)]
pub enum ColorInput {
    Hex(String),
}

#[derive(Debug, Clone, PartialEq)]
pub enum ColorInputError {
    InvalidHex(String),
}

impl ColorInput {
    pub fn to_oklch(&self) -> Result<Oklch, ColorInputError> {
        match self {
            ColorInput::Hex(s) => parse_hex(s),
        }
    }
}

fn parse_hex(s: &str) -> Result<Oklch, ColorInputError> {
    let color = csscolorparser::parse(s).map_err(|_| ColorInputError::InvalidHex(s.to_string()))?;
    let srgb = Srgb::new(color.r as f32, color.g as f32, color.b as f32);
    Ok(srgb.into_color())
}
