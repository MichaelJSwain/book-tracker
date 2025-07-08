import { useState } from "react";
import type { FormData, ResponseObject, Book, ReadingStatus } from "../../types";
import { createBook, updateBook } from "../../utils/intro";
import "./BookForm.css"
import { Button } from "../Button/Button";

type BookFormAction = "create" | "update"

type InitialBookFormValues = {title: string, author: string, status: ReadingStatus, imageUrl: string, number_of_pages: number}

const defaultValues = {
            title: "",
            author: "",
            status: "to read",
            imageUrl: "",
            number_of_pages: 0
        } as const

interface BookFormProps {
    action: BookFormAction,
    submitFunc: (result: ResponseObject<Book | Book[] | null>) => void,
    initialValues?: InitialBookFormValues,
    book?: Book
}

export const BookForm = ({ action, submitFunc, initialValues = defaultValues, book }: BookFormProps) => {
        const [formData, setFormData] = useState<FormData>(initialValues);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const copy = {
            ...formData
        };
        copy[e.target.name] = e.target.value;

        setFormData(copy);
    };


        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const { title, author, status, imageUrl, number_of_pages } = formData;
        
            if (action === "create") {
                console.log("create|");
                const result = createBook(title, author, status, imageUrl, number_of_pages);
                submitFunc(result);
            } else if (action === "update") {
                console.log("update|");
                if (!!book) {
                    const updatedBook = {
                        ...book,
                        title,
                        author,
                        status,
                        imageUrl,
                        number_of_pages
                    }
                    
                    const result = updateBook(updatedBook);
                    submitFunc(result);
                }
            }
   
        }

    return (
            <form onSubmit={handleSubmit}>
                    <fieldset>
                        <label htmlFor="title">Title*:</label>
                        <input type="text" id="title" name="title" onChange={handleChange} value={formData.title}></input>
                    </fieldset>
                    <fieldset>
                        <label htmlFor="author">Author*:</label>
                        <input type="text" id="author" name="author" onChange={handleChange} value={formData.author}></input>
                    </fieldset>
                    <fieldset>
                        <label htmlFor="status">Status*:</label>
                        <input type="text" id="status" name="status" onChange={handleChange} value={formData.status}></input>
                    </fieldset>
                    <fieldset>
                        <label htmlFor="imageUrl">Image URL:</label>
                        <input type="text" id="imageUrl" name="imageUrl" onChange={handleChange} value={formData.imageUrl}></input>
                    </fieldset>
                <fieldset>
                        <label htmlFor="number_of_pages">Number of pages*:</label>
                        <input type="text" id="number_of_pages" name="number_of_pages" onChange={handleChange} value={formData.number_of_pages}></input>
                    </fieldset>
                    <Button variant="primary" type="submit" dataTestId="save-book-button" classList="form-button">Save book</Button>
                </form>
    )
}