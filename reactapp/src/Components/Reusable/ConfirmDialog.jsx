/**
 * ConfirmDialog Component
 * This is a reusable modal used to ask the user for confirmation before performing
 * a destructive or important action (like deleting a profile or logging out).
 * 
 * Props:
 * - isOpen: Boolean. Controls whether the dialog is visible.
 * - title: String. The main heading of the dialog.
 * - message: String. The descriptive text explaining the action.
 * - onConfirm: Function. Called when the user clicks the "Confirm" button.
 * - onCancel: Function. Called when the user clicks "Cancel" or closes the modal.
 * - confirmText: String (optional). Text for the confirm button.
 */

import React from 'react';
import Button from './Button';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm" }) => {
    // If the modal is not supposed to be open, return nothing
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header & Message */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600">
                        {message}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end p-6 space-x-3 bg-gray-50/50">
                    {/* Cancel Button */}
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
                    >
                        Cancel
                    </button>

                    {/* Confirm Button */}
                    <Button
                        text={confirmText}
                        onClick={onConfirm}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 shadow-md shadow-orange-200"
                    />
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
