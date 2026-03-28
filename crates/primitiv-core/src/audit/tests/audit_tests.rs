use super::super::audit::*;

#[test]
fn test_contrast_result_ratio_success() {
    let result = get_contrast_rating("#000000", "#FFFFFF");

    assert_eq!(result.ratio, 21.0);
}

#[test]
fn test_contrast_result_display_ratio_success() {
    let result = get_contrast_rating("#000000", "#FFFFFF");

    assert_eq!(result.display_ratio, "21.00:1");
}

#[test]
fn test_contrast_result_rating_success() {
    let result = get_contrast_rating("#000000", "#FFFFFF");

    assert_eq!(result.rating, "AAA");
}

#[test]
fn test_contrast_result_ratio_fail() {
    let result = get_contrast_rating("#FFC0CB", "#FFFFFF");

    assert_eq!(result.ratio, 1.54);
}

#[test]
fn test_contrast_result_display_ratio_fail() {
    let result = get_contrast_rating("#FFC0CB", "#FFFFFF");

    assert_eq!(result.display_ratio, "1.54:1");
}

#[test]
fn test_contrast_result_rating_fail() {
    let result = get_contrast_rating("#FFC0CB", "#FFFFFF");

    assert_eq!(result.rating, "Fail");
}
