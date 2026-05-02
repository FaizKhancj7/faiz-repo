/**
 * Modal.jsx — Theme-Aware Generic Modal Container
 * Uses CSS custom properties for card background, header, and close button.
 */

import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'var(--theme-bg-overlay)', backdropFilter: 'blur(12px)' }}
        >
            {/* Modal Body */}
            <div 
                className="relative w-full max-w-2xl overflow-hidden animate-lift shadow-2xl"
                style={{ 
                    background: 'var(--theme-bg-card)', 
                    borderRadius: '40px',
                    border: '2px solid var(--theme-border)',
                    backdropFilter: 'var(--theme-glass)'
                }}
            >
                {/* Solar Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: 'var(--theme-accent-gradient)' }}></div>
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-8" style={{ borderBottom: '1px solid var(--theme-border)' }}>
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-black tracking-tight" style={{ color: 'var(--theme-text-primary)' }}>{title}</h2>
                        <div className="w-12 h-1 mt-1 rounded-full" style={{ background: 'var(--theme-accent)' }}></div>
                    </div>
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center transition-all active:scale-90 rounded-2xl border-2"
                        style={{ 
                            color: 'var(--theme-text-muted)', 
                            background: 'var(--theme-bg-input)',
                            borderColor: 'var(--theme-border)'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.color = 'var(--theme-accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-text-muted)'; }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="animate-lift delay-100">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
