/**
 * Loader.jsx — Theme-Aware Loading Spinner
 * Uses CSS custom properties for spinner color and backdrop.
 */

import React from 'react';

const Loader = ({ fullPage = false }) => {
    const containerClasses = fullPage 
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center"
        : "flex flex-col items-center justify-center p-12 w-full";

    return (
        <div 
            className={containerClasses}
            style={fullPage ? { background: 'var(--theme-bg-overlay)', backdropFilter: 'blur(4px)' } : {}}
        >
            {/* Spinning Icon */}
            <div className="relative w-16 h-16 mb-4">
                {/* Background Ring */}
                <div className="absolute inset-0 w-full h-full rounded-full" style={{ border: '4px solid var(--theme-border)' }}></div>
                
                {/* Moving Accent Ring (The Spinner) */}
                <div className="absolute inset-0 w-full h-full rounded-full animate-spin" style={{ border: '4px solid transparent', borderTopColor: 'var(--theme-accent)' }}></div>
            </div>

            {/* Loading Text */}
            <p className="text-sm font-medium animate-pulse tracking-wide uppercase" style={{ color: 'var(--theme-text-muted)' }}>
                Loading...
            </p>
        </div>
    );
};

export default Loader;
