import React from 'react';

const PopupForm = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
                <div className="popup-body">{children}</div>
            </div>
        </div>
    );
}

export default PopupForm;