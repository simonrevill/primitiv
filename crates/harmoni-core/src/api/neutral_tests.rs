use crate::api::neutral::generate_neutral_ramp;
use crate::color::input::ColorInput;
use crate::neutral::ramp::TintMode;

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
