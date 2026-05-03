/**
 * Input.jsx — Theme-Aware Reusable Input
 * Uses CSS custom properties for border, focus ring, and background.
 */
import React, { useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

const Input = ({ label, type, name, value, onChange, error, ...rest }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1.5 w-full text-left relative">
            {/* Label */}
            {label && (
                <label className="text-[11px] font-black uppercase tracking-[0.1em] ml-1 flex items-center gap-1 whitespace-nowrap" style={{ color: 'var(--theme-text-muted)' }}>
                    {label} <span style={{ color: 'var(--theme-accent)' }}>*</span>
                </label>
            )}
            
            {/* Input Wrapper */}
            <div className="relative">
                <input 
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    {...rest}
                    className="w-full outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-4 py-3 text-sm font-medium pr-12"
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

                {/* Password Toggle Icon */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl transition-all hover:scale-110 active:scale-95"
                        style={{ color: 'var(--theme-text-muted)' }}
                    >
                        {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                    </button>
                )}
            </div>
            
            {/* Error Message */}
            {error && <p className="text-xs font-medium" style={{ color: 'var(--theme-status-rejected-text)' }}>{error}</p>}
        </div>
    );
};

export default Input;