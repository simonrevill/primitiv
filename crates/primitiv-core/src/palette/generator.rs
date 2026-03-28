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
    fn test_generate_greyscale_oklch_first_step_returns_50_label() {
        // Arrange
        let result = generate_greyscale_oklch();

        // Assert
        let fifty_step = &result[0];
        assert_eq!(fifty_step.label, 50);
    }

    #[test]
    fn test_generate_greyscale_oklch_first_step_lightness_is_very_bright() {
        // Arrange
        let result = generate_greyscale_oklch();

        // Assert
        let fifty_step = &result[0];
        assert!(fifty_step.l > 0.9);
    }
}
