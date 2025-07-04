import "./StatusLabel.css"

type ReadingStatus = "to read" | "reading" | "read"

interface StatusLabelProps {
        status: ReadingStatus
}

const statusIconMap = {
    "to read": <svg className="Icon_Icon__qPZ8O Icon_large__76ZXR" data-testid="icon-utility-wishlist-svg" width="1em" height="1em" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M7 3.63281L6.37109 3.00391L5.71484 2.34766C5.16797 1.80078 4.45703 1.5 3.69141 1.5C2.13281 1.5 0.875 2.78516 0.875 4.34375C0.875 5.10938 1.14844 5.82031 1.69531 6.36719L2.35156 7.02344L7 11.6445L11.6211 7.02344L12.2773 6.36719C12.8242 5.82031 13.125 5.10938 13.125 4.34375C13.125 2.78516 11.8398 1.5 10.2812 1.5C9.51562 1.5 8.80469 1.80078 8.25781 2.34766L7.60156 3.00391L7 3.63281ZM7.60156 12.2734L7 12.875L6.37109 12.2734L1.75 7.625L1.06641 6.96875C0.382812 6.28516 0 5.32812 0 4.34375C0 2.29297 1.64062 0.625 3.69141 0.625C4.67578 0.625 5.63281 1.03516 6.31641 1.71875L6.37109 1.77344L7 2.375L7.60156 1.77344L7.65625 1.71875C8.33984 1.03516 9.29688 0.625 10.2812 0.625C12.332 0.625 14 2.29297 14 4.34375C14 5.32812 13.5898 6.28516 12.9062 6.96875L12.25 7.625L7.60156 12.2734Z" fill="#1B1D1F"></path></svg>,
    "reading": "...", // Replace with icon
    "read": <svg className="Icon_Icon__qPZ8O Icon_regular__MbCqv" data-testid="icon-utility-check-small-svg" width="0.9285714285714286em" height="1em" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.25 3.00391L11.9492 3.30469L4.73047 10.7969L4.42969 11.125L4.10156 10.7969L0.300781 6.83203L0 6.53125L0.628906 5.90234L0.929688 6.23047L4.42969 9.86719L11.3203 2.70312L11.6211 2.375L12.25 3.00391Z" fill="#1B1D1F"></path></svg>,
} as const;

const statusClassMap = {
    "to read": "to_read",
    "reading": "reading",
    "read": "read",
} as const;

const statusLabelMap = {
    "to read": "To Read",
    "reading": "Reading",
    "read": "Read",
} as const;

export const StatusLabel = ({ status }: StatusLabelProps) => {
    const statusLabelText = statusLabelMap[status];
    const statusIcon = statusIconMap[status];
    const statusClasses = statusClassMap[status];

    return (
        <div className={`status-label status-label-${statusClasses}`}>
            <span className="status-label-icon">{statusIcon}</span>
            <span className="status-label-text">{statusLabelText}</span>
        </div>
    )
}