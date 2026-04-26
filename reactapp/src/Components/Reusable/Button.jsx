// This is a simple reusable Button component.
import React from 'react';

const Button = ({ text, onClick, type = "button", disabled }) => {
    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="w-full bg-[#1E3A5F] text-white py-2.5 rounded-lg font-bold transition-all 
                hover:bg-[#2D5282] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
            {text}
        </button>
    );
};

export default Button;