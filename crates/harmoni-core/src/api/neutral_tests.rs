use crate::api::neutral::{derive_soft_neutrals, generate_neutral_ramp, tint_neutrals};
use crate::color::input::ColorInput;
use crate::neutral::ramp::TintMode;

#[test]
fn tint_neutrals_layers_source_hue_onto_color_input_endpoints() {
    let result = tint_neutrals(
        ColorInput::Oklch {
            l: 0.96,
            c: 0.0,
            h: 0.0,
        },
        ColorInput::Oklch {
            l: 0.22,
            c: 0.0,
            h: 0.0,
        },
        ColorInput::Oklch {
            l: 0.55,
            c: 0.18,
            h: 240.0,
        },
        0.5,
    )
    .expect("valid inputs should produce tinted neutrals");

    assert_eq!(result.white.l, 0.96);
    assert_eq!(result.black.l, 0.22);
    assert!(result.white.chroma > 0.0);
    assert_eq!(
        result.white.hue.into_degrees(),
        result.black.hue.into_degrees()
    );
}

#[test]
fn derive_soft_neutrals_returns_softened_values_from_brand_color_input() {
    let result = derive_soft_neutrals(
        ColorInput::Oklch {
            l: 0.55,
            c: 0.20,
            h: 240.0,
        },
        0.5,
    )
    .expect("valid input should produce soft neutrals");

    assert!((result.white.l - 0.975).abs() < 1e-5);
    assert!((result.white.chroma - 0.008).abs() < 1e-5);
    assert!((result.black.l - 0.10).abs() < 1e-5);
    assert!((result.black.chroma - 0.005).abs() < 1e-5);
}

#[test]
fn generate_neutral_ramp_returns_palette_with_endpoints_matching_color_inputs() {
    let palette = generate_neutral_ramp(
        ColorInput::Oklch {
            l: 0.95,
            c: 0.02,
            h: 240.0,
        },
        ColorInput::Oklch {
            l: 0.10,
            c: 0.005,
            h: 240.0,
        },
        TintMode::Inherit,
    )
    .expect("valid inputs should produce a palette");

    assert_eq!(palette.swatches.len(), 10);

    let step_50 = &palette.swatches[0];
    assert!((step_50.l - 0.95).abs() < 1e-5);
    assert!((step_50.c - 0.02).abs() < 1e-5);

    let step_900 = &palette.swatches[9];
    assert!((step_900.l - 0.10).abs() < 1e-5);
    assert!((step_900.c - 0.005).abs() < 1e-5);
}
