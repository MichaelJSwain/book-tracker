import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { fetchBooks, filterBooks, sortBooks } from "../utils/intro";
import type { Book, ResponseObject, SortDirection, UIDrawerHandle } from "../types/index";
import { BookList } from "../components/BookList/BookList";
import { ClickAwayListener } from "../components/ClickAwayListener/ClickAwayListener.tsx";
import { Tooltip } from "../components/Tooltip/Tooltip.tsx";
import { TooltipGroup } from "../components/TooltipGroup/TooltipGroup.tsx";
import { createPortal } from "react-dom";
import { UIDrawer } from "../components/UIDrawer/UIDrawer.tsx";
import { BookForm } from "../components/BookForm/BookForm.tsx";
import { TooltipItem } from "../components/TooltipItem/TooltipItem.tsx";
import { LoadingView } from "../components/LoadingView/LoadingView.tsx";
import { useLoading } from "../hooks/useLoading/useLoading.ts";
import { SearchInput } from "../components/SearchInput/SearchInput.tsx";
import { Toolbar } from "../components/Toolbar/Toolbar.tsx";
import { SortControls } from "../components/SortControls/SortControls.tsx";
import { Button } from "../components/Button/Button.tsx";
import { PageHeader } from "../components/PageHeader/PageHeader.tsx";

const portalElem = document.getElementById('portal') as HTMLElement;

export const BookListView = () => {
    const [bookList, setBookList] = useState<Array<Book>>([]);
    const [filteredBookList, setFilteredBookList] = useState<Array<Book>>([]);
    const [isShowingError, setIsShowingError] = useState<Boolean>(false);
    const [isShowingForm, setIsShowingForm] = useState<Boolean>(false);
    const [isShowingTooltip, setIsShowingTooltip] = useState<Boolean>(false);
    const [sortOption, setSortOption] = useState<string>("title");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const { isLoading, withLoading } = useLoading();
    const uiDrawerRef = useRef<UIDrawerHandle>(null);

    const getBooks = async () => {
        const { data: books, success } = await withLoading(fetchBooks);

        if (success && books && Array.isArray(books)) {
            setBookList(books);
            setFilteredBookList(books);
        }
    }

    const handleSearchInputChange = (inputText: string) => {
        const filtered = filterBooks(bookList, inputText);
        setFilteredBookList(filtered);
    }

    const handleSubmit = (result: ResponseObject) => {
        if (result.success) {
            console.log("SUCCESS");
            // re-fetch books
            getBooks();
            uiDrawerRef.current?.close();
        } else {
            console.log("ERROR");
            // display error message
            setIsShowingError(true);
        }
    }

    const handleSortBooks = () => {
        const sortedBooks = sortBooks(filteredBookList, sortOption, sortDirection);
        setFilteredBookList(sortedBooks);
    }

    const handleSortOption = (e: React.MouseEvent<HTMLLIElement>) => {
        const sortOption = e.currentTarget.textContent?.toLowerCase();
        if (sortOption) {
            setSortOption(sortOption);
            setIsShowingTooltip(false);
        } else {
            // handle error...
        }
    }

    const handleSortDirection = () => {
        const newSortDirection = sortDirection === "desc" ? "asc" : "desc";
        setSortDirection(newSortDirection);
    }

    const onDelete = (result: ResponseObject) => {
        if (result.success) {
            getBooks();
        }
    }

    const onUpdate = (result: ResponseObject) => {
        if (result.success) {
            getBooks();
        }
    }

    useEffect(() => {
        getBooks();
    }, []);


    useEffect(() => {
        handleSortBooks();
    }, [sortOption, sortDirection]);

    return (
        <>
            <PageHeader title="My Books" button={<Button onClick={() => setIsShowingForm(true)} variant="primary" type="button">Add book</Button>}></PageHeader>

            {isLoading && <LoadingView></LoadingView>}

            {!!filteredBookList.length && 
                <div>
                    <Toolbar>
                        <SearchInput placeholder="Search for a book..." onChange={handleSearchInputChange}></SearchInput>
                        <SortControls>
                            <ClickAwayListener onClickAway={() => setIsShowingTooltip(false)}>
                                <TooltipGroup>
                                    <Button onClick={() => setIsShowingTooltip(!isShowingTooltip)} variant="ghost" type="button">Sort by: {sortOption}</Button>
                                    {
                                        isShowingTooltip && 
                                        <Tooltip>
                                            <TooltipItem clickFunc={handleSortOption}>Title</TooltipItem>
                                            <TooltipItem clickFunc={handleSortOption}>Author</TooltipItem>
                                            <TooltipItem clickFunc={handleSortOption}>Number of pages</TooltipItem>
                                            <TooltipItem clickFunc={handleSortOption}>Rating</TooltipItem>
                                        </Tooltip>
                                    }
                                </TooltipGroup>
                            </ClickAwayListener>
                            <Button onClick={handleSortDirection} variant="ghost" type="button">{sortDirection}</Button>
                        </SortControls>
                    </Toolbar>

                    <BookList onDelete={onDelete} onUpdate={onUpdate} bookList={filteredBookList}></BookList>
                </div>}
            
            {isShowingForm && createPortal(
                <UIDrawer ref={uiDrawerRef} closeFunc={() => setIsShowingForm(false)} title="Create book">
                    <BookForm action="create" submitFunc={(result) => handleSubmit(result)}></BookForm>
                </UIDrawer>, 
                portalElem)
            }

            {isShowingError && 
                <div data-testId="error-message" className="error-message">
                    <Button onClick={() => setIsShowingError(false)} variant="ghost" type="button">
                        <svg width="0.7857142857142857em" height="1em" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M5.25 6.14844L8.85938 2.51172L9.48828 3.14062L5.85156 6.75L9.48828 10.3867L8.85938 11.0156L5.25 7.37891L1.61328 11.0156L0.984375 10.3867L4.62109 6.75L0.984375 3.14062L1.61328 2.51172L5.25 6.14844Z" fill="#1B1D1F"></path></svg>
                    </Button>
                    <div><p>Error!</p>
                    </div>
                </div>}
        </>
    )
}