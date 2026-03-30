use crate::palette::generator::{OklchLabel, OklchStep};
use crate::audit::foreground::get_best_foreground;

#[test]
fn should_return_dark_anchor_foreground_when_background_is_very_light() {
    // Arrange
    let example_background = OklchStep {
        l: 0.9,
        c: 0.0,
        h: 0.0,
        label: OklchLabel::Number(100)
    };
    let example_dark_anchor = OklchStep {
        l: 0.1,
        c: 0.0,
        h: 0.0,
        label: OklchLabel::Number(900),
    };
    
    let result: OklchStep = get_best_foreground(&example_background, &example_dark_anchor);

    // Assert
    assert_eq!(result, example_dark_anchor);
}

#[test]
fn should_return_white_foreground_when_background_is_very_dark() {
    // Arrange
    let example_background = OklchStep {
        l: 0.1,
        c: 0.0,
        h: 0.0,
        label: OklchLabel::Number(100)
    };
    let example_dark_anchor = OklchStep {
        l: 0.1,
        c: 0.0,
        h: 0.0,
        label: OklchLabel::Number(900),
    };
    let expected_white_foreground = OklchStep {
        l: 1.0,
        c: 0.0,
        h: 0.0,
        label: OklchLabel::Name(String::from("White")),
    };
    
    let result: OklchStep = get_best_foreground(&example_background, &example_dark_anchor);

    // Assert
    assert_eq!(result, expected_white_foreground);
}
