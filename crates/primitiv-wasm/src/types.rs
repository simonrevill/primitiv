// Mirror types that hold the Tsify derives for the wasm boundary.
//
// primitiv-core is a pure Rust library and must not depend on wasm-bindgen
// or tsify. These structs shadow the core types field-for-field, add the
// Tsify derives needed for TypeScript generation + the wasm ABI, and
// expose `From<core::..>` impls so wasm entry points can convert at the
// boundary.

use primitiv_core as core;
use serde::{Deserialize, Serialize};
use tsify::Tsify;

#[derive(Tsify, Debug, Clone, Serialize, Deserialize, PartialEq)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum OklchLabel {
    Number(u16),
    Name(String),
}

impl From<core::OklchLabel> for OklchLabel {
    fn from(value: core::OklchLabel) -> Self {
        match value {
            core::OklchLabel::Number(n) => OklchLabel::Number(n),
            core::OklchLabel::Name(s) => OklchLabel::Name(s),
        }
    }
}

#[derive(Tsify, PartialEq, Debug, Clone, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct OklchStep {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: OklchLabel,
}

impl From<core::OklchStep> for OklchStep {
    fn from(value: core::OklchStep) -> Self {
        OklchStep {
            l: value.l,
            c: value.c,
            h: value.h,
            label: value.label.into(),
        }
    }
}

#[derive(Tsify, PartialEq, Debug, Clone, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct ContrastResult {
    pub ratio: f32,
    pub display_ratio: String,
    pub rating: String,
}

impl From<core::ContrastResult> for ContrastResult {
    fn from(value: core::ContrastResult) -> Self {
        ContrastResult {
            ratio: value.ratio,
            display_ratio: value.display_ratio,
            rating: value.rating,
        }
    }
}

#[derive(Tsify, PartialEq, Debug, Clone, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Palette {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: OklchLabel,
    pub best_foreground: OklchStep,
    pub contrast_result: ContrastResult,
    pub max_recommended_light_padding: f32,
    pub max_recommended_dark_padding: f32,
    pub note: String,
}

impl From<core::Palette> for Palette {
    fn from(value: core::Palette) -> Self {
        Palette {
            l: value.l,
            c: value.c,
            h: value.h,
            label: value.label.into(),
            best_foreground: value.best_foreground.into(),
            contrast_result: value.contrast_result.into(),
            max_recommended_light_padding: value.max_recommended_light_padding,
            max_recommended_dark_padding: value.max_recommended_dark_padding,
            note: value.note,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn oklch_label_number_converts_from_core() {
        let core_label = core::OklchLabel::Number(500);
        let wasm_label: OklchLabel = core_label.into();
        assert_eq!(wasm_label, OklchLabel::Number(500));
    }

    #[test]
    fn oklch_label_name_converts_from_core() {
        let core_label = core::OklchLabel::Name("White".to_string());
        let wasm_label: OklchLabel = core_label.into();
        assert_eq!(wasm_label, OklchLabel::Name("White".to_string()));
    }

    #[test]
    fn oklch_step_converts_from_core_preserving_all_fields() {
        let core_step = core::OklchStep::from_label(0.55, 0.12, 30.0, 500u16);
        let wasm_step: OklchStep = core_step.into();
        assert_eq!(
            wasm_step,
            OklchStep {
                l: 0.55,
                c: 0.12,
                h: 30.0,
                label: OklchLabel::Number(500),
            }
        );
    }

    #[test]
    fn contrast_result_converts_from_core_preserving_all_fields() {
        let core_result = core::ContrastResult {
            ratio: 4.54,
            display_ratio: "4.54:1".to_string(),
            rating: "AA".to_string(),
        };
        let wasm_result: ContrastResult = core_result.into();
        assert_eq!(
            wasm_result,
            ContrastResult {
                ratio: 4.54,
                display_ratio: "4.54:1".to_string(),
                rating: "AA".to_string(),
            }
        );
    }
}
