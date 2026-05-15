use palette::Oklch;

use crate::neutral::derive::SoftNeutrals;

pub fn tint_neutrals(
    white: Oklch,
    black: Oklch,
    source: Oklch,
    strength: f32,
) -> SoftNeutrals {
    let hue = source.hue.into_degrees();
    SoftNeutrals {
        white: Oklch::new(white.l, source.chroma * 0.08 * strength, hue),
        black: Oklch::new(black.l, source.chroma * 0.05 * strength, hue),
    }
}
