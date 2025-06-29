import type { TooltipProps } from "../../types"
import "./Tooltip.css"

export const Tooltip = ({ clickFunc }: TooltipProps) => {
    return (
        <div className="tooltip">
            <ul>
                <li onClick={clickFunc}>Title</li>
                <li onClick={clickFunc}>Author</li>
                <li onClick={clickFunc}>Number of pages</li>
                <li onClick={clickFunc}>Rating</li>
            </ul>
        </div>
    )
}