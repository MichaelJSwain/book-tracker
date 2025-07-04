import { useState } from "react"
import type { BookCardProps } from "../../types"
import { ClickAwayListener } from "../ClickAwayListener/ClickAwayListener"
import { StatusLabel } from "../StatusLabel/StatusLabel"
import { Tooltip } from "../Tooltip/Tooltip"
import { TooltipGroup } from "../TooltipGroup/TooltipGroup"
import { TooltipItem } from "../TooltipItem/TooltipItem"
import "./BookCard.css"
import { deleteBook, updateBook } from "../../utils/intro"

export const BookCard = ({ book, onDelete }: BookCardProps) => {
    const [isShowingTooltip, setIsShowingTooltip] = useState(false);

    const handleDelete = () => {
        const result = deleteBook(book.id);
        onDelete(result);
    }

    const handleUpdate = () => {
        console.log("handling update");
    }

    return (
        <div className="book-card">
            <div>
                <img className="book-img" src={book.imageUrl}></img>
            </div>
            <div className="text-align-left">
                <div className="book-card-header">
                    <StatusLabel status={book.status}></StatusLabel>
                    <ClickAwayListener onClickAway={() => setIsShowingTooltip(false)}>
                        <TooltipGroup>
                            <button onClick={() => setIsShowingTooltip(!isShowingTooltip)}>...</button>
                            {
                                isShowingTooltip && 
                                <Tooltip>
                                    <TooltipItem clickFunc={handleUpdate}>Update</TooltipItem>
                                    <TooltipItem clickFunc={handleDelete}>Delete</TooltipItem>
                                </Tooltip>
                            }
                        </TooltipGroup>
                    </ClickAwayListener>
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