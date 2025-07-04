import "./TooltipItem.css"

interface TooltipItemProps {
    children: React.ReactNode,
    clickFunc: (e: React.MouseEvent<HTMLLIElement>) => void
}

export const TooltipItem = ({children, clickFunc}: TooltipItemProps) => {
    return (
        <li className="tooltip-item" onClick={clickFunc}>{children}</li>
    )
}