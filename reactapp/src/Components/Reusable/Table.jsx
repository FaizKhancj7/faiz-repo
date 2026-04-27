/**
 * Table Component
 * This is a reusable component that displays data in a structured grid format.
 * It is built using Tailwind CSS to ensure it looks modern and is responsive.
 * 
 * Props:
 * - columns: An array of strings representing the table headers.
 * - rows: An array of objects where each object represents a row of data.
 * - renderRow: A function that tells the table how to render each row's columns.
 */

import React from 'react';

const Table = ({ columns, rows, renderRow }) => {
    return (
        <div className="w-full overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
            {/* The outer div handles the border and rounded corners */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {/* Table Header Section */}
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            {columns.map((column, index) => (
                                <th 
                                    key={index} 
                                    className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body Section */}
                    <tbody className="divide-y divide-gray-100">
                        {rows && rows.length > 0 ? (
                            rows.map((row, rowIndex) => (
                                <tr 
                                    key={rowIndex} 
                                    className="transition-colors hover:bg-gray-50/50"
                                >
                                    {renderRow(row, rowIndex)}
                                </tr>
                            ))
                        ) : (
                            /* If there are no rows, we leave it to the parent to handle EmptyState 
                               or we can show a placeholder here if needed. */
                            null
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
