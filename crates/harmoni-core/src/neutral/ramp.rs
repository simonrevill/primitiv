use palette::Oklch;

use crate::audit::contrast::get_contrast_rating_for_step;
use crate::audit::foreground::get_best_foreground;
use crate::palette::generator::{Palette, Swatch, SwatchLabel, SwatchStep};

#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub enum TintMode {
    #[default]
    Inherit,
    Achromatic,
}

const STEPS: [u16; 10] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

pub fn generate_neutral_ramp(soft_white: Oklch, soft_black: Oklch, _tint: TintMode) -> Palette {
    let backgrounds: Vec<SwatchStep> = STEPS
        .iter()
        .map(|&step| {
            let source = if step == 900 { soft_black } else { soft_white };
            SwatchStep::from_label(source.l, source.chroma, source.hue.into_degrees(), step)
        })
        .collect();

    let dark_candidate = backgrounds
        .iter()
        .find(|bg| bg.label == SwatchLabel::Number(900))
        .expect("neutral ramp must include a 900 step");

    let swatches: Vec<Swatch> = backgrounds
        .iter()
        .map(|background| {
            let recommendation = get_best_foreground(background, dark_candidate);
            let contrast_result = get_contrast_rating_for_step(background, &recommendation.color);
            Swatch {
                l: background.l,
                c: background.c,
                h: background.h,
                label: background.label.clone(),
                best_foreground: recommendation.color,
                contrast_result,
            }
        })
        .collect();

    let lightness_curve = [
        soft_white.l,
        soft_white.l,
        soft_white.l,
        soft_white.l,
        soft_white.l,
        soft_white.l,
        soft_white.l,
        soft_white.l,
        soft_white.l,
        soft_black.l,
    ];

    Palette {
        swatches,
        lightness_curve,
        max_recommended_light_padding: 0.0,
        max_recommended_dark_padding: 0.0,
        note: String::new(),
    }
}
