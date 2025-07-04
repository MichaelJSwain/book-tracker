import { useState } from "react";
import type { FormData, CreateBookFormProps } from "../../types";
import { createBook } from "../../utils/intro";
import "./CreateBookForm.css"

export const CreateBookForm = ({ submitFunc }: CreateBookFormProps) => {
        const [formData, setFormData] = useState<FormData>({
            title: "",
            author: "",
            status: "",
            imageUrl: "",
            number_of_pages: 0
        });

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
        
            const result = createBook(title, author, status, imageUrl, number_of_pages);

            submitFunc(result);
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
                    <button data-testId="save-book-button" type="submit" className="form-button">Save book</button>
                </form>
    )
}