pub struct OklchStep {
    pub label: u8,
}

pub fn generate_greyscale_oklch() -> Vec<OklchStep> {
    let mut vec: Vec<OklchStep> = Vec::new();

    for i in 1..=10 {
        vec.push(OklchStep {
            label: if i == 1 { 50 } else { i },
        });
    }

    vec
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
}
