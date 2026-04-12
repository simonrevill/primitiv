mod types;

use wasm_bindgen::prelude::*;

use harmoni_core::api::{self, GenerateOptions};
use harmoni_core::ColorInput;

fn to_js_error(e: impl std::fmt::Debug) -> JsError {
    JsError::new(&format!("Invalid color input: {:?}", e))
}

fn palette_to_js(palette_data: harmoni_core::Palette) -> Result<Palette, JsError> {
    let wrapped: Vec<types::Swatch> = palette_data.into_iter().map(Into::into).collect();
    serde_wasm_bindgen::to_value(&wrapped)
        .map(|v| v.unchecked_into())
        .map_err(|e| JsError::new(&e.to_string()))
}

// A Palette is a sequence of Swatches. Tsify emits the Swatch struct
// type automatically via its derive on `types::Swatch`; this custom
// section adds the matching `type Palette = Swatch[]` alias so the
// generated .d.ts exposes the same vocabulary the engine uses.
#[wasm_bindgen(typescript_custom_section)]
const TS_PALETTE: &'static str = r#"
export type Palette = Swatch[];
"#;

#[wasm_bindgen]
extern "C" {
    // Opaque JS handle whose TS type is `Palette` (= Swatch[]).
    // Needed because Vec<T> is not a first-class wasm-abi return type.
    #[wasm_bindgen(typescript_type = "Palette")]
    pub type Palette;
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
) -> Result<Palette, JsError> {
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
) -> Result<Palette, JsError> {
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
pub fn generate_greyscale_oklch() -> Palette {
    let data = api::generate_greyscale();
    let wrapped: Vec<types::Swatch> = data.into_iter().map(Into::into).collect();
    serde_wasm_bindgen::to_value(&wrapped)
        .expect("serializing greyscale palette should never fail")
        .unchecked_into()
}
