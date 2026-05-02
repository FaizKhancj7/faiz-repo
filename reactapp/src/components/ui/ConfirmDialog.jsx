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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* BACKDROP */}
            <div 
                className="absolute inset-0 animate-in fade-in duration-300" 
                style={{ background: 'var(--theme-bg-overlay)', backdropFilter: 'blur(8px)' }}
                onClick={onCancel}
            ></div>
            
            {/* MODAL CARD */}
            <div 
                className="relative w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-300"
                style={{ 
                    background: 'var(--theme-bg-card)', 
                    borderRadius: 'var(--theme-radius-xl)',
                    boxShadow: 'var(--theme-shadow-lg)',
                    borderLeft: `6px solid ${danger ? 'var(--theme-status-rejected-text)' : 'var(--theme-accent)'}` 
                }}
            >
                
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <RiRocketLine size={120} style={{ color: 'var(--theme-text-primary)' }} className="rotate-12" />
                </div>

                <div className="relative p-8 md:p-10">
                    <div 
                        className="inline-flex items-center gap-2 px-3 py-1 mb-6"
                        style={{ 
                            borderRadius: 'var(--theme-radius)', 
                            background: 'var(--theme-accent-light)', 
                            border: '1px solid var(--theme-border)' 
                        }}
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Verification</span>
                    </div>

                    <h3 
                        className="text-2xl mb-4"
                        style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, color: 'var(--theme-text-primary)', letterSpacing: '-0.04em', lineHeight: 1.2 }}
                    >
                        {title}
                    </h3>

                    <p className="text-sm leading-relaxed mb-10 font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                        {message}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-4 text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                            style={{
                                borderRadius: 'var(--theme-radius-lg)',
                                background: danger ? 'var(--theme-status-rejected-text)' : 'var(--theme-accent)',
                                color: 'var(--theme-text-on-accent)',
                                boxShadow: `0 8px 24px ${danger ? 'rgba(220,38,38,0.25)' : 'var(--theme-accent-glow)'}`
                            }}
                        >
                            {confirmText}
                        </button>
                        
                        {showCancel && (
                            <button
                                onClick={onCancel}
                                className="w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all"
                                style={{ color: 'var(--theme-text-muted)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text-muted)'}
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
