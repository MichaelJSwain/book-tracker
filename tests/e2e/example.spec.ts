import { test, expect } from '@playwright/test';

test.describe("Book List Page", () => {
  test("should have correct metadata and elements (empty view)", async ({page}) => {
    const title = "Get Started!";
    const message = "Click the 'Add books' button to get started.";

    await page.goto('http://localhost:5173');

    await expect(page.getByRole('heading', { name: 'My Books' })).toBeVisible();
    await expect(page.getByRole('button', {name: 'Add book'})).toBeVisible();
    await expect(page.locator('.empty-view')).toBeVisible();
    await expect(page.locator('.empty-view-img')).toBeVisible();
    await expect(page.locator('.empty-view-title')).toHaveText(title);
    await expect(page.locator('.empty-view-message')).toHaveText(message);
  });

  test("should have correct metadata and elements (non-empty view)", async ({ page }) => {
      const mockBooks = [
        {
          id: '1',
          title: '1984',
          author: 'George Orwell',
          status: 'Reading',
          imageUrl: 'https://m.media-amazon.com/images/I/71wANojhEKL._UF894,1000_QL80_.jpg'
        },
        {
          id: '2',
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          status: 'To Read',
          imageUrl: 'https://m.media-amazon.com/images/I/712cDO7d73L._UF894,1000_QL80_.jpg'
        },
        {
          id: '3',
          title: 'Dune',
          author: 'Frank Herbert',
          status: 'Read',
          imageUrl: 'https://m.media-amazon.com/images/I/81Ua99CURsL.jpg'
        }
      ];

      // Add the localStorage data before the page loads
      await page.addInitScript((books) => {
        localStorage.setItem('book_list', JSON.stringify(books));
      }, mockBooks);

      await page.goto('http://localhost:5173');

      // Assertions
      // 1. toolbar
      await expect(page.getByPlaceholder('Search for a book...')).toBeVisible();
      await expect(page.getByRole('button', {name: 'Sort by: title'})).toBeVisible();
      await expect(page.getByRole('button', {name: 'asc'})).toBeVisible();

      // 2. book list
      const bookCards = await page.locator('.book-card').all();
      await expect(bookCards).toHaveLength(3);

      for (let i = 0; i < 3; i++) {
        const card = bookCards[i];
        await expect(card.locator('.book-details')).toHaveText(mockBooks[i].title + mockBooks[i].author);
        await expect(card.locator('.book-img')).toHaveAttribute('src', mockBooks[i].imageUrl);
        await expect(card.locator('.status-label')).toBeVisible();
        await expect(card.locator('.tooltip-group')).toBeVisible();
      }
    });
});
