/**
 * EmptyState.jsx — Theme-Aware Empty State Display
 * Uses CSS custom properties for text, border, and background.
 */

import React from 'react';

const EmptyState = ({ message, icon = "📁" }) => {
    return (
        <div 
            className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed animate-lift"
            style={{ 
                background: 'var(--theme-bg-input)', 
                borderColor: 'var(--theme-border)',
                borderRadius: '40px' 
            }}
        >
            {/* Visual Icon */}
            <div className="mb-8" style={{ color: 'var(--theme-accent)' }}>
                {React.isValidElement(icon) ? icon : (
                    <span className="text-7xl opacity-20 filter grayscale">{icon}</span>
                )}
            </div>

            {/* Heading */}
            <h3 className="text-3xl font-black tracking-tight mb-4" style={{ color: 'var(--theme-text-primary)' }}>
                Ecosystem Quiet.
            </h3>

            {/* Description */}
            <p className="max-w-md text-sm font-medium leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                {message || "There are no entries to display at the moment. Our systems are ready when you are!"}
            </p>
        </div>
    );
};

export default EmptyState;
