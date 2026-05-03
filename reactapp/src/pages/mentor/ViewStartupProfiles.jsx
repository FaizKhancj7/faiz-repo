// ViewStartupProfiles — Kinetic Mentor Redesign
// Features: Portfolio-style dashboard, solar-gradient table headers, and HD illustrations.

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiAddLine, 
    RiDeleteBinLine, 
    RiEditLine,
    RiBankLine,
    RiSortAsc,
    RiLineChartLine
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import startupService from '../../services/startupService';
import { fetchStart, fetchSuccess, fetchFailure } from '../../store/startupSlice';

// Reusable Components
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Loader from '../../components/ui/Loader';
import TableSkeleton from '../../components/ui/TableSkeleton';
import Dropdown from '../../components/ui/Dropdown';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Kinetic Palette) ---

const MemphisPortfolio = () => (
    <svg viewBox="0 0 400 200" className="w-full max-w-[280px] h-auto drop-shadow-xl animate-float">
        <circle cx="100" cy="100" r="80" fill="var(--theme-accent-light)" opacity="0.3" />
        <rect x="180" y="40" width="180" height="120" rx="20" fill="var(--theme-bg-card)" stroke="var(--theme-border)" strokeWidth="2" />
        {/* Charts */}
        <rect x="200" y="120" width="30" height="20" rx="4" fill="#ff8c00" />
        <rect x="240" y="100" width="30" height="40" rx="4" fill="#ad2c00" />
        <rect x="280" y="80" width="30" height="60" rx="4" fill="var(--theme-accent)" />
        {/* Person - Managing Data */}
        <path d="M50 160 Q80 100 120 120" fill="none" stroke="#ff8c00" strokeWidth="16" strokeLinecap="round" />
        <circle cx="130" cy="100" r="12" fill="#ff8c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
    </svg>
);

const ViewStartupProfiles = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { profiles, loading, pagination } = useSelector((state) => state.startup);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    
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

    const loadProfiles = useCallback(async (page = 1, keyword = '') => {
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
            toast.error("Failed to load profiles");
        }
    }, [dispatch, sortValue]);

    useEffect(() => {
        loadProfiles(1, debouncedSearch);
    }, [debouncedSearch, sortValue, loadProfiles]);

    const handlePageChange = (newPage) => {
        loadProfiles(newPage, debouncedSearch);
    };

    const handleEdit = (profile) => {
        navigate('/mentor/create-profile', { state: { profileData: profile } });
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        const id = deleteId;
        setDeleteId(null);
        try {
            const response = await startupService.deleteProfile(id);
            if (response.success) {
                toast.success("Profile deleted successfully");
                loadProfiles(pagination.currentPage, debouncedSearch);
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete profile");
        }
    };

    return (
        <div className="min-h-full relative flex flex-col transition-all duration-300" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: 'var(--theme-bg-primary)',
                color: 'var(--theme-text-primary)'
            }}>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex-grow flex flex-col min-h-0">
                
                {/* HEADER — Portfolio Context (Reduced Margins) */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-6 animate-lift flex-shrink-0">
                    <div className="text-center lg:text-left flex-1">
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 mb-2 rounded-full" 
                            style={{ background: 'var(--theme-accent-light)', border: '1px solid var(--theme-border)' }}>
                            <RiBankLine style={{ color: 'var(--theme-accent)' }} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Venture Portfolio</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-2">
                            Startup <span style={{ color: 'var(--theme-accent)' }}>Opportunities.</span>
                        </h1>
                        <p className="text-xs font-medium max-w-lg" style={{ color: 'var(--theme-text-secondary)' }}>
                            Manage your listed ventures and funding limits. Your active listings are visible to thousands of entrepreneurs.
                        </p>
                    </div>

                    <div className="hidden md:block flex-shrink-0">
                        <MemphisPortfolio />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <button 
                            onClick={() => navigate('/mentor/create-profile')}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl"
                            style={{
                                background: 'var(--theme-accent-gradient)',
                                color: 'var(--theme-text-on-accent)',
                                borderRadius: '20px',
                                boxShadow: '0 15px 30px -10px var(--theme-accent-glow)'
                            }}
                        >
                            <RiAddLine size={20} />
                            <span>Add New Profile</span>
                        </button>
                    </div>
                </div>

                {/* SEARCH & FILTER STRIP (Reduced Margin) */}
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-2xl border-2 mb-6 flex flex-col md:flex-row items-center gap-4 animate-lift delay-100 relative z-[100]" style={{ borderColor: 'var(--theme-border)', backdropFilter: 'blur(10px)' }}>
                    <div className="relative flex-grow w-full">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" style={{ color: 'var(--theme-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by industry or category..."
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
                        <Dropdown
                            value={sortValue}
                            options={sortOptions}
                            onChange={setSortValue}
                            icon={RiSortAsc}
                        />
                    </div>
                </div>

                {/* CONTENT — Table/Pagination Card */}
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
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Listing Details</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-text-muted)' }}>Targeting</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-text-muted)' }}>Cap / Equity</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase text-right" style={{ color: 'var(--theme-text-muted)' }}>Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: 'var(--theme-border)' }}>
                                    {profiles.map((profile) => (
                                        <tr key={profile._id} className="group transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="inline-flex w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all"
                                                        style={{
                                                            background: 'var(--theme-accent-light)',
                                                            color: 'var(--theme-accent)',
                                                            borderColor: 'var(--theme-border)'
                                                        }}>
                                                        {profile.category}
                                                    </span>
                                                    <p className="text-sm font-black transition-all" style={{ color: 'var(--theme-text-primary)' }}>{profile.targetIndustry}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <p className="text-xs font-black uppercase tracking-tight" style={{ color: 'var(--theme-text-secondary)' }}>{profile.preferredStage}</p>
                                                    <p className="text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>Growth Stage</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-black" style={{ color: 'var(--theme-accent)' }}>₹{profile.fundingLimit?.toLocaleString()}</p>
                                                    <p className="text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>at {profile.avgEquityExpectation}% equity</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleEdit(profile)}
                                                        className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2"
                                                        style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-primary)' }}
                                                        title="Edit Profile"
                                                    >
                                                        <RiEditLine size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteClick(profile._id)}
                                                        className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2"
                                                        style={{ background: 'var(--theme-status-rejected-bg)', borderColor: 'var(--theme-status-rejected-text)', color: 'var(--theme-status-rejected-text)' }}
                                                        title="Delete Listing"
                                                    >
                                                        <RiDeleteBinLine size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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
                        message={searchTerm ? "No profiles match your filters." : "Your venture portfolio is currently empty."} 
                        icon={<RiLineChartLine className="text-6xl mb-6 opacity-20" />}
                        action={!searchTerm && (
                            <button onClick={() => navigate('/mentor/create-profile')} className="px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs text-white" style={{ background: 'var(--theme-accent-gradient)' }}>
                                Create First Listing
                            </button>
                        )}
                    />
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog 
                isOpen={!!deleteId}
                title="De-list Opportunity?"
                message="Are you sure you want to remove this profile from the funding hub? Entrepreneurs will no longer be able to pitch to it."
                confirmText="Yes, De-list"
                danger={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default ViewStartupProfiles;
