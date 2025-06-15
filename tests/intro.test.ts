import { describe, test, it, expect, beforeEach, vi } from "vitest";
import {createBook, fetchBooks} from "../src/intro";
import { setupMockLocalStorage } from "./mocks/setupMockLocalStorage.ts";

describe("create book", () => {
    it("should return a book object if the title, author and status are passed as args", () => {
        // arrange
        const title = "The great book";
        const author = "Dave Smith";
        const status = "Reading";

        // act
        const result = createBook(title, author, status);

        console.log("book result = ", result);
        
        // assert
        expect(result).toBeTypeOf("object");
    });

    it("should return an object containing the status code and message if it was unable to create the book", () => {
        const title = "error";
        const author = "Dave Smith";
        const status = "Reading";

        const error = {message: "Sorry, unable to create book"};

        const result = createBook(title, author, status);

        expect(result).toEqual(error);
    });
});

describe("fetch books", () => {
    beforeEach(() => {
        setupMockLocalStorage();
        console.log(localStorage);
    });

    it("returns an empty array if no books are stored", () => {
        // act
        const result = fetchBooks();

        // assert
        expect(result).toEqual([]);
    });
    it('returns array of Books if books are found in localStorage', () => {
        // arrange
        const books = [{title: 'book 1', author: 'dave smith', status: 'reading'},
            {title: 'book 2', author: 'sarah simon', status: 'reading'},
            {title: 'book 2', author: 'sarah simon', status: 'reading'}
        ];
        localStorage.setItem('book_list', JSON.stringify(books));

        // act
        const result = fetchBooks();

        // assert
        expect(result).toEqual(books);
    });
});