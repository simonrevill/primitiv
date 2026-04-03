use wasm_bindgen::prelude::*;
use primitiv_core::{ContrastResult};
use palette::Oklch;

#[wasm_bindgen]
pub fn get_contrast_rating(bg: &str, fg: &str) -> ContrastResult {
    primitiv_core::get_contrast_rating(bg, fg)
}

#[wasm_bindgen]
extern "C" {
    // This tells wasm-bindgen that a type called "Palette" exists in TS
    #[wasm_bindgen(typescript_type = "Palette[]")]
    pub type PaletteArray;
}

fn parse_oklch(s: &str) -> Option<(f32, f32, f32)> {
    let inner = s.trim()
        .strip_prefix("oklch(")?
        .strip_suffix(')')?;

    let nums: Vec<f32> = inner
        .split_whitespace()
        .filter(|&p| p != "/")   // skip optional alpha separator
        .take(3)
        .map(|p| {
            // lightness can be a percentage, e.g. "50%"
            if let Some(pct) = p.strip_suffix('%') {
                pct.parse::<f32>().ok().map(|v| v / 100.0)
            } else {
                p.parse::<f32>().ok()
            }
        })
        .collect::<Option<Vec<_>>>()?;

    if nums.len() == 3 { Some((nums[0], nums[1], nums[2])) } else { None }
}

#[wasm_bindgen]
pub fn generate_palette(oklch: &str) -> Result<PaletteArray, JsError> {
    let (l, c, h) = parse_oklch(oklch)
        .ok_or_else(|| JsError::new(&format!("Invalid oklch string: {oklch}")))?;

    let data = primitiv_core::generate_palette(Oklch::new(l, c, h));

    serde_wasm_bindgen::to_value(&data)
        .map(|v| v.unchecked_into())
        .map_err(|e| JsError::new(&e.to_string()))
}



#[wasm_bindgen]
pub fn generate_greyscale_oklch() -> PaletteArray {
    let data = primitiv_core::generate_greyscale_oklch();

    // We still use serde to do the actual conversion,
    // but we cast it to our "Fake" TS type
    serde_wasm_bindgen::to_value(&data)
        .unwrap()
        .unchecked_into()
}
