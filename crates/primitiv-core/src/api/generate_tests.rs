use crate::api::generate::generate;
use crate::color::input::ColorInput;

#[test]
fn generate_returns_ten_step_palette_for_valid_oklch_input() {
    let input = ColorInput::Oklch {
        l: 0.55,
        c: 0.15,
        h: 240.0,
    };

    let result = generate(input).expect("valid input should produce a palette");

    assert_eq!(result.len(), 10);
}
