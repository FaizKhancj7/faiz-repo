/**
 * ViewStartupProfiles Component — Theme-Aware Implementation
 * This page allows Mentors to manage their listed startup opportunities.
 * Uses CSS custom properties for backgrounds, cards, text, tables, and buttons.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiAddLine, 
    RiDeleteBinLine, 
    RiEditLine,
    RiBankLine,
    RiSortAsc
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
        
        // Parse sort value
        let sortBy = 'createdAt';
        let order = 'desc';
        
        if (sortValue === 'funding_desc') { sortBy = 'fundingLimit'; order = 'desc'; }
        else if (sortValue === 'funding_asc') { sortBy = 'fundingLimit'; order = 'asc'; }
        else if (sortValue === 'date_desc') { sortBy = 'createdAt'; order = 'desc'; }
        else if (sortValue === 'date_asc') { sortBy = 'createdAt'; order = 'asc'; }

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
        <div className="h-full relative flex flex-col transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background handled by global AnimatedBackground in MainLayout */}

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Static) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-lift flex-shrink-0 relative z-40">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 transition-all duration-300"
                            style={{
                                background: 'var(--theme-accent-light)',
                                borderRadius: 'var(--theme-radius)',
                                border: '1px solid var(--theme-border)'
                            }}
                        >
                            <RiBankLine style={{ color: 'var(--theme-accent)' }} className="text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Venture Portfolio</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '36px', fontWeight: 800, color: 'var(--theme-text-on-dark)', letterSpacing: '-0.04em', lineHeight: 1 }} className="transition-all duration-300">
                            Startup Opportunities
                        </h1>
                        <p className="text-sm mt-2 font-medium transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Manage and track the profiles you've listed in the ecosystem.</p>
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
                                placeholder="Filter listings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all font-bold text-sm"
                                style={{
                                    background: 'var(--theme-bg-input)',
                                    border: '1px solid var(--theme-border)',
                                    color: 'var(--theme-text-primary)'
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                            />
                        </div>
                        <button 
                            onClick={() => navigate('/mentor/create-profile')}
                            className="flex items-center gap-2 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                            style={{
                                background: 'var(--theme-accent-gradient)',
                                color: 'var(--theme-text-on-accent)',
                                borderRadius: 'var(--theme-radius-lg)',
                                boxShadow: '0 6px 16px var(--theme-accent-glow)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <RiAddLine size={16} />
                            <span>Add Profile</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <TableSkeleton columns={6} rows={5} />
                ) : profiles && profiles.length > 0 ? (
                    <div className="flex flex-col h-full overflow-hidden animate-lift delay-100">
                        
                        {/* DESKTOP TABLE VIEW (Visible on LG screens and up) */}
                        <div className="hidden lg:flex flex-col flex-grow overflow-hidden border shadow-2xl transition-all duration-300"
                            style={{
                                background: 'var(--theme-bg-card)',
                                borderColor: 'var(--theme-border)',
                                borderRadius: 'var(--theme-radius-xl)',
                                backdropFilter: 'var(--theme-glass)'
                            }}
                        >
                            <div className="flex-grow overflow-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead className="sticky top-0 z-20 transition-all duration-300" style={{ background: 'var(--theme-bg-secondary)' }}>
                                        <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                                            <th className="w-[20%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-accent)' }}>Category</th>
                                            <th className="w-[25%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-accent)' }}>Industry</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-accent)' }}>Funding</th>
                                            <th className="w-[10%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-accent)' }}>Equity</th>
                                            <th className="w-[10%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-accent)' }}>Stage</th>
                                            <th className="w-[20%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-right" style={{ color: 'var(--theme-accent)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderTop: '1px solid transparent', borderColor: 'var(--theme-border)' }}>
                                        {profiles.map((profile) => (
                                            <tr key={profile._id} className="transition-all duration-200" onMouseEnter={(e) => e.currentTarget.style.background = 'var(--theme-bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                <td className="px-6 py-5 overflow-hidden">
                                                    <span className="inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border truncate max-w-full transition-all duration-300"
                                                        style={{
                                                            background: 'var(--theme-status-approved-bg)',
                                                            color: 'var(--theme-status-approved-text)',
                                                            borderColor: 'var(--theme-status-approved-border)',
                                                            borderRadius: 'var(--theme-radius)'
                                                        }}>
                                                        {profile.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-bold uppercase tracking-tight truncate transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{profile.targetIndustry}</td>
                                                <td className="px-6 py-5 text-sm font-black text-center truncate transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>₹{profile.fundingLimit?.toLocaleString()}</td>
                                                <td className="px-6 py-5 text-sm font-black text-center transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{profile.avgEquityExpectation}%</td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-xs font-bold capitalize transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{profile.preferredStage}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(profile)}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent"
                                                            style={{ color: 'var(--theme-status-approved-text)' }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-approved-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-approved-border)'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                        >
                                                            <RiEditLine size={14} />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteClick(profile._id)}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent"
                                                            style={{ color: 'var(--theme-status-rejected-text)' }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-rejected-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-rejected-border)'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                        >
                                                            <RiDeleteBinLine size={14} />
                                                            <span>Del</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
                            {profiles.map((profile) => (
                                <div key={profile._id} className="p-5 shadow-xl transition-all duration-300 space-y-4"
                                    style={{
                                        background: 'var(--theme-bg-card)',
                                        borderRadius: 'var(--theme-radius-xl)',
                                        border: '1px solid var(--theme-border)',
                                        borderLeft: '4px solid var(--theme-accent)',
                                        backdropFilter: 'var(--theme-glass)'
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 overflow-hidden">
                                            <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border truncate max-w-full transition-all duration-300"
                                                style={{
                                                    background: 'var(--theme-status-approved-bg)',
                                                    color: 'var(--theme-status-approved-text)',
                                                    borderColor: 'var(--theme-status-approved-border)',
                                                    borderRadius: 'var(--theme-radius)'
                                                }}>
                                                {profile.category}
                                            </span>
                                            <h3 className="text-sm font-black uppercase mt-1 truncate transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{profile.targetIndustry}</h3>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Limit</p>
                                            <p className="text-sm font-black transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>₹{profile.fundingLimit?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 py-3 transition-all duration-300" style={{ borderTop: '1px solid var(--theme-border)', borderBottom: '1px solid var(--theme-border)' }}>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Equity</p>
                                            <p className="text-xs font-bold transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{profile.avgEquityExpectation}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Stage</p>
                                            <p className="text-xs font-bold capitalize transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{profile.preferredStage}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <button 
                                            onClick={() => handleEdit(profile)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95"
                                            style={{
                                                background: 'var(--theme-status-approved-bg)',
                                                color: 'var(--theme-status-approved-text)',
                                                borderColor: 'var(--theme-status-approved-border)',
                                                borderRadius: 'var(--theme-radius-lg)'
                                            }}
                                        >
                                            <RiEditLine size={14} />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(profile._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95"
                                            style={{
                                                background: 'var(--theme-status-rejected-bg)',
                                                color: 'var(--theme-status-rejected-text)',
                                                borderColor: 'var(--theme-status-rejected-border)',
                                                borderRadius: 'var(--theme-radius-lg)'
                                            }}
                                        >
                                            <RiDeleteBinLine size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                        message={searchTerm ? "No profiles match your search." : "You haven't listed any startup opportunities yet."} 
                        icon="🚀"
                    />
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog 
                isOpen={!!deleteId}
                title="Delete Profile?"
                message="Are you sure you want to delete this startup opportunity? This action cannot be undone."
                confirmText="Yes, Delete"
                danger={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default ViewStartupProfiles;
