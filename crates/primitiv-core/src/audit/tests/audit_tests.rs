use super::super::audit::*;

#[test]
fn test_contrast_result_ratio() {
    let result = get_contrast_rating("#000000", "#FFFFFF");

    assert_eq!(result.ratio, 21.0);
}

#[test]
fn test_contrast_result_display_ratio() {
    let result = get_contrast_rating("#000000", "#FFFFFF");

    assert_eq!(result.display_ratio, "21.00:1");
}

#[test]
fn test_contrast_result_rating() {
    let result = get_contrast_rating("#000000", "#FFFFFF");

    assert_eq!(result.rating, "AAA");
}
