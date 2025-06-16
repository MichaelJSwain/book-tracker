import { v4 as uuid, type UUIDTypes } from "uuid";

// interface types
type Book = {
        id: UUIDTypes,
        title: String,
        author: String,
        status: String,
        imageUrl: String,
        rating: Number | null,
        review: String | null,
        date_added: Date,
        date_updated: Date | null,
        date_read: Date | null,
        number_of_pages: Number,
        read_count: Number
}

type Error = {
    message: String
}

const BOOKS_KEY: string = "book_list";

export const createBook = (title: String, author: String, status: String, imageUrl: String | undefined, number_of_pages: Number): Book | Error => {
    // simulate error
    if (title === "error") {
        return {message: "Sorry, unable to create book"};
    }

    imageUrl = imageUrl ? imageUrl : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

    const newBook = {
        id: uuid(),
        title,
        author,
        status,
        imageUrl: imageUrl,
        rating: null,
        review: null,
        date_added: new Date(),
        date_updated: null,
        date_read: null,
        number_of_pages,
        read_count: 0
    }
    
    return newBook;
};

export const fetchBooks = (): Book[] => {
    const books = localStorage.getItem(BOOKS_KEY);
    if (books) {
        const parsed = JSON.parse(books);
        return parsed;
    }
    return [];
}

export const fetchBook = (id: UUIDTypes) => {
    const books = localStorage.getItem(BOOKS_KEY);
    
    if (books) {
        const parsed = JSON.parse(books);
        return parsed.find((book: Book) => book.id === id) || { message: "Sorry, couldn't find book" };
    }

    return { message: "Sorry, couldn't find any book" };
}
