/**
 * Modal Component
 * A generic, reusable container that overlays the screen.
 * It provides a consistent layout with a header (title + close button) 
 * and a content area for any children components.
 */

import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    // Return null if the modal is closed
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
            {/* Modal Body */}
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    
                    {/* Close Button Icon */}
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content - Where the children are rendered */}
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
