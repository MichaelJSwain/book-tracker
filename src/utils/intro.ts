import { v4 as uuid, type UUIDTypes } from "uuid";
import type { Book, SortDirection, ResponseObject, ReadingStatus } from "../types/index";

const BOOKS_KEY: string = "book_list";

export const createBook = (title: string, author: string, status: ReadingStatus, imageUrl: string | undefined, number_of_pages: number): ResponseObject => {
    
    if (!title || !author || !status || !number_of_pages) {
        return { success: false, message: "Please pass the required values" };
    }

    imageUrl = imageUrl ? imageUrl : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

    const newBook: Book = {
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
    
    const { data: fetchedBooks } = fetchBooks();

    if (fetchedBooks && Array.isArray(fetchedBooks)) {
        const updatedBooks = [
            ...fetchedBooks,
            newBook
        ]
        
        const saved = saveBooks(updatedBooks);
        
        if (saved.success) {
            return { data: newBook, success: true, message: "Successfully created book" };
        } else {
            return { success: false, message: "Sorry, unable to create book" };
        }
    } else {
        return { success: false, message: "Sorry, unable to create book" };
    }

};

export const fetchBooks = (): ResponseObject => {
    try {
        const books = localStorage.getItem(BOOKS_KEY);
        if (books) {
            const parsed = JSON.parse(books);
            return {data: [], success: true, message: "Successfully fetched books"};
        }
        return {data: [], success: true, message: "Successfully fetched books"};
    } catch(error) {
        return {success: false, message: "Failed to fetch books"};
    }

}

export const fetchBook = (id: UUIDTypes): ResponseObject => {
    const { data: fetchedBooks } = fetchBooks();

    if (fetchedBooks && Array.isArray(fetchedBooks)) {
        const foundBook = fetchedBooks.find((book: Book) => book.id === id);
        
        if (foundBook) {
            return { data: foundBook, success: true, message: "successfully fetched book"};
        } else {
            return { success: false, message: "Unable to fetch book"};
        }
    } else {
        return { success: false, message: "Sorry, couldn't find book" };
    }
}

export const deleteBook = (bookId: UUIDTypes): ResponseObject => {
    const { data: fetchedBooks} = fetchBooks();
   
    if (fetchedBooks && Array.isArray(fetchedBooks)) {
        const filtered = fetchedBooks.filter(book => book.id !== bookId);
        saveBooks(filtered);

        if (fetchedBooks.length !== filtered.length) {
            return { success: true, message: "Successfully deleted book" };
        } else {
            return { success: false, message: "Sorry, unable to delete book" };
        }
    } else {
        return { success: false, message: "Error trying to delete book" };
    }
}

export const updateBook = (updatedBook: Book): ResponseObject => {
    const { data: fetchedBooks } = fetchBooks();

    if (fetchedBooks && Array.isArray(fetchedBooks)) {
        const index = fetchedBooks.findIndex(book => book.id === updatedBook.id);
        if (index !== -1) {
            fetchedBooks[index] = updatedBook;
            saveBooks(fetchedBooks);
            return { data: fetchedBooks[index], success: true, message: "Successfully updated book" }
        } else {
            return { success: false, message: "Unable to find book" };
        }
    }
    return { success: false, message: "Error tryign to find book" };
}

export const saveBooks = (books: Book[]): ResponseObject => {
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

export const sortBooks = (books: Book[], sortOption: string, sortDirection: SortDirection = 'asc'): Book[] => {
    if (!books.length) {
        return [];
    }

    const sorted = [...books];
    const sortOptionLowercase = sortOption.toLowerCase();

    if (sortOptionLowercase === "title") {
        sorted.sort((a, b) => compareFn(a.title, b.title, sortDirection));
        return sorted;
    } else if (sortOptionLowercase === "author") {
        sorted.sort((a, b) => compareFn(a.author, b.author, sortDirection));
        return sorted;
    } else if (sortOptionLowercase === "number_of_pages") {
        sorted.sort((a, b) => compareFn(a.number_of_pages, b.number_of_pages, sortDirection));
        return sorted;
    } else if (sortOptionLowercase === "rating") {
        sorted.sort((a, b) => compareFn(a.rating, b.rating, sortDirection));
        return sorted;
    } 

    return books;
}

const compareFn = (a: String | Number, b: String | Number, sortDirection: string): number => {
    if (a < b) {
        return sortDirection === "asc" ? -1 : 1;
    } else if (a > b) {
        return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
}