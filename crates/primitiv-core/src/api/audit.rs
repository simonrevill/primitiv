// Contrast auditing entry points for adapters.

use crate::audit::contrast::{calculate_contrast_low_level, ContrastResult};
use crate::color::input::{ColorInput, ColorInputError};

pub fn audit_contrast(
    bg: ColorInput,
    fg: ColorInput,
) -> Result<ContrastResult, ColorInputError> {
    let bg_oklch = bg.to_oklch()?;
    let fg_oklch = fg.to_oklch()?;
    Ok(calculate_contrast_low_level(&bg_oklch, &fg_oklch))
}
