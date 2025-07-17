import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import type { UIDrawerProps, UIDrawerHandle } from "../../types";
import "./UIDrawer.css"
import { Button } from "../Button/Button";

export const UIDrawer = forwardRef<UIDrawerHandle, UIDrawerProps>(
    ({ children, closeFunc, title }, ref) => {
        const [isOpen, setIsOpen] = useState(false);

        useEffect(() => {
            setIsOpen(true);
            document.body.style.overflow = 'hidden'
        }, []);

        const handleClose = () => {
            setIsOpen(false);
            document.body.style.overflow = ''
            setTimeout(() => {
                closeFunc();
            }, 300);
        }

        useImperativeHandle(ref, () => ({
            close: handleClose,
        }));

        return (
            <div className={isOpen ? "ui-drawer-container is-open" : "ui-drawer-container"}>
                <div className="ui-drawer-panel">
                    <div className="ui-drawer-header">
                        <h1>{title}</h1>
                        <Button onClick={handleClose} variant="ghost" type="button">
                            <svg width="0.7857142857142857em" height="1em" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M5.25 6.14844L8.85938 2.51172L9.48828 3.14062L5.85156 6.75L9.48828 10.3867L8.85938 11.0156L5.25 7.37891L1.61328 11.0156L0.984375 10.3867L4.62109 6.75L0.984375 3.14062L1.61328 2.51172L5.25 6.14844Z" fill="#1B1D1F"></path></svg>
                        </Button>
                        
                    </div>
                    <div className="ui-drawer-body">
                        {children}
                    </div>
                </div>
                <div onClick={handleClose} className="ui-drawer-overlay"></div>
            </div>
        )
    }
)

UIDrawer.displayName = 'UIDrawer'; 