use crate::palette::generator::OklchStep;
use crate::audit::foreground::get_best_foreground;

#[test]
fn should_return_dark_anchor_foreground_when_background_is_very_light() {
    // Arrange
    let example_background = OklchStep {
        l: 0.9,
        c: 0.0,
        h: 0.0,
        label: 100
    };
    let example_dark_anchor = OklchStep {
        l: 0.1,
        c: 0.0,
        h: 0.0,
        label: 900,
    };
    
    let result: OklchStep = get_best_foreground(&example_background, &example_dark_anchor);

    // Assert
    assert_eq!(result, example_dark_anchor);
}
