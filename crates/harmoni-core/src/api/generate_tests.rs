use crate::api::generate::{generate, generate_with_options, GenerateOptions};
use crate::color::input::ColorInput;
use crate::palette::generator::SwatchLabel;
use palette::Oklch;

fn sample_input() -> ColorInput {
    ColorInput::Oklch {
        l: 0.55,
        c: 0.15,
        h: 240.0,
    }
}

#[test]
fn generate_returns_ten_step_palette_for_valid_oklch_input() {
    let result = generate(sample_input()).expect("valid input should produce a palette");

    assert_eq!(result.swatches.len(), 10);
}

#[test]
fn generate_with_options_threads_soft_white_through_to_audit_foreground() {
    let custom_white = Oklch::new(0.95, 0.02, 240.0);

    let palette = generate_with_options(
        sample_input(),
        GenerateOptions {
            soft_white: Some(custom_white),
            ..GenerateOptions::default()
        },
    )
    .expect("valid input");

    let white_swatch = palette
        .swatches
        .iter()
        .find(|s| matches!(&s.best_foreground.label, SwatchLabel::Name(name) if name == "White"))
        .expect("brand palette should have at least one swatch using a white foreground");

    assert!(
        (white_swatch.best_foreground.l - 0.95).abs() < 1e-5,
        "white foreground should use custom soft white L, got {}",
        white_swatch.best_foreground.l
    );
    assert!((white_swatch.best_foreground.c - 0.02).abs() < 1e-5);
}

#[test]
fn generate_with_options_light_padding_brightens_the_lightest_step() {
    let default_result = generate(sample_input()).expect("valid input");
    let padded_result = generate_with_options(
        sample_input(),
        GenerateOptions {
            light_padding: 0.2,
            dark_padding: 0.0,
            ..GenerateOptions::default()
        },
    )
    .expect("valid input");

    // Step 50 (index 0) should be lighter with positive light_padding.
    assert!(
        padded_result.swatches[0].l > default_result.swatches[0].l,
        "expected padded 50 step ({}) to be lighter than default ({})",
        padded_result.swatches[0].l,
        default_result.swatches[0].l
    );
}
