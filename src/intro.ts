import { v4 as uuid, type UUIDTypes } from "uuid";

// interface types
type Book = {
        id: UUIDTypes,
        title: String,
        author: String,
        status: String,
        imageUrl: String,
        rating: Number,
        review: String,
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
        rating: 0,
        review: "",
        date_added: new Date(),
        date_updated: null,
        date_read: null,
        number_of_pages,
        read_count: 0
    }
    
    const fetchedBooks = fetchBooks();
    const updatedBooks = [
        ...fetchedBooks,
        newBook
    ]
    
    saveBooks(updatedBooks);

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
    const fetchedBooks = fetchBooks();
    return fetchedBooks.find((book: Book) => book.id === id) || { message: "Sorry, couldn't find book" };
}

export const deleteBook = (bookId: UUIDTypes): { message: String } => {
    const books = fetchBooks();
    const filtered = books.filter(book => book.id !== bookId);
    saveBooks(filtered);

    if (books.length !== filtered.length) {
        return { message: "Successfully deleted book" }
    } else {
        return {message: "Sorry, unable to delete book"}
    }
}

export const updateBook = (updatedBook: Book): {data: Book | null, message: String} => {
    const books = fetchBooks();
    const index = books.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
        books[index] = updatedBook;
        saveBooks(books);
        return {data: books[index], message: "Successfully updated book"}
    } else {
        return {data: null, message: "Unable to find book"};
    }
}

export const saveBooks = (books: Book[]): {success: boolean, message: string} => {
    if (Array.isArray(books)) {
        try {
            localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
            return { success: true, message: 'Books saved successfully.' };
        } catch(error) {
            return {success: false, message: "Failed to save books to localStorage."};
        }
    } else {
        return {success: false, message: "Invalid input: expected an array of books."};
    }
}

export const filterBooks = (books: Book[], searchString: string): Book[] => {
    const trimmedSearchString = searchString.replace(/\s/g, '')

    if (!trimmedSearchString.length) {
        return books;
    }
    const filteredBooks = books.filter(book => (book.title.toLowerCase().includes(trimmedSearchString.toLowerCase()) || book.author.toLowerCase().includes(trimmedSearchString.toLowerCase())));
    return filteredBooks;
}

export const sortBooks = (books: Book[], sortOption: string): Book[] => {
    if (!books.length) {
        return [];
    }

    const sorted = [...books];
    const sortOptionLowercase = sortOption.toLowerCase();

    if (sortOptionLowercase === "title") {
        sorted.sort((a, b) => compareFn(a.title, b.title));
        return sorted;
    } else if (sortOptionLowercase === "author") {
        sorted.sort((a, b) => compareFn(a.author, b.author));
        return sorted;
    } else if (sortOptionLowercase === "number_of_pages") {
        sorted.sort((a, b) => compareFn(a.number_of_pages, b.number_of_pages));
        return sorted;
    } else if (sortOptionLowercase === "rating") {
        sorted.sort((a, b) => compareFn(a.rating, b.rating));
        return sorted;
    } 

    return books;
}

const compareFn = (a: String | Number, b: String | Number): number => {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
    return 0;
}