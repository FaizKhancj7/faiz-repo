/**
 * Button.jsx — Theme-Aware Reusable Button
 * Uses CSS custom properties for accent color, radius, and hover states.
 */
import React from 'react';

const Button = ({ children, text, onClick, type = "button", disabled, loading, className = "" }) => {
    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full text-white py-2.5 font-bold transition-all 
                active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center gap-2 ${className}`}
            style={{
                background: 'var(--theme-accent-gradient)',
                borderRadius: 'var(--theme-radius-lg)',
                boxShadow: `0 6px 24px var(--theme-accent-glow)`,
                color: 'var(--theme-text-on-accent)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 10px 32px var(--theme-accent-glow)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = `0 6px 24px var(--theme-accent-glow)`; }}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : null}
            {children || text}
        </button>
    );
};

export default Button;