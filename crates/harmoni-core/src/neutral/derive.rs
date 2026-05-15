use palette::Oklch;

#[derive(Debug, Clone)]
pub struct SoftNeutrals {
    pub black: Oklch,
    pub white: Oklch,
}

pub fn derive_soft_neutrals(brand: Oklch, _softness: f32) -> SoftNeutrals {
    let hue = brand.hue.into_degrees();
    SoftNeutrals {
        white: Oklch::new(1.0, 0.0, hue),
        black: Oklch::new(0.05, 0.0, hue),
    }
}
