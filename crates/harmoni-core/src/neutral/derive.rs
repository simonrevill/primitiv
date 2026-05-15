use palette::Oklch;

#[derive(Debug, Clone)]
pub struct SoftNeutrals {
    pub black: Oklch,
    pub white: Oklch,
}

pub fn derive_soft_neutrals(brand: Oklch, softness: f32) -> SoftNeutrals {
    let hue = brand.hue.into_degrees();
    let white_l = 1.0 - 0.05 * softness;
    let white_c = brand.chroma * 0.08 * softness;
    let black_l = 0.05 + 0.10 * softness;
    let black_c = brand.chroma * 0.05 * softness;
    SoftNeutrals {
        white: Oklch::new(white_l, white_c, hue),
        black: Oklch::new(black_l, black_c, hue),
    }
}
