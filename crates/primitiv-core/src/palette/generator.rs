use palette::Oklch;

pub struct OklchStep {
    pub l: f32,
    pub c: f32,
    pub h: f32,
    pub label: u16,
}

pub fn generate_greyscale_oklch() -> Vec<OklchStep> {
    let labels: [u16; 10] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    let steps: Vec<OklchStep> = labels
        .iter()
        .map(|&label| {
            let l = 1.0 - (label as f32 / 1000.0);

            let oklch_color = Oklch::new(l, 0.0, 0.0);

            OklchStep {
                l: oklch_color.l,
                c: oklch_color.chroma,
                h: oklch_color.hue.into_degrees(),
                label,
            }
        })
        .collect();

    steps
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_greyscale_oklch_returns_length_of_ten() {
        // Arrange
        let result = generate_greyscale_oklch();

        // Assert
        assert_eq!(result.len(), 10);
    }

    #[test]
    fn test_generate_greyscale_oklch_all_labels_are_correct() {
        // Arrange
        let result = generate_greyscale_oklch();
        let expected_labels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

        // Assert
        for (i, step) in result.iter().enumerate() {
            assert_eq!(
                step.label, expected_labels[i],
                "Step at index {} has incorrect label",
                i
            );
        }
    }

    #[test]
    fn test_generate_greyscale_oklch_first_step_lightness_is_very_bright() {
        // Arrange
        let result = generate_greyscale_oklch();

        // Assert
        let fifty_step = &result[0];
        assert!(fifty_step.l > 0.9);
    }

    #[test]
    fn test_generate_greyscale_oklch_all_steps_have_zero_chroma() {
        // Arrange
        let result = generate_greyscale_oklch();

        // Assert
        for step in result {
            assert_eq!(
                step.c, 0.0,
                "Step {} should have 0.0 chroma (neutral grey)",
                step.label
            );
        }
    }

    #[test]
    fn test_generate_greyscale_oklch_all_steps_have_zero_hue() {
        // Arrange
        let result = generate_greyscale_oklch();

        // Assert
        for step in result {
            assert_eq!(
                step.h, 0.0,
                "Step {} should have 0.0 hue (neutral grey)",
                step.label
            );
        }
    }

    #[test]
    fn test_generate_greyscale_oklch_steps_are_perceptually_descending() {
        // Arrange
        let result = generate_greyscale_oklch();

        // Assert
        for i in 0..result.len() - 1 {
            assert!(
                result[i].l > result[i + 1].l,
                "Step {} (L: {}) is not lighter that Step {} (L: {})",
                result[i].label,
                result[i].l,
                result[i + 1].label,
                result[i + 1].l,
            );
        }
    }
}
