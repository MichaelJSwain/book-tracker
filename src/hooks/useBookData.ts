//  filteredBookList,
//   sortOption,
//   sortDirection,
//   handleSearchInputChange,
//   handleSortOption,
//   handleSortDirection,
//   onDelete,
//   onUpdate,
//   refreshBooks

import { useState, useEffect } from "react";
import type { Book, SortDirection, ResponseObject } from "../types";
import { useLoading } from "./useLoading/useLoading";
import { fetchBooks, filterBooks, sortBooks } from "../utils/intro";

export const useBookData = () => {
    const [bookList, setBookList] = useState<Array<Book>>([]);
    const [filteredBookList, setFilteredBookList] = useState<Array<Book>>([]);
    const [sortOption, setSortOption] = useState<string>("title");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const { isLoading, withLoading } = useLoading();

    const getBooks = async () => {
        const { data: books, success } = await withLoading(fetchBooks);
        if (success && books && Array.isArray(books)) {
            setBookList(books);
            setFilteredBookList(books);
        }
    };

    const handleSearchInputChange = (inputText: string) => {
        const filtered = filterBooks(bookList, inputText);
        setFilteredBookList(filtered);
    };

    const handleSortBooks = () => {
        const sortedBooks = sortBooks(filteredBookList, sortOption, sortDirection);
        setFilteredBookList(sortedBooks);
    };

    const handleSortOption = (e: React.MouseEvent<HTMLLIElement>) => {
        const sortOption = e.currentTarget.textContent?.toLowerCase();
        if (sortOption) {
            setSortOption(sortOption);
            setIsShowingTooltip(false);
        } else {
            // handle error...
        }
    };

    const handleSortDirection = () => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const onDelete = (result: ResponseObject) => {
        if (result.success) getBooks();
    };

    const onUpdate = (result: ResponseObject) => {
        if (result.success) getBooks();
    };

    useEffect(() => {
        getBooks();
    }, []);

    useEffect(() => {
        handleSortBooks();
    }, [sortOption, sortDirection]);

    return {
        filteredBookList,
        sortOption,
        sortDirection,
        isLoading,
        handleSearchInputChange,
        handleSortOption,
        handleSortDirection,
        onDelete,
        onUpdate,
        getBooks
    };
}