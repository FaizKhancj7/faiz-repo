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
import { RiRocketLine } from 'react-icons/ri';
import Button from './Button';

const ConfirmDialog = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    danger = false,
    showCancel = true
}) => {
    // If the modal is not supposed to be open, return nothing
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* BACKDROP with Heavy Blur */}
            <div className="absolute inset-0 bg-[#0e1d2a]/80 backdrop-blur-[8px] animate-in fade-in duration-300" onClick={onCancel}></div>
            
            {/* MODAL CARD */}
            <div className="relative w-full max-w-[400px] bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border-l-[6px] border-[#ff7a21] animate-in zoom-in-95 duration-300">
                
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <RiRocketLine size={120} className="text-[#0e1d2a] rotate-12" />
                </div>

                <div className="relative p-8 md:p-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff7a21]/10 border border-[#ff7a21]/20 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7a21]">Verification</span>
                    </div>

                    <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, color: '#0e1d2a', letterSpacing: '-0.04em', lineHeight: 1.2 }} className="text-2xl mb-4">
                        {title}
                    </h3>

                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
                        {message}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                                danger 
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/20' 
                                : 'bg-[#ff7a21] hover:bg-[#ea6c0a] text-white shadow-orange-900/20'
                            }`}
                        >
                            {confirmText}
                        </button>
                        
                        {showCancel && (
                            <button
                                onClick={onCancel}
                                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
