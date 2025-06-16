import { describe, test, it, expect, beforeEach, vi } from "vitest";
import {createBook, deleteBook, fetchBook, fetchBooks} from "../src/intro";
import { setupMockLocalStorage } from "./mocks/setupMockLocalStorage.ts";
import { v4 as UUID } from "uuid";

describe("create book", () => {
    it("should return a book object if the title, author and status are passed as args", () => {
        // arrange
        const title = "The great book";
        const author = "Dave Smith";
        const status = "Reading";

        // act
        const result = createBook(title, author, status);
        
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
    });

    it("returns an empty array if no books are stored", () => {
        // act
        const result = fetchBooks();

        // assert
        expect(result).toEqual([]);
    });
    it('returns array of Books if books are found in localStorage', () => {
        // arrange
        const books = [{id: 1, title: 'book 1', author: 'dave smith', status: 'reading'},
            {id: 2, title: 'book 2', author: 'sarah simon', status: 'reading'}
        ];
        localStorage.setItem('book_list', JSON.stringify(books));

        // act
        const result = fetchBooks();

        // assert
        expect(result).toEqual(books);
    });
});

describe("fetch a single book", () => {
    beforeEach(() => {
        setupMockLocalStorage();
    });

    it("returns a book if the book is found in localStorage", () => {
        // arrange
        const bookId = UUID();
        const books = [{id: bookId, title: 'book 1', author: 'dave smith', status: 'reading', imageUrl: null, number_of_pages: 100},
            {id: UUID(), title: 'book 2', author: 'sarah simon', status: 'reading', imageUrl: null, number_of_pages: 100}
        ];
        localStorage.setItem('book_list', JSON.stringify(books));

        // act
        const result = fetchBook(bookId);

        // assert
        expect(result).toEqual(books[0]);
    });

    it("should return an object with a message if the book is not found in localStorage", () => {
        // arrange
        const noBookFoundResponse = {message: "Sorry, couldn't find book"};
        const bookId = UUID();
        const books = [{id: UUID(), title: 'book 1', author: 'dave smith', status: 'reading', imageUrl: null, number_of_pages: 100},
            {id: UUID(), title: 'book 2', author: 'sarah simon', status: 'reading', imageUrl: null, number_of_pages: 100}
        ];
        localStorage.setItem('book_list', JSON.stringify(books));

        // act
        const result = fetchBook(bookId);

        // assert
        expect(result).toEqual(noBookFoundResponse);
    });

    it("should return an object with a message if there are no books in localStorage", () => {
        const noBooksFoundResponse = {message: "Sorry, couldn't find any book"};
        const bookId = UUID();

        const result = fetchBook(bookId);

        expect(result).toEqual(noBooksFoundResponse);
    });
});

describe("delete a book", () => {
    beforeEach(() => {
        setupMockLocalStorage();
    });

    it("should delete a book and return success message if book is successfully deleted", () => {
        const successMessage = {message: "Successfully deleted book"};
        const bookId = UUID();
        const books = [{id: bookId, title: 'book 1', author: 'dave smith', status: 'reading', imageUrl: null, number_of_pages: 100},
            {id: UUID(), title: 'book 2', author: 'sarah simon', status: 'reading', imageUrl: null, number_of_pages: 100}
        ];

        localStorage.setItem('book_list', JSON.stringify(books));

        const result = deleteBook(bookId);

        expect(result).toEqual(successMessage);
    });

    it("should return error message if unable to delete book from localStorage", () => {
        const failureMessage = {message: "Sorry, unable to delete book"};
        const bookId = UUID();
        const books = [{id: UUID(), title: 'book 1', author: 'dave smith', status: 'reading', imageUrl: null, number_of_pages: 100},
            {id: UUID(), title: 'book 2', author: 'sarah simon', status: 'reading', imageUrl: null, number_of_pages: 100}
        ];

        localStorage.setItem('book_list', JSON.stringify(books));

        const result = deleteBook(bookId);

        expect(result).toEqual(failureMessage);
    });

     it("should return error message if unable no items in localStorage", () => {
            const failureMessage = {message: "Sorry, no books in localStorage"};
            const bookId = UUID();

            const result = deleteBook(bookId);

            expect(result).toEqual(failureMessage);
     });
});