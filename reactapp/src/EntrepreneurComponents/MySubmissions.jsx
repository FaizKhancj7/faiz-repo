/**
 * MySubmissions.jsx
 * This component allows Entrepreneurs to track and manage their submitted startup ideas.
 * Features: Pagination, Category Search, View Profile Modal, View PDF, and Delete Action.
 * Strictly follows PRD Section 5.4.3.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiEyeLine, 
    RiFilePdfLine, 
    RiDeleteBin6Line,
    RiRocket2Line,
    RiExternalLinkLine
} from 'react-icons/ri';

// Import our reusable components
import Table from '../Components/Reusable/Table';
import Pagination from '../Components/Reusable/Pagination';
import Loader from '../Components/Reusable/Loader';
import EmptyState from '../Components/Reusable/EmptyState';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Modal from '../Components/Reusable/Modal';

import startupSubmissionService from '../services/startupSubmissionService';

const MySubmissions = () => {
    // --- 1. STATE MANAGEMENT ---
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });
    
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Modal/Dialog states
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    // --- 2. DEBOUNCE SEARCH ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // --- 3. DATA FETCHING ---
    const loadSubmissions = useCallback(async (page = 1, category = '') => {
        setLoading(true);
        try {
            const response = await startupSubmissionService.getMySubmissions({ 
                page, 
                category 
            });
            if (response.success) {
                setSubmissions(response.data);
                setPagination({
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages
                });
            }
        } catch (error) {
            toast.error(error.message || "Failed to load your submissions");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSubmissions(1, debouncedSearch);
    }, [debouncedSearch, loadSubmissions]);

    // --- 4. EVENT HANDLERS ---
    const handlePageChange = (newPage) => {
        loadSubmissions(newPage, debouncedSearch);
    };

    const handleViewProfile = (profile) => {
        setSelectedProfile(profile);
        setShowProfileModal(true);
    };

    const handleOpenDelete = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const handleConfirmDelete = async () => {
        const id = deleteConfirm.id;
        setDeleteConfirm({ show: false, id: null });
        
        try {
            const response = await startupSubmissionService.deleteMySubmission(id);
            if (response.success) {
                toast.success("Submission removed successfully");
                loadSubmissions(pagination.currentPage, debouncedSearch);
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete submission");
        }
    };

    const viewPitchDeck = (filePath) => {
        // Backend serves uploads at root
        const url = `http://localhost:8080/${filePath}`;
        window.open(url, '_blank');
    };

    // --- 5. TABLE CONFIGURATION ---
    const columns = [
        "Mentor",
        "Startup Category",
        "Submission Date",
        "Status",
        "Actions"
    ];

    const getStatusBadge = (status) => {
        const styles = {
            1: "bg-yellow-100 text-yellow-700",
            2: "bg-green-100 text-green-700",
            3: "bg-red-100 text-red-700"
        };
        const labels = { 1: "Pending", 2: "Shortlisted", 3: "Rejected" };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const renderRow = (submission) => (
        <>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{submission.startupProfileId?.mentorId?.userName || 'N/A'}</span>
                    <span className="text-xs text-gray-400 font-medium">{submission.startupProfileId?.mentorId?.email}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-gray-700 font-bold uppercase tracking-tight">
                    {submission.startupProfileId?.category || 'N/A'}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                {new Date(submission.submissionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td className="px-6 py-4">
                {getStatusBadge(submission.status)}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button 
                        onClick={() => handleViewProfile(submission.startupProfileId)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="View Mentor Profile"
                    >
                        <RiEyeLine size={18} />
                    </button>
                    <button 
                        onClick={() => viewPitchDeck(submission.pitchDeckFile)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                        title="View Pitch Deck (PDF)"
                    >
                        <RiFilePdfLine size={18} />
                    </button>
                    <button 
                        onClick={() => handleOpenDelete(submission._id)}
                        className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                        title="Remove Submission"
                    >
                        <RiDeleteBin6Line size={18} />
                    </button>
                </div>
            </td>
        </>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">My Submissions</h1>
                    <p className="text-gray-500 font-medium mt-1 italic">Track the journey of your startup ideas and pitches.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <Loader />
            ) : submissions.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Table 
                        columns={columns}
                        rows={submissions}
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
                    message={searchTerm ? "No submissions match your search." : "You haven't submitted any startup ideas yet."}
                    icon="🚀"
                />
            )}

            {/* View Profile Modal */}
            <Modal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                title="Mentor Opportunity Details"
            >
                {selectedProfile && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <RiRocket2Line className="text-2xl text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-orange-400 uppercase tracking-widest">Target Category</p>
                                <p className="text-xl font-black text-gray-900 uppercase italic">{selectedProfile.category}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Max Funding</p>
                                <p className="text-lg font-black text-gray-900">₹{selectedProfile.fundingLimit?.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Equity Expectation</p>
                                <p className="text-lg font-black text-gray-900">{selectedProfile.avgEquityExpectation}%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Preferred Stage</p>
                                <p className="text-sm font-bold text-gray-700 capitalize">{selectedProfile.preferredStage}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Industry</p>
                                <p className="text-sm font-bold text-gray-700">{selectedProfile.targetIndustry}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</p>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {selectedProfile.description}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={deleteConfirm.show}
                onCancel={() => setDeleteConfirm({ show: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Remove Submission?"
                message="Are you sure you want to remove this pitch? This will delete your submission from the mentor's dashboard as well."
                confirmText="Yes, Remove It"
                danger={true}
            />
        </div>
    );
};

export default MySubmissions;
