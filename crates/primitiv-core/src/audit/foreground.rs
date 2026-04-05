use crate::OklchStep;
use crate::palette::generator::OklchLabel;
use palette::{IntoColor, LinSrgb, Oklch};
use palette::color_difference::Wcag21RelativeContrast;

// New return type — rich information for the UI and strict AA guarantee
#[derive(Debug, Clone, PartialEq)]
pub struct ForegroundRecommendation {
    pub color: OklchStep,
    pub contrast_ratio: f32,
    pub is_harmonious: bool,        // true = used palette's own 900
}

pub fn get_best_foreground(background: &OklchStep, dark_candidate: &OklchStep) -> ForegroundRecommendation {
    let bg_color = Oklch::new(background.l, background.c, background.h);
    let dark_color = Oklch::new(dark_candidate.l, dark_candidate.c, dark_candidate.h);
    let white_color = Oklch::new(1.0, 0.0, 0.0);
    let black_color = Oklch::new(0.01, 0.0, 0.0);   // near-black (better than pure 0.0)

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
    let ratio_dark  = (bg_lum + 0.05) / (dark_lum + 0.05);

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
            color: OklchStep {
                l: 1.0,
                c: 0.0,
                h: 0.0,
                label: OklchLabel::Name(String::from("White")),
            },
            contrast_ratio: ratio_white,
            is_harmonious: false,
        };
    }

    if ratio_black >= 4.5 {
        return ForegroundRecommendation {
            color: OklchStep {
                l: 0.01,
                c: 0.0,
                h: 0.0,
                label: OklchLabel::Name(String::from("Black")),
            },
            contrast_ratio: ratio_black,
            is_harmonious: false,
        };
    }

    // 3. Both white and black fail AA → pick the one with the highest ratio anyway
    if ratio_white >= ratio_black {
        ForegroundRecommendation {
            color: OklchStep {
                l: 1.0,
                c: 0.0,
                h: 0.0,
                label: OklchLabel::Name(String::from("White")),
            },
            contrast_ratio: ratio_white,
            is_harmonious: false,
        }
    } else {
        ForegroundRecommendation {
            color: OklchStep {
                l: 0.01,
                c: 0.0,
                h: 0.0,
                label: OklchLabel::Name(String::from("Black")),
            },
            contrast_ratio: ratio_black,
            is_harmonious: false,
        }
    }
}