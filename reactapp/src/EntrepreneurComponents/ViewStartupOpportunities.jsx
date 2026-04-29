/**
 * ViewStartupOpportunities Component
 * This page allows Entrepreneurs to browse all startup opportunities listed by Mentors.
 * It uses the shared startup state and includes server-side search and pagination.
 * Strictly follows PRD Section 5.4.1.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiSearchLine, RiLightbulbLine, RiCheckLine } from 'react-icons/ri';

import startupService from '../services/startupService';
import startupSubmissionService from '../services/startupSubmissionService';
import { fetchStart, fetchSuccess, fetchFailure } from '../slices/startupSlice';

// Reusable Components
import Table from '../Components/Reusable/Table';
import Pagination from '../Components/Reusable/Pagination';
import EmptyState from '../Components/Reusable/EmptyState';
import Loader from '../Components/Reusable/Loader';

const ViewStartupOpportunities = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get state from Redux
    const { profiles, loading, pagination } = useSelector((state) => state.startup);
    
    // Local state for search and submission tracking
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [submittedProfileIds, setSubmittedProfileIds] = useState(new Set());

    // --- 1. DEBOUNCE SEARCH (PRD 6.1) ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // --- 2. DATA FETCHING ---
    const fetchUserSubmissions = useCallback(async () => {
        try {
            const response = await startupSubmissionService.getMySubmissions();
            if (response.success) {
                // Extract IDs of profiles already submitted to
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

    // --- 3. EVENT HANDLERS ---
    const handlePageChange = (newPage) => {
        loadOpportunities(newPage, debouncedSearch);
    };

    const handleSubmitIdea = (profileId, category, fundingLimit) => {
        // We pass the profile info in the state so the submission form knows which one it's for
        navigate('/submit-idea', { state: { profileId, category, fundingLimit } });
    };

    // --- 4. TABLE CONFIGURATION ---
    const columns = [
        "Mentor",
        "Category",
        "Target Industry",
        "Funding Limit",
        "Preferred Stage",
        "Action"
    ];

    const renderRow = (profile) => {
        const isSubmitted = submittedProfileIds.has(profile._id);

        return (
            <>
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{profile.mentorId?.userName}</span>
                        <span className="text-xs text-gray-500">{profile.mentorId?.email}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        {profile.category}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{profile.targetIndustry}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Up to ₹{profile.fundingLimit?.toLocaleString()}</td>
                <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{profile.preferredStage}</span>
                </td>
                <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => !isSubmitted && handleSubmitIdea(profile._id, profile.category, profile.fundingLimit)}
                        disabled={isSubmitted}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                            isSubmitted 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200' 
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                    >
                        {isSubmitted ? (
                            <>
                                <RiCheckLine className="text-lg" />
                                <span>Already Applied</span>
                            </>
                        ) : (
                            <>
                                <RiLightbulbLine className="text-lg" />
                                <span>Submit Idea</span>
                            </>
                        )}
                    </button>
                </td>
            </>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Startup Opportunities</h1>
                <p className="text-gray-500 font-medium mt-1">Browse and find the perfect mentor for your startup idea.</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                    type="text"
                    placeholder="Search by category, industry or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>

            {/* Content Area */}
            {loading ? (
                <Loader />
            ) : profiles && profiles.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Table 
                        columns={columns} 
                        rows={profiles} 
                        renderRow={renderRow} 
                    />
                    <Pagination 
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            ) : (
                <EmptyState 
                    message={searchTerm ? "No opportunities match your search." : "There are no startup opportunities listed at the moment."} 
                    icon="💼"
                />
            )}
        </div>
    );
};

export default ViewStartupOpportunities;
