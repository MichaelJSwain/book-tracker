import { test, expect } from '@playwright/test';

test.describe("Book List Page", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("http://localhost:5173");
  });

  test("should have correct metadata and elements", async ({page}) => {
    await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible();
    await expect(page.getByRole('button', {name: 'Add book'})).toBeVisible();
    await expect(page.getByPlaceholder('Search for a book...')).toBeVisible()
  });
});
