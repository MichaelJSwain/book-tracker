import type { BookCardProps } from "../../types"
import { StatusLabel } from "../StatusLabel/StatusLabel"
import "./BookCard.css"

export const BookCard = ({ book }: BookCardProps) => {
    return (
        <div className="book-card">
            <div>
                <img className="book-img" src={book.imageUrl}></img>
            </div>
            <div className="text-align-left">
                <div>
                    <StatusLabel status={book.status}></StatusLabel>
                </div>

                <div className="book-details">
                    <div>{book.title}</div>
                    <div>{book.author}</div>
                </div>
                
                <div>
                    {`${book.rating}`}
                </div>
            </div>
        </div>
    )
}