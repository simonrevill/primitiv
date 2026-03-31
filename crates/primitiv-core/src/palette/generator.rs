use palette::Oklch;
use serde::{Deserialize, Serialize};
use tsify::Tsify;

use crate::get_best_foreground;
use crate::{ContrastResult, get_contrast_rating};

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
pub struct OklchStepWithContrast {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: OklchLabel,
    pub best_foreground: OklchStep,
    pub contrast_result: ContrastResult,
}

pub fn generate_greyscale_oklch() -> Vec<OklchStepWithContrast> {
    let labels: [u16; 10] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    let steps: Vec<OklchStep> = labels
        .iter()
        .map(|&label| {
            let l = 1.0 - (label as f32 / 1000.0);

            let oklch_color = Oklch::new(l, 0.0, 0.0);

            OklchStep {
                l: oklch_color.l,
                c: oklch_color.chroma,
                h: oklch_color.hue.into_degrees(),
                label: OklchLabel::Number(label),
            }
        })
        .collect();

    let dark_anchor = steps
        .iter()
        .find(|step| step.label == OklchLabel::Number(900))
        .expect("Palette must contain a 900 step to act as a dark anchor");

    let steps_with_foreground_and_contrast: Vec<OklchStepWithContrast> = steps
        .iter()
        .map(|step| {
            let best_foreground = get_best_foreground(&step, &dark_anchor);

            let step_bg_oklch = format!("oklch({} {} {})", step.l, step.c, step.h);

            let best_fg_oklch = format!(
                "oklch({} {} {})",
                best_foreground.l, best_foreground.c, best_foreground.h
            );

            let contrast_result = get_contrast_rating(&step_bg_oklch, &best_fg_oklch);

            OklchStepWithContrast {
                l: step.l,
                c: step.c,
                h: step.h,
                label: step.label.clone(),
                best_foreground,
                contrast_result,
            }
        })
        .collect();

    steps_with_foreground_and_contrast
}
