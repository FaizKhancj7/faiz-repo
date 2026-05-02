// SubmitIdea — Kinetic Mentor Redesign
// Features: Elevator Pitch layout, solar-gradient accents, and HD illustrations.

import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    RiRocketLine, 
    RiUploadCloud2Line, 
    RiErrorWarningLine,
    RiArrowLeftLine,
    RiFilePdfLine,
    RiCheckLine,
    RiSparklingLine,
    RiLightbulbLine
} from 'react-icons/ri';

import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Input from '../../components/ui/Input';
import startupSubmissionService from '../../services/startupSubmissionService';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Kinetic Palette) ---

const MemphisPitch = () => (
    <svg viewBox="0 0 400 400" className="w-full max-w-[340px] h-auto drop-shadow-2xl animate-float">
        <circle cx="200" cy="200" r="180" fill="var(--theme-accent-light)" opacity="0.3" />
        {/* Person - Presenting Idea */}
        <path d="M150 320 Q180 200 250 220" fill="none" stroke="#ff8c00" strokeWidth="18" strokeLinecap="round" />
        <circle cx="260" cy="200" r="15" fill="#ad2c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
        {/* Idea Cloud */}
        <path d="M220 100 Q250 50 300 80 Q350 110 320 160 Q290 200 240 180 Q190 160 220 100" fill="var(--theme-accent)" opacity="0.4" />
        <RiLightbulbLine className="absolute" style={{ color: 'var(--theme-accent)', left: '260px', top: '100px', fontSize: '40px' }} />
        {/* Decorative Memphis elements */}
        <rect x="80" y="80" width="40" height="40" rx="8" fill="var(--theme-text-primary)" opacity="0.1" transform="rotate(45, 100, 100)" />
        <circle cx="320" cy="300" r="20" fill="var(--theme-accent-light)" />
    </svg>
);

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
            newErrors.launchYear = "Date required.";
        } else {
            const selectedDate = new Date(formData.launchYear);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate <= today) newErrors.launchYear = "Future date only.";
        }

        if (!formData.expectedFunding || Number(formData.expectedFunding) <= 0) {
            newErrors.expectedFunding = "Required amount.";
        } else if (fundingLimit && Number(formData.expectedFunding) > fundingLimit) {
            newErrors.expectedFunding = `Exceeds limit of ₹${fundingLimit.toLocaleString()}`;
        }

        if (!formData.address || formData.address.length < 10) newErrors.address = "Min 10 chars.";
        if (!selectedFile) newErrors.pitchDeckFile = "PDF required.";

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

    const handleConfirmSubmit = useCallback(async () => {
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
    }, [profileId, formData, selectedFile]);

    if (!profileId) {
        return (
            <div className="h-full w-full flex items-center justify-center p-10 transition-all duration-300" style={{ background: 'var(--theme-bg-primary)' }}>
                <div className="text-center animate-lift p-12 rounded-[40px] border-2 shadow-2xl" style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)' }}>
                    <RiErrorWarningLine className="text-7xl mx-auto mb-6" style={{ color: 'var(--theme-accent)' }} />
                    <h2 className="text-4xl font-black mb-4 tracking-tight">No Target Selected</h2>
                    <p className="mb-10 max-w-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>You need to choose an opportunity from the discovery hub first.</p>
                    <button 
                        onClick={() => navigate('/mentor-opportunities')}
                        className="px-10 py-4 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                        style={{
                            background: 'var(--theme-accent-gradient)',
                            color: 'var(--theme-text-on-accent)',
                            borderRadius: '20px',
                            boxShadow: '0 10px 25px -5px var(--theme-accent-glow)'
                        }}
                    >
                        Browse Hub
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex transition-all duration-300 relative overflow-hidden" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: 'var(--theme-bg-primary)',
                color: 'var(--theme-text-primary)'
            }}>
            
            {/* Background Memphis Blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 animate-liquid" style={{ background: 'var(--theme-accent)' }}></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-20 animate-liquid" style={{ background: '#ff8c00' }}></div>

            {/* LEFT — Illustration Column */}
            <div className="hidden lg:flex w-[450px] flex-shrink-0 flex-col justify-between relative overflow-hidden border-r-2"
                style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>
                
                <div className="p-10">
                    <button onClick={() => navigate('/mentor-opportunities')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[var(--theme-accent)] transition-all">
                        <RiArrowLeftLine /> Back to Discovery
                    </button>
                    <h2 className="mt-8 text-4xl font-black leading-tight tracking-tight">
                        Launch your<br />
                        <span style={{ color: 'var(--theme-accent)' }}>Vision.</span>
                    </h2>
                    <p className="mt-4 text-sm font-medium leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                        You're pitching for the <strong>{category}</strong> opportunity. Ensure your deck highlights the unique potential of your idea.
                    </p>
                </div>

                <div className="flex justify-center p-8">
                    <MemphisPitch />
                </div>

                <div className="p-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: 'var(--theme-accent-light)', border: '1px solid var(--theme-border)' }}>
                        <RiSparklingLine style={{ color: 'var(--theme-accent)' }} />
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-accent)' }}>Pitch Protocol Ready</span>
                    </div>
                </div>
            </div>

            {/* RIGHT — Form Column */}
            <div className="flex-grow flex items-center justify-center p-6 relative overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-2xl relative z-10 animate-lift">
                    
                    <div className="p-8 md:p-12 shadow-2xl transition-all duration-300 border-2"
                        style={{
                            background: 'var(--theme-bg-card)',
                            borderRadius: '40px',
                            borderColor: 'var(--theme-border)',
                            boxShadow: 'var(--theme-shadow-lg)'
                        }}
                    >
                        <div className="mb-6 text-center lg:text-left">
                            <h1 className="text-2xl font-black tracking-tight mb-1">Elevator Pitch.</h1>
                            <p className="text-[11px] font-medium opacity-80" style={{ color: 'var(--theme-text-secondary)' }}>
                                Complete your submission for the <strong>{category}</strong> opportunity.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: 'var(--theme-text-muted)' }}>Market Potential</label>
                                    <Input name="marketPotential" type="number" value={formData.marketPotential} onChange={handleChange} placeholder="1-100" error={errors.marketPotential} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: 'var(--theme-text-muted)' }}>Launch Date</label>
                                    <Input name="launchYear" type="date" value={formData.launchYear} onChange={handleChange} error={errors.launchYear} />
                                </div>
                                <div className="space-y-1 md:col-span-2 lg:col-span-1">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: 'var(--theme-text-muted)' }}>Requirement (₹)</label>
                                    <Input name="expectedFunding" type="number" value={formData.expectedFunding} onChange={handleChange} placeholder={`Max ${fundingLimit?.toLocaleString()}`} error={errors.expectedFunding} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: 'var(--theme-text-muted)' }}>Pitch Deck (PDF)</label>
                                    <div className="relative group overflow-hidden border-2" 
                                        style={{ 
                                            background: 'var(--theme-bg-input)', 
                                            borderColor: errors.pitchDeckFile ? 'var(--theme-status-rejected-border)' : 'var(--theme-border)',
                                            borderRadius: '20px' 
                                        }}>
                                        <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                        <div className="flex items-center gap-3 p-3.5">
                                            <div className="p-2 rounded-xl" style={{ background: selectedFile ? 'var(--theme-status-approved-bg)' : 'var(--theme-accent-light)', color: selectedFile ? 'var(--theme-status-approved-text)' : 'var(--theme-accent)' }}>
                                                {selectedFile ? <RiCheckLine size={18} /> : <RiUploadCloud2Line size={18} />}
                                            </div>
                                            <div className="flex flex-col truncate">
                                                <p className="text-[11px] font-black truncate">{selectedFile ? selectedFile.name : "Choose PDF Deck"}</p>
                                                <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "Click to upload"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {errors.pitchDeckFile && <p className="text-[9px] font-bold ml-1 uppercase" style={{ color: 'var(--theme-status-rejected-text)' }}>{errors.pitchDeckFile}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] ml-1" style={{ color: 'var(--theme-text-muted)' }}>Venture Location</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Startup base address..."
                                        className="w-full px-5 py-3.5 min-h-[68px] outline-none transition-all font-bold text-sm resize-none border-2"
                                        style={{
                                            background: 'var(--theme-bg-input)',
                                            borderColor: 'var(--theme-border)',
                                            borderRadius: '20px',
                                            color: 'var(--theme-text-primary)'
                                        }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                                    />
                                    {errors.address && <p className="text-[9px] font-bold ml-1 uppercase" style={{ color: 'var(--theme-status-rejected-text)' }}>{errors.address}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl disabled:opacity-50"
                                style={{
                                    background: 'var(--theme-accent-gradient)',
                                    color: 'var(--theme-text-on-accent)',
                                    borderRadius: '20px',
                                    boxShadow: '0 15px 30px -10px var(--theme-accent-glow)'
                                }}
                            >
                                {isSubmitting ? "Finalizing Pitch..." : (
                                    <>
                                        <RiRocketLine className="text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        Launch Submission
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Commit Pitch?"
                message="Your elevator pitch and deck will be sent to the mentor for formal evaluation. Continue?"
                onConfirm={handleConfirmSubmit}
                onCancel={() => setShowConfirm(false)}
            />

            <ConfirmDialog
                isOpen={showSuccess}
                title="Venture Launched!"
                message="Your pitch has been successfully delivered. You can track its status in your dashboard."
                onConfirm={() => navigate('/entrepreneur/my-submissions')}
                showCancel={false}
                confirmText="Go to Dashboard"
            />
        </div>
    );
};

export default SubmitIdea;
