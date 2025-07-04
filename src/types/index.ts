import type { FormEventHandler, MouseEventHandler } from "react"
import type { UUIDTypes } from "uuid"

export type Book = {
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

export type BookCardProps = {
        book: Book
}

export type BookListProps = {
        bookList: Book[]
}

// export type CreateBookFormProps = {
//         closeFunc: MouseEventHandler<HTMLButtonElement>,
//         submitFunc: FormEventHandler<HTMLFormElement>
// }

export interface ClickAwayListenerProps {
  children: React.ReactNode;
  onClickAway: () => void;
}

export interface TooltipGroupProps {
  children: React.ReactNode;
}

export type TooltipProps = {
        clickFunc: React.MouseEventHandler<HTMLLIElement>
}

export type FormData = {
    title: string,
    author: string,
    status: string,
    imageUrl: string,
    number_of_pages: number
}
// export default FormData

export type SortDirection = "asc" | "desc";

export interface UIDrawerProps {
  children: React.ReactNode;
  closeFunc: () => void;
  title: string
}

export type UIDrawerHandle = {
  close: () => void;
};

export type ResponseObject<T = Book | Book[] | null> = {
    data?: T;
    success: boolean,
    message: string
}

export interface CreateBookFormProps {
        submitFunc: (result: ResponseObject<Book | Book[] | null>) => void
}