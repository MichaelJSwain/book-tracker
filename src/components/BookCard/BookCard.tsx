import { useRef, useState } from "react"
import type {  Book, ResponseObject } from "../../types"
import { ClickAwayListener } from "../ClickAwayListener/ClickAwayListener"
import { StatusLabel } from "../StatusLabel/StatusLabel"
import { Tooltip } from "../Tooltip/Tooltip"
import { TooltipGroup } from "../TooltipGroup/TooltipGroup"
import { TooltipItem } from "../TooltipItem/TooltipItem"
import "./BookCard.css"
import { deleteBook, updateBook } from "../../utils/intro"
import { UIDrawer } from "../UIDrawer/UIDrawer"
import { BookForm } from "../BookForm/BookForm"
import { createPortal } from "react-dom"
import { Button } from "../Button/Button"

const portalElem = document.getElementById('portal') as HTMLElement;

export type BookCardProps = {
        book: Book,
        onDelete: (result: ResponseObject) => void,
        onUpdate: (result: ResponseObject) => void
}

export const BookCard = ({ book, onDelete, onUpdate }: BookCardProps) => {
    const [isShowingTooltip, setIsShowingTooltip] = useState(false);
    const [isShowingForm, setIsShowingForm] = useState(false);
    const uiDrawerRef = useRef(null);

    const handleDelete = () => {
        const result = deleteBook(book.id);
        onDelete(result);
    }

    const handleUpdate = (result: ResponseObject) => {
        if (result.success) {
            setIsShowingForm(false);
            onUpdate(result);
        }
    }

    const handleShowForm = () => {
        console.log("handling update");
        setIsShowingTooltip(false);
        setIsShowingForm(true);
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
                            <Button onClick={() => setIsShowingTooltip(!isShowingTooltip)} variant="ghost" type="button">...</Button>
                            {
                                isShowingTooltip && 
                                <Tooltip>
                                    <TooltipItem clickFunc={handleShowForm}>Update</TooltipItem>
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

                      {isShowingForm && createPortal(
                            <UIDrawer ref={uiDrawerRef} closeFunc={() => setIsShowingForm(false)} title="Update book">
                                <BookForm action="update" submitFunc={handleUpdate} initialValues={{title: book.title, author: book.author, status: book.status, imageUrl: book.imageUrl, number_of_pages: book.number_of_pages}} book={book}>

                                </BookForm>
                            </UIDrawer>
                 
                        ,
                        portalElem
                        )
                        }
        </div>
    )
}