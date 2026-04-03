use wasm_bindgen::prelude::*;
use primitiv_core::ContrastResult;

#[wasm_bindgen]
pub fn get_contrast_rating(bg: &str, fg: &str) -> ContrastResult {
    primitiv_core::get_contrast_rating(bg, fg)
}

#[wasm_bindgen]
extern "C" {
    // This tells wasm-bindgen that a type called "OklchStepWithContrast" exists in TS
    #[wasm_bindgen(typescript_type = "OklchStepWithContrast[]")]
    pub type OklchStepWithContrastArray;
}

#[wasm_bindgen]
pub fn generate_greyscale_oklch() -> OklchStepWithContrastArray {
    let data = primitiv_core::generate_greyscale_oklch();

    // We still use serde to do the actual conversion,
    // but we cast it to our "Fake" TS type
    serde_wasm_bindgen::to_value(&data)
        .unwrap()
        .unchecked_into()
}
