use crate::OklchStep;

// pub fn get_best_foreground(_bg: OklchStep, _dark_fg_anchor: OklchStep) -> bool {
pub fn get_best_foreground(_background: &OklchStep, dark_anchor: &OklchStep) -> OklchStep {
    dark_anchor.clone()
}
