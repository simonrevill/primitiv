use palette::{IntoColor, LinSrgb, Oklch, Srgb};
use palette::color_difference::Wcag21RelativeContrast;
use serde::{Deserialize, Serialize};

use crate::OklchStep;

#[derive(PartialEq, Debug, Clone, Deserialize, Serialize)]
pub struct ContrastResult {
    pub ratio: f32,
    pub display_ratio: String,
    pub rating: String,
}

pub fn get_contrast_result(ratio: f32) -> ContrastResult {
    let rating = if ratio >= 7.0 {
        "AAA"
    } else if ratio >= 4.5 {
        "AA"
    } else {
        "Fail"
    };

    ContrastResult {
        ratio,
        display_ratio: format!("{:.2}:1", ratio),
        rating: rating.to_string(),
    }
}

pub fn calculate_contrast_low_level(bg: &Oklch, fg: &Oklch) -> ContrastResult {
    let bg_lin: LinSrgb = (*bg).into_color();
    let fg_lin: LinSrgb = (*fg).into_color();

    let l1 = bg_lin.relative_luminance().luma;
    let l2 = fg_lin.relative_luminance().luma;

    let raw_ratio = if l1 > l2 {
        (l1 + 0.05) / (l2 + 0.05)
    } else {
        (l2 + 0.05) / (l1 + 0.05)
    };

    let ratio = (raw_ratio * 100.0).round() / 100.0;

    get_contrast_result(ratio)
}

pub fn get_contrast_rating_for_step(bg: &OklchStep, fg: &OklchStep) -> ContrastResult {
    let bg_raw = Oklch::new(bg.l, bg.c, bg.h);
    let fg_raw = Oklch::new(fg.l, fg.c, fg.h);

    calculate_contrast_low_level(&bg_raw, &fg_raw)
}

pub fn parse_oklch_string(color_css: &str) -> Oklch {
    let color = csscolorparser::parse(color_css).unwrap_or_default();
    let srgb = Srgb::new(color.r as f32, color.g as f32, color.b as f32);

    srgb.into_color()
}

pub fn get_contrast_rating(bg_css: &str, fg_css: &str) -> ContrastResult {
    let bg_oklch = parse_oklch_string(bg_css);
    let fg_oklch = parse_oklch_string(fg_css);

    calculate_contrast_low_level(&bg_oklch, &fg_oklch)
}
