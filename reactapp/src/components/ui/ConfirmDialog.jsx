/**
 * ConfirmDialog.jsx — Theme-Aware Confirmation Modal
 * Uses CSS custom properties for backdrop, card, accent, and border styles.
 */

import React from 'react';
import { RiRocketLine } from 'react-icons/ri';

const ConfirmDialog = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    danger = false,
    showCancel = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div 
                className="absolute inset-0 transition-opacity duration-300" 
                style={{ background: 'var(--theme-bg-overlay)', backdropFilter: 'blur(12px)' }}
                onClick={onCancel}
            ></div>
            
            {/* MODAL CARD */}
            <div 
                className="relative w-full max-w-[440px] overflow-hidden animate-lift shadow-2xl"
                style={{ 
                    background: 'var(--theme-bg-card)', 
                    borderRadius: '40px',
                    border: '2px solid var(--theme-border)',
                    backdropFilter: 'var(--theme-glass)'
                }}
            >
                {/* Solar Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: danger ? 'var(--theme-status-rejected-text)' : 'var(--theme-accent-gradient)' }}></div>

                <div className="relative p-10 md:p-12">
                    <div 
                        className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border"
                        style={{ 
                            background: 'var(--theme-accent-light)', 
                            borderColor: 'var(--theme-border)' 
                        }}
                    >
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: danger ? 'var(--theme-status-rejected-text)' : 'var(--theme-accent)' }}></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: danger ? 'var(--theme-status-rejected-text)' : 'var(--theme-accent)' }}>Verification Required</span>
                    </div>

                    <h3 
                        className="text-3xl mb-5 font-black tracking-tight"
                        style={{ color: 'var(--theme-text-primary)', lineHeight: 1.1 }}
                    >
                        {title}
                    </h3>

                    <p className="text-base leading-relaxed mb-10 font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                        {message}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={onConfirm}
                            className="w-full py-5 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl rounded-2xl"
                            style={{
                                background: danger ? 'var(--theme-status-rejected-text)' : 'var(--theme-accent-gradient)',
                                color: 'var(--theme-text-on-accent)',
                                boxShadow: danger ? '0 10px 25px -5px rgba(220,38,38,0.4)' : '0 10px 25px -5px var(--theme-accent-glow)'
                            }}
                        >
                            {confirmText}
                        </button>
                        
                        {showCancel && (
                            <button
                                onClick={onCancel}
                                className="w-full py-4 text-[11px] font-black uppercase tracking-widest transition-all rounded-2xl border-2"
                                style={{ 
                                    color: 'var(--theme-text-primary)',
                                    borderColor: 'var(--theme-border)',
                                    background: 'var(--theme-bg-input)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.color = 'var(--theme-accent)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-text-primary)'; }}
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
