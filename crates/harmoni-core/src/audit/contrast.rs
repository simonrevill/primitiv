use palette::color_difference::Wcag21RelativeContrast;
use palette::{IntoColor, LinSrgb, Oklch};
use serde::{Deserialize, Serialize};

use crate::SwatchStep;

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

pub fn get_contrast_rating_for_step(bg: &SwatchStep, fg: &SwatchStep) -> ContrastResult {
    let bg_raw = Oklch::new(bg.l, bg.c, bg.h);
    let fg_raw = Oklch::new(fg.l, fg.c, fg.h);

    calculate_contrast_low_level(&bg_raw, &fg_raw)
}
