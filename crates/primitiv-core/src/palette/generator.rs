use palette::Oklch;
use serde::{Deserialize, Serialize};
use tsify::Tsify;

#[derive(Copy, PartialEq, Tsify, Debug, Clone, Serialize, Deserialize)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct OklchStep {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: u16,
}

pub fn generate_greyscale_oklch() -> Vec<OklchStep> {
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
                label,
            }
        })
        .collect();

    steps
}
