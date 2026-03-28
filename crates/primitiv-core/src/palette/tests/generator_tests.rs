// crates/primitiv-core/src/palette/generator_tests.rs
use crate::palette::generator::*;

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
        assert_eq!(step.label, expected_labels[i]);
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
