/**
 * ViewStartupProfiles Component
 * This page allows Mentors to see a list of startup opportunities they have created.
 * It includes server-side pagination, search, loading states, and edit/delete actions.
 * Strictly follows PRD Section 5.3.1.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RiSearchLine, RiAddLine, RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import startupService from '../services/startupService';
import { fetchStart, fetchSuccess, fetchFailure } from '../slices/startupSlice';

// Reusable Components
import Table from '../Components/Reusable/Table';
import Pagination from '../Components/Reusable/Pagination';
import EmptyState from '../Components/Reusable/EmptyState';
import Button from '../Components/Reusable/Button';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Loader from '../Components/Reusable/Loader';

const ViewStartupProfiles = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get state from Redux
    const { profiles, loading, pagination } = useSelector((state) => state.startup);
    
    // Local state for search and delete confirmation
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    // --- 1. DEBOUNCE SEARCH (PRD 6.1) ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // --- 2. DATA FETCHING ---
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

    // --- 3. EVENT HANDLERS ---
    const handlePageChange = (newPage) => {
        loadProfiles(newPage, debouncedSearch);
    };

    const handleEdit = (profile) => {
        // Navigate to the form and pass the profile data via state
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
                // Refresh the current page
                loadProfiles(pagination.currentPage, debouncedSearch);
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete profile");
        }
    };

    // --- 4. TABLE CONFIGURATION ---
    const columns = [
        "Category",
        "Target Industry",
        "Funding Limit",
        "Equity Expectation",
        "Preferred Stage",
        "Actions"
    ];

    const renderRow = (profile) => (
        <>
            <td className="px-6 py-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {profile.category}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{profile.targetIndustry}</td>
            <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{profile.fundingLimit?.toLocaleString()}</td>
            <td className="px-6 py-4 text-sm font-semibold text-gray-700">{profile.avgEquityExpectation}%</td>
            <td className="px-6 py-4">
                <span className="text-sm text-gray-600 capitalize">{profile.preferredStage}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    {/* Edit Button */}
                    <button 
                        className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 font-bold text-sm"
                        onClick={() => handleEdit(profile)}
                    >
                        <RiEditLine className="text-lg" />
                        <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button 
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 font-bold text-sm"
                        onClick={() => handleDeleteClick(profile._id)}
                    >
                        <RiDeleteBinLine className="text-lg" />
                        <span>Delete</span>
                    </button>
                </div>
            </td>
        </>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Startup Opportunities</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and track the profiles you've listed.</p>
                </div>

                <Button 
                    text="List New Opportunity" 
                    icon={<RiAddLine />}
                    onClick={() => navigate('/mentor/create-profile')}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-orange-200 flex items-center gap-2"
                />
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
                    message={searchTerm ? "No profiles match your search." : "You haven't listed any startup opportunities yet."} 
                    icon="🚀"
                />
            )}

            {/* Delete Confirmation Dialog */}
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
