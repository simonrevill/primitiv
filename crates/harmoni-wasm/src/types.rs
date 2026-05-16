// Mirror types that hold the Tsify derives for the wasm boundary.
//
// harmoni-core is a pure Rust library and must not depend on wasm-bindgen
// or tsify. These structs shadow the core types field-for-field, add the
// Tsify derives needed for TypeScript generation + the wasm ABI, and
// expose `From<core::..>` impls so wasm entry points can convert at the
// boundary.

use harmoni_core as core;
use serde::{Deserialize, Serialize};
use tsify::Tsify;

#[derive(Tsify, Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Default)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum TintMode {
    #[default]
    Inherit,
    Achromatic,
}

impl From<core::TintMode> for TintMode {
    fn from(value: core::TintMode) -> Self {
        match value {
            core::TintMode::Inherit => TintMode::Inherit,
            core::TintMode::Achromatic => TintMode::Achromatic,
        }
    }
}

impl From<TintMode> for core::TintMode {
    fn from(value: TintMode) -> Self {
        match value {
            TintMode::Inherit => core::TintMode::Inherit,
            TintMode::Achromatic => core::TintMode::Achromatic,
        }
    }
}

#[derive(Tsify, Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct OklchTriple {
    pub l: f32,
    pub c: f32,
    pub h: f32,
}

#[derive(Tsify, Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct SoftNeutrals {
    pub white: OklchTriple,
    pub black: OklchTriple,
}

impl From<core::SoftNeutrals> for SoftNeutrals {
    fn from(value: core::SoftNeutrals) -> Self {
        SoftNeutrals {
            white: OklchTriple {
                l: value.white.l,
                c: value.white.chroma,
                h: value.white.hue.into_degrees(),
            },
            black: OklchTriple {
                l: value.black.l,
                c: value.black.chroma,
                h: value.black.hue.into_degrees(),
            },
        }
    }
}

#[derive(Tsify, Debug, Clone, Serialize, Deserialize, PartialEq)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum SwatchLabel {
    Number(u16),
    Name(String),
}

impl From<core::SwatchLabel> for SwatchLabel {
    fn from(value: core::SwatchLabel) -> Self {
        match value {
            core::SwatchLabel::Number(n) => SwatchLabel::Number(n),
            core::SwatchLabel::Name(s) => SwatchLabel::Name(s),
        }
    }
}

#[derive(Tsify, PartialEq, Debug, Clone, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct SwatchStep {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: SwatchLabel,
}

impl From<core::SwatchStep> for SwatchStep {
    fn from(value: core::SwatchStep) -> Self {
        SwatchStep {
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
pub struct Swatch {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: SwatchLabel,
    pub best_foreground: SwatchStep,
    pub contrast_result: ContrastResult,
}

impl From<core::Swatch> for Swatch {
    fn from(value: core::Swatch) -> Self {
        Swatch {
            l: value.l,
            c: value.c,
            h: value.h,
            label: value.label.into(),
            best_foreground: value.best_foreground.into(),
            contrast_result: value.contrast_result.into(),
        }
    }
}

#[derive(Tsify, Debug, Clone, Serialize, Deserialize, PartialEq)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Palette {
    pub swatches: Vec<Swatch>,
    pub lightness_curve: [f32; 10],
    pub max_recommended_light_padding: f32,
    pub max_recommended_dark_padding: f32,
    pub note: String,
}

impl From<core::Palette> for Palette {
    fn from(value: core::Palette) -> Self {
        Palette {
            swatches: value.swatches.into_iter().map(Into::into).collect(),
            lightness_curve: value.lightness_curve,
            max_recommended_light_padding: value.max_recommended_light_padding,
            max_recommended_dark_padding: value.max_recommended_dark_padding,
            note: value.note,
        }
    }
}

#[derive(Tsify, Debug, Clone, Serialize, Deserialize, PartialEq)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct PaletteSet {
    pub light: Palette,
    pub dark: Palette,
}

impl From<core::PaletteSet> for PaletteSet {
    fn from(value: core::PaletteSet) -> Self {
        PaletteSet {
            light: value.light.into(),
            dark: value.dark.into(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn swatch_label_number_converts_from_core() {
        let core_label = core::SwatchLabel::Number(500);
        let wasm_label: SwatchLabel = core_label.into();
        assert_eq!(wasm_label, SwatchLabel::Number(500));
    }

    #[test]
    fn swatch_label_name_converts_from_core() {
        let core_label = core::SwatchLabel::Name("White".to_string());
        let wasm_label: SwatchLabel = core_label.into();
        assert_eq!(wasm_label, SwatchLabel::Name("White".to_string()));
    }

    #[test]
    fn swatch_step_converts_from_core_preserving_all_fields() {
        let core_step = core::SwatchStep::from_label(0.55, 0.12, 30.0, 500u16);
        let wasm_step: SwatchStep = core_step.into();
        assert_eq!(
            wasm_step,
            SwatchStep {
                l: 0.55,
                c: 0.12,
                h: 30.0,
                label: SwatchLabel::Number(500),
            }
        );
    }

    #[test]
    fn tint_mode_inherit_round_trips_through_conversions() {
        let core_value = core::TintMode::Inherit;
        let wasm_value: TintMode = core_value.into();
        assert_eq!(wasm_value, TintMode::Inherit);

        let core_again: core::TintMode = wasm_value.into();
        assert_eq!(core_again, core::TintMode::Inherit);
    }

    #[test]
    fn tint_mode_achromatic_round_trips_through_conversions() {
        let core_value = core::TintMode::Achromatic;
        let wasm_value: TintMode = core_value.into();
        assert_eq!(wasm_value, TintMode::Achromatic);

        let core_again: core::TintMode = wasm_value.into();
        assert_eq!(core_again, core::TintMode::Achromatic);
    }

    #[test]
    fn soft_neutrals_converts_from_core_preserving_oklch_components() {
        let core_value = core::SoftNeutrals {
            white: palette::Oklch::new(0.95, 0.02, 240.0),
            black: palette::Oklch::new(0.10, 0.005, 240.0),
        };
        let wasm_value: SoftNeutrals = core_value.into();
        assert!((wasm_value.white.l - 0.95).abs() < 1e-5);
        assert!((wasm_value.white.c - 0.02).abs() < 1e-5);
        assert!((wasm_value.black.l - 0.10).abs() < 1e-5);
        assert!((wasm_value.black.c - 0.005).abs() < 1e-5);
    }

    #[test]
    fn palette_set_converts_from_core_preserving_both_palettes() {
        let core_set = core::api::generate_pair(
            core::ColorInput::Css("#3b82f6".to_string()),
            &core::palette::generator::TARGET_LIGHTNESS,
            &core::palette::generator::TARGET_LIGHTNESS_DARK,
            core::api::GenerateOptions::default(),
        )
        .expect("valid input should produce a palette set");

        let wasm_set: PaletteSet = core_set.clone().into();

        let expected_light: Palette = core_set.light.into();
        let expected_dark: Palette = core_set.dark.into();
        assert_eq!(wasm_set.light, expected_light);
        assert_eq!(wasm_set.dark, expected_dark);
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
