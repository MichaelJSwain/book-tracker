// useBookList.ts
import { useState, useEffect, useRef } from "react";
import { fetchBooks, filterBooks, sortBooks } from "../utils/intro";
import { useLoading } from "../hooks/useLoading/useLoading.ts";
import type { Book, ResponseObject, SortDirection, UIDrawerHandle } from "../types/index";

interface UseBookListProps {
    refresh: () => Promise<void>
}

export function useBookList({ refresh }: UseBookListProps) {
    const [bookList, setBookList] = useState<Array<Book>>([]);
    const [filteredBookList, setFilteredBookList] = useState<Array<Book>>([]);
    const [isShowingError, setIsShowingError] = useState(false);
    const [sortOption, setSortOption] = useState<string>("title");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [isShowingTooltip, setIsShowingTooltip] = useState<Boolean>(false);
    // const { isLoading, withLoading } = useLoading();
    const uiDrawerRef = useRef<UIDrawerHandle>(null);

    // const getBooks = async () => {
    //     const { data: books, success } = await withLoading(fetchBooks);
    //     if (success && books && Array.isArray(books)) {
    //         setBookList(books);
    //         setFilteredBookList(books);
    //     }
    // };

    // const handleSearchInputChange = (inputText: string) => {
    //     const filtered = filterBooks(bookList, inputText);
    //     setFilteredBookList(filtered);
    // };

    // const handleSortBooks = () => {
    //     const sortedBooks = sortBooks(filteredBookList, sortOption, sortDirection);
    //     setFilteredBookList(sortedBooks);
    // };

    const handleSubmit = (result: ResponseObject) => {
        if (result.success) {
            refresh();
            uiDrawerRef.current?.close();
        } else {
            setIsShowingError(true);
        }
    };

    // const handleSortOption = (e: React.MouseEvent<HTMLLIElement>) => {
    //     const sortOption = e.currentTarget.textContent?.toLowerCase();
    //     if (sortOption) {
    //         setSortOption(sortOption);
    //         setIsShowingTooltip(false);
    //     } else {
    //         // handle error...
    //     }
    // };

    // const handleSortDirection = () => {
    //     setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    // };

    // const onDelete = (result: ResponseObject) => {
    //     if (result.success) getBooks();
    // };

    // const onUpdate = (result: ResponseObject) => {
    //     if (result.success) getBooks();
    // };

    // useEffect(() => {
    //     getBooks();
    // }, []);

    // useEffect(() => {
    //     handleSortBooks();
    // }, [sortOption, sortDirection]);

    return {
        isShowingError,
        uiDrawerRef,
        isShowingTooltip,
        setIsShowingTooltip,
        handleSubmit,
        setIsShowingError,
    };
}
