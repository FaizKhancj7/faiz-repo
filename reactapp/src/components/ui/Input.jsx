/**
 * Input.jsx — Theme-Aware Reusable Input
 * Uses CSS custom properties for border, focus ring, and background.
 */
import React from 'react';

const Input = ({ label, type, name, value, onChange, error, ...rest }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full text-left">
            {/* Label */}
            <label className="text-[11px] md:text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--theme-text-secondary)' }}>
                {label} <span style={{ color: 'var(--theme-accent)' }}>*</span>
            </label>
            
            {/* Input */}
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                {...rest}
                className="outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-4 py-3 text-sm font-medium"
                style={{
                    background: error ? 'rgba(239,68,68,0.05)' : 'var(--theme-bg-input)',
                    border: error ? '2px solid #ef4444' : '2px solid var(--theme-border)',
                    borderRadius: 'var(--theme-radius)',
                    color: 'var(--theme-text-primary)',
                }}
                onFocus={(e) => {
                    if (!error) {
                        e.currentTarget.style.borderColor = 'var(--theme-accent)';
                        e.currentTarget.style.background = 'var(--theme-bg-card)';
                    }
                }}
                onBlur={(e) => {
                    if (!error) {
                        e.currentTarget.style.borderColor = 'var(--theme-border)';
                        e.currentTarget.style.background = 'var(--theme-bg-input)';
                    }
                }}
            />
            
            {/* Error Message */}
            {error && <p className="text-xs font-medium" style={{ color: 'var(--theme-status-rejected-text)' }}>{error}</p>}
        </div>
    );
};

export default Input;