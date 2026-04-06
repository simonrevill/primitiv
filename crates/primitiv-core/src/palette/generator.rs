use palette::Oklch;
use serde::{Deserialize, Serialize};
use tsify::Tsify;

use crate::{get_best_foreground, get_contrast_rating_for_step};
use crate::{ContrastResult};

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

const TARGET_LIGHTNESS: [f32; 10] = [
    0.99, 0.945, 0.87, 0.79, 0.69, 0.55, 0.45, 0.32, 0.22, 0.15
];

pub fn chroma_scale_for_lightness(lightness: f32) -> f32 {
    if lightness >= 0.945 { 0.18 } 
    else if lightness >= 0.88 { 0.36 } 
    else if lightness > 0.80 { 0.65 }
    else if lightness < 0.25 { 0.55 } 
    else if lightness < 0.35 { 0.75 } 
    else { 1.0 }
}

fn max_chroma_for_hue_and_lightness(hue: f32, lightness: f32) -> f32 {
    let hue = (hue as i32).rem_euclid(360) as f32;

    let base_max = match hue as i32 {
        0..=30 | 330..=360 => 0.225,
        31..=50 => 0.195,
        51..=80 => 0.170,
        81..=115 => 0.135,
        116..=155 => 0.185,
        156..=195 => 0.245,
        196..=255 => 0.320,
        256..=295 => 0.275,
        296..=329 => 0.240,
        _ => 0.22,
    };

    let lightness_factor = if lightness > 0.85 || lightness < 0.25 {
        0.45
    } else if lightness > 0.70 || lightness < 0.35 {
        0.75
    } else {
        1.0
    };

    base_max * lightness_factor
}

pub fn generate_palette_with_scale(base_500: Oklch, lightness_scale: &[f32]) -> Vec<Palette> {
    let base_hue = base_500.hue.into_degrees();
    let base_chroma = base_500.chroma;
    let base_lightness = base_500.l;

    let backgrounds: Vec<OklchStep> = STEPS
        .iter()
        .zip(lightness_scale.iter())
        .map(|(&step, &reference_lightness)| {
            let lightness = if step == 500 {
                base_lightness
            } else if step == 900 {
                (base_lightness - 0.42).max(0.08)
            } else {
                let offset = reference_lightness - 0.55;
                (base_lightness + offset).clamp(0.01, 0.99)
            };
            
            let (final_lightness, final_chroma) = if step == 500 {
                (lightness, base_chroma)
            } else {
                let scale = chroma_scale_for_lightness(lightness);
                let scaled = base_chroma * scale;
                let max_chroma = max_chroma_for_hue_and_lightness(base_hue, lightness);
                (lightness, scaled.min(max_chroma))
            };

            let oklch_color = Oklch::new(final_lightness, final_chroma, base_hue);

            OklchStep::from_label(oklch_color.l, oklch_color.chroma, oklch_color.hue.into_degrees(), step)
        })
        .collect();

        let dark_candidate = backgrounds
        .iter()
        .find(|background| background.label == OklchLabel::Number(900))
        .expect("Palette must contain a 900 step to act as a dark candidate");

        backgrounds
            .iter()
            .map(|background| {

                let foreground_recommendation = get_best_foreground(background, dark_candidate);

                let contrast_result = get_contrast_rating_for_step(&background, &foreground_recommendation.color);

                Palette {
                    l: background.l,
                    c: background.c,
                    h: background.h,
                    label: background.label.clone(),
                    best_foreground: foreground_recommendation.color,
                    contrast_result,
                }
            })
            .collect()
}

pub fn generate_palette(base_500: Oklch) -> Vec<Palette> {
    generate_palette_with_scale(base_500, &TARGET_LIGHTNESS)
}

pub fn generate_greyscale_oklch() -> Vec<Palette> {
    let lightness_scale: [f32; 10] = [0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
    generate_palette_with_scale(Oklch::new(0.5, 0.0, 0.0), &lightness_scale)
}
