// Curated public API for primitiv-core.
//
// Adapters (web, Figma plugin, CLI, etc.) should call into this
// module rather than the lower-level palette::generator functions.
// Everything here accepts ColorInput so callers never need to know
// about palette::Oklch directly.

pub mod audit;
pub mod generate;

pub use audit::audit_contrast;
pub use generate::{generate, generate_with_options, GenerateOptions};

// Thin re-export so adapters only ever need to know about primitiv_core::api.
pub use crate::palette::generator::generate_greyscale_oklch as generate_greyscale;

#[cfg(test)]
mod audit_tests;
#[cfg(test)]
mod generate_tests;
