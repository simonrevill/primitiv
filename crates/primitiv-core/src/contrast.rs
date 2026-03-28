use palette::Srgb;
use palette::color_difference::Wcag21RelativeContrast;

pub struct ContrastResult {
    pub ratio: f32,
    pub display_ratio: String,
    pub rating: String,
}

pub fn get_contrast_rating(bg_hex: &str, fg_hex: &str) -> ContrastResult {
    let bg_color = csscolorparser::parse(bg_hex).unwrap_or_default();
    let fg_color = csscolorparser::parse(fg_hex).unwrap_or_default();

    let bg_lin = Srgb::new(bg_color.r as f32, bg_color.g as f32, bg_color.b as f32).into_linear();
    let fg_lin = Srgb::new(fg_color.r as f32, fg_color.g as f32, fg_color.b as f32).into_linear();

    // These are Luma structs
    let l1_result = bg_lin.relative_luminance();
    let l2_result = fg_lin.relative_luminance();

    // Use .luma to get the f32 value
    let l1 = l1_result.luma;
    let l2 = l2_result.luma;

    // The WCAG contrast ratio formula
    let raw_ratio = if l1 > l2 {
        (l1 + 0.05) / (l2 + 0.05)
    } else {
        (l2 + 0.05) / (l1 + 0.05)
    };

    let ratio = (raw_ratio * 100.0).round() / 100.0;

    let rating = if ratio >= 7.0 {
        "AAA"
    } else if ratio >= 4.5 {
        "AA"
    } else {
        "Fail"
    };

    ContrastResult {
        ratio,
        display_ratio: format!("{:.2}:1", ratio),
        rating: rating.to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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
}
