import { test, expect } from '@playwright/test';
import { mockBooks } from '../mocks/mockData';

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

  test("should create a new book and add it to the list", async ({ page }) => {
    await page.goto('http://localhost:5173');

    const AddBookBtn = await page.getByRole('button', {name: 'Add book'});
    await AddBookBtn.click();
    await page.locator('input[name="title"]').fill("Strange Pictures");
    await page.locator('input[name="author"]').fill("Uketsu");
    await page.locator('input[name="status"]').fill("to read");
    await page.locator('input[name="imageUrl"]').fill("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1728787087i/216670080.jpg");
    await page.locator('input[name="number_of_pages"]').fill("300");
    await page.getByTestId('save-book-button').click();

    await expect(page.locator('.book-card')).toBeVisible();
    await expect(page.locator('.book-img')).toHaveAttribute('src', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1728787087i/216670080.jpg');
    await expect(page.locator('.status-label-icon [data-testid="icon-utility-wishlist-svg"]')).toBeVisible();
    await expect(page.locator('.status-label-text')).toHaveText("To Read");
    await expect(page.locator('.book-details')).toHaveText('Strange PicturesUketsu');
  });

  test("should delete a book", async ({ page }) => {


      // Add the localStorage data before the page loads
      await page.addInitScript((books) => {
        localStorage.setItem('book_list', JSON.stringify(books));
      }, mockBooks);

      await page.goto('http://localhost:5173');

      await page.locator('.book-card').count() === 3;
      await page.locator('.book-card').first().getByRole('button', {name: "..."}).click();
      await page.locator('.tooltip-item').nth(1).click();

      await expect(page.locator('.book-card')).toHaveCount(2);
      const firstBook = page.locator('.book-card').first()
      await expect(firstBook.locator('.book-details')).not.toHaveText(mockBooks[0].title + mockBooks[0].author);
      await expect(firstBook.locator('.book-img').getAttribute('src')).not.toBe(mockBooks[0].imageUrl);
      await expect(firstBook.locator('.status-label-text')).not.toBe(mockBooks[0].status);

      const pageDetails = await page.evaluate(() => {
         const bookList = JSON.parse(localStorage.getItem("book_list") || '[]');
        const isBookDeleted = !bookList.find(book => book.title === '1984');

          return {
            bookCount: bookList.length,
            isBookDeleted
          }
      });

      expect(pageDetails.bookCount).toBe(2);
      expect(pageDetails.isBookDeleted).toBeTruthy();
  });

  test("should update a book", async ({ page }) => {
    await page.addInitScript((books) => {
      localStorage.setItem("book_list", JSON.stringify(books));
    }, mockBooks);

    await page.goto('http://localhost:5173');

    const bookCards = await page.locator('.book-card');
    const firstCard = await bookCards.first();

    await firstCard.getByRole('button').click();
    await firstCard.locator('.tooltip-item').first().click();

    await page.locator('input[name="title"]').fill('2025');
    await page.locator('input[name="author"]').fill('George Orwell');
    await page.locator('input[name="status"]').fill('Read');
    await page.locator('input[name="imageUrl"]').fill('https://m.media-amazon.com/images/I/31MC-vg8ShL._UF1000,1000_QL80_.jpg');
    await page.locator('input[name="number_of_pages"]').fill('300');
    await page.getByTestId('save-book-button').click();

    await expect(firstCard.locator('.book-details')).toHaveText(`2025George Orwell`);
    await expect(firstCard.locator('.number-of-pages')).toHaveText('300 pages');
    await expect(firstCard.locator('.book-img')).toHaveAttribute('src', 'https://m.media-amazon.com/images/I/31MC-vg8ShL._UF1000,1000_QL80_.jpg');

    const hasUpdatedLocalStorage = await page.evaluate(() => {
      const book = JSON.parse(localStorage.getItem("book_list") || '[]')[0];

      if (
          book.title === "2025" && 
          book.author === "George Orwell" &&
          book.status === "Read" &&
          book.imageUrl === "https://m.media-amazon.com/images/I/31MC-vg8ShL._UF1000,1000_QL80_.jpg" &&
          book.number_of_pages === "300"
        ) {
        return true
      }
      return false;
    });

    expect(hasUpdatedLocalStorage).toBeTruthy();
  });

  test("should filter books by search query in input field an return 1 result", async ({ page }) => {
    await page.addInitScript((books) => {
      localStorage.setItem("book_list", JSON.stringify(books));
    }, mockBooks);

    await page.goto('http://localhost:5173');
    await page.locator('.book-card');

    await page.getByPlaceholder('Search for a book...').fill('Dune');
    await expect(page.locator('.book-card')).toHaveCount(1);
  });

  test("should filter books by search query in input field an return 2 result", async ({ page }) => {
    await page.addInitScript((books) => {
      localStorage.setItem("book_list", JSON.stringify(books));
    }, mockBooks);

    await page.goto('http://localhost:5173');
    await page.locator('.book-card');

    await page.getByPlaceholder('Search for a book...').fill('H');
    await expect(page.locator('.book-card')).toHaveCount(2);
  });

  test("should filter books by search query in input field an return 0 result", async ({ page }) => {
    await page.addInitScript((books) => {
      localStorage.setItem("book_list", JSON.stringify(books));
    }, mockBooks);

    await page.goto('http://localhost:5173');
    await page.locator('.book-card');

    await page.getByPlaceholder('Search for a book...').fill('XYZ');
    await expect(page.locator('.book-card')).toHaveCount(0);
  });

  test("should sort books in ascending order based on selected sort option", async ({ page }) => {
    await page.addInitScript((books) => {
      localStorage.setItem("book_list", JSON.stringify(books));
    }, mockBooks);

    await page.goto('http://localhost:5173');
    
    const sortTooltip = await page.locator('.sort-controls .tooltip-group');
    await sortTooltip.getByRole('button').click();
    await sortTooltip.locator('.tooltip-item').nth(1).click();
    
    await expect(page.locator('.book-card').first().locator('.book-details')).toHaveText('DuneFrank Herbert');
    await expect(page.locator('.book-card').nth(1).locator('.book-details')).toHaveText('The HobbitJ.R.R. Tolkien');
    await expect(page.locator('.book-card').nth(2).locator('.book-details')).toHaveText('1984george orrwell');
  });

  test("should sort books in descending order based on title", async ({ page }) => {
    await page.addInitScript((books) => {
      localStorage.setItem("book_list", JSON.stringify(books));
    }, mockBooks);

    await page.goto('http://localhost:5173');

    await page.locator('.sort-controls button').nth(1).click();
    await expect(page.locator('.book-card').nth(0).locator('.book-details')).toHaveText('The HobbitJ.R.R. Tolkien');
    await expect(page.locator('.book-card').nth(1).locator('.book-details')).toHaveText('DuneFrank Herbert');
    await expect(page.locator('.book-card').nth(2).locator('.book-details')).toHaveText('1984george orrwell');
  });
});
