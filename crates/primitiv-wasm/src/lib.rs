use wasm_bindgen::prelude::*;
// Import the core logic
use primitiv_core;

// 1. Define the JS-facing object
#[wasm_bindgen]
pub struct ContrastData {
    pub ratio: f32,
    display_ratio: String,
    rating: String,
}

#[wasm_bindgen]
impl ContrastData {
    // This allows JS to access .display_ratio
    #[wasm_bindgen(getter)]
    pub fn display_ratio(&self) -> String {
        self.display_ratio.clone()
    }

    // This allows JS to access .rating
    #[wasm_bindgen(getter)]
    pub fn rating(&self) -> String {
        self.rating.clone()
    }
}

// 2. The Exported Function
#[wasm_bindgen]
pub fn get_contrast_rating(bg: &str, fg: &str) -> ContrastData {
    let result = primitiv_core::get_contrast_rating(bg, fg);

    // Bridge the Core struct to the Wasm struct
    ContrastData {
        ratio: result.ratio,
        display_ratio: result.display_ratio,
        rating: result.rating,
    }
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
