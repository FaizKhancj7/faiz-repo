/**
 * ViewStartupOpportunities Component
 * Features: Background image, Premium Search, and Normal Table with Orange Headers.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiLightbulbLine, 
    RiCheckLine, 
    RiRocketLine
} from 'react-icons/ri';

import startupService from '../services/startupService';
import startupSubmissionService from '../services/startupSubmissionService';
import { fetchStart, fetchSuccess, fetchFailure } from '../slices/startupSlice';

// Reusable Components
import Pagination from '../Components/Reusable/Pagination';
import EmptyState from '../Components/Reusable/EmptyState';
import Loader from '../Components/Reusable/Loader';

const ViewStartupOpportunities = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { profiles, loading, pagination } = useSelector((state) => state.startup);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [submittedProfileIds, setSubmittedProfileIds] = useState(new Set());

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchUserSubmissions = useCallback(async () => {
        try {
            const response = await startupSubmissionService.getMySubmissions({ limit: 1000 });
            if (response.success) {
                const ids = new Set(response.data.map(sub => 
                    typeof sub.startupProfileId === 'object' ? sub.startupProfileId._id : sub.startupProfileId
                ));
                setSubmittedProfileIds(ids);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    }, []);

    const loadOpportunities = useCallback(async (page = 1, keyword = '') => {
        dispatch(fetchStart());
        try {
            const response = await startupService.getAllProfiles({ 
                page, 
                keyword,
                sortBy: 'createdAt',
                order: 'desc'
            });
            if (response.success) {
                dispatch(fetchSuccess(response));
            }
        } catch (error) {
            dispatch(fetchFailure(error.message));
            toast.error("Failed to load opportunities");
        }
    }, [dispatch]);

    useEffect(() => {
        loadOpportunities(1, debouncedSearch);
        fetchUserSubmissions();
    }, [debouncedSearch, loadOpportunities, fetchUserSubmissions]);

    const handlePageChange = (newPage) => {
        loadOpportunities(newPage, debouncedSearch);
    };

    const handleSubmitIdea = (profileId, category, fundingLimit) => {
        navigate('/submit-idea', { state: { profileId, category, fundingLimit } });
    };

    return (
        <div className="h-full relative flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0" 
                style={{ 
                    backgroundImage: "url('/32b8737b988d6a77f3b0042e33a62a69.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                }}>
                <div className="absolute inset-0 bg-[#0e1d2a]/80 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Static) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-lift flex-shrink-0">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff7a21]/10 border border-[#ff7a21]/20 mb-3">
                            <RiRocketLine className="text-[#ff7a21] text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7a21]">Explore Ecosystem</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                            Startup Opportunities
                        </h1>
                        <p className="text-white/40 text-sm mt-2 font-medium">Browse and find the perfect mentor for your startup idea.</p>
                    </div>

                    {/* Premium Search Bar */}
                    <div className="relative w-full md:w-80">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-[#ff7a21]/30 transition-all font-bold text-sm shadow-2xl"
                        />
                    </div>
                </div>

                {/* Content Area (Scrollable Table) */}
                {loading ? (
                    <Loader />
                ) : profiles && profiles.length > 0 ? (
                    <div className="flex flex-col h-full overflow-hidden animate-lift delay-100">
                        {/* Table Container with Internal Scroll */}
                        <div className="flex-grow overflow-auto border border-white/10 rounded-3xl shadow-2xl bg-white scrollbar-hide">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead className="sticky top-0 z-20">
                                    <tr className="bg-[#f7f9ff] border-b border-gray-100 shadow-sm">
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Mentor</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Category</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Target Industry</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Funding Limit</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Preferred Stage</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {profiles.map((profile) => {
                                        const isSubmitted = submittedProfileIds.has(profile._id);
                                        return (
                                            <tr key={profile._id} className="transition-all duration-200 hover:bg-slate-50/80">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">{profile.mentorId?.userName}</span>
                                                        <span className="text-xs text-gray-400 font-medium italic">{profile.mentorId?.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                        {profile.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-bold uppercase tracking-tight">{profile.targetIndustry}</td>
                                                <td className="px-6 py-4 text-sm font-black text-gray-900 tracking-tight">₹{profile.fundingLimit?.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-gray-600 font-bold capitalize">{profile.preferredStage}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => !isSubmitted && handleSubmitIdea(profile._id, profile.category, profile.fundingLimit)}
                                                        disabled={isSubmitted}
                                                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 ${
                                                            isSubmitted 
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                                            : 'bg-[#ff7a21] hover:bg-[#ea6c0a] text-white shadow-lg shadow-orange-900/10'
                                                        }`}
                                                    >
                                                        {isSubmitted ? (
                                                            <>
                                                                <RiCheckLine size={12} />
                                                                <span>Applied</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <RiLightbulbLine size={12} />
                                                                <span>Submit Idea</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination (Fixed at bottom of grid) */}
                        <div className="py-4 flex-shrink-0">
                            <Pagination 
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                ) : (
                    <EmptyState 
                        message={searchTerm ? "No opportunities match your search." : "There are no startup opportunities listed at the moment."} 
                        icon="💼"
                    />
                )}
            </div>
        </div>
    );
};

export default ViewStartupOpportunities;
