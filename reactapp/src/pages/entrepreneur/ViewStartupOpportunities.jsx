/**
 * ViewStartupOpportunities Component — Theme-Aware Implementation
 * Features: Background image, Premium Search, and Normal Table.
 * Uses CSS custom properties for backgrounds, cards, text, tables, and buttons.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiLightbulbLine, 
    RiCheckLine, 
    RiRocketLine,
    RiSortAsc
} from 'react-icons/ri';

import startupService from '../../services/startupService';
import startupSubmissionService from '../../services/startupSubmissionService';
import { fetchStart, fetchSuccess, fetchFailure } from '../../store/startupSlice';

// Reusable Components
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';
import TableSkeleton from '../../components/ui/TableSkeleton';
import Dropdown from '../../components/ui/Dropdown';

const ViewStartupOpportunities = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { profiles, loading, pagination } = useSelector((state) => state.startup);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [submittedProfileIds, setSubmittedProfileIds] = useState(new Set());
    
    // SORTING STATES
    const [sortValue, setSortValue] = useState('date_desc');

    const sortOptions = [
        { label: 'Funding: High to Low', value: 'funding_desc' },
        { label: 'Funding: Low to High', value: 'funding_asc' },
        { label: 'Newest First', value: 'date_desc' }
    ];

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

        // Parse sort value
        let sortBy = 'createdAt';
        let order = 'desc';

        if (sortValue === 'funding_desc') { sortBy = 'fundingLimit'; order = 'desc'; }
        else if (sortValue === 'funding_asc') { sortBy = 'fundingLimit'; order = 'asc'; }
        else if (sortValue === 'date_desc') { sortBy = 'createdAt'; order = 'desc'; }

        try {
            const response = await startupService.getAllProfiles({ 
                page, 
                keyword,
                sortBy,
                order
            });
            if (response.success) {
                dispatch(fetchSuccess(response));
            }
        } catch (error) {
            dispatch(fetchFailure(error.message));
            toast.error("Failed to load opportunities");
        }
    }, [dispatch, sortValue]);

    useEffect(() => {
        loadOpportunities(1, debouncedSearch);
        fetchUserSubmissions();
    }, [debouncedSearch, sortValue, loadOpportunities, fetchUserSubmissions]);

    const handlePageChange = (newPage) => {
        loadOpportunities(newPage, debouncedSearch);
    };

    const handleSubmitIdea = (profileId, category, fundingLimit) => {
        navigate('/submit-idea', { state: { profileId, category, fundingLimit } });
    };

    return (
        <div className="h-full relative flex flex-col transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background handled by global AnimatedBackground in MainLayout */}

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Static) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-lift flex-shrink-0 relative z-40">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 transition-all duration-300"
                            style={{ background: 'var(--theme-accent-light)', borderRadius: 'var(--theme-radius)', border: '1px solid var(--theme-border)' }}>
                            <RiRocketLine style={{ color: 'var(--theme-accent)' }} className="text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>Explore Ecosystem</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '36px', fontWeight: 800, color: 'var(--theme-text-on-dark)', letterSpacing: '-0.04em', lineHeight: 1 }} className="transition-all duration-300">
                            Startup Opportunities
                        </h1>
                        <p className="text-sm mt-2 font-medium transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Browse and find the perfect mentor for your startup idea.</p>
                    </div>

                    <div className="flex items-center gap-4 relative z-50">
                        {/* Sort Dropdown */}
                        <div className="w-48">
                            <Dropdown
                                value={sortValue}
                                options={sortOptions}
                                onChange={setSortValue}
                                icon={RiSortAsc}
                            />
                        </div>

                        {/* Premium Search Bar */}
                        <div className="relative w-full md:w-80">
                            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all font-bold text-sm"
                                style={{ background: 'var(--theme-bg-input)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <TableSkeleton columns={6} rows={5} />
                ) : profiles && profiles.length > 0 ? (
                    <div className="flex flex-col h-full overflow-hidden animate-lift delay-100">
                        
                        {/* DESKTOP TABLE VIEW (Visible on LG screens and up) */}
                        <div className="hidden lg:flex flex-col flex-grow overflow-hidden border shadow-2xl transition-all duration-300"
                            style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius-xl)', backdropFilter: 'var(--theme-glass)' }}>
                            <div className="flex-grow overflow-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead className="sticky top-0 z-20 transition-all duration-300" style={{ background: 'var(--theme-bg-secondary)' }}>
                                        <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                                            <th className="w-[25%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>Mentor</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>Category</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>Industry</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>Funding</th>
                                            <th className="w-[10%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>Stage</th>
                                            <th className="w-[20%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-right transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderTop: '1px solid transparent', borderColor: 'var(--theme-border)' }}>
                                        {profiles.map((profile) => {
                                            const isSubmitted = submittedProfileIds.has(profile._id);
                                            return (
                                                <tr key={profile._id} className="transition-all duration-200" onMouseEnter={(e) => e.currentTarget.style.background = 'var(--theme-bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                    <td className="px-6 py-5 overflow-hidden">
                                                        <div className="flex flex-col truncate">
                                                            <span className="text-sm font-bold leading-tight truncate transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{profile.mentorId?.userName}</span>
                                                            <span className="text-[10px] font-medium italic mt-0.5 truncate transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>{profile.mentorId?.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border transition-all duration-300"
                                                            style={{ background: 'var(--theme-status-approved-bg)', color: 'var(--theme-status-approved-text)', borderColor: 'var(--theme-status-approved-border)', borderRadius: 'var(--theme-radius)' }}>
                                                            {profile.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-bold uppercase tracking-tight truncate transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{profile.targetIndustry}</td>
                                                    <td className="px-6 py-5 text-sm font-black tracking-tight transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>₹{profile.fundingLimit?.toLocaleString()}</td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-xs font-bold capitalize transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{profile.preferredStage}</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button 
                                                            onClick={() => !isSubmitted && handleSubmitIdea(profile._id, profile.category, profile.fundingLimit)}
                                                            disabled={isSubmitted}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                                            style={{
                                                                background: isSubmitted ? 'var(--theme-bg-input)' : 'var(--theme-accent-gradient)',
                                                                color: isSubmitted ? 'var(--theme-text-muted)' : 'var(--theme-text-on-accent)',
                                                                border: isSubmitted ? '1px solid var(--theme-border)' : '1px solid transparent',
                                                                cursor: isSubmitted ? 'not-allowed' : 'pointer',
                                                                boxShadow: isSubmitted ? 'none' : '0 4px 12px var(--theme-accent-glow)'
                                                            }}
                                                            onMouseEnter={(e) => !isSubmitted && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                                            onMouseLeave={(e) => !isSubmitted && (e.currentTarget.style.transform = 'translateY(0)')}
                                                        >
                                                            {isSubmitted ? (
                                                                <>
                                                                    <RiCheckLine size={12} />
                                                                    <span>Applied</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <RiLightbulbLine size={12} />
                                                                    <span>Pitch</span>
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
                            {/* Desktop Pagination */}
                            <Pagination 
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>

                        {/* TABLET & MOBILE CARD VIEW (Visible below LG breakpoint) */}
                        <div className="lg:hidden flex-grow overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                            {profiles.map((profile) => {
                                const isSubmitted = submittedProfileIds.has(profile._id);
                                return (
                                    <div key={profile._id} className="p-5 shadow-xl transition-all duration-300 space-y-4"
                                        style={{ background: 'var(--theme-bg-card)', borderRadius: 'var(--theme-radius-xl)', border: '1px solid var(--theme-border)', borderLeft: '4px solid var(--theme-accent)', backdropFilter: 'var(--theme-glass)' }}>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1 overflow-hidden">
                                                <div className="flex flex-col mb-2 truncate">
                                                    <span className="text-xs font-black leading-tight truncate transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{profile.mentorId?.userName}</span>
                                                    <span className="text-[9px] font-medium italic truncate transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>{profile.mentorId?.email}</span>
                                                </div>
                                                <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border transition-all duration-300"
                                                    style={{ background: 'var(--theme-status-approved-bg)', color: 'var(--theme-status-approved-text)', borderColor: 'var(--theme-status-approved-border)', borderRadius: 'var(--theme-radius)' }}>
                                                    {profile.category}
                                                </span>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Industry</p>
                                                <p className="text-[11px] font-black uppercase truncate max-w-[100px] transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{profile.targetIndustry}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 py-3 transition-all duration-300" style={{ borderTop: '1px solid var(--theme-border)', borderBottom: '1px solid var(--theme-border)' }}>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Funding</p>
                                                <p className="text-xs font-black transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>₹{profile.fundingLimit?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Stage</p>
                                                <p className="text-xs font-bold capitalize transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{profile.preferredStage}</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => !isSubmitted && handleSubmitIdea(profile._id, profile.category, profile.fundingLimit)}
                                            disabled={isSubmitted}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                            style={{
                                                background: isSubmitted ? 'var(--theme-bg-input)' : 'var(--theme-accent-gradient)',
                                                color: isSubmitted ? 'var(--theme-text-muted)' : 'var(--theme-text-on-accent)',
                                                border: isSubmitted ? '1px solid var(--theme-border)' : '1px solid transparent',
                                                cursor: isSubmitted ? 'not-allowed' : 'pointer',
                                                boxShadow: isSubmitted ? 'none' : '0 4px 12px var(--theme-accent-glow)'
                                            }}
                                            onMouseEnter={(e) => !isSubmitted && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                            onMouseLeave={(e) => !isSubmitted && (e.currentTarget.style.transform = 'translateY(0)')}
                                        >
                                            {isSubmitted ? (
                                                <><RiCheckLine size={14} /> Applied</>
                                            ) : (
                                                <><RiLightbulbLine size={14} /> Submit Pitch</>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                            {/* Mobile Pagination */}
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
