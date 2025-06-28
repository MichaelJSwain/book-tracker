// import { test, expect } from '@playwright/test';

// test.describe("Book List Page", () => {
//   test.beforeEach(async ({page}) => {
//     await page.goto("http://localhost:5174");
//   });

//   test("should have correct metadata and elements", async ({page}) => {
//     const heading = page.getByRole("heading", {name: "Book list view"});

//     expect(heading).toBeVisible();
//   });

//   test("should create a new book and display in list", async ({page}) => {
//       await page.getByPlaceholder("title").fill("harry potter");
//       await page.getByPlaceholder("author").fill("j.k. rowling");
//       await page.getByPlaceholder("status").fill("reading");
//       await page.getByPlaceholder("number of pages").fill("389");
//       await page.getByTestId("save-book-button").click();
//       await expect(page.getByTestId("book-card")).toHaveCount(1);
//   });

//   test("should display error if could not create book", async ({page}) => {
//       await page.getByPlaceholder("title").fill("harry potter");
//       await page.getByPlaceholder("author").fill("j.k. rowling");
//       await page.getByPlaceholder("status").fill("reading");
//       await page.getByTestId("save-book-button").click();
//       await expect(page.getByTestId("error-message")).toBeVisible();
//   });

// });
