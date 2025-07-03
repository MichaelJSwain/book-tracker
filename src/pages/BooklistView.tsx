import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { createBook, fetchBooks, filterBooks, sortBooks } from "../utils/intro";
import type { Book, FormData, ResponseObject, SortDirection, UIDrawerHandle } from "../types/index";
import { BookList } from "../components/BookList/BookList";
import { ClickAwayListener } from "../components/ClickAwayListener/ClickAwayListener.tsx";
import { Tooltip } from "../components/Tooltip/Tooltip.tsx";
import { TooltipGroup } from "../components/TooltipGroup/TooltipGroup.tsx";
import { createPortal } from "react-dom";
import { UIDrawer } from "../components/UIDrawer/UIDrawer.tsx";
import { CreateBookForm } from "../components/CreateBookForm/CreateBookForm.tsx";

const portalElem = document.getElementById('portal') as HTMLElement;

export const BookListView = () => {
    const [bookList, setBookList] = useState<Array<Book>>([]);
    const [filteredBookList, setFilteredBookList] = useState<Array<Book>>([]);
    const [isShowingError, setIsShowingError] = useState<Boolean>(false);
    const [isShowingForm, setIsShowingForm] = useState<Boolean>(false);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [searchInputText, setSearchInputText] = useState<string>("");
    const [isShowingTooltip, setIsShowingTooltip] = useState<Boolean>(false);
    const [sortOption, setSortOption] = useState<string>("title");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const uiDrawerRef = useRef<UIDrawerHandle>(null);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        author: "",
        status: "",
        imageUrl: "",
        number_of_pages: 0
    });

    const getBooks = async () => {
        
        const { data: books, success } = await fetchBooks();
        console.log("fetched books = ", books, success);
        if (success && books && Array.isArray(books)) {
            setBookList(books);
            setFilteredBookList(books);
        }
    }

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInputText(e.target.value);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const copy = {
            ...formData
        };
        copy[e.target.name] = e.target.value;

        setFormData(copy);
    };

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
        } else {
            // handle error...
        }
    }

    const handleSortDirection = () => {
        const newSortDirection = sortDirection === "desc" ? "asc" : "desc";
        setSortDirection(newSortDirection);
    }

    useEffect(() => {
        getBooks();
    }, []);

    useEffect(() => {
        console.log("search input text effect running")
        const filtered = filterBooks(bookList, searchInputText);
        setFilteredBookList(filtered);
    }, [searchInputText]);

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

            {isLoading ? <div>Loading...</div> :
                  <div>
                <div className="flex flex-hr">
                    <input className="search-input" placeholder="Search for a book..." onChange={handleSearchInputChange} value={searchInputText}></input>
                    
                    <ClickAwayListener onClickAway={() => setIsShowingTooltip(false)}>
                        <TooltipGroup>
                            <button onClick={() => setIsShowingTooltip(!isShowingTooltip)}>Sort by: {sortOption}</button>
                            {
                                isShowingTooltip && 
                                <Tooltip clickFunc={handleSortOption}></Tooltip>
                            }
                        </TooltipGroup>
                    </ClickAwayListener>
                    <button onClick={handleSortDirection}>{sortDirection}</button>
                </div>

                <div className="mv-16 text-align-left">
                    {filteredBookList.length} books
                </div>
                <BookList bookList={filteredBookList}></BookList>
            </div>
            }
            {isShowingForm && createPortal(
                <UIDrawer ref={uiDrawerRef} closeFunc={() => setIsShowingForm(false)} title="Create book">
                    <CreateBookForm submitFunc={(result) => handleSubmit(result)}></CreateBookForm>
                </UIDrawer>
     
            ,
            portalElem
            )
            }

            {isShowingError && <div data-testId="error-message" className="error-message"><button onClick={() => setIsShowingError(false)}>X</button><div><p>Error!</p></div></div>}
        </>
    )
}