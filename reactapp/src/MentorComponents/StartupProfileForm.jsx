/**
 * StartupProfileForm Component — Ascent Modernism
 * This is the form where Mentors can create or update startup opportunities.
 * Features: Background image, Normal Form Card, and Fixed Viewport.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiArrowLeftLine, RiRocketLine, RiEditLine, RiAddLine } from 'react-icons/ri';
import startupService from '../services/startupService';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Loader from '../Components/Reusable/Loader';

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

    const categories = ['FinTech', 'GreenTech', 'EdTech', 'AI/ML', 'HealthTech', 'Retail', 'Other'];
    const industries = ['Energy', 'Education', 'Financial Services', 'Retail', 'Healthcare', 'Technology'];
    const stages = ['idea', 'MVP', 'pre-revenue', 'scaling', 'established'];

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
        <div className="h-full relative flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0" 
                style={{ 
                    backgroundImage: "url('/a9e3860adaff375666a186570e41a751.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                }}>
                <div className="absolute inset-0 bg-[#0e1d2a]/85 backdrop-blur-[3px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-8 animate-lift flex-shrink-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff7a21]/10 border border-[#ff7a21]/20 mb-4">
                        {isEditing ? <RiEditLine className="text-[#ff7a21]" /> : <RiAddLine className="text-[#ff7a21]" />}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7a21]">
                            {isEditing ? 'Editor Mode' : 'Creation Mode'}
                        </span>
                    </div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '40px', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                        {isEditing ? 'Edit Profile' : 'New Opportunity'}
                    </h1>
                </div>

                {/* Perfectly Fixed Form Area (No Scroll) */}
                <div className="flex-grow overflow-hidden animate-lift delay-100 pb-6">
                    <div className="bg-white rounded-[40px] shadow-2xl p-8 border-l-[6px] border-[#ff7a21] h-full flex flex-col relative overflow-hidden">
                        
                        <form onSubmit={handleSubmitClick} className="space-y-5 flex flex-col h-full">
                            
                            <div className="grid grid-cols-1 gap-5">
                                {/* Category Selection */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-bold text-sm text-gray-800 appearance-none shadow-sm"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {errors.category && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.category}</p>}
                                </div>

                                {/* Target Industry */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Industry</label>
                                    <select
                                        name="targetIndustry"
                                        value={formData.targetIndustry}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-bold text-sm text-gray-800 appearance-none shadow-sm"
                                    >
                                        <option value="">Select Industry</option>
                                        {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                    {errors.targetIndustry && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.targetIndustry}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Preferred Stage */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preferred Stage</label>
                                    <select
                                        name="preferredStage"
                                        value={formData.preferredStage}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-bold text-xs text-gray-800 appearance-none shadow-sm"
                                    >
                                        <option value="">Stage...</option>
                                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                {/* Funding Limit */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Funding (₹)</label>
                                    <input
                                        type="number"
                                        name="fundingLimit"
                                        value={formData.fundingLimit}
                                        onChange={handleChange}
                                        placeholder="500,000"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-black text-xs text-gray-800 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Equity */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Equity Expectation (%)</label>
                                <input
                                    type="number"
                                    name="avgEquityExpectation"
                                    value={formData.avgEquityExpectation}
                                    onChange={handleChange}
                                    placeholder="10"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-black text-sm text-gray-800 shadow-sm"
                                />
                            </div>

                            {/* Flexible Description */}
                            <div className="flex-grow flex flex-col space-y-1 min-h-0">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Opportunity Details</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Briefly describe your requirements..."
                                    className="flex-grow w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#ff7a21]/40 outline-none transition-all font-medium text-sm text-gray-700 resize-none shadow-sm"
                                />
                                {errors.description && <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{errors.description}</p>}
                            </div>

                            {/* Compact Action Footer */}
                            <div className="pt-4 flex flex-col gap-2 flex-shrink-0">
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#ff7a21] hover:bg-[#ea6c0a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <RiRocketLine size={16} />
                                    {isEditing ? 'Save Changes' : 'Launch Listing'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/view-profiles')}
                                    className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    Cancel & Return
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
