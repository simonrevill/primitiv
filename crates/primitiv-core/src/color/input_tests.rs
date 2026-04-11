use super::input::{ColorInput, ColorInputError};
use palette::Oklch;

// Ground-truth OkLCH values for well-known sRGB colors come from the
// Oklab reference (https://bottosson.github.io/posts/oklab/). They are
// independent of our own conversion path so they genuinely exercise
// the implementation instead of tautologically matching it.

const L_C_EPSILON: f32 = 0.01;
const HUE_EPSILON_DEG: f32 = 0.2;

fn ok(result: Result<Oklch, ColorInputError>) -> Oklch {
    result.expect("color input should parse successfully")
}

fn assert_oklch_approx_eq(actual: Oklch, expected_l: f32, expected_c: f32, expected_h: f32) {
    let actual_hue = actual.hue.into_degrees();
    assert!(
        (actual.l - expected_l).abs() < L_C_EPSILON,
        "lightness: expected ~{}, got {}",
        expected_l,
        actual.l
    );
    assert!(
        (actual.chroma - expected_c).abs() < L_C_EPSILON,
        "chroma: expected ~{}, got {}",
        expected_c,
        actual.chroma
    );
    assert!(
        (actual_hue - expected_h).abs() < HUE_EPSILON_DEG,
        "hue: expected ~{}°, got {}°",
        expected_h,
        actual_hue
    );
}

#[test]
fn hex_with_hash_prefix_converts_pure_red_to_oklch() {
    let input = ColorInput::Hex("#ff0000".to_string());

    let result = ok(input.to_oklch());

    // sRGB #ff0000 ≈ oklch(0.6279 0.2577 29.23°)
    assert_oklch_approx_eq(result, 0.6279, 0.2577, 29.23);
}

#[test]
fn hex_without_hash_prefix_converts_pure_red_to_oklch() {
    let with_hash = ok(ColorInput::Hex("#ff0000".to_string()).to_oklch());
    let without_hash = ok(ColorInput::Hex("ff0000".to_string()).to_oklch());

    assert_oklch_approx_eq(
        without_hash,
        with_hash.l,
        with_hash.chroma,
        with_hash.hue.into_degrees(),
    );
}

#[test]
fn invalid_hex_returns_invalid_hex_error() {
    let input = ColorInput::Hex("not-a-color".to_string());

    let result = input.to_oklch();

    assert_eq!(
        result,
        Err(ColorInputError::InvalidHex("not-a-color".to_string()))
    );
}

#[test]
fn rgb_pure_red_matches_hex_pure_red() {
    let from_hex = ok(ColorInput::Hex("#ff0000".to_string()).to_oklch());
    let from_rgb = ok(ColorInput::Rgb { r: 255, g: 0, b: 0 }.to_oklch());

    assert_oklch_approx_eq(
        from_rgb,
        from_hex.l,
        from_hex.chroma,
        from_hex.hue.into_degrees(),
    );
}

#[test]
fn rgb_pure_green_converts_to_oklch() {
    let input = ColorInput::Rgb { r: 0, g: 255, b: 0 };

    let result = ok(input.to_oklch());

    // sRGB #00ff00 ≈ oklch(0.8664 0.2948 142.50°)
    assert_oklch_approx_eq(result, 0.8664, 0.2948, 142.50);
}

#[test]
fn oklch_variant_is_passthrough() {
    let input = ColorInput::Oklch {
        l: 0.55,
        c: 0.18,
        h: 27.3,
    };

    let result = ok(input.to_oklch());

    // Tolerance zero — this is a literal pass-through, no conversion.
    assert_eq!(result.l, 0.55);
    assert_eq!(result.chroma, 0.18);
    assert_eq!(result.hue.into_degrees(), 27.3);
}
