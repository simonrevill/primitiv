use palette::{IntoColor, LinSrgb, Oklch};
use serde::{Deserialize, Serialize};
use tsify::Tsify;

use crate::{get_best_foreground, get_contrast_rating_for_step};
use crate::ContrastResult;

#[derive(Tsify, Debug, Clone, Serialize, Deserialize, PartialEq)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub enum OklchLabel {
    Number(u16),
    Name(String),
}

impl From<u16> for OklchLabel {
    fn from(n: u16) -> Self {
        OklchLabel::Number(n)
    }
}

impl From<&str> for OklchLabel {
    fn from(s: &str) -> Self {
        OklchLabel::Name(s.to_string())
    }
}

#[derive(PartialEq, Tsify, Debug, Clone, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct OklchStep {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: OklchLabel,
}

impl OklchStep {
    pub fn from_label<T: Into<OklchLabel>>(l: f32, c: f32, h: f32, label: T) -> Self {
        Self {
            l,
            c,
            h,
            label: label.into(),
        }
    }
}

#[derive(PartialEq, Tsify, Debug, Clone, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct Palette {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: OklchLabel,
    pub best_foreground: OklchStep,
    pub contrast_result: ContrastResult,
}

const STEPS: [u16; 10] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

pub const TARGET_LIGHTNESS: [f32; 10] = [
    0.97, 0.91, 0.83, 0.76, 0.67, 0.55, 0.45, 0.32, 0.22, 0.15
];

pub const TARGET_CHROMA_SCALE: [f32; 10] = [
    0.12, 0.35, 0.65, 0.80, 0.92, 1.0, 0.92, 0.80, 0.65, 0.50
];

/// Binary search for the maximum chroma that stays within the sRGB gamut
/// for a given OkLCH lightness and hue.
pub fn max_in_gamut_chroma(lightness: f32, hue: f32) -> f32 {
    let mut lo: f32 = 0.0;
    let mut hi: f32 = 0.4;

    for _ in 0..20 {
        let mid = (lo + hi) / 2.0;
        let srgb: LinSrgb = Oklch::new(lightness, mid, hue).into_color();

        if srgb.red >= -0.001 && srgb.red <= 1.001
            && srgb.green >= -0.001 && srgb.green <= 1.001
            && srgb.blue >= -0.001 && srgb.blue <= 1.001
        {
            lo = mid;
        } else {
            hi = mid;
        }
    }

    lo
}

fn apply_padding_to_lightness(lightness_scale: &[f32], light_padding: f32) -> Vec<f32>{
    lightness_scale
        .iter()
        .enumerate()
        .map(|(i, &l)| {
            let n = i as f32 / (lightness_scale.len() as f32 - 1.0);
            let light_influence = (1.0 - n).powi(2);
            let delta = light_padding * light_influence;

            (l + delta).clamp(0.01, 0.99)
        })
        .collect()
}

pub fn generate_palette_with_scale(
    base_500: Oklch,
    lightness_scale: &[f32],
    chroma_scale: &[f32],
    light_padding: f32,
) -> Vec<Palette> {
    let base_hue = base_500.hue.into_degrees();
    let base_chroma = base_500.chroma;
    let base_lightness = base_500.l;
    let adjusted_lightess = apply_padding_to_lightness(lightness_scale, light_padding);

    // Express the base chroma as a fraction of its gamut maximum,
    // so we can apply the same proportional saturation at every step.
    let base_gamut_max = max_in_gamut_chroma(base_lightness, base_hue);
    let base_ratio = if base_gamut_max > 0.001 {
        (base_chroma / base_gamut_max).min(1.0)
    } else {
        0.0
    };

    let backgrounds: Vec<OklchStep> = STEPS
        .iter()
        .zip(adjusted_lightess.iter())
        .zip(chroma_scale.iter())
        .map(|((&step, &reference_lightness), &chroma_factor)| {
            let (final_lightness, final_chroma) = if step == 500 {
                (base_lightness, base_chroma)
            } else {
                let offset = reference_lightness - 0.55;
                let l = (base_lightness + offset).clamp(0.01, 0.99);
                let step_gamut_max = max_in_gamut_chroma(l, base_hue);
                // Use 95% of gamut max as a safety margin to avoid edge clipping
                let chroma = step_gamut_max * 0.95 * base_ratio * chroma_factor;
                (l, chroma)
            };

            let oklch_color = Oklch::new(final_lightness, final_chroma, base_hue);

            OklchStep::from_label(
                oklch_color.l,
                oklch_color.chroma,
                oklch_color.hue.into_degrees(),
                step,
            )
        })
        .collect();

    let dark_candidate = backgrounds
        .iter()
        .find(|background| background.label == OklchLabel::Number(900))
        .expect("Palette must contain a 900 step to act as a dark candidate");

    backgrounds
        .iter()
        .map(|background| {
            let recommendation = get_best_foreground(background, dark_candidate);
            let contrast_result = get_contrast_rating_for_step(background, &recommendation.color);

            Palette {
                l: background.l,
                c: background.c,
                h: background.h,
                label: background.label.clone(),
                best_foreground: recommendation.color,
                contrast_result,
            }
        })
        .collect()
}

pub fn generate_palette(base_500: Oklch) -> Vec<Palette> {
    generate_palette_with_scale(base_500, &TARGET_LIGHTNESS, &TARGET_CHROMA_SCALE, 0.0)
}

pub fn generate_palette_with_light_padding(base_500: Oklch, light_padding: f32) -> Vec<Palette> {
    generate_palette_with_scale(base_500, &TARGET_LIGHTNESS, &TARGET_CHROMA_SCALE, light_padding)
}

pub fn generate_greyscale_oklch() -> Vec<Palette> {
    let lightness_scale: [f32; 10] = [0.97, 0.93, 0.85, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
    generate_palette_with_scale(Oklch::new(0.5, 0.0, 0.0), &lightness_scale, &TARGET_CHROMA_SCALE, 0.0)
}