import { useState } from "react"
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
import { useBookList } from "../hooks/useBookList.ts";

const portalElem = document.getElementById('portal') as HTMLElement;

export const BookListView = () => {
    const {
        filteredBookList,
        sortOption,
        sortDirection,
        isLoading,
        isShowingError,
        uiDrawerRef,
        isShowingTooltip,
        setIsShowingTooltip,
        handleSearchInputChange,
        handleSubmit,
        handleSortOption,
        handleSortDirection,
        onDelete,
        onUpdate,
        setIsShowingError
    } = useBookList();

    const [isShowingForm, setIsShowingForm] = useState(false);

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
                createPortal(
                <Modal closeFunc={() => setIsShowingError(false)} title="Oh no!" message="Encountered an unexpected error!"></Modal>, 
                portalElem)
            }
        </>
    )
}