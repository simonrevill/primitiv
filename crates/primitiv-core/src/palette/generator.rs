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
    0.97, 0.92, 0.85, 0.78, 0.68, 0.55, 0.45, 0.32, 0.22, 0.15
];

pub fn chroma_scale_for_lightness(lightness: f32) -> f32 {
    if lightness > 0.90 {
        0.25
    } else if lightness >= 0.85 {
        0.40
    } else if lightness > 0.80 {
        0.65
    } else if lightness < 0.25 {
        0.35
    } else if lightness < 0.35 {
        0.60
    } else {
        1.0
    }
}

pub fn generate_palette_with_scale(base_500: Oklch, lightness_scale: &[f32]) -> Vec<Palette> {
    let base_hue = base_500.hue.into_degrees();
    let base_chroma = base_500.chroma;

    let backgrounds: Vec<OklchStep> = STEPS
        .iter()
        .zip(lightness_scale.iter())
        .map(|(&background, &target_lightness)| {
            let (lightness, chroma) = if background == 500 {
                (base_500.l, base_chroma)
            } else {
                let scale = chroma_scale_for_lightness(target_lightness);
                (target_lightness, base_chroma * scale)
            };

            let oklch_color = Oklch::new(lightness, chroma, base_hue);

            OklchStep::from_label(oklch_color.l, oklch_color.chroma, oklch_color.hue.into_degrees(), background)
        })
        .collect();

        let dark_candidate = backgrounds
        .iter()
        .find(|background| background.label == OklchLabel::Number(900))
        .expect("Palette must contain a 900 step to act as a dark candidate");

        backgrounds
            .iter()
            .map(|background| {
                let best_foreground = get_best_foreground(&background, &dark_candidate);

                let contrast_result = get_contrast_rating_for_step(&background, &best_foreground);

                Palette {
                    l: background.l,
                    c: background.c,
                    h: background.h,
                    label: background.label.clone(),
                    best_foreground,
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
