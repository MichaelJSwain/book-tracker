import { Button } from "../Button/Button"
import "./PageHeader.css"

interface PageHeaderProps {
    title: string,
    button?: React.ReactNode
}

export const PageHeader = ({ title, button }: PageHeaderProps) => {
    return (
        <div className="page-header">
            <div>
                <h1>{title}</h1>
            </div>
            <div>
                {button}
            </div>
        </div>
    )
}