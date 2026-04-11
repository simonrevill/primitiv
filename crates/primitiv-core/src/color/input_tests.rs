use super::input::ColorInput;
use palette::Oklch;

// Ground-truth OkLCH values for well-known sRGB colors come from the
// Oklab reference (https://bottosson.github.io/posts/oklab/). They are
// independent of our own conversion path so they genuinely exercise
// the implementation instead of tautologically matching it.

const L_C_EPSILON: f32 = 0.01;
const HUE_EPSILON_DEG: f32 = 0.2;

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

    let result = input.to_oklch();

    // sRGB #ff0000 ≈ oklch(0.6279 0.2577 29.23°)
    assert_oklch_approx_eq(result, 0.6279, 0.2577, 29.23);
}

#[test]
fn hex_without_hash_prefix_converts_pure_red_to_oklch() {
    let with_hash = ColorInput::Hex("#ff0000".to_string()).to_oklch();
    let without_hash = ColorInput::Hex("ff0000".to_string()).to_oklch();

    assert_oklch_approx_eq(
        without_hash,
        with_hash.l,
        with_hash.chroma,
        with_hash.hue.into_degrees(),
    );
}
