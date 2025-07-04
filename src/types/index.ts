import type { FormEventHandler, MouseEventHandler } from "react"
import type { UUIDTypes } from "uuid"

export type ReadingStatus = "to read" | "reading" | "read"

export type Book = {
        id: UUIDTypes,
        title: string,
        author: string,
        status: ReadingStatus,
        imageUrl: string,
        rating: number,
        review: string,
        date_added: Date,
        date_updated: Date | null,
        date_read: Date | null,
        number_of_pages: number,
        read_count: number
}

export type BookCardProps = {
        book: Book,
        onDelete: (result: ResponseObject) => void,
        onUpdate: (result: ResponseObject) => void
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