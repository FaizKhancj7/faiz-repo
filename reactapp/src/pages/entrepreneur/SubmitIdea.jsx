/**
 * SubmitIdea Component — Theme-Aware Implementation
 * This page allows Entrepreneurs to submit a startup idea for a specific Mentor opportunity.
 * Uses CSS custom properties for background overlay, cards, inputs, and text.
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

import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Input from '../../components/ui/Input';
import startupSubmissionService from '../../services/startupSubmissionService';

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
        if (validateForm()) {
            setShowConfirm(true);
        } else {
            toast.warning("Please correct the errors before submitting.");
        }
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
            if (response.success) {
                setShowSuccess(true);
            }
        } catch (error) {
            toast.error(error.message || "Submission failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profileId) {
        return (
            <div className="h-full w-full flex items-center justify-center p-10 transition-all duration-300" style={{ background: 'var(--theme-bg-primary)' }}>
                <div className="text-center animate-lift p-8 rounded-3xl border" style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)', boxShadow: 'var(--theme-shadow-lg)' }}>
                    <RiErrorWarningLine className="text-6xl mx-auto mb-6 transition-all" style={{ color: 'var(--theme-accent)' }} />
                    <h2 className="text-3xl font-black mb-4 transition-all" style={{ color: 'var(--theme-text-primary)' }}>No Opportunity Selected</h2>
                    <p className="mb-10 max-w-sm transition-all" style={{ color: 'var(--theme-text-secondary)' }}>Please choose a mentor opportunity first.</p>
                    <button 
                        onClick={() => { navigate('/mentor-opportunities'); }}
                        className="px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                        style={{
                            background: 'var(--theme-accent-gradient)',
                            color: 'var(--theme-text-on-accent)',
                            borderRadius: 'var(--theme-radius-lg)',
                            boxShadow: '0 6px 20px var(--theme-accent-glow)'
                        }}
                    >
                        Browse Mentors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full relative flex flex-col overflow-hidden transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background handled by global AnimatedBackground in MainLayout */}

            <div className="relative z-10 w-full max-w-xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Compact) */}
                <div className="flex flex-col items-center text-center mb-4 md:mb-8 animate-lift flex-shrink-0">
                    <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 mb-3 transition-all duration-300"
                        style={{
                            background: 'var(--theme-accent-light)',
                            borderRadius: 'var(--theme-radius)',
                            border: '1px solid var(--theme-border)'
                        }}
                    >
                        <RiRocketLine style={{ color: 'var(--theme-accent)' }} className="text-xs" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Venture Pitch Submission</span>
                    </div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, color: 'var(--theme-text-on-dark)', letterSpacing: '-0.04em', lineHeight: 1 }} className="text-xl md:text-[36px] transition-all duration-300">
                        Pitch Your Idea
                    </h1>
                </div>

                {/* Form Card (Fixed Height, No Scroll) */}
                <div className="flex-grow overflow-hidden animate-lift delay-100 pb-2">
                    <div className="p-4 md:p-8 h-full flex flex-col relative overflow-hidden transition-all duration-300"
                        style={{
                            background: 'var(--theme-bg-card)',
                            borderRadius: 'var(--theme-radius-xl)',
                            boxShadow: 'var(--theme-shadow-lg)',
                            borderLeft: '6px solid var(--theme-accent)',
                            backdropFilter: 'var(--theme-glass)'
                        }}
                    >
                        
                        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col h-full">
                            
                            {/* Inputs Stack */}
                            <div className="flex flex-col space-y-2 md:space-y-4 flex-shrink-0">
                                <Input 
                                    label="Market Potential (1-100)"
                                    name="marketPotential"
                                    type="number"
                                    value={formData.marketPotential}
                                    onChange={handleChange}
                                    placeholder="e.g. 85"
                                    error={errors.marketPotential}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                                    <Input 
                                        label="Expected Launch"
                                        name="launchYear"
                                        type="date"
                                        value={formData.launchYear}
                                        onChange={handleChange}
                                        error={errors.launchYear}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <Input 
                                        label="Funding Req. (₹)"
                                        name="expectedFunding"
                                        type="number"
                                        value={formData.expectedFunding}
                                        onChange={handleChange}
                                        placeholder="Amount"
                                        error={errors.expectedFunding}
                                    />
                                </div>
                            </div>

                            {/* Flexible Address Field */}
                            <div className="flex-grow flex flex-col space-y-1 min-h-0 overflow-hidden">
                                <label className="text-[9px] font-black uppercase tracking-widest ml-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Project Location & Base</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Describe your location..."
                                    className="flex-grow w-full px-4 py-2 outline-none transition-all font-medium text-[11px] md:text-[13px] resize-none"
                                    style={{
                                        background: errors.address ? 'rgba(239,68,68,0.05)' : 'var(--theme-bg-input)',
                                        border: errors.address ? '2px solid #ef4444' : '1px solid var(--theme-border)',
                                        borderRadius: 'var(--theme-radius)',
                                        color: 'var(--theme-text-primary)'
                                    }}
                                    onFocus={(e) => { if(!errors.address) { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; } }}
                                    onBlur={(e) => { if(!errors.address) { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; } }}
                                />
                                {errors.address && <p className="text-[8px] font-bold ml-1 uppercase transition-all" style={{ color: 'var(--theme-status-rejected-text)' }}>{errors.address}</p>}
                            </div>

                            {/* Ultra Compact File Upload */}
                            <div className="space-y-1 flex-shrink-0">
                                <label className="text-[9px] font-black uppercase tracking-widest ml-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Pitch Deck (PDF)</label>
                                <div className="relative border border-dashed p-2.5 flex items-center justify-center gap-3 transition-all"
                                    style={{
                                        background: errors.pitchDeckFile ? 'rgba(239,68,68,0.05)' : (selectedFile ? 'var(--theme-status-approved-bg)' : 'var(--theme-bg-input)'),
                                        borderColor: errors.pitchDeckFile ? '#ef4444' : (selectedFile ? 'var(--theme-status-approved-border)' : 'var(--theme-border)'),
                                        borderWidth: errors.pitchDeckFile ? '2px' : '1px',
                                        borderRadius: 'var(--theme-radius)'
                                    }}
                                >
                                    <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    {selectedFile ? <RiCheckLine className="text-sm transition-all" style={{ color: 'var(--theme-status-approved-text)' }} /> : <RiUploadCloud2Line className="text-sm transition-all" style={{ color: 'var(--theme-text-muted)' }} />}
                                    <p className="text-[9px] font-black uppercase tracking-tighter truncate max-w-[150px] transition-all" style={{ color: 'var(--theme-text-secondary)' }}>
                                        {selectedFile ? selectedFile.name : "Attach Deck"}
                                    </p>
                                </div>
                                {errors.pitchDeckFile && <p className="text-[8px] font-bold ml-1 uppercase transition-all" style={{ color: 'var(--theme-status-rejected-text)' }}>{errors.pitchDeckFile}</p>}
                            </div>

                            {/* Compact Actions */}
                            <div className="pt-2 flex flex-col gap-2 flex-shrink-0">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                    style={{
                                        background: 'var(--theme-accent-gradient)',
                                        color: 'var(--theme-text-on-accent)',
                                        borderRadius: 'var(--theme-radius)',
                                        boxShadow: '0 6px 16px var(--theme-accent-glow)'
                                    }}
                                    onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
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
                                    onClick={() => { navigate('/mentor-opportunities'); }}
                                    className="w-full py-1 text-[9px] font-black uppercase tracking-widest transition-all"
                                    style={{ color: 'var(--theme-text-muted)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text-muted)'}
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
                onCancel={() => { setShowConfirm(false); }}
            />

            <ConfirmDialog
                isOpen={showSuccess}
                title="Pitch Sent!"
                message="Your startup idea has been successfully submitted."
                onConfirm={() => { navigate('/entrepreneur/my-submissions'); }}
                showCancel={false}
                confirmText="View Dashboard"
            />
        </div>
    );
};

export default SubmitIdea;
