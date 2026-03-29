import { test, expect } from "@playwright/test";

test("Double Loop: Accessible Contrast Toggle", async ({ page }) => {
  // 1. Arrange: Go to the app
  await page.goto("/");

  // Define locators based on Accessible Roles and Names
  const preview = page.getByRole("region", { name: /color preview/i });

  // We look for the 'status' regions by the text they are labeled with
  const statusRatio = page.getByRole("status", { name: /ratio/i });
  const statusRating = page.getByRole("status", { name: /rating/i });

  // 2. Assert: Initial State (Black background, White text)
  await expect(preview).toHaveCSS("background-color", "oklch(0 0 0)");
  await expect(preview).toHaveCSS("color", "oklch(1 0 0)");

  // Wait for Wasm to hydrate (replaces "Loading..." with the real ratio)
  await expect(statusRatio).not.toHaveText(/Loading/i);
  await expect(statusRatio).toHaveText(/21.00:1/i);
  await expect(statusRating).toHaveText(/Rating: AAA/i);

  // 3. Act: Switch to White background
  const colorWhiteRadio = page.getByLabel(/White/i);
  await colorWhiteRadio.check();

  // 4. Assert: New State (White background, Black text)
  await expect(preview).toHaveCSS("background-color", "oklch(1 0 0)");
  await expect(preview).toHaveCSS("color", "oklch(0 0 0)");

  // Verify the ratio remains 21.00:1 for Black/White flip
  await expect(statusRatio).toHaveText(/21.00:1/i);
  await expect(statusRating).toHaveText(/Rating: AAA/i);

  // 5. Act: Switch to Pink (The "Fail" case)
  const colorPinkRadio = page.getByLabel(/Pink/i);
  await colorPinkRadio.check();

  // Assert: Pink background with White text (Should result in a Fail)
  await expect(preview).toHaveCSS(
    "background-color",
    "oklch(0.8677 0.0735 7.09)",
  ); // Pink
  await expect(preview).toHaveCSS("color", "oklch(1 0 0)"); // White

  // Pink (#FFC0CB) vs White (#FFFFFF) ratio is ~1.78:1
  await expect(statusRatio).toHaveText(/1.54:1/i);
  await expect(statusRating).toHaveText(/Rating: Fail/i);
});
