// This is a simple reusable Input component with a label and error message.
import React from 'react';

const Input = ({ label, type, name, value, onChange, error }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {/* The label for the input field */}
            <label className="text-sm font-semibold text-slate-700">
                {label} <span className="text-red-500">*</span>
            </label>
            
            {/* The actual input element */}
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`border-2 rounded-lg px-4 py-2 outline-none transition-all 
                    ${error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-[#1E3A5F]'}`}
            />
            
            {/* Display the error message if it exists */}
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        </div>
    );
};

export default Input;