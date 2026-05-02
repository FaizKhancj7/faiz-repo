import React from 'react';

const TableSkeleton = ({ rows = 5, columns = 5 }) => {
    return (
        <div className="flex flex-col flex-grow overflow-hidden border shadow-2xl transition-all duration-300"
            style={{
                background: 'var(--theme-bg-card)',
                borderColor: 'var(--theme-border)',
                borderRadius: 'var(--theme-radius-xl)',
                backdropFilter: 'var(--theme-glass)'
            }}
        >
            <div className="flex-grow overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 transition-all duration-300" style={{ background: 'var(--theme-bg-secondary)' }}>
                        <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="px-6 py-4">
                                    <div className="h-3 w-24 rounded animate-pulse" style={{ background: 'var(--theme-text-muted)', opacity: 0.3 }}></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderTop: '1px solid transparent', borderColor: 'var(--theme-border)' }}>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="transition-all duration-200">
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <td key={colIndex} className="px-6 py-5">
                                        <div className="space-y-3">
                                            <div className="h-4 w-3/4 rounded animate-pulse" style={{ background: 'var(--theme-text-muted)', opacity: 0.2 }}></div>
                                            {colIndex === 0 && (
                                                <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: 'var(--theme-text-muted)', opacity: 0.15 }}></div>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Mobile Skeleton View */}
            <div className="lg:hidden flex-grow overflow-y-auto space-y-4 p-4 custom-scrollbar">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="p-5 shadow-xl transition-all duration-300 space-y-4 rounded-[var(--theme-radius-xl)] border"
                        style={{
                            background: 'var(--theme-bg-card)',
                            borderColor: 'var(--theme-border)',
                        }}
                    >
                        <div className="h-4 w-1/2 rounded animate-pulse mb-2" style={{ background: 'var(--theme-text-muted)', opacity: 0.2 }}></div>
                        <div className="h-3 w-1/3 rounded animate-pulse mb-4" style={{ background: 'var(--theme-text-muted)', opacity: 0.15 }}></div>
                        <div className="flex justify-between">
                            <div className="h-8 w-16 rounded animate-pulse" style={{ background: 'var(--theme-text-muted)', opacity: 0.2 }}></div>
                            <div className="h-8 w-16 rounded animate-pulse" style={{ background: 'var(--theme-text-muted)', opacity: 0.2 }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
