/**
 * Loader Component
 * This component provides a visual indicator that data is being loaded.
 * It can be used as a full-page overlay or as an inline spinner.
 * 
 * Props:
 * - fullPage: Boolean. If true, it centers the loader in the middle of the screen.
 */

import React from 'react';

const Loader = ({ fullPage = false }) => {
    // Determine the container classes based on whether it's full-page or not
    const containerClasses = fullPage 
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
        : "flex flex-col items-center justify-center p-12 w-full";

    return (
        <div className={containerClasses}>
            {/* Spinning Icon */}
            <div className="relative w-16 h-16 mb-4">
                {/* Background Ring */}
                <div className="absolute inset-0 w-full h-full border-4 border-gray-100 rounded-full"></div>
                
                {/* Moving Accent Ring (The Spinner) */}
                <div className="absolute inset-0 w-full h-full border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
            </div>

            {/* Optional Loading Text */}
            <p className="text-sm font-medium text-gray-500 animate-pulse tracking-wide uppercase">
                Loading...
            </p>
        </div>
    );
};

export default Loader;
