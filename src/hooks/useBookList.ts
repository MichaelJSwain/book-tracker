// useBookList.ts
import { useState, useRef } from "react";
import { fetchBooks, filterBooks, sortBooks } from "../utils/intro";
import { useLoading } from "../hooks/useLoading/useLoading.ts";
import type { Book, ResponseObject, SortDirection, UIDrawerHandle } from "../types/index";

interface UseBookListProps {
    refresh: () => Promise<void>
}

export function useBookList({ refresh }: UseBookListProps) {
    const [isShowingError, setIsShowingError] = useState(false);
    const [isShowingTooltip, setIsShowingTooltip] = useState<Boolean>(false);
    const uiDrawerRef = useRef<UIDrawerHandle>(null);

    const handleSubmit = (result: ResponseObject) => {
        if (result.success) {
            refresh();
            uiDrawerRef.current?.close();
        } else {
            setIsShowingError(true);
        }
    };

    return {
        isShowingError,
        uiDrawerRef,
        isShowingTooltip,
        setIsShowingTooltip,
        handleSubmit,
        setIsShowingError,
    };
}
