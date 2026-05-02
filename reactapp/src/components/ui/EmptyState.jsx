/**
 * EmptyState.jsx — Theme-Aware Empty State Display
 * Uses CSS custom properties for text, border, and background.
 */

import React from 'react';

const EmptyState = ({ message, icon = "📁" }) => {
    return (
        <div 
            className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed"
            style={{ 
                background: 'var(--theme-accent-light)', 
                borderColor: 'var(--theme-border)',
                borderRadius: 'var(--theme-radius-xl)' 
            }}
        >
            {/* Visual Icon */}
            <div className="text-6xl mb-6 grayscale opacity-50">
                {icon}
            </div>

            {/* Heading */}
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--theme-text-primary)' }}>
                No records found
            </h3>

            {/* Description */}
            <p className="max-w-xs leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                {message || "There are no entries to display at the moment. Check back later or create a new one!"}
            </p>
        </div>
    );
};

export default EmptyState;
