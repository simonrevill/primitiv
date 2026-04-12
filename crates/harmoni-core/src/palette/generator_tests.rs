use crate::palette::generator::SwatchLabel;
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
            let result = generate_palette(base_500, 0.0, 0.0);

            // Assert
            let base_500_step = &result.swatches[5];
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
            assert_eq!(result.swatches.len(), 10);
        }

        #[test]
        fn test_generate_greyscale_oklch_all_labels_are_correct() {
            let result = generate_greyscale_oklch();
            let expected_labels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

            for (i, step) in result.swatches.iter().enumerate() {
                assert_eq!(step.label, SwatchLabel::Number(expected_labels[i]));
            }
        }

        #[test]
        fn test_generate_greyscale_oklch_first_step_lightness_is_very_bright() {
            let result = generate_greyscale_oklch();
            assert!(result.swatches[0].l > 0.9);
        }

        #[test]
        fn test_generate_greyscale_oklch_all_steps_have_zero_chroma() {
            let result = generate_greyscale_oklch();
            for step in result.swatches {
                assert_eq!(step.c, 0.0);
            }
        }

        #[test]
        fn test_generate_greyscale_oklch_all_steps_have_zero_hue() {
            let result = generate_greyscale_oklch();
            for step in result.swatches {
                assert_eq!(step.h, 0.0);
            }
        }

        #[test]
        fn test_generate_greyscale_oklch_steps_are_perceptually_descending() {
            let result = generate_greyscale_oklch();
            for i in 0..result.swatches.len() - 1 {
                assert!(result.swatches[i].l > result.swatches[i + 1].l);
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
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(50))
                .expect("Should have a 50 step");

            assert_eq!(
                step_50.best_foreground,
                SwatchStep {
                    l: 0.049999982,
                    c: 0.0,
                    h: 0.0,
                    label: SwatchLabel::Number(900),
                }
            );
        }

        #[test]
        fn should_include_contrast_result() {
            let result = generate_greyscale_oklch();

            let step_50 = result
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(50))
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

    mod swatch_label {
        use super::*;

        #[test]
        fn should_create_label_from_str() {
            let label: SwatchLabel = "White".into();
            assert_eq!(label, SwatchLabel::Name(String::from("White")));
        }
    }

    mod max_chroma_hue_coverage {
        use super::*;

        #[test]
        fn should_generate_palette_for_purple_hue() {
            // Hue 280 covers the 256..=295 range
            let base = Oklch::new(0.55, 0.15, 280.0);
            let result = generate_palette(base, 0.0, 0.0);
            assert_eq!(result.swatches.len(), 10);
        }

        #[test]
        fn should_generate_palette_for_magenta_hue() {
            // Hue 310 covers the 296..=329 range
            let base = Oklch::new(0.55, 0.15, 310.0);
            let result = generate_palette(base, 0.0, 0.0);
            assert_eq!(result.swatches.len(), 10);
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
            let result = generate_palette(base, 0.0, 0.0);
            assert_eq!(result.swatches.len(), 10);
        }
    }

    mod light_padding {
        use super::*;

        #[test]
        fn should_make_light_end_of_scale_lighter_with_positive_light_padding() {
            // Arrange
            let base_500 = Oklch::new(0.55, 0.0, 0.0);
            let positive_light_padding = 0.06;
            let palette_with_no_padding = generate_palette_with_scale(
                base_500,
                &TARGET_LIGHTNESS,
                &TARGET_CHROMA_SCALE,
                0.0,
                0.0,
            );
            let step_50_no_padding_lightness = palette_with_no_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(50))
                .unwrap()
                .l;
            let step_100_no_padding_lightness = palette_with_no_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(100))
                .unwrap()
                .l;
            let step_200_no_padding_lightness = palette_with_no_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(200))
                .unwrap()
                .l;
            let step_300_no_padding_lightness = palette_with_no_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(300))
                .unwrap()
                .l;
            let palette_with_padding = generate_palette_with_scale(
                base_500,
                &TARGET_LIGHTNESS,
                &TARGET_CHROMA_SCALE,
                positive_light_padding,
                0.0,
            );
            let step_50_with_padding_lightness = palette_with_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(50))
                .unwrap()
                .l;
            let step_100_with_padding_lightness = palette_with_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(100))
                .unwrap()
                .l;
            let step_200_with_padding_lightness = palette_with_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(200))
                .unwrap()
                .l;
            let step_300_with_padding_lightness = palette_with_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(300))
                .unwrap()
                .l;

            // Assert
            assert!(step_50_with_padding_lightness > step_50_no_padding_lightness);
            assert!(step_100_with_padding_lightness > step_100_no_padding_lightness);
            assert!(step_200_with_padding_lightness > step_200_no_padding_lightness);
            assert!(step_300_with_padding_lightness > step_300_no_padding_lightness);
        }

        #[test]
        fn should_make_light_end_of_scale_darker_with_negative_light_padding() {
            // Arrange
            let base_500 = Oklch::new(0.55, 0.0, 0.0);
            let negative_light_padding = -0.06;
            let palette_with_no_padding = generate_palette_with_scale(
                base_500,
                &TARGET_LIGHTNESS,
                &TARGET_CHROMA_SCALE,
                0.0,
                0.0,
            );
            let step_50_no_padding_lightness = palette_with_no_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(50))
                .unwrap()
                .l;
            let step_100_no_padding_lightness = palette_with_no_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(100))
                .unwrap()
                .l;
            let step_200_no_padding_lightness = palette_with_no_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(200))
                .unwrap()
                .l;
            let step_300_no_padding_lightness = palette_with_no_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(300))
                .unwrap()
                .l;
            let palette_with_padding = generate_palette_with_scale(
                base_500,
                &TARGET_LIGHTNESS,
                &TARGET_CHROMA_SCALE,
                negative_light_padding,
                0.0,
            );
            let step_50_with_padding_lightness = palette_with_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(50))
                .unwrap()
                .l;
            let step_100_with_padding_lightness = palette_with_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(100))
                .unwrap()
                .l;
            let step_200_with_padding_lightness = palette_with_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(200))
                .unwrap()
                .l;
            let step_300_with_padding_lightness = palette_with_padding
                .swatches.iter()
                .find(|step| step.label == SwatchLabel::Number(300))
                .unwrap()
                .l;

            // Assert
            assert!(step_50_with_padding_lightness < step_50_no_padding_lightness);
            assert!(step_100_with_padding_lightness < step_100_no_padding_lightness);
            assert!(step_200_with_padding_lightness < step_200_no_padding_lightness);
            assert!(step_300_with_padding_lightness < step_300_no_padding_lightness);
        }
    }

    mod dark_padding {
        use super::*;

        #[test]
        fn should_make_dark_end_of_scale_darker_with_positive_dark_padding() {
            let base_500 = Oklch::new(0.55, 0.0, 0.0);
            let positive_dark_padding = 0.06;

            let no_padding = generate_palette_with_scale(
                base_500,
                &TARGET_LIGHTNESS,
                &TARGET_CHROMA_SCALE,
                0.0,
                0.0,
            );
            let step_800_no = no_padding
                .swatches.iter()
                .find(|s| s.label == SwatchLabel::Number(800))
                .unwrap()
                .l;
            let step_900_no = no_padding
                .swatches.iter()
                .find(|s| s.label == SwatchLabel::Number(900))
                .unwrap()
                .l;

            let with_padding = generate_palette_with_scale(
                base_500,
                &TARGET_LIGHTNESS,
                &TARGET_CHROMA_SCALE,
                0.0,
                positive_dark_padding,
            );
            let step_800_with = with_padding
                .swatches.iter()
                .find(|s| s.label == SwatchLabel::Number(800))
                .unwrap()
                .l;
            let step_900_with = with_padding
                .swatches.iter()
                .find(|s| s.label == SwatchLabel::Number(900))
                .unwrap()
                .l;

            assert!(step_800_with < step_800_no);
            assert!(step_900_with < step_900_no);
        }

        #[test]
        fn should_make_dark_end_of_scale_lighter_with_negative_dark_padding() {
            let base_500 = Oklch::new(0.55, 0.0, 0.0);
            let negative_dark_padding = -0.06;

            let no_padding = generate_palette_with_scale(
                base_500,
                &TARGET_LIGHTNESS,
                &TARGET_CHROMA_SCALE,
                0.0,
                0.0,
            );
            let step_800_no = no_padding
                .swatches.iter()
                .find(|s| s.label == SwatchLabel::Number(800))
                .unwrap()
                .l;
            let step_900_no = no_padding
                .swatches.iter()
                .find(|s| s.label == SwatchLabel::Number(900))
                .unwrap()
                .l;

            let with_padding = generate_palette_with_scale(
                base_500,
                &TARGET_LIGHTNESS,
                &TARGET_CHROMA_SCALE,
                0.0,
                negative_dark_padding,
            );
            let step_800_with = with_padding
                .swatches.iter()
                .find(|s| s.label == SwatchLabel::Number(800))
                .unwrap()
                .l;
            let step_900_with = with_padding
                .swatches.iter()
                .find(|s| s.label == SwatchLabel::Number(900))
                .unwrap()
                .l;

            assert!(step_800_with > step_800_no);
            assert!(step_900_with > step_900_no);
        }
    }

    mod metadata_tests {
    use super::*;

    #[test]
    fn every_palette_swatch_contains_metadata() {
        let base = Oklch::new(0.55, 0.18, 260.0); // blue-ish

        let palette = generate_palette_with_scale(
            base,
            &TARGET_LIGHTNESS,
            &TARGET_CHROMA_SCALE,
            0.0,
            0.0,
        );

        assert!(!palette.swatches.is_empty());

        assert!(palette.max_recommended_light_padding > 0.0);
        assert!(palette.max_recommended_dark_padding > 0.0);
    }

    #[test]
    fn metadata_limits_vary_by_hue() {
        let yellow = Oklch::new(0.55, 0.18, 80.0);   // yellow – more constrained
        let blue   = Oklch::new(0.55, 0.18, 260.0);  // blue   – more headroom

        let yellow_palette = generate_palette_with_scale(yellow, &TARGET_LIGHTNESS, &TARGET_CHROMA_SCALE, 0.0, 0.0);
        let blue_palette   = generate_palette_with_scale(blue,   &TARGET_LIGHTNESS, &TARGET_CHROMA_SCALE, 0.0, 0.0);

        assert!(
            yellow_palette.max_recommended_light_padding < blue_palette.max_recommended_light_padding,
            "Yellow should have tighter light padding limit than blue"
        );
    }

    mod palette_struct_tests {
        use super::*;

        #[test]
        fn palette_struct_exposes_metadata_fields() {
            // Arrange
            let base_500 = Oklch::new(0.55, 0.15, 240.0);
            let palette = generate_palette(base_500, 0.0, 0.0);

            // Assert: Palette should have metadata fields accessible directly
            assert!(palette.max_recommended_light_padding > 0.0);
            assert!(palette.max_recommended_dark_padding > 0.0);
            assert_eq!(palette.note, "");
        }

        #[test]
        fn palette_struct_contains_swatches() {
            // Arrange
            let base_500 = Oklch::new(0.55, 0.15, 240.0);
            let palette = generate_palette(base_500, 0.0, 0.0);

            // Assert: Palette should have a swatches field with 10 items
            assert_eq!(palette.swatches.len(), 10);
            assert_eq!(palette.swatches[5].label, SwatchLabel::Number(500));
        }
    }
}
}
