// useBookList.ts
import { useState, useRef } from "react";
import type { ResponseObject, UIDrawerHandle } from "../types/index";

interface UseBookListProps {
    refresh: () => Promise<void>
}

export function useBookList({ refresh }: UseBookListProps) {
    const [isShowingError, setIsShowingError] = useState(false);
    const [isShowingTooltip, setIsShowingTooltip] = useState<boolean>(false);
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
