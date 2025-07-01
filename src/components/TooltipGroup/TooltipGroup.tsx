import type { TooltipGroupProps } from "../../types"
import "./TooltipGroup.css"

export const TooltipGroup = ({ children }: TooltipGroupProps) => {
    return (
        <div className="tooltip-group">
            {children}
        </div>
    )
}