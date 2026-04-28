/**
 * StartupSubmissions.jsx
 * This component provides a dashboard for Mentors to review startup ideas sent by Entrepreneurs.
 * Features: Filtering, Sorting, Pagination (10/page), Detail View, and Status Management.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
    RiFilter2Line, 
    RiSortAsc, 
    RiEyeLine, 
    RiCheckLine, 
    RiCloseLine, 
    RiFilePdfLine,
    RiRocket2Line
} from 'react-icons/ri';

// Import our reusable components
import Table from '../Components/Reusable/Table';
import Pagination from '../Components/Reusable/Pagination';
import Loader from '../Components/Reusable/Loader';
import EmptyState from '../Components/Reusable/EmptyState';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Modal from '../Components/Reusable/Modal';

import startupSubmissionService from '../services/startupSubmissionService';

const StartupSubmissions = () => {
    // --- 1. STATE MANAGEMENT ---

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });
    
    // Filter and Sort states
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    // Action/Dialog states
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState({ show: false, type: '', id: null });

    // --- 2. DATA FETCHING ---

    const loadSubmissions = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                status: statusFilter,
                order: sortOrder
            };
            const response = await startupSubmissionService.getMentorSubmissions(params);
            if (response.success) {
                setSubmissions(response.data);
                setPagination({
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages
                });
            }
        } catch (error) {
            toast.error(error.message || "Failed to load submissions");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, sortOrder]);

    useEffect(() => {
        loadSubmissions(1);
    }, [loadSubmissions]);

    // --- 3. ACTION HANDLERS ---

    const handlePageChange = (newPage) => {
        loadSubmissions(newPage);
    };

    const handleViewDetails = (submission) => {
        setSelectedSubmission(submission);
        setShowDetailModal(true);
    };

    const openConfirm = (type, id) => {
        setConfirmAction({ show: true, type, id });
    };

    const handleConfirmAction = async () => {
        const { type, id } = confirmAction;
        setConfirmAction({ show: false, type: '', id: null });

        try {
            if (type === 'delete') {
                const response = await startupSubmissionService.deleteSubmission(id);
                if (response.success) {
                    toast.success("Submission deleted successfully");
                    loadSubmissions(pagination.currentPage);
                }
            } else {
                // Shortlist (2) or Reject (3)
                const status = type === 'shortlist' ? 2 : 3;
                const response = await startupSubmissionService.updateStatus(id, status);
                if (response.success) {
                    toast.success(`Submission ${type === 'shortlist' ? 'shortlisted' : 'rejected'}`);
                    loadSubmissions(pagination.currentPage);
                }
            }
        } catch (error) {
            toast.error(error.message || "Action failed");
        }
    };

    // --- 4. TABLE CONFIGURATION ---

    const columns = [
        "Entrepreneur",
        "Startup Name",
        "Date Submitted",
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
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const renderRow = (submission) => (
        <>
            <td className="px-6 py-4">
                <span className="text-sm font-bold text-gray-900">{submission.userName}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-gray-600 font-medium">
                    {submission.startupProfileId?.category || 'N/A'}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(submission.submissionDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
                {getStatusBadge(submission.status)}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    {/* View Details - Always Available */}
                    <button 
                        onClick={() => handleViewDetails(submission)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                    >
                        <RiEyeLine size={18} />
                    </button>

                    {/* Shortlist Action - Available if not already shortlisted */}
                    {submission.status !== 2 && (
                        <button 
                            onClick={() => openConfirm('shortlist', submission._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Shortlist"
                        >
                            <RiCheckLine size={18} />
                        </button>
                    )}

                    {/* Reject Action - Available if not already rejected (remains available after shortlist) */}
                    {submission.status !== 3 && (
                        <button 
                            onClick={() => openConfirm('reject', submission._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject"
                        >
                            <RiCloseLine size={18} />
                        </button>
                    )}
                </div>
            </td>
        </>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Startup Submissions</h1>
                    <p className="text-gray-500 font-medium">Review and manage ideas sent to your startup opportunities.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Filter */}
                    <div className="relative">
                        <RiFilter2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm text-gray-700"
                        >
                            <option value="">All Statuses</option>
                            <option value="1">Pending</option>
                            <option value="2">Shortlisted</option>
                            <option value="3">Rejected</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div className="relative">
                        <RiSortAsc className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm text-gray-700"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Table Area */}
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
                    message="No submissions found matching your criteria."
                    icon="📂"
                />
            )}

            {/* View Details Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Startup Idea Details"
            >
                {selectedSubmission && (
                    <div className="space-y-6 text-gray-800">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Entrepreneur</p>
                                <p className="font-bold text-lg">{selectedSubmission.userName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Target Category</p>
                                <p className="font-bold text-lg text-orange-600">{selectedSubmission.startupProfileId?.category}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Potential</p>
                                <p className="font-black text-blue-600">{selectedSubmission.marketPotential}%</p>
                            </div>
                            <div className="text-center border-x border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Launch</p>
                                <p className="font-black text-gray-800">{new Date(selectedSubmission.launchYear).getFullYear()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Funding Req.</p>
                                <p className="font-black text-green-600">₹{selectedSubmission.expectedFunding?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pitch Deck (PDF)</p>
                            <a 
                                href={`http://localhost:8080/${selectedSubmission.pitchDeckFile}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-700 font-bold hover:bg-orange-100 transition-all group"
                            >
                                <RiFilePdfLine className="text-2xl" />
                                <span>View Pitch Deck Document</span>
                                <RiRocket2Line className="ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </a>
                        </div>

                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Physical Address</p>
                            <p className="text-sm font-medium bg-white border border-gray-100 p-4 rounded-2xl leading-relaxed">
                                {selectedSubmission.address}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Generic Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={confirmAction.show}
                onCancel={() => setConfirmAction({ show: false, type: '', id: null })}
                onConfirm={handleConfirmAction}
                title={`Confirm ${confirmAction.type === 'delete' ? 'Deletion' : 'Status Update'}`}
                message={`Are you sure you want to ${confirmAction.type} this submission? This action ${confirmAction.type === 'delete' ? 'cannot be undone.' : 'will notify the entrepreneur.'}`}
                confirmText={`Yes, ${confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}`}
                danger={confirmAction.type === 'delete' || confirmAction.type === 'reject'}
            />
        </div>
    );
};

export default StartupSubmissions;
