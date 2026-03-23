import { test, expect } from '@playwright/test';

test('Double Loop: Accessible Contrast Toggle', async ({ page }) => {
  // Arrange
  await page.goto('/');
  const preview = page.getByRole('region', { name: /color preview/i });
  const statusRatio = page.getByRole('status', { name: /status-ratio/i });
  const statusRating = page.getByRole('status', { name: /status-rating/i });

  // Assert
  await expect(preview).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(preview).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(statusRatio).toHaveText(/21.00:1/i);
  await expect(statusRating).toHaveText(/Rating: AAA/i);

  // Act
  const colorWhiteRadio = page.getByLabel(/White/i);
  await colorWhiteRadio.check();

  // Assert
  await expect(preview).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(preview).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(statusRatio).toHaveText(/21.00:1/i);
  await expect(statusRating).toHaveText(/Rating: AAA/i);
});