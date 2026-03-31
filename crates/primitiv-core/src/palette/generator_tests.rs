use crate::palette::generator::OklchLabel;
use crate::palette::generator::*;

#[cfg(test)]
mod generator_tests {
    use super::*;

    #[test]
    fn test_generate_greyscale_oklch_returns_length_of_ten() {
        let result = generate_greyscale_oklch();
        assert_eq!(result.len(), 10);
    }

    #[test]
    fn test_generate_greyscale_oklch_all_labels_are_correct() {
        let result = generate_greyscale_oklch();
        let expected_labels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

        for (i, step) in result.iter().enumerate() {
            assert_eq!(step.label, OklchLabel::Number(expected_labels[i]));
        }
    }

    #[test]
    fn test_generate_greyscale_oklch_first_step_lightness_is_very_bright() {
        let result = generate_greyscale_oklch();
        assert!(result[0].l > 0.9);
    }

    #[test]
    fn test_generate_greyscale_oklch_all_steps_have_zero_chroma() {
        let result = generate_greyscale_oklch();
        for step in result {
            assert_eq!(step.c, 0.0);
        }
    }

    #[test]
    fn test_generate_greyscale_oklch_all_steps_have_zero_hue() {
        let result = generate_greyscale_oklch();
        for step in result {
            assert_eq!(step.h, 0.0);
        }
    }

    #[test]
    fn test_generate_greyscale_oklch_steps_are_perceptually_descending() {
        let result = generate_greyscale_oklch();
        for i in 0..result.len() - 1 {
            assert!(result[i].l > result[i + 1].l);
        }
    }

    mod foreground_metadata {
        use crate::ContrastResult;

        use super::*;

        #[test]
        fn should_include_best_foreground() {
            let result = generate_greyscale_oklch();

            let step_50 = result
                .iter()
                .find(|step| step.label == OklchLabel::Number(50))
                .expect("Should have a 50 step");

            assert_eq!(
                step_50.best_foreground,
                OklchStep {
                    l: 0.100000024,
                    c: 0.0,
                    h: 0.0,
                    label: OklchLabel::Number(900),
                }
            );
        }

        #[test]
        fn should_include_contrast_result() {
            let result = generate_greyscale_oklch();

            let step_50 = result
                .iter()
                .find(|step| step.label == OklchLabel::Number(50))
                .expect("Should have a 50 step");

            assert_eq!(
                step_50.contrast_result,
                ContrastResult {
                    ratio: 17.79,
                    display_ratio: String::from("17.79:1"),
                    rating: String::from("AAA"),
                }
            );
        }
    }
}
