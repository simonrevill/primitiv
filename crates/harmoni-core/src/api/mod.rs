// Curated public API for harmoni-core.
//
// Adapters (web, Figma plugin, CLI, etc.) should call into this
// module rather than the lower-level palette::generator functions.
// Everything here accepts ColorInput so callers never need to know
// about palette::Oklch directly.

pub mod audit;
pub mod generate;
pub mod neutral;

pub use audit::audit_contrast;
pub use generate::{generate, generate_with_options, generate_with_lightness, GenerateOptions};
pub use neutral::{derive_soft_neutrals, generate_neutral_ramp};

// Thin re-export so adapters only ever need to know about harmoni_core::api.
pub use crate::palette::generator::generate_greyscale_oklch as generate_greyscale;

#[cfg(test)]
mod audit_tests;
#[cfg(test)]
mod generate_tests;
#[cfg(test)]
mod neutral_tests;
