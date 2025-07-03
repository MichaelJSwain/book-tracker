import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import type { UIDrawerProps, UIDrawerHandle } from "../../types";
import "./UIDrawer.css"


export const UIDrawer = forwardRef<UIDrawerHandle, UIDrawerProps>(
    ({ children, closeFunc, title }, ref) => {
        const [isOpen, setIsOpen] = useState(false);

        useEffect(() => {
            setIsOpen(true);
        }, []);

        const handleClose = () => {
            setIsOpen(false);
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
                        <button onClick={handleClose}>X</button>
                    </div>
                    <div className="ui-drawer-body">
                        {children}
                    </div>
                </div>
                <div className="ui-drawer-overlay"></div>
            </div>
        )
    }
)