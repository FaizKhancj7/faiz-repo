/**
 * Pagination.jsx — Theme-Aware Pagination Controls
 * Uses CSS custom properties for button colors, borders, and active states.
 */

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center py-6 px-6 border-t" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-bg-secondary)' }}>
            <div className="inline-flex items-center p-1 rounded-full shadow-lg border transition-all hover:shadow-xl" 
                 style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)' }}>
                
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed group"
                    style={{ 
                        background: 'var(--theme-bg-card)',
                        border: '1px solid var(--theme-border)',
                        color: 'var(--theme-text-primary)'
                    }}
                >
                    <span className="text-lg transition-transform group-hover:-translate-x-0.5">&larr;</span>
                </button>

                {/* Page Status */}
                <div className="px-6 flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-text-primary)' }}>
                        {currentPage}
                    </span>
                    <span className="text-[9px] font-bold opacity-30" style={{ color: 'var(--theme-text-primary)' }}>
                        OF
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>
                        {totalPages}
                    </span>
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg group"
                    style={{ 
                        background: 'var(--theme-accent-gradient)',
                        color: 'var(--theme-text-on-accent)',
                        boxShadow: currentPage === totalPages ? 'none' : '0 4px 12px var(--theme-accent-glow)'
                    }}
                >
                    <span className="text-lg transition-transform group-hover:translate-x-0.5">&rarr;</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
