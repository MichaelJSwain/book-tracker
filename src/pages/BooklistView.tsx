import { useRef, useState } from "react"
import { BookList } from "../components/BookList/BookList";
import { ClickAwayListener } from "../components/ClickAwayListener/ClickAwayListener.tsx";
import { Tooltip } from "../components/Tooltip/Tooltip.tsx";
import { TooltipGroup } from "../components/TooltipGroup/TooltipGroup.tsx";
import { createPortal } from "react-dom";
import { UIDrawer } from "../components/UIDrawer/UIDrawer.tsx";
import { BookForm } from "../components/BookForm/BookForm.tsx";
import { TooltipItem } from "../components/TooltipItem/TooltipItem.tsx";
import { LoadingView } from "../components/LoadingView/LoadingView.tsx";
import { SearchInput } from "../components/SearchInput/SearchInput.tsx";
import { Toolbar } from "../components/Toolbar/Toolbar.tsx";
import { SortControls } from "../components/SortControls/SortControls.tsx";
import { Button } from "../components/Button/Button.tsx";
import { PageHeader } from "../components/PageHeader/PageHeader.tsx";
import { Modal } from "../components/Modal/Modal.tsx";
import { useBookData } from "../hooks/useBookData.ts";
import type { UIDrawerHandle, ResponseObject } from "../types/index.ts";import { EmptyView } from "../components/EmptyView/EmptyView.tsx";
{}
const portalElem = document.getElementById('portal') as HTMLElement;

export const BookListView = () => {
    const [isShowingError, setIsShowingError] = useState(false);
    const [isShowingTooltip, setIsShowingTooltip] = useState<boolean>(false);
    const uiDrawerRef = useRef<UIDrawerHandle>(null);
    const [isShowingForm, setIsShowingForm] = useState(false);

    const {
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
    } = useBookData();

    const handleSubmit = (result: ResponseObject) => {
        if (result.success) {
            getBooks();
            uiDrawerRef.current?.close();
        } else {
            setIsShowingError(true);
        }
    };

    const onSort = (e: React.MouseEvent<HTMLLIElement>) => {
        setIsShowingTooltip(false);
        handleSortOption(e);
    }

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
                                            <TooltipItem clickFunc={onSort}>Title</TooltipItem>
                                            <TooltipItem clickFunc={onSort}>Author</TooltipItem>
                                            <TooltipItem clickFunc={onSort}>Number of pages</TooltipItem>
                                            <TooltipItem clickFunc={onSort}>Rating</TooltipItem>
                                        </Tooltip>
                                    }
                                </TooltipGroup>
                            </ClickAwayListener>
                            <Button onClick={handleSortDirection} variant="ghost" type="button">{sortDirection}</Button>
                        </SortControls>
                    </Toolbar>

                    <BookList onDelete={onDelete} onUpdate={onUpdate} bookList={filteredBookList}></BookList>
                </div>}

            {(!isLoading && !filteredBookList.length) && 
            <EmptyView></EmptyView>}
            
            {isShowingForm && createPortal(
                <UIDrawer ref={uiDrawerRef} closeFunc={() => setIsShowingForm(false)} title="Add a book">
                    <BookForm action="create" submitFunc={(result) => handleSubmit(result)}></BookForm>
                </UIDrawer>, 
                portalElem)
            }

            {isShowingError && 
                createPortal(
                <Modal closeFunc={() => setIsShowingError(false)} title="Oh no!" message="Encountered an unexpected error!"></Modal>, 
                portalElem)
            }
        </>
    )
}