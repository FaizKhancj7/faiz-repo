// This is a simple reusable Button component.
import React from 'react';

const Button = ({ children, text, onClick, type = "button", disabled, loading, className = "" }) => {
    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full bg-[#1E3A5F] text-white py-2.5 rounded-lg font-bold transition-all 
                hover:bg-[#2D5282] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md 
                flex items-center justify-center gap-2 ${className}`}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : null}
            {children || text}
        </button>
    );
};

export default Button;