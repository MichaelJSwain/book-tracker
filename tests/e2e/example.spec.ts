import { test, expect } from '@playwright/test';

test.describe("Book List Page", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("http://localhost:5173");
  });

  test("should have correct metadata and elements (empty view)", async ({page}) => {
    const title = "Get Started!";
    const message = "Click the 'Add books' button to get started.";

    await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible();
    await expect(page.getByRole('button', {name: 'Add book'})).toBeVisible();
    await expect(page.locator('.empty-view')).toBeVisible();
    await expect(page.locator('.empty-view-img')).toBeVisible();
    await expect(page.locator('.empty-view-title')).toHaveText(title);
    await expect(page.locator('.empty-view-message')).toHaveText(message);
  });
});
