pub fn generate_greyscale_oklch() -> Vec<i32> {
    let mut vec = Vec::new();

    for i in 1..=10 {
        vec.push(i);
    }

    vec
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_greyscale_oklch_returns_ten_steps() {
        // Arrange
        let result = generate_greyscale_oklch();

        // Assert
        assert_eq!(result.len(), 10);
    }
}
