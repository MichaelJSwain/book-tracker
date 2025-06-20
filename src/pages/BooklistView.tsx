import { useEffect, useState } from "react"
import { createBook, fetchBooks } from "../utils/intro";
import type { Book } from "../types/index";

export const BookListView = () => {
    const [bookList, setBookList] = useState<Array<Book>>([]);
    const [isShowingError, setIsShowingError] = useState<Boolean>(false);

    useEffect(() => {
        const { data: books, success } = fetchBooks();
        console.log("fetched books = ", books, success);
        if (success && books && Array.isArray(books)) {
            setBookList(books);
        }
    }, []);

    const handleCreateBook = () => {
        // (title: String, author: String, status: String, imageUrl: String | undefined, number_of_pages: Number)
        const { success, message } = createBook("Harry Potter", "J.K Rowling", "Reading", "www.url.com", 450);

        if (success) {
            // re-fetch books
        } else {
            // display error message
        }
    };

    return (
        <>
            <h1>Book list view</h1>
            <button onClick={handleCreateBook}>Create book</button>

            {bookList.map(book => {
                return <div>{book.title}</div>
            })}

            {isShowingError && <p>Error!</p>}
        </>
    )
}