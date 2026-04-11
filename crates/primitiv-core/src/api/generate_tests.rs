use crate::api::generate::{generate, generate_with_options, GenerateOptions};
use crate::color::input::ColorInput;

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

    assert_eq!(result.len(), 10);
}

#[test]
fn generate_with_options_light_padding_brightens_the_lightest_step() {
    let default_result = generate(sample_input()).expect("valid input");
    let padded_result = generate_with_options(
        sample_input(),
        GenerateOptions {
            light_padding: 0.2,
            dark_padding: 0.0,
        },
    )
    .expect("valid input");

    // Step 50 (index 0) should be lighter with positive light_padding.
    assert!(
        padded_result[0].l > default_result[0].l,
        "expected padded 50 step ({}) to be lighter than default ({})",
        padded_result[0].l,
        default_result[0].l
    );
}
