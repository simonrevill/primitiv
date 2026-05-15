use crate::neutral::derive::derive_soft_neutrals;
use palette::Oklch;

#[test]
fn should_tint_and_soften_both_endpoints_when_softness_is_positive() {
    let brand = Oklch::new(0.55, 0.15, 240.0);

    let result = derive_soft_neutrals(brand, 0.5);

    assert!(result.white.l < 1.0);
    assert!(result.white.l > 0.9);
    assert!(result.white.chroma > 0.0);
    assert_eq!(result.white.hue.into_degrees(), brand.hue.into_degrees());
    assert!(result.black.l > 0.05);
    assert!(result.black.l < 0.2);
    assert!(result.black.chroma > 0.0);
    assert_eq!(result.black.hue.into_degrees(), brand.hue.into_degrees());
}

#[test]
fn should_return_pure_white_and_safe_near_black_when_softness_is_zero() {
    let brand = Oklch::new(0.55, 0.15, 240.0);

    let result = derive_soft_neutrals(brand, 0.0);

    assert_eq!(result.white.l, 1.0);
    assert_eq!(result.white.chroma, 0.0);
    assert_eq!(result.white.hue.into_degrees(), brand.hue.into_degrees());
    assert_eq!(result.black.l, 0.05);
    assert_eq!(result.black.chroma, 0.0);
    assert_eq!(result.black.hue.into_degrees(), brand.hue.into_degrees());
}
