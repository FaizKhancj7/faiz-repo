/**
 * Pagination.jsx — Theme-Aware Pagination Controls
 * Uses CSS custom properties for button colors, borders, and active states.
 */

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div 
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ 
                borderTop: '1px solid var(--theme-border)',
                background: 'rgba(255, 255, 255, 0.02)' // Subtle highlight for the footer
            }}
        >
            {/* Page Info */}
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--theme-accent)' }}></div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-text-muted)' }}>
                    Displaying Page <span style={{ color: 'var(--theme-text-primary)' }}>{currentPage}</span> <span className="mx-1" style={{ color: 'var(--theme-border)' }}>/</span> {totalPages}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed border"
                    style={{
                        borderColor: 'var(--theme-border)',
                        background: 'transparent',
                        color: 'var(--theme-text-primary)'
                    }}
                    onMouseEnter={(e) => { if (currentPage !== 1) { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.color = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-accent-light)'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-text-primary)'; e.currentTarget.style.background = 'transparent'; }}
                    title="Previous Page"
                >
                    <span className="text-sm font-bold">&larr;</span>
                </button>

                <div className="px-3 py-1 rounded-md border text-[10px] font-black" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-bg-input)', color: 'var(--theme-text-primary)' }}>
                    {currentPage}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed border"
                    style={{
                        borderColor: 'var(--theme-border)',
                        background: 'transparent',
                        color: 'var(--theme-text-primary)'
                    }}
                    onMouseEnter={(e) => { if (currentPage !== totalPages) { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.color = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-accent-light)'; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-text-primary)'; e.currentTarget.style.background = 'transparent'; }}
                    title="Next Page"
                >
                    <span className="text-sm font-bold">&rarr;</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
