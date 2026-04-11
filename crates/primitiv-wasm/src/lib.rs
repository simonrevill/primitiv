mod types;

use wasm_bindgen::prelude::*;

use primitiv_core::api::{self, GenerateOptions};
use primitiv_core::ColorInput;

fn to_js_error(e: impl std::fmt::Debug) -> JsError {
    JsError::new(&format!("Invalid color input: {:?}", e))
}

fn palette_to_js(
    palette_data: Vec<primitiv_core::Palette>,
) -> Result<PaletteArray, JsError> {
    let wrapped: Vec<types::Palette> = palette_data.into_iter().map(Into::into).collect();
    serde_wasm_bindgen::to_value(&wrapped)
        .map(|v| v.unchecked_into())
        .map_err(|e| JsError::new(&e.to_string()))
}

#[wasm_bindgen]
extern "C" {
    // This tells wasm-bindgen that a type called "Palette" exists in TS
    #[wasm_bindgen(typescript_type = "Palette[]")]
    pub type PaletteArray;
}

#[wasm_bindgen]
pub fn get_contrast_rating(bg: &str, fg: &str) -> Result<types::ContrastResult, JsError> {
    api::audit_contrast(
        ColorInput::Css(bg.to_string()),
        ColorInput::Css(fg.to_string()),
    )
    .map(Into::into)
    .map_err(to_js_error)
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

    palette_to_js(palette_data)
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

    palette_to_js(palette_data)
}

#[wasm_bindgen]
pub fn generate_greyscale_oklch() -> PaletteArray {
    let data = api::generate_greyscale();
    let wrapped: Vec<types::Palette> = data.into_iter().map(Into::into).collect();
    serde_wasm_bindgen::to_value(&wrapped)
        .expect("serializing greyscale palette should never fail")
        .unchecked_into()
}
