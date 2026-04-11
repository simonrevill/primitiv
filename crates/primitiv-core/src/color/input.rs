// Color input abstraction — accepts colors in multiple formats and
// normalizes to OkLCH, which is the single internal representation
// used throughout primitiv-core.

use palette::{IntoColor, Oklch, Srgb};

#[derive(Debug, Clone, PartialEq)]
pub enum ColorInput {
    Hex(String),
}

impl ColorInput {
    pub fn to_oklch(&self) -> Oklch {
        match self {
            ColorInput::Hex(s) => {
                let color = csscolorparser::parse(s).unwrap_or_default();
                let srgb = Srgb::new(color.r as f32, color.g as f32, color.b as f32);
                srgb.into_color()
            }
        }
    }
}
