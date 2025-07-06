import "./Button.css"

interface ButtonProps {
    children: React.ReactNode,
    onClick?: () => void,
    variant: "primary" | "secondary" | "ghost",
    type: "button" | "submit"
    dataTestId?: string,
    classList?: string
}

export const Button = ({ children, onClick, variant, type, dataTestId, classList }: ButtonProps) => {
    return (
        <button className={classList ? `button-${variant} ${classList}` : `button-${variant}`} type={type} onClick={onClick} data-testId={dataTestId}>{children}</button>
    )
}