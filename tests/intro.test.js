import { describe, test, it, expect } from "vitest";
import {createBook} from "../src/intro";

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