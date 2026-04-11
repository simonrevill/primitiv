use crate::api::audit_contrast;
use crate::audit::contrast::ContrastResult;
use crate::color::input::ColorInput;

fn rate(bg: &str, fg: &str) -> ContrastResult {
    audit_contrast(
        ColorInput::Css(bg.to_string()),
        ColorInput::Css(fg.to_string()),
    )
    .expect("valid css strings should audit successfully")
}

#[test]
fn test_contrast_result_ratio_success() {
    let result = rate("oklch(0 0 0)", "oklch(1 0 0)");

    assert_eq!(result.ratio, 21.0);
}

#[test]
fn test_contrast_result_display_ratio_success() {
    let result = rate("oklch(0 0 0)", "oklch(1 0 0)");

    assert_eq!(result.display_ratio, "21.00:1");
}

#[test]
fn test_contrast_result_rating_success() {
    let result = rate("oklch(0 0 0)", "oklch(1 0 0)");

    assert_eq!(result.rating, "AAA");
}

#[test]
fn test_contrast_result_ratio_success_opposite() {
    let result = rate("oklch(1 0 0)", "oklch(0 0 0)");

    assert_eq!(result.ratio, 21.0);
}

#[test]
fn test_contrast_result_display_ratio_success_opposite() {
    let result = rate("oklch(1 0 0)", "oklch(0 0 0)");

    assert_eq!(result.display_ratio, "21.00:1");
}

#[test]
fn test_contrast_result_rating_success_opposite() {
    let result = rate("oklch(1 0 0)", "oklch(0 0 0)");

    assert_eq!(result.rating, "AAA");
}

#[test]
fn test_contrast_result_ratio_fail() {
    let result = rate("oklch(0.8677 0.0735 7.09)", "oklch(1 0 0)");

    assert_eq!(result.ratio, 1.54);
}

#[test]
fn test_contrast_result_display_ratio_fail() {
    let result = rate("oklch(0.8677 0.0735 7.09)", "oklch(1 0 0)");

    assert_eq!(result.display_ratio, "1.54:1");
}

#[test]
fn test_contrast_result_rating_fail() {
    let result = rate("oklch(0.8677 0.0735 7.09)", "oklch(1 0 0)");

    assert_eq!(result.rating, "Fail");
}

#[test]
fn test_contrast_result_ratio_double_a() {
    let result = rate("#767676", "oklch(1 0 0)");

    assert_eq!(result.ratio, 4.54);
}

#[test]
fn test_contrast_result_display_ratio_double_a() {
    let result = rate("#767676", "oklch(1 0 0)");

    assert_eq!(result.display_ratio, "4.54:1");
}

#[test]
fn test_contrast_result_rating_double_a() {
    let result = rate("#767676", "oklch(1 0 0)");

    assert_eq!(result.rating, "AA");
}
