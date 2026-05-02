/**
 * Modal.jsx — Theme-Aware Generic Modal Container
 * Uses CSS custom properties for card background, header, and close button.
 */

import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-in fade-in duration-300"
            style={{ background: 'var(--theme-bg-overlay)', backdropFilter: 'blur(8px)' }}
        >
            {/* Modal Body */}
            <div 
                className="relative w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300"
                style={{ 
                    background: 'var(--theme-bg-card)', 
                    borderRadius: 'var(--theme-radius-xl)',
                    boxShadow: 'var(--theme-shadow-lg)',
                    border: '1px solid var(--theme-border)' 
                }}
            >
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--theme-border)' }}>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--theme-text-primary)' }}>{title}</h2>
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="p-2 transition-all active:scale-95"
                        style={{ 
                            color: 'var(--theme-text-muted)', 
                            borderRadius: 'var(--theme-radius)' 
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-text-primary)'; e.currentTarget.style.background = 'var(--theme-accent-light)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
