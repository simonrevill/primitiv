// Color input abstraction — accepts colors in multiple formats and
// normalizes to OkLCH, which is the single internal representation
// used throughout harmoni-core.

use palette::{encoding, Hsl, IntoColor, Oklch, Srgb};

#[derive(Debug, Clone, PartialEq)]
pub enum ColorInput {
    /// Any CSS-parseable color string: hex (`#ff0000`), `rgb(...)`,
    /// `hsl(...)`, `oklch(...)`, named colors, etc.
    Css(String),
    Rgb { r: u8, g: u8, b: u8 },
    Hsl { h: f32, s: f32, l: f32 },
    Oklch { l: f32, c: f32, h: f32 },
}

#[derive(Debug, Clone, PartialEq)]
pub enum ColorInputError {
    InvalidCss(String),
}

impl ColorInput {
    pub fn to_oklch(&self) -> Result<Oklch, ColorInputError> {
        match self {
            ColorInput::Css(s) => parse_css(s),
            ColorInput::Rgb { r, g, b } => Ok(rgb_to_oklch(*r, *g, *b)),
            ColorInput::Hsl { h, s, l } => Ok(hsl_to_oklch(*h, *s, *l)),
            ColorInput::Oklch { l, c, h } => Ok(Oklch::new(*l, *c, *h)),
        }
    }
}

fn parse_css(s: &str) -> Result<Oklch, ColorInputError> {
    let color = csscolorparser::parse(s).map_err(|_| ColorInputError::InvalidCss(s.to_string()))?;
    let srgb = Srgb::new(color.r as f32, color.g as f32, color.b as f32);
    Ok(srgb.into_color())
}

fn rgb_to_oklch(r: u8, g: u8, b: u8) -> Oklch {
    let srgb = Srgb::new(
        f32::from(r) / 255.0,
        f32::from(g) / 255.0,
        f32::from(b) / 255.0,
    );
    srgb.into_color()
}

fn hsl_to_oklch(h: f32, s: f32, l: f32) -> Oklch {
    let hsl: Hsl<encoding::Srgb, f32> = Hsl::new(h, s, l);
    hsl.into_color()
}
