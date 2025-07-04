import { BookCard } from "../BookCard/BookCard";
import type { Book, BookListProps } from "../../types";
import "./BookList.css"

export const BookList = ({ onDelete, bookList }: BookListProps) => {
    return (
        <div className="book-list">
            {bookList.map((book: Book) => {
                return <BookCard onDelete={onDelete} key={`${book.id}`} book={book}></BookCard>
            })}
        </div>
    )
}