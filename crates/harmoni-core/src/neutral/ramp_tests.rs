use crate::neutral::ramp::{generate_neutral_ramp, TintMode};
use crate::palette::generator::SwatchLabel;
use palette::Oklch;

#[test]
fn should_return_ten_labelled_swatches_with_endpoints_pinned_to_soft_white_and_soft_black() {
    let soft_white = Oklch::new(0.975, 0.006, 240.0);
    let soft_black = Oklch::new(0.10, 0.00375, 240.0);

    let palette = generate_neutral_ramp(soft_white, soft_black, TintMode::Inherit);

    assert_eq!(palette.swatches.len(), 10);

    let expected_labels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    for (i, swatch) in palette.swatches.iter().enumerate() {
        assert_eq!(swatch.label, SwatchLabel::Number(expected_labels[i]));
    }

    let step_50 = &palette.swatches[0];
    assert_eq!(step_50.l, soft_white.l);
    assert_eq!(step_50.c, soft_white.chroma);
    assert_eq!(step_50.h, soft_white.hue.into_degrees());

    let step_900 = &palette.swatches[9];
    assert_eq!(step_900.l, soft_black.l);
    assert_eq!(step_900.c, soft_black.chroma);
    assert_eq!(step_900.h, soft_black.hue.into_degrees());
}

#[test]
fn should_space_lightness_along_the_normalised_perceptual_curve() {
    use crate::palette::generator::TARGET_LIGHTNESS;

    let soft_white = Oklch::new(0.975, 0.006, 240.0);
    let soft_black = Oklch::new(0.10, 0.00375, 240.0);

    let palette = generate_neutral_ramp(soft_white, soft_black, TintMode::Inherit);

    let span = TARGET_LIGHTNESS[0] - TARGET_LIGHTNESS[9];
    for i in 0..palette.swatches.len() {
        let fraction = (TARGET_LIGHTNESS[0] - TARGET_LIGHTNESS[i]) / span;
        let expected_l = soft_white.l + (soft_black.l - soft_white.l) * fraction;
        let actual_l = palette.swatches[i].l;
        assert!(
            (actual_l - expected_l).abs() < 1e-5,
            "step at index {} has l={} but expected {}",
            i,
            actual_l,
            expected_l
        );
    }
}

#[test]
fn should_interpolate_chroma_between_endpoints_in_inherit_tint_mode() {
    use crate::palette::generator::TARGET_LIGHTNESS;

    let soft_white = Oklch::new(0.975, 0.02, 240.0);
    let soft_black = Oklch::new(0.10, 0.008, 240.0);

    let palette = generate_neutral_ramp(soft_white, soft_black, TintMode::Inherit);

    let span = TARGET_LIGHTNESS[0] - TARGET_LIGHTNESS[9];
    for i in 1..palette.swatches.len() - 1 {
        let fraction = (TARGET_LIGHTNESS[0] - TARGET_LIGHTNESS[i]) / span;
        let expected_c = soft_white.chroma + (soft_black.chroma - soft_white.chroma) * fraction;
        let actual_c = palette.swatches[i].c;
        assert!(
            (actual_c - expected_c).abs() < 1e-5,
            "step at index {} has c={} but expected {}",
            i,
            actual_c,
            expected_c
        );
        assert!(actual_c > 0.0, "step at index {} should be tinted", i);
        assert_eq!(palette.swatches[i].h, soft_white.hue.into_degrees());
    }
}

#[test]
fn should_decrease_lightness_monotonically_across_the_ramp() {
    let soft_white = Oklch::new(0.975, 0.006, 240.0);
    let soft_black = Oklch::new(0.10, 0.00375, 240.0);

    let palette = generate_neutral_ramp(soft_white, soft_black, TintMode::Inherit);

    for i in 0..palette.swatches.len() - 1 {
        assert!(
            palette.swatches[i].l > palette.swatches[i + 1].l,
            "step at index {} (l={}) is not greater than step at index {} (l={})",
            i,
            palette.swatches[i].l,
            i + 1,
            palette.swatches[i + 1].l
        );
    }
}
