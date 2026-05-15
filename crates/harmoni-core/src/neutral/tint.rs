use palette::Oklch;

use crate::neutral::derive::SoftNeutrals;

pub fn tint_neutrals(
    white: Oklch,
    black: Oklch,
    source: Oklch,
    _strength: f32,
) -> SoftNeutrals {
    let hue = source.hue.into_degrees();
    SoftNeutrals {
        white: Oklch::new(white.l, 0.0, hue),
        black: Oklch::new(black.l, 0.0, hue),
    }
}
