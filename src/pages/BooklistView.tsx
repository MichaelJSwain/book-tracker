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
            <div className="page-header">
                <div>
                    <h1>My Books</h1>
                </div>
                <div>
                    <button onClick={() => setIsShowingForm(true)}>Add book</button>
                </div>
            </div>

            {isLoading ? <LoadingView></LoadingView> :
                  <div>
                
                <Toolbar>
                    <SearchInput placeholder="Search for a book..." onChange={handleSearchInputChange}></SearchInput>
                    <SortControls>
                        <ClickAwayListener onClickAway={() => setIsShowingTooltip(false)}>
                            <TooltipGroup>
                                <button onClick={() => setIsShowingTooltip(!isShowingTooltip)}>Sort by: {sortOption}</button>
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
                        <button onClick={handleSortDirection}>{sortDirection}</button>
                    </SortControls>
                </Toolbar>

                <div className="mv-16 text-align-left">
                    {filteredBookList.length} books
                </div>
                <BookList onDelete={onDelete} onUpdate={onUpdate} bookList={filteredBookList}></BookList>
            </div>
            }
            {isShowingForm && createPortal(
                <UIDrawer ref={uiDrawerRef} closeFunc={() => setIsShowingForm(false)} title="Create book">
                    <BookForm action="create" submitFunc={(result) => handleSubmit(result)}></BookForm>
                </UIDrawer>
     
            ,
            portalElem
            )
            }

            {isShowingError && <div data-testId="error-message" className="error-message"><button onClick={() => setIsShowingError(false)}>X</button><div><p>Error!</p></div></div>}
        </>
    )
}