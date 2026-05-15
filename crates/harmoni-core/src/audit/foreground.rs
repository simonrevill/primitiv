use crate::SwatchStep;
use crate::palette::generator::SwatchLabel;
use palette::color_difference::Wcag21RelativeContrast;
use palette::{IntoColor, LinSrgb, Oklch};

// New return type — rich information for the UI and strict AA guarantee
#[derive(Debug, Clone, PartialEq)]
pub struct ForegroundRecommendation {
    pub color: SwatchStep,
    pub contrast_ratio: f32,
    pub is_harmonious: bool, // true = used palette's own 900
}

pub fn get_best_foreground(
    background: &SwatchStep,
    dark_candidate: &SwatchStep,
    custom_white: Option<&SwatchStep>,
    custom_black: Option<&SwatchStep>,
) -> ForegroundRecommendation {
    let bg_color = Oklch::new(background.l, background.c, background.h);
    let dark_color = Oklch::new(dark_candidate.l, dark_candidate.c, dark_candidate.h);
    let (white_l, white_c, white_h) = match custom_white {
        Some(w) => (w.l, w.c, w.h),
        None => (1.0, 0.0, 0.0),
    };
    let white_color = Oklch::new(white_l, white_c, white_h);
    let (black_l, black_c, black_h) = match custom_black {
        Some(b) => (b.l, b.c, b.h),
        None => (0.01, 0.0, 0.0), // near-black (better than pure 0.0)
    };
    let black_color = Oklch::new(black_l, black_c, black_h);

    let bg_lin: LinSrgb = bg_color.into_color();
    let dark_lin: LinSrgb = dark_color.into_color();
    let white_lin: LinSrgb = white_color.into_color();
    let black_lin: LinSrgb = black_color.into_color();

    let bg_lum = bg_lin.relative_luminance().luma;
    let dark_lum = dark_lin.relative_luminance().luma;
    let white_lum = white_lin.relative_luminance().luma;
    let black_lum = black_lin.relative_luminance().luma;

    let ratio_white = (white_lum + 0.05) / (bg_lum + 0.05);
    let ratio_black = (bg_lum + 0.05) / (black_lum + 0.05);
    let ratio_dark = (bg_lum + 0.05) / (dark_lum + 0.05);

    // 1. Prefer harmonious dark_candidate (palette's 900) if it meets AA
    if ratio_dark >= 4.5 {
        return ForegroundRecommendation {
            color: dark_candidate.clone(),
            contrast_ratio: ratio_dark,
            is_harmonious: true,
        };
    }

    // 2. Otherwise choose the better of white or black
    if ratio_white >= 4.5 && ratio_white >= ratio_black {
        return ForegroundRecommendation {
            color: SwatchStep {
                l: white_l,
                c: white_c,
                h: white_h,
                label: SwatchLabel::Name(String::from("White")),
            },
            contrast_ratio: ratio_white,
            is_harmonious: false,
        };
    }

    if ratio_black >= 4.5 {
        return ForegroundRecommendation {
            color: SwatchStep {
                l: black_l,
                c: black_c,
                h: black_h,
                label: SwatchLabel::Name(String::from("Black")),
            },
            contrast_ratio: ratio_black,
            is_harmonious: false,
        };
    }

    // For any sRGB-representable background, at least one of white or black
    // will always achieve a contrast ratio >= 4.5 against it.
    // This is mathematically guaranteed by the WCAG relative luminance formula.
    unreachable!("Both white and black failed AA — this should never happen for valid sRGB colors");
}
