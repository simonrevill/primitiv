use crate::OklchStep;
use crate::palette::generator::OklchLabel;

// pub fn get_best_foreground(_bg: OklchStep, _dark_fg_anchor: OklchStep) -> bool {
pub fn get_best_foreground(background: &OklchStep, dark_anchor: &OklchStep) -> OklchStep {
    if background.l >= 0.9 {
        return dark_anchor.clone();
    }

    OklchStep {
        l: 1.0,
        c: 0.0,
        h: 0.0,
        label: OklchLabel::Name(String::from("White")),
    }
}
