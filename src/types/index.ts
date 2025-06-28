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

export type FormData = {
    title: string,
    author: string,
    status: string,
    imageUrl: string,
    number_of_pages: number
}