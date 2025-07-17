import { useState } from "react"
import type { ResponseObject } from "../../types"

type WithLoadingArg = () => ResponseObject

export const useLoading = () => {
    const [isLoading, setIsLoading] = useState(false);

    const withLoading = (callback: WithLoadingArg) => {
        setIsLoading(true);

        try {
            const res = callback();
            return res;
        } catch(error) {
            // if generic error, handle feedback here
            //....
            
            return { data: null, success: false, message: `unable to get books. ${error}` };
        } finally {
            setIsLoading(false);
        }
    }

    return {isLoading, withLoading};
}