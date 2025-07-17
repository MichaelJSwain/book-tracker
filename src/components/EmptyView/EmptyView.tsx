import "./EmptyView.css"

export const EmptyView = () => {
    return (
        <div className="empty-view">
            <img className="empty-view-img" style={{height: "80px"}} src="https://www.iconpacks.net/icons/2/free-opened-book-icon-3163-thumb.png"></img>
            <h1 className="empty-view-title">Get Started!</h1>
            <p className="empty-view-message">Click the Add books button to get started.</p>
        </div>
    )
};