use wasm_bindgen::prelude::*;

use primitiv_core::api::{self, GenerateOptions};
use primitiv_core::{ColorInput, ContrastResult};

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

fn to_js_error(e: impl std::fmt::Debug) -> JsError {
    JsError::new(&format!("Invalid color input: {:?}", e))
}

fn palette_to_js(
    palette_data: &[primitiv_core::Palette],
) -> Result<PaletteArray, JsError> {
    serde_wasm_bindgen::to_value(palette_data)
        .map(|v| v.unchecked_into())
        .map_err(|e| JsError::new(&e.to_string()))
}

#[wasm_bindgen]
pub fn generate_palette(
    hex: &str,
    light_padding: f32,
    dark_padding: f32,
) -> Result<PaletteArray, JsError> {
    let palette_data = api::generate_with_options(
        ColorInput::Css(hex.to_string()),
        GenerateOptions {
            light_padding,
            dark_padding,
        },
    )
    .map_err(to_js_error)?;

    palette_to_js(&palette_data)
}

#[wasm_bindgen]
pub fn generate_palette_with_light_padding(
    hex: &str,
    light_padding: f32,
) -> Result<PaletteArray, JsError> {
    let palette_data = api::generate_with_options(
        ColorInput::Css(hex.to_string()),
        GenerateOptions {
            light_padding,
            dark_padding: 0.0,
        },
    )
    .map_err(to_js_error)?;

    palette_to_js(&palette_data)
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
