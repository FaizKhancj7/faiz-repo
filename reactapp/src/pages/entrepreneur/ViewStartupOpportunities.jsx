// ViewStartupOpportunities — Kinetic Mentor Redesign
// Features: Discovery Hub layout, solar-gradient accents, and HD illustrations.

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiLightbulbLine, 
    RiCheckLine, 
    RiRocketLine,
    RiSortAsc,
    RiCompass3Line,
    RiUserFollowLine
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

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Kinetic Palette) ---

const MemphisDiscovery = () => (
    <svg viewBox="0 0 400 200" className="w-full max-w-[280px] h-auto drop-shadow-xl animate-float">
        <circle cx="100" cy="100" r="80" fill="var(--theme-accent-light)" opacity="0.3" />
        {/* Telescope/Magnifying Glass */}
        <path d="M150 120 L250 80" stroke="var(--theme-text-primary)" strokeWidth="12" strokeLinecap="round" />
        <circle cx="260" cy="75" r="30" fill="var(--theme-bg-card)" stroke="var(--theme-border)" strokeWidth="2" />
        <circle cx="260" cy="75" r="20" fill="var(--theme-accent)" opacity="0.4" />
        {/* Person - Searching */}
        <path d="M50 160 Q80 100 120 120" fill="none" stroke="#ff8c00" strokeWidth="16" strokeLinecap="round" />
        <circle cx="130" cy="100" r="12" fill="#ad2c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
        {/* Small floating idea icons */}
        <path d="M300 140 L310 160 L330 165 L315 175 L320 195 L300 185 L280 195 L285 175 L270 165 L290 160 Z" fill="var(--theme-accent)" opacity="0.6" />
    </svg>
);

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
        <div className="min-h-full relative flex flex-col transition-all duration-300" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: 'var(--theme-bg-primary)',
                color: 'var(--theme-text-primary)'
            }}>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex-grow flex flex-col min-h-0">
                
                {/* HEADER — Context (Reduced Margins) */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-6 animate-lift flex-shrink-0">
                    <div className="text-center lg:text-left flex-1">
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 mb-2 rounded-full" 
                            style={{ background: 'var(--theme-accent-light)', border: '1px solid var(--theme-border)' }}>
                            <RiCompass3Line style={{ color: 'var(--theme-accent)' }} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Opportunity Hub</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-2">
                            Discovery <span style={{ color: 'var(--theme-accent)' }}>Portal.</span>
                        </h1>
                        <p className="text-xs font-medium max-w-lg" style={{ color: 'var(--theme-text-secondary)' }}>
                            Find the perfect mentorship match. Browse opportunities, compare funding limits, and pitch your game-changing ideas.
                        </p>
                    </div>

                    <div className="hidden md:block flex-shrink-0">
                        <MemphisDiscovery />
                    </div>
                </div>

                {/* SEARCH STRIP (Reduced Margin) */}
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-2xl border-2 mb-6 flex flex-col md:flex-row items-center gap-4 animate-lift delay-100 relative z-[100]" style={{ borderColor: 'var(--theme-border)', backdropFilter: 'blur(10px)' }}>
                    <div className="relative flex-grow w-full">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" style={{ color: 'var(--theme-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by mentor name, Industry or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all font-bold text-sm"
                            style={{
                                background: 'var(--theme-bg-input)',
                                border: '1px solid var(--theme-border)',
                                color: 'var(--theme-text-primary)'
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <Dropdown value={sortValue} options={sortOptions} onChange={setSortValue} icon={RiSortAsc} />
                    </div>
                </div>

                {/* CONTENT — Table/Cards */}
                {loading ? (
                    <TableSkeleton columns={6} rows={5} />
                ) : profiles && profiles.length > 0 ? (
                    <div className="flex-grow flex flex-col min-h-0 animate-lift delay-200">
                        <div className="flex-grow overflow-auto custom-scrollbar border-2 rounded-[40px] shadow-2xl min-h-0"
                            style={{
                                background: 'var(--theme-bg-card)',
                                borderColor: 'var(--theme-border)',
                                backdropFilter: 'var(--theme-glass)'
                            }}
                        >
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-20" style={{ background: 'var(--theme-bg-secondary)' }}>
                                    <tr>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Lead Mentor</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Ecosystem</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Venture Capital</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase text-right" style={{ color: 'var(--theme-text-muted)' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: 'var(--theme-border)' }}>
                                    {profiles.map((profile) => {
                                        const isSubmitted = submittedProfileIds.has(profile._id);
                                        return (
                                            <tr key={profile._id} className="group transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all group-hover:scale-110"
                                                            style={{ background: 'var(--theme-bg-secondary)', border: '1px solid var(--theme-border)', color: 'var(--theme-accent)' }}>
                                                            <RiUserFollowLine />
                                                        </div>
                                                        <div className="flex flex-col truncate">
                                                            <p className="text-sm font-black transition-all" style={{ color: 'var(--theme-text-primary)' }}>{profile.mentorId?.userName}</p>
                                                            <p className="text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>{profile.mentorId?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className="inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                                                            style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)', borderColor: 'var(--theme-border)' }}>
                                                            {profile.category}
                                                        </span>
                                                        <p className="text-[9px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>{profile.targetIndustry}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col items-start">
                                                        <p className="text-sm font-black" style={{ color: 'var(--theme-accent)' }}>₹{profile.fundingLimit?.toLocaleString()}</p>
                                                        <p className="text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>{profile.preferredStage} stage</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button 
                                                        onClick={() => !isSubmitted && handleSubmitIdea(profile._id, profile.category, profile.fundingLimit)}
                                                        disabled={isSubmitted}
                                                        className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                                        style={{
                                                            background: isSubmitted ? 'var(--theme-bg-input)' : 'var(--theme-accent-gradient)',
                                                            color: isSubmitted ? 'var(--theme-text-muted)' : 'var(--theme-text-on-accent)',
                                                            border: isSubmitted ? '2px solid var(--theme-border)' : 'none',
                                                            boxShadow: isSubmitted ? 'none' : '0 8px 20px -5px var(--theme-accent-glow)'
                                                        }}
                                                    >
                                                        {isSubmitted ? (
                                                            <>
                                                                <RiCheckLine size={16} />
                                                                <span>Applied</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <RiLightbulbLine size={16} />
                                                                <span>Pitch Idea</span>
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

                        {/* PAGINATION */}
                        <div className="mt-6 flex-shrink-0">
                            <Pagination 
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                ) : (
                    <EmptyState 
                        message={searchTerm ? "No opportunities match your search." : "Ecosystem is currently quiet. Check back later!"} 
                        icon={<RiCompass3Line className="text-6xl mb-6 opacity-20" />}
                    />
                )}
            </div>
        </div>
    );
};

export default ViewStartupOpportunities;
