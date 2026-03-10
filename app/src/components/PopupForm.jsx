import React from 'react';

const PopupForm = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <div>
                    <h2>{title}</h2>
                    <button onClick={onClose}>
                        Close
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}

export default PopupForm;