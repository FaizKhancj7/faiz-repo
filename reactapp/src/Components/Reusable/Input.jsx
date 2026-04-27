// This is a simple reusable Input component with a label and error message.
import React from 'react';

const Input = ({ label, type, name, value, onChange, error, ...rest }) => {
    return (
        <div className="flex flex-col gap-1 w-full text-left">
            {/* The label for the input field */}
            <label className="text-sm font-bold text-gray-700">
                {label} <span className="text-red-500">*</span>
            </label>
            
            {/* The actual input element */}
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                {...rest}
                className={`border rounded-xl px-4 py-3 outline-none transition-all 
                    ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-orange-500 bg-gray-50'}`}
            />
            
            {/* Display the error message if it exists */}
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        </div>
    );
};

export default Input;