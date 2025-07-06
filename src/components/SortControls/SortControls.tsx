import "./SortControls.css"

interface SortControlsProps {
    children: React.ReactNode
}

export const SortControls = ({ children }: SortControlsProps) => {
    return (
        <div className="sort-controls">
            {children}
        </div>
    )
}