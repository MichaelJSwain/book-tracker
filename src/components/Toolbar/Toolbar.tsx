interface ToolbarProps {
    children: React.ReactNode
}

export const Toolbar = ({ children }: ToolbarProps) => {
    return (
        <div className="flex flex-hr">
            {children}
        </div>
    )   
}