import { describe, test, it, expect, beforeEach, vi, afterEach } from "vitest";
import {createBook, deleteBook, fetchBook, fetchBooks, filterBooks, saveBooks, sortBooks, updateBook} from "../src/intro";
import { setupMockLocalStorage } from "./mocks/setupMockLocalStorage.ts";
import { v4 as UUID } from "uuid";

describe("create book", () => {
    beforeEach(() => {
        setupMockLocalStorage();
    });

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
        const noBooksFoundResponse = { message: "Sorry, couldn't find book" };
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
        const failureMessage = {message: "Sorry, unable to delete book"};
        const bookId = UUID();

        const result = deleteBook(bookId);

        expect(result).toEqual(failureMessage);
     });
});

describe("update a book", () => {
    beforeEach(() => {
        setupMockLocalStorage();
    });

    it("should update the book if found in localStorage and return the updated book + success message", () => {
        const bookId = UUID();
        const books = [{id: bookId, title: 'book 1', author: 'dave smith', status: 'reading', imageUrl: null, number_of_pages: 100},
            {id: UUID(), title: 'book 2', author: 'sarah simon', status: 'reading', imageUrl: null, number_of_pages: 100}
        ];

        localStorage.setItem('book_list', JSON.stringify(books));

        const updatedBook = {id: bookId, title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0};
        const success = {data: updatedBook, message: "Successfully updated book"};

        const result = updateBook(updatedBook);
        
        expect(result).toEqual(success);
    });

    it("should return error message if can't find book in localStorage", () => {
        const bookId = UUID();
        const books = [{id: UUID(), title: 'book 1', author: 'dave smith', status: 'reading', imageUrl: null, number_of_pages: 100},
            {id: UUID(), title: 'book 2', author: 'sarah simon', status: 'reading', imageUrl: null, number_of_pages: 100}
        ];

        localStorage.setItem('book_list', JSON.stringify(books));

        const updatedBook = {id: bookId, title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0};
        const error = {data: null, message: "Unable to find book"};

        const result = updateBook(updatedBook);
        
        expect(result).toEqual(error);
    });

    it("should return error message if nothing in localStorage", () => {
        const bookId = UUID();
        const updatedBook = {id: bookId, title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0};
        const error = {data: null, message: "Unable to find book"};

        const result = updateBook(updatedBook);
        
        expect(result).toEqual(error);
    });
});

describe("save books in localStorage", () => {
    beforeEach(() => {
        setupMockLocalStorage();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should return success response object if the array of Book types were successfully saves to localStorage", () => {
        const books = [
            {id: UUID(), title: 'book 1', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 3', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 4', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];
        const successResponse = { success: true, message: 'Books saved successfully.' };

        const result = saveBooks(books);

        expect(result).toEqual(successResponse);
    });

    it("should return failure response object if passing an invalid type as arg", () => {
        const books = "books";
        
        const failureResponse =  {success: false, message: "Invalid input: expected an array of books."}

         const result = saveBooks(books);

         expect(result).toEqual(failureResponse);
    });

    it("should return failure response object if unable to save array of Book types to localStorage", () => {
        const books = [
            {id: UUID(), title: 'throw error', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 3', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 4', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];
        
        vi.spyOn(localStorage, "setItem").mockImplementation(() => {
            throw new Error("Mock save books failure case");
        });

        const failureResponse = {success: false, message: "Failed to save books to localStorage."};

         const result = saveBooks(books);

         expect(result).toEqual(failureResponse);
         
    });
});

describe("filter book list", () => {
    it("should return an updated list of books where the title or author match the search string", () => {
        const unfilteredList = [{id: UUID(), title: 'book 1', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 3', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 4', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'the book of darren', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 6', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];
        const searchString = "darren";
        const filteredList = [unfilteredList[1], unfilteredList[3], unfilteredList[4]];

        const result = filterBooks(unfilteredList, searchString);

        expect(result).toEqual(filteredList);
    });

    it("should return an empty array if there are no book titles or authors in the list that match the search string", () => {
        const unfilteredList = [{id: UUID(), title: 'book 1', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 3', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 4', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'the book of darren', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 6', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];
        const searchString = "the lord of the rings";
        const emptyList = [];

        const result = filterBooks(unfilteredList, searchString);

        expect(result).toEqual(emptyList);
    });

    it("should return all books if the search string is empty", () => {
        const unfilteredList = [{id: UUID(), title: 'book 1', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 3', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 4', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'the book of darren', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 6', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const searchString = "";

        const result = filterBooks(unfilteredList, searchString);

        expect(result).toEqual(unfilteredList);
    });

    it("should return all books for whitespace-only string", () => {
        const unfilteredList = [{id: UUID(), title: 'book 1', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 3', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 4', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'the book of darren', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 6', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const searchString = " ";

        const result = filterBooks(unfilteredList, searchString);

        expect(result).toEqual(unfilteredList);
    });

    it("should return empty array if no books in book list", () => {
        const unfilteredList = [];

        const searchString = "harry";

        const result = filterBooks(unfilteredList, searchString);

        expect(result).toEqual([]);
    });

    it("should return book with title Ender's Game if Ender's is passed as search term (handle special characters / punc)", () => {
        const unfilteredList = [{id: UUID(), title: 'book 1', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 2', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 3', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 4', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'the book of darren', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'book 6', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: "Ender's game", author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const searchString = "Ender's";

        const result = filterBooks(unfilteredList, searchString);

        expect(result).toEqual([unfilteredList[6]]);
    });

    it("should return 'Harry Potter' and 'harry pinter' if 'harry' passed as search string (case-sensitive matching)", () => {
        const unfilteredList = [
            {id: UUID(), title: 'yah', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'oi', author: 'harry pinter', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'abracadabra', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'meh', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'allo', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'Harry Potter', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const filteredList = [
            unfilteredList[1],
            unfilteredList[5]
        ];

        const searchString = "harry";

        const result = filterBooks(unfilteredList, searchString);

        expect(result).toEqual(filteredList);
    });

    it("should return 'Harry Potter' if 'Pot' is passed as search string (partial matches)", () => {
        const unfilteredList = [
            {id: UUID(), title: 'yah', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'oi', author: 'harry pinter', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'abracadabra', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'meh', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'allo', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'Harry Potter', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ]; 

        const searchTerm = "Pot";

        const filteredList = [unfilteredList[5]];

        const result = filterBooks(unfilteredList, searchTerm);
        
        expect(result).toEqual(filteredList);
    });
});

describe("sort book list", () => {
    it("should return an array of books with the title sorted in alphabetical order", () => {
        const unsortedList = [
            {id: UUID(), title: 'yah', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'oi', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'abracadabra', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'meh', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'allo', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'huh', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const sortedList = [
            unsortedList[2],
            unsortedList[4],
            unsortedList[5],
            unsortedList[3],
            unsortedList[1],
            unsortedList[0]
        ]

        const sortOption = "title";

        const result = sortBooks(unsortedList, sortOption);

        expect(result).toEqual(sortedList);
    });

    it("should return an array of books with the author sorted in alphabetical order", () => {
        const unsortedList = [
            {id: UUID(), title: 'yah', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'oi', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'abracadabra', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'meh', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'allo', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'huh', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const sortedList = [
            unsortedList[3],
            unsortedList[5],
            unsortedList[1],
            unsortedList[2],
            unsortedList[4],
            unsortedList[0]
        ]

        const sortOption = "author";

        const result = sortBooks(unsortedList, sortOption);

        expect(result).toEqual(sortedList);
    });

    it("should return an array of books sorted by number of pages (low to high)", () => {
        const unsortedList = [
            {id: UUID(), title: 'yah', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'oi', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 200, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'abracadabra', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 800, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'meh', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 478, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'allo', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 390, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'huh', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 128, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const sortedList = [
            unsortedList[0],
            unsortedList[5],
            unsortedList[1],
            unsortedList[4],
            unsortedList[3],
            unsortedList[2]
        ]

        const sortOption = "number_of_pages";

        const result = sortBooks(unsortedList, sortOption);

        expect(result).toEqual(sortedList);
    });

    it("should return an array of books sorted by rating (low to high)", () => {
        const unsortedList = [
            {id: UUID(), title: 'yah', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 5, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'oi', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 200, rating: 3, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'abracadabra', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 800, rating: 4, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'meh', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 478, rating: 2, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'allo', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 390, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'huh', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 128, rating: 1, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const sortedList = [
            unsortedList[4],
            unsortedList[5],
            unsortedList[3],
            unsortedList[1],
            unsortedList[2],
            unsortedList[0]
        ]

        const sortOption = "rating";

        const result = sortBooks(unsortedList, sortOption);

        expect(result).toEqual(sortedList);
    });

    it("should return an empty array if no books in book list", () => {
        const unsortedList = [];

        const sortOption = "rating";

        const result = sortBooks(unsortedList, sortOption);

        expect(result).toEqual([]);
    });

    it("should return the unsorted list if unrecognised sort option is passed", () => {
        const unsortedList = [
            {id: UUID(), title: 'yah', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 5, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'oi', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 200, rating: 3, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'abracadabra', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 800, rating: 4, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'meh', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 478, rating: 2, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'allo', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 390, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'huh', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 128, rating: 1, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const sortOption = "unrecognisedOption";

        const result = sortBooks(unsortedList, sortOption);

        expect(result).toBe(unsortedList);
    });

    it("should return the book list with the titles sorted alphabetically if passing a mixed case sort option", () => {
        const unsortedList = [
            {id: UUID(), title: 'yah', author: 'tim simon', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'oi', author: 'darren smith', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'abracadabra', author: 'sarah day', status: 'reading', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'meh', author: 'beth darren', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'allo', author: 'terry blah', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0},
            {id: UUID(), title: 'huh', author: 'cassie yu', status: 'read', imageUrl: "", number_of_pages: 100, rating: 0, review: "", date_added: new Date(), date_updated: new Date(), date_read: new Date(), read_count: 0}
        ];

        const sortedList = [
            unsortedList[2],
            unsortedList[4],
            unsortedList[5],
            unsortedList[3],
            unsortedList[1],
            unsortedList[0]
        ]

        const sortOption = "TiTle";

        const result = sortBooks(unsortedList, sortOption);

        expect(result).toEqual(sortedList);
    });
});