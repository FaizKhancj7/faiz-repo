/**
 * SubmitIdea Component — Ascent Modernism
 * This page allows Entrepreneurs to submit a startup idea for a specific Mentor opportunity.
 * Features: Background image, Normal Form Card, and Fixed Viewport.
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    RiRocketLine, 
    RiUploadCloud2Line, 
    RiErrorWarningLine,
    RiArrowLeftLine,
    RiFilePdfLine,
    RiCheckLine
} from 'react-icons/ri';

import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import startupSubmissionService from '../services/startupSubmissionService';

const SubmitIdea = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { profileId, category, fundingLimit } = location.state || {};

    const [formData, setFormData] = useState({
        marketPotential: '',
        launchYear: '',
        expectedFunding: '',
        address: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.marketPotential || formData.marketPotential < 1 || formData.marketPotential > 100) 
            newErrors.marketPotential = "Score must be 1-100.";
        
        if (!formData.launchYear) {
            newErrors.launchYear = "Launch date is required.";
        } else {
            const selectedDate = new Date(formData.launchYear);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate <= today) newErrors.launchYear = "Date must be in the future.";
        }

        if (!formData.expectedFunding || Number(formData.expectedFunding) <= 0) {
            newErrors.expectedFunding = "Required amount.";
        } else if (fundingLimit && Number(formData.expectedFunding) > fundingLimit) {
            newErrors.expectedFunding = `Exceeds limit of ₹${fundingLimit.toLocaleString()}`;
        }

        if (!formData.address || formData.address.length < 10) newErrors.address = "Min 10 characters.";
        if (!selectedFile) newErrors.pitchDeckFile = "PDF Pitch Deck is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setErrors(prev => ({ ...prev, pitchDeckFile: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) setShowConfirm(true);
        else toast.warning("Please correct the errors before submitting.");
    };

    const handleConfirmSubmit = async () => {
        setShowConfirm(false);
        setIsSubmitting(true);

        const submissionPayload = new FormData();
        submissionPayload.append('startupProfileId', profileId);
        submissionPayload.append('marketPotential', formData.marketPotential);
        submissionPayload.append('launchYear', formData.launchYear);
        submissionPayload.append('expectedFunding', formData.expectedFunding);
        submissionPayload.append('address', formData.address);
        submissionPayload.append('pitchDeckFile', selectedFile);

        try {
            const response = await startupSubmissionService.createSubmission(submissionPayload);
            if (response.success) setShowSuccess(true);
        } catch (error) {
            toast.error(error.message || "Submission failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profileId) {
        return (
            <div className="h-full w-full flex items-center justify-center p-10 bg-[#0e1d2a]">
                <div className="text-center animate-lift">
                    <RiErrorWarningLine className="text-6xl text-[#ff7a21] mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-white mb-4">No Opportunity Selected</h2>
                    <p className="text-white/40 mb-10 max-w-sm">Please choose a mentor opportunity first.</p>
                    <button 
                        onClick={() => navigate('/mentor-opportunities')}
                        className="px-8 py-4 bg-[#ff7a21] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-900/20"
                    >
                        Browse Mentors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full relative flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0" 
                style={{ 
                    backgroundImage: "url('/a9e3860adaff375666a186570e41a751.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                }}>
                <div className="absolute inset-0 bg-[#0e1d2a]/85 backdrop-blur-[3px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Compact) */}
                <div className="flex flex-col items-center text-center mb-4 md:mb-8 animate-lift flex-shrink-0">
                    <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff7a21]/10 border border-[#ff7a21]/20 mb-3">
                        <RiRocketLine className="text-[#ff7a21] text-xs" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff7a21]">Venture Pitch Submission</span>
                    </div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }} className="text-xl md:text-[36px]">
                        Pitch Your Idea
                    </h1>
                </div>

                {/* Form Card (Fixed Height, No Scroll) */}
                <div className="flex-grow overflow-hidden animate-lift delay-100 pb-2">
                    <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-2xl p-4 md:p-8 border-l-[4px] md:border-l-[6px] border-[#ff7a21] h-full flex flex-col relative overflow-hidden">
                        
                        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col h-full">
                            
                            {/* Inputs Stack */}
                            <div className="flex flex-col space-y-2 md:space-y-4 flex-shrink-0">
                                {/* Market Potential */}
                                <div className="space-y-0.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Market Potential (1-100)</label>
                                    <input
                                        type="number"
                                        name="marketPotential"
                                        value={formData.marketPotential}
                                        onChange={handleChange}
                                        placeholder="e.g. 85"
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-bold text-[11px] md:text-[13px] text-gray-800 shadow-sm"
                                    />
                                </div>

                                {/* Date and Funding (Compact Row) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Expected Launch</label>
                                        <input
                                            type="date"
                                            name="launchYear"
                                            value={formData.launchYear}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-bold text-[11px] md:text-[13px] text-gray-800 shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Funding Req. (₹)</label>
                                        <input
                                            type="number"
                                            name="expectedFunding"
                                            value={formData.expectedFunding}
                                            onChange={handleChange}
                                            placeholder="Amount"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-bold text-[11px] md:text-[13px] text-gray-800 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Flexible Address Field */}
                            <div className="flex-grow flex flex-col space-y-1 min-h-0 overflow-hidden">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Location & Base</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Describe your location..."
                                    className="flex-grow w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-medium text-[11px] md:text-[13px] text-gray-700 resize-none shadow-sm"
                                />
                                {errors.address && <p className="text-[8px] text-red-500 font-bold ml-1 uppercase">{errors.address}</p>}
                            </div>

                            {/* Ultra Compact File Upload */}
                            <div className="space-y-1 flex-shrink-0">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Pitch Deck (PDF)</label>
                                <div className={`relative border border-dashed rounded-xl p-2.5 flex items-center justify-center gap-3 transition-all ${
                                    selectedFile ? 'border-green-400 bg-green-50' : 'border-slate-100 bg-slate-50 hover:border-[#ff7a21]/30 hover:bg-[#ff7a21]/5'
                                }`}>
                                    <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    {selectedFile ? <RiCheckLine className="text-sm text-green-500" /> : <RiUploadCloud2Line className="text-sm text-slate-300" />}
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-tighter truncate max-w-[150px]">
                                        {selectedFile ? selectedFile.name : "Attach Deck"}
                                    </p>
                                </div>
                                {errors.pitchDeckFile && <p className="text-[8px] text-red-500 font-bold ml-1 uppercase">{errors.pitchDeckFile}</p>}
                            </div>

                            {/* Compact Actions */}
                            <div className="pt-2 flex flex-col gap-2 flex-shrink-0">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-[#ff7a21] hover:bg-[#ea6c0a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Processing..." : (
                                        <>
                                            <RiRocketLine size={14} />
                                            Submit Pitch
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/mentor-opportunities')}
                                    className="w-full py-1 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#0e1d2a] transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Confirm Submission"
                message="Your pitch will be sent to the mentor for review. Continue?"
                onConfirm={handleConfirmSubmit}
                onCancel={() => setShowConfirm(false)}
            />

            <ConfirmDialog
                isOpen={showSuccess}
                title="Pitch Sent!"
                message="Your startup idea has been successfully submitted."
                onConfirm={() => navigate('/entrepreneur/my-submissions')}
                showCancel={false}
                confirmText="View Dashboard"
            />
        </div>
    );
};

export default SubmitIdea;
