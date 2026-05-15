use crate::neutral::tint::tint_neutrals;
use palette::Oklch;

#[test]
fn should_preserve_endpoint_lightness_and_stay_achromatic_when_strength_is_zero() {
    let white = Oklch::new(0.96, 0.0, 0.0);
    let black = Oklch::new(0.22, 0.0, 0.0);
    let source = Oklch::new(0.55, 0.18, 240.0);

    let result = tint_neutrals(white, black, source, 0.0);

    assert_eq!(result.white.l, 0.96);
    assert_eq!(result.white.chroma, 0.0);
    assert_eq!(result.black.l, 0.22);
    assert_eq!(result.black.chroma, 0.0);
}
