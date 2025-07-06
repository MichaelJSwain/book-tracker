import { useState, type ChangeEvent } from "react";

interface SearchInputProps {
    placeholder?: string,
    onChange: (inputText: string) => void
}

export const SearchInput = ({ placeholder, onChange }: SearchInputProps) => {
    const [inputText, setInputText] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputText(newValue);
        onChange(newValue);
    }

    return (
        <input className="search-input" placeholder={placeholder} onChange={handleChange} value={inputText}></input>
    )
}