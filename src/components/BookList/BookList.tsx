import { BookCard } from "../BookCard/BookCard";
import type { Book, ResponseObject } from "../../types";
import "./BookList.css"

export type BookListProps = {
        bookList: Book[],
        onDelete: (result: ResponseObject) => void,
        onUpdate: (result: ResponseObject) => void
}

export const BookList = ({ onDelete, onUpdate, bookList }: BookListProps) => {
    return (
        <div>
            <div className="mv-16 text-align-left">
                {bookList.length} books
            </div>
            <div className="book-list">
                {bookList.map((book: Book) => {
                    return <BookCard onDelete={onDelete} onUpdate={onUpdate} key={`${book.id}`} book={book}></BookCard>
                })}
            </div>
        </div>
    )
}