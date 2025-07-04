import "./Tooltip.css"

type TooltipProps = {
        children: React.ReactNode
}

export const Tooltip = ({ children }: TooltipProps) => {
    return (
        <div className="tooltip">
            <ul>
                {children}
            </ul>
        </div>
    )
}