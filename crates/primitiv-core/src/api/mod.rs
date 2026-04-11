// Curated public API for primitiv-core.
//
// Adapters (web, Figma plugin, CLI, etc.) should call into this
// module rather than the lower-level palette::generator functions.
// Everything here accepts ColorInput so callers never need to know
// about palette::Oklch directly.

pub mod audit;
pub mod generate;

#[cfg(test)]
mod audit_tests;
#[cfg(test)]
mod generate_tests;
