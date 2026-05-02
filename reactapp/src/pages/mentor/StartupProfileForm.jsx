// StartupProfileForm — Kinetic Mentor Redesign
// Features: HD illustrations, solar-gradient accents, and a professional split-layout.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiRocketLine, RiEditLine, RiAddLine, RiArrowLeftLine, RiSparklingLine } from 'react-icons/ri';
import startupService from '../../services/startupService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Loader from '../../components/ui/Loader';
import Dropdown from '../../components/ui/Dropdown';
import Input from '../../components/ui/Input';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Kinetic Palette) ---

const MemphisLaunch = () => (
    <svg viewBox="0 0 400 400" className="w-full max-w-[340px] h-auto drop-shadow-2xl animate-float">
        <defs>
            <filter id="launch-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                <feOffset dx="0" dy="8" result="offsetblur" />
                <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <g filter="url(#launch-shadow)">
            <circle cx="200" cy="200" r="180" fill="var(--theme-accent-light)" opacity="0.3" />
            {/* Launchpad */}
            <rect x="100" y="320" width="200" height="15" rx="8" fill="var(--theme-text-primary)" opacity="0.1" stroke="var(--theme-text-primary)" strokeWidth="1" />
            {/* Person - Handing over a rocket (Mentor Role) */}
            <path d="M150 320 Q130 220 170 200" fill="none" stroke="#ff8c00" strokeWidth="18" strokeLinecap="round" />
            <circle cx="180" cy="180" r="15" fill="#ad2c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
            {/* Giant Sparkle/Idea */}
            <path d="M250 150 L270 200 L320 220 L270 240 L250 290 L230 240 L180 220 L230 200 Z" fill="var(--theme-accent)" stroke="var(--theme-text-primary)" strokeWidth="2" />
            <circle cx="250" cy="220" r="15" fill="white" opacity="0.3" />
        </g>
    </svg>
);

const StartupProfileForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const editData = location.state?.profileData;
    const isEditing = !!editData;

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        fundingLimit: '',
        avgEquityExpectation: '',
        targetIndustry: '',
        preferredStage: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const categories = [
        { label: 'FinTech', value: 'FinTech' },
        { label: 'GreenTech', value: 'GreenTech' },
        { label: 'EdTech', value: 'EdTech' },
        { label: 'AI/ML', value: 'AI/ML' },
        { label: 'HealthTech', value: 'HealthTech' },
        { label: 'Retail', value: 'Retail' },
        { label: 'Other', value: 'Other' }
    ];
    
    const industries = [
        { label: 'Energy', value: 'Energy' },
        { label: 'Education', value: 'Education' },
        { label: 'Financial Services', value: 'Financial Services' },
        { label: 'Retail', value: 'Retail' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Technology', value: 'Technology' }
    ];
    
    const stages = [
        { label: 'Idea', value: 'idea' },
        { label: 'MVP', value: 'MVP' },
        { label: 'Pre-revenue', value: 'pre-revenue' },
        { label: 'Scaling', value: 'scaling' },
        { label: 'Established', value: 'established' }
    ];

    useEffect(() => {
        if (isEditing) {
            setFormData({
                category: editData.category || '',
                description: editData.description || '',
                fundingLimit: editData.fundingLimit || '',
                avgEquityExpectation: editData.avgEquityExpectation || '',
                targetIndustry: editData.targetIndustry || '',
                preferredStage: editData.preferredStage || ''
            });
        }
    }, [isEditing, editData]);

    const validate = () => {
        let tempErrors = {};
        if (!formData.category) tempErrors.category = "Category req.";
        if (!formData.description || formData.description.length < 20) tempErrors.description = "Min 20 chars";
        if (!formData.fundingLimit || Number(formData.fundingLimit) < 1) tempErrors.fundingLimit = "Invalid amt.";
        if (!formData.avgEquityExpectation || Number(formData.avgEquityExpectation) < 1) tempErrors.avgEquityExpectation = "Invalid equity";
        if (!formData.targetIndustry) tempErrors.targetIndustry = "Industry req.";
        if (!formData.preferredStage) tempErrors.preferredStage = "Stage req.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (validate()) setIsConfirmOpen(true);
        else toast.error("Please fill all required fields.");
    };

    const handleConfirmSubmit = useCallback(async () => {
        setIsConfirmOpen(false);
        setLoading(true);
        try {
            let response;
            if (isEditing) response = await startupService.updateProfile(editData._id, formData);
            else response = await startupService.createProfile(formData);

            if (response.success) {
                toast.success(isEditing ? "Profile updated!" : "Profile launched!");
                navigate('/view-profiles');
            }
        } catch (error) {
            toast.error(error.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    }, [isEditing, editData, formData, navigate]);

    if (loading) return <Loader fullPage={true} />;

    return (
        <div className="h-full flex transition-all duration-300 relative overflow-hidden" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: 'var(--theme-bg-primary)',
                color: 'var(--theme-text-primary)'
            }}>
            
            {/* Background Memphis Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 animate-liquid" style={{ background: 'var(--theme-accent)' }}></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-20 animate-liquid" style={{ background: '#ff8c00' }}></div>

            {/* LEFT — Illustration Column */}
            <div className="hidden lg:flex w-[400px] flex-shrink-0 flex-col justify-between relative overflow-hidden border-r-2"
                style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>
                
                <div className="p-10">
                    <button onClick={() => navigate('/view-profiles')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[var(--theme-accent)] transition-all">
                        <RiArrowLeftLine /> View All Profiles
                    </button>
                    <h2 className="mt-8 text-4xl font-black leading-tight tracking-tight">
                        Define your<br />
                        <span style={{ color: 'var(--theme-accent)' }}>Ideal Match.</span>
                    </h2>
                    <p className="mt-4 text-sm font-medium leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                        Be specific about your funding capacity and the industries you're passionate about mentoring.
                    </p>
                </div>

                <div className="flex justify-center p-8">
                    <MemphisLaunch />
                </div>

                <div className="p-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: 'var(--theme-accent-light)', border: '1px solid var(--theme-border)' }}>
                        <RiSparklingLine style={{ color: 'var(--theme-accent)' }} />
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-accent)' }}>Mentor Protocol Active</span>
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
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--theme-text-primary)' }}>
                                {isEditing ? 'Edit Profile' : 'New Opportunity'}
                            </h1>
                            <p className="text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                                {isEditing ? 'Refine the details of your mentorship offering.' : 'Create a new listing to attract high-potential startups.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmitClick} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-[0.1em] ml-1 flex items-center gap-1" style={{ color: 'var(--theme-text-muted)' }}>Broad Category <span style={{ color: 'var(--theme-accent)' }}>*</span></label>
                                    <Dropdown 
                                        value={formData.category}
                                        options={[{label: 'Select Category', value: ''}, ...categories]}
                                        onChange={(val) => handleChange({ target: { name: 'category', value: val }})}
                                        error={errors.category}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-[0.1em] ml-1 flex items-center gap-1" style={{ color: 'var(--theme-text-muted)' }}>Target Industry <span style={{ color: 'var(--theme-accent)' }}>*</span></label>
                                    <Dropdown 
                                        value={formData.targetIndustry}
                                        options={[{label: 'Select Industry', value: ''}, ...industries]}
                                        onChange={(val) => handleChange({ target: { name: 'targetIndustry', value: val }})}
                                        error={errors.targetIndustry}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-[0.1em] ml-1 flex items-center gap-1" style={{ color: 'var(--theme-text-muted)' }}>Preferred Growth Stage <span style={{ color: 'var(--theme-accent)' }}>*</span></label>
                                    <Dropdown 
                                        value={formData.preferredStage}
                                        options={[{label: 'Select Stage', value: ''}, ...stages]}
                                        onChange={(val) => handleChange({ target: { name: 'preferredStage', value: val }})}
                                        error={errors.preferredStage}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input label="Funding Limit (₹)" name="fundingLimit" type="number" value={formData.fundingLimit} onChange={handleChange} placeholder="500000" error={errors.fundingLimit} />
                                    <Input label="Equity (%)" name="avgEquityExpectation" type="number" value={formData.avgEquityExpectation} onChange={handleChange} placeholder="10" error={errors.avgEquityExpectation} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-[0.1em] ml-1 flex items-center gap-1" style={{ color: 'var(--theme-text-muted)' }}>Opportunity Requirements <span style={{ color: 'var(--theme-accent)' }}>*</span></label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Briefly describe what kind of startups you are looking for..."
                                    className="w-full px-5 py-4 min-h-[120px] outline-none transition-all font-bold text-sm resize-none"
                                    style={{
                                        background: 'var(--theme-bg-input)',
                                        border: '2px solid var(--theme-border)',
                                        borderRadius: '20px',
                                        color: 'var(--theme-text-primary)'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                                />
                                {errors.description && <p className="text-[10px] font-bold ml-1 uppercase" style={{ color: 'var(--theme-status-rejected-text)' }}>{errors.description}</p>}
                            </div>

                            <button
                                type="submit"
                                className="group w-full py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
                                style={{
                                    background: 'var(--theme-accent-gradient)',
                                    color: 'var(--theme-text-on-accent)',
                                    borderRadius: '20px',
                                    boxShadow: '0 15px 30px -10px var(--theme-accent-glow)'
                                }}
                            >
                                {isEditing ? <RiEditLine className="text-lg" /> : <RiRocketLine className="text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                                {isEditing ? 'Update Opportunity' : 'Launch Listing'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title={isEditing ? "Confirm Update" : "Confirm Listing"}
                message={isEditing ? "Save changes to this profile?" : "List this opportunity for all entrepreneurs?"}
                onConfirm={handleConfirmSubmit}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </div>
    );
};

export default StartupProfileForm;
