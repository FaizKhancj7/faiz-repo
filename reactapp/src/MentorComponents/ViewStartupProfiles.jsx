/**
 * ViewStartupProfiles Component — Ascent Modernism
 * This page allows Mentors to manage their listed startup opportunities.
 * Features: Background image, Normal Table with Orange Headers, and Fixed Viewport Scroll.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiAddLine, 
    RiDeleteBinLine, 
    RiEditLine,
    RiRocketLine,
    RiBankLine
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import startupService from '../services/startupService';
import { fetchStart, fetchSuccess, fetchFailure } from '../slices/startupSlice';

// Reusable Components
import Pagination from '../Components/Reusable/Pagination';
import EmptyState from '../Components/Reusable/EmptyState';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Loader from '../Components/Reusable/Loader';

const ViewStartupProfiles = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { profiles, loading, pagination } = useSelector((state) => state.startup);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadProfiles = useCallback(async (page = 1, keyword = '') => {
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
            toast.error("Failed to load profiles");
        }
    }, [dispatch]);

    useEffect(() => {
        loadProfiles(1, debouncedSearch);
    }, [debouncedSearch, loadProfiles]);

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
        <div className="h-full relative flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0" 
                style={{ 
                    backgroundImage: "url('/ef25b0c1e24e39075b96f250f91f9060.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                }}>
                <div className="absolute inset-0 bg-[#0e1d2a]/85 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Static) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-lift flex-shrink-0">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff7a21]/10 border border-[#ff7a21]/20 mb-3">
                            <RiBankLine className="text-[#ff7a21] text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7a21]">Venture Portfolio</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                            Startup Opportunities
                        </h1>
                        <p className="text-white/40 text-sm mt-2 font-medium">Manage and track the profiles you've listed in the ecosystem.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Premium Search Bar */}
                        <div className="relative w-full md:w-80">
                            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl" />
                            <input
                                type="text"
                                placeholder="Filter listings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-[#ff7a21]/30 transition-all font-bold text-sm shadow-2xl"
                            />
                        </div>
                        <button 
                            onClick={() => navigate('/mentor/create-profile')}
                            className="flex items-center gap-2 px-6 py-3.5 bg-[#ff7a21] hover:bg-[#ea6c0a] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-900/20 transition-all active:scale-95"
                        >
                            <RiAddLine size={16} />
                            <span>Add Profile</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <Loader />
                ) : profiles && profiles.length > 0 ? (
                    <div className="flex flex-col h-full overflow-hidden animate-lift delay-100">
                        
                        {/* DESKTOP TABLE VIEW (Visible on LG screens and up) */}
                        <div className="hidden lg:flex flex-col flex-grow overflow-hidden border border-white/10 rounded-3xl shadow-2xl bg-white">
                            <div className="flex-grow overflow-auto">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead className="sticky top-0 z-20">
                                        <tr className="bg-[#f7f9ff] border-b border-gray-100 shadow-sm">
                                            <th className="w-[20%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Category</th>
                                            <th className="w-[25%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Industry</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Funding</th>
                                            <th className="w-[10%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Equity</th>
                                            <th className="w-[10%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Stage</th>
                                            <th className="w-[20%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {profiles.map((profile) => (
                                            <tr key={profile._id} className="transition-all duration-200 hover:bg-slate-50/80">
                                                <td className="px-6 py-5 overflow-hidden">
                                                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100 truncate max-w-full">
                                                        {profile.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-600 font-bold uppercase tracking-tight truncate">{profile.targetIndustry}</td>
                                                <td className="px-6 py-5 text-sm font-black text-gray-900 text-center truncate">₹{profile.fundingLimit?.toLocaleString()}</td>
                                                <td className="px-6 py-5 text-sm font-black text-gray-600 text-center">{profile.avgEquityExpectation}%</td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-xs text-gray-600 font-bold capitalize">{profile.preferredStage}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(profile)}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-blue-100"
                                                        >
                                                            <RiEditLine size={14} />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteClick(profile._id)}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-red-100"
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
                        </div>

                        {/* TABLET & MOBILE CARD VIEW (Visible below LG breakpoint) */}
                        <div className="lg:hidden flex-grow overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                            {profiles.map((profile) => (
                                <div key={profile._id} className="bg-white rounded-3xl p-5 shadow-xl border-l-[4px] border-[#ff7a21] space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 overflow-hidden">
                                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-wider border border-blue-100 truncate max-w-full">
                                                {profile.category}
                                            </span>
                                            <h3 className="text-sm font-black text-[#0e1d2a] uppercase mt-1 truncate">{profile.targetIndustry}</h3>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Limit</p>
                                            <p className="text-sm font-black text-[#ff7a21]">₹{profile.fundingLimit?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Equity</p>
                                            <p className="text-xs font-bold text-gray-700">{profile.avgEquityExpectation}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stage</p>
                                            <p className="text-xs font-bold text-gray-700 capitalize">{profile.preferredStage}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <button 
                                            onClick={() => handleEdit(profile)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 transition-all active:scale-95"
                                        >
                                            <RiEditLine size={14} />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(profile._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 transition-all active:scale-95"
                                        >
                                            <RiDeleteBinLine size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination */}
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
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default ViewStartupProfiles;
