use crate::palette::generator::OklchLabel;
use crate::palette::generator::*;
use palette::Oklch;

#[cfg(test)]
mod generator_tests {
    use super::*;

    mod palette_generation {
        use super::*;

        #[test]
        fn should_preserve_the_base_500_color_that_was_passed_in() {
            // Arrange
            let base_500 = Oklch::new(0.55, 0.15, 240.0);
            let result = generate_palette(base_500);
    
            // Assert
            let base_500_step = &result[5];
            assert_eq!(base_500.l, base_500_step.l);
            assert_eq!(base_500.chroma, base_500_step.c);
            assert_eq!(base_500.hue.into_degrees(), base_500_step.h);
        }
    }

    mod greyscale_palette_generation {
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
                    l: 0.049999982,
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
                    ratio: 16.53,
                    display_ratio: String::from("16.53:1"),
                    rating: String::from("AAA"),
                }
            );
        }
    }

    mod oklch_label {
        use super::*;

        #[test]
        fn should_create_label_from_str() {
            let label: OklchLabel = "White".into();
            assert_eq!(label, OklchLabel::Name(String::from("White")));
        }
    }

    mod max_chroma_hue_coverage {
        use super::*;

        #[test]
        fn should_generate_palette_for_purple_hue() {
            // Hue 280 covers the 256..=295 range
            let base = Oklch::new(0.55, 0.15, 280.0);
            let result = generate_palette(base);
            assert_eq!(result.len(), 10);
        }

        #[test]
        fn should_generate_palette_for_magenta_hue() {
            // Hue 310 covers the 296..=329 range
            let base = Oklch::new(0.55, 0.15, 310.0);
            let result = generate_palette(base);
            assert_eq!(result.len(), 10);
        }

        #[test]
        fn should_generate_palette_for_edge_case_hue() {
            // Hue 361+ wraps via rem_euclid — after % 360 it becomes 1,
            // which lands in 0..=30. Use a negative hue to exercise the
            // _ fallback (unreachable in practice due to rem_euclid 0..=360,
            // but we can test with hue 360 exactly which matches 0..=30|330..=360).
            // Actually the _ arm is unreachable since hue ranges 0..=360 are
            // fully covered. Let's just verify wrapping works.
            let base = Oklch::new(0.55, 0.15, 720.0);
            let result = generate_palette(base);
            assert_eq!(result.len(), 10);
        }
    }

    mod light_padding {
        use super::*;

        #[test]
        fn should_make_light_end_of_scale_lighter_with_positive_light_padding() {
            // Arrange
            let base_500 = Oklch::new(0.55, 0.0, 0.0);
            let palette_with_no_padding = generate_palette_with_scale(base_500, &TARGET_LIGHTNESS, &TARGET_CHROMA_SCALE, 0.0);
            let step_50_no_padding_lightness = palette_with_no_padding.iter().find(|step| step.label == OklchLabel::Number(50)).unwrap().l;
            let palette_with_padding = generate_palette_with_scale(base_500, &TARGET_LIGHTNESS, &TARGET_CHROMA_SCALE, 0.06);
            let step_50_with_padding_lightness = palette_with_padding.iter().find(|step| step.label == OklchLabel::Number(50)).unwrap().l;

            // Assert
            assert!(step_50_with_padding_lightness > step_50_no_padding_lightness);
        }
    }
}
