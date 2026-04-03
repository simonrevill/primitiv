use crate::OklchStep;
use crate::palette::generator::OklchLabel;
use palette::{IntoColor, LinSrgb, Oklch, color_difference::Wcag21RelativeContrast};

// pub fn get_best_foreground(_bg: OklchStep, _dark_fg_anchor: OklchStep) -> bool {
pub fn get_best_foreground(background: &OklchStep, dark_candidate: &OklchStep) -> OklchStep {
    let bg_color = Oklch::new(background.l, background.c, background.h);
    let dark_color = Oklch::new(dark_candidate.l, dark_candidate.c, dark_candidate.h);
    let white_color = Oklch::new(1.0, 0.0, 0.0);

    let bg_lin: LinSrgb = bg_color.into_color();
    let dark_lin: LinSrgb = dark_color.into_color();
    let white_lin: LinSrgb = white_color.into_color();

    let bg_lum = bg_lin.relative_luminance().luma;
    let dark_lum = dark_lin.relative_luminance().luma;
    let white_lum = white_lin.relative_luminance().luma;

    let ratio_white = (white_lum + 0.05) / (bg_lum + 0.05);
    let ratio_dark = (bg_lum + 0.05) / (dark_lum + 0.05);

    if ratio_dark >= ratio_white {
        return dark_candidate.clone();
    }

    OklchStep {
        l: 1.0,
        c: 0.0,
        h: 0.0,
        label: OklchLabel::Name(String::from("White")),
    }
}
