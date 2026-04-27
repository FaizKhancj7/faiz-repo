/**
 * Pagination Component
 * This component provides navigation controls for paginated data lists.
 * It strictly follows PRD Section 6.2 rules:
 * - Shows current page vs total pages.
 * - Disables navigation buttons at boundaries (page 1 or last page).
 */

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // If there is only one page or no data, we don't need to show pagination
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
            {/* Left Side: Page Info */}
            <div className="text-sm text-gray-700">
                Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
            </div>

            {/* Right Side: Navigation Buttons */}
            <div className="flex space-x-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border
                        ${currentPage === 1 
                            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:scale-95 shadow-sm'
                        }`}
                >
                    &larr; Previous
                </button>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium transition-all rounded-lg border
                        ${currentPage === totalPages 
                            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:scale-95 shadow-sm'
                        }`}
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
};

export default Pagination;
