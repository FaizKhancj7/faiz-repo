/**
 * StartupProfileForm Component — Theme-Aware Implementation
 * This is the form where Mentors can create or update startup opportunities.
 * Uses CSS custom properties for background overlay, cards, inputs, and text.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiRocketLine, RiEditLine, RiAddLine } from 'react-icons/ri';
import startupService from '../../services/startupService';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Loader from '../../components/ui/Loader';
import Dropdown from '../../components/ui/Dropdown';
import Input from '../../components/ui/Input';

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
        if (!formData.category) tempErrors.category = "Category is required";
        if (!formData.description || formData.description.length < 20) tempErrors.description = "Min 20 characters";
        if (!formData.fundingLimit || Number(formData.fundingLimit) < 1) tempErrors.fundingLimit = "Invalid amount";
        if (!formData.avgEquityExpectation || Number(formData.avgEquityExpectation) < 1) tempErrors.avgEquityExpectation = "Invalid equity";
        if (!formData.targetIndustry) tempErrors.targetIndustry = "Industry is required";
        if (!formData.preferredStage) tempErrors.preferredStage = "Stage is required";
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

    const handleConfirmSubmit = async () => {
        setIsConfirmOpen(false);
        setLoading(true);
        try {
            let response;
            if (isEditing) response = await startupService.updateProfile(editData._id, formData);
            else response = await startupService.createProfile(formData);

            if (response.success) {
                toast.success(isEditing ? "Profile updated!" : "Profile created!");
                navigate('/view-profiles');
            }
        } catch (error) {
            toast.error(error.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullPage={true} />;

    return (
        <div className="h-full relative flex flex-col overflow-hidden transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background handled by global AnimatedBackground in MainLayout */}

            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Compact for Mobile) */}
                <div className="flex flex-col items-center text-center mb-4 md:mb-8 animate-lift flex-shrink-0">
                    <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 mb-3 transition-all duration-300"
                        style={{
                            background: 'var(--theme-accent-light)',
                            borderRadius: 'var(--theme-radius)',
                            border: '1px solid var(--theme-border)'
                        }}
                    >
                        {isEditing ? <RiEditLine style={{ color: 'var(--theme-accent)' }} className="text-xs" /> : <RiAddLine style={{ color: 'var(--theme-accent)' }} className="text-xs" />}
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>
                            {isEditing ? 'Editor Mode' : 'Creation Mode'}
                        </span>
                    </div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, color: 'var(--theme-text-on-dark)', letterSpacing: '-0.04em', lineHeight: 1 }} className="text-xl md:text-[36px] transition-all duration-300">
                        {isEditing ? 'Edit Profile' : 'New Opportunity'}
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
                        
                        <form onSubmit={handleSubmitClick} className="space-y-3 flex flex-col h-full">
                            
                            {/* Inputs Stack */}
                            <div className="flex flex-col space-y-2 md:space-y-4 flex-shrink-0">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                                    {/* Category */}
                                    <div className="space-y-0.5 relative">
                                        <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--theme-text-muted)' }}>Category</label>
                                        <Dropdown 
                                            value={formData.category}
                                            options={[{label: 'Select Category', value: ''}, ...categories]}
                                            onChange={(val) => handleChange({ target: { name: 'category', value: val }})}
                                            error={errors.category}
                                        />
                                    </div>

                                    {/* Industry */}
                                    <div className="space-y-0.5 relative">
                                        <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--theme-text-muted)' }}>Industry</label>
                                        <Dropdown 
                                            value={formData.targetIndustry}
                                            options={[{label: 'Select Industry', value: ''}, ...industries]}
                                            onChange={(val) => handleChange({ target: { name: 'targetIndustry', value: val }})}
                                            error={errors.targetIndustry}
                                        />
                                    </div>

                                    {/* Stage */}
                                    <div className="space-y-0.5 relative z-10">
                                        <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--theme-text-muted)' }}>Stage</label>
                                        <Dropdown 
                                            value={formData.preferredStage}
                                            options={[{label: 'Select Stage', value: ''}, ...stages]}
                                            onChange={(val) => handleChange({ target: { name: 'preferredStage', value: val }})}
                                            error={errors.preferredStage}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 md:gap-4">
                                    <Input 
                                        label="Funding (₹)"
                                        name="fundingLimit"
                                        type="number"
                                        value={formData.fundingLimit}
                                        onChange={handleChange}
                                        placeholder="500000"
                                        error={errors.fundingLimit}
                                        style={{ fontSize: '13px', fontWeight: 'bold' }}
                                    />
                                    <Input 
                                        label="Equity (%)"
                                        name="avgEquityExpectation"
                                        type="number"
                                        value={formData.avgEquityExpectation}
                                        onChange={handleChange}
                                        placeholder="10"
                                        error={errors.avgEquityExpectation}
                                        style={{ fontSize: '13px', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>

                            {/* Requirements (Flex Grow, No Internal Scroll) */}
                            <div className="flex-grow flex flex-col space-y-1 min-h-0 overflow-hidden">
                                <label className="text-[9px] font-black uppercase tracking-widest ml-1" style={{ color: 'var(--theme-text-muted)' }}>Requirements</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your requirements..."
                                    className="flex-grow w-full px-4 py-2 outline-none transition-all font-medium text-[11px] md:text-[13px] resize-none"
                                    style={{
                                        background: 'var(--theme-bg-input)',
                                        border: '1px solid var(--theme-border)',
                                        borderRadius: 'var(--theme-radius)',
                                        color: 'var(--theme-text-primary)'
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                                />
                                {errors.description && <p className="text-[8px] font-bold ml-1 uppercase" style={{ color: 'var(--theme-status-rejected-text)' }}>{errors.description}</p>}
                            </div>

                            {/* Compact Actions */}
                            <div className="pt-2 flex flex-col gap-2 flex-shrink-0">
                                <button
                                    type="submit"
                                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                                    style={{
                                        background: 'var(--theme-accent-gradient)',
                                        color: 'var(--theme-text-on-accent)',
                                        borderRadius: 'var(--theme-radius)',
                                        boxShadow: '0 6px 16px var(--theme-accent-glow)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <RiRocketLine size={14} />
                                    {isEditing ? 'Save' : 'Launch Listing'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/view-profiles')}
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
