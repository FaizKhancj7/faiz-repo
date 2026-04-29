import React from 'react';

/**
 * Reusable Table Component
 * This follows the corporate design system with a clean, structured look.
 * It's fully responsive and handles empty states gracefully.
 */
const Table = ({ columns, rows, renderRow }) => {
    return (
        <div className="w-full overflow-hidden border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 bg-white overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                        {columns.map((column, index) => (
                            <th 
                                key={index} 
                                className="px-6 py-5 text-xs font-black tracking-widest text-gray-400 uppercase"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                    {rows && rows.length > 0 ? (
                        rows.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                className="transition-all duration-200 hover:bg-gray-50/50"
                            >
                                {renderRow(row, rowIndex)}
                            </tr>
                        ))
                    ) : null}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
