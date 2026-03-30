use palette::Oklch;
use serde::{Deserialize, Serialize};
use tsify::Tsify;

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
        Self { l, c, h, label: label.into() }
    }
}

pub fn generate_greyscale_oklch() -> Vec<OklchStep> {
    let labels: [u16; 10] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    let steps: Vec<OklchStep> = labels
        .iter()
        .map(|&label| {
            let l = 1.0 - (label as f32 / 1000.0);

            let oklch_color = Oklch::new(l, 0.0, 0.0);

            OklchStep::from_label(
                oklch_color.l,
                oklch_color.chroma,
                oklch_color.hue.into_degrees(),
                OklchLabel::Number(label)
            )
        })
        .collect();

    steps
}
