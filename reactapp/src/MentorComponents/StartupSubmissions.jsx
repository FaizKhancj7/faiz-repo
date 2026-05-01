/**
 * StartupSubmissions Component — Ascent Modernism
 * This component provides a dashboard for Mentors to review startup ideas.
 * Features: Background image, Normal Table with Orange Headers, and Fixed Viewport Scroll.
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
    RiRocketLine,
    RiInboxArchiveLine,
    RiFileTextLine
} from 'react-icons/ri';

// Import our reusable components
import Pagination from '../Components/Reusable/Pagination';
import EmptyState from '../Components/Reusable/EmptyState';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Modal from '../Components/Reusable/Modal';
import Loader from '../Components/Reusable/Loader';

import startupSubmissionService from '../services/startupSubmissionService';

const StartupSubmissions = () => {
    // --- 1. STATE MANAGEMENT ---
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    
    // REJECTION FEEDBACK STATES
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const [rejectLoading, setRejectLoading] = useState(false);

    const [confirmAction, setConfirmAction] = useState({ show: false, type: '', id: null });

    // REASON MODAL STATES
    const [reasonModal, setReasonModal] = useState({ show: false, title: '', content: '' });

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
            } else if (type === 'shortlist') {
                const response = await startupSubmissionService.updateStatus(id, 'approved');
                if (response.success) {
                    toast.success("Submission shortlisted successfully");
                    loadSubmissions(pagination.currentPage);
                }
            }
        } catch (error) {
            toast.error(error.message || "Action failed");
        }
    };

    const handleRejectClick = (id) => {
        setRejectId(id);
        setFeedbackText('');
        setFeedbackError('');
        setShowRejectModal(true);
    };

    const handleConfirmRejection = async () => {
        if (!feedbackText.trim()) {
            setFeedbackError("Feedback is required before rejecting.");
            return;
        }
        if (feedbackText.trim().length < 10) {
            setFeedbackError("Feedback must be at least 10 characters long.");
            return;
        }

        setRejectLoading(true);
        try {
            const response = await startupSubmissionService.rejectSubmission(rejectId, feedbackText);
            if (response.success) {
                toast.success("Submission rejected with feedback.");
                setShowRejectModal(false);
                loadSubmissions(pagination.currentPage);
            }
        } catch (error) {
            setFeedbackError(error.message || "Failed to reject submission");
        } finally {
            setRejectLoading(false);
        }
    };

    const handleOpenReasonModal = (title, content) => {
        setReasonModal({ show: true, title, content });
    };

    const getStatusBadge = (submission) => {
        if (submission.isWithdrawn) {
            return (
                <span className="px-3 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-wider">
                    Withdrawn
                </span>
            );
        }

        const styles = {
            'pending': "bg-yellow-50 text-yellow-600 border-yellow-100",
            'approved': "bg-green-50 text-green-600 border-green-100",
            'rejected': "bg-red-50 text-red-600 border-red-100"
        };
        const labels = { 'pending': "Pending", 'approved': "Approved", 'rejected': "Rejected" };
        return (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[submission.status] || styles['pending']}`}>
                {labels[submission.status] || "Pending"}
            </span>
        );
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
                            <RiInboxArchiveLine className="text-[#ff7a21] text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7a21]">Review Center</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                            Startup Submissions
                        </h1>
                        <p className="text-white/40 text-sm mt-2 font-medium">Review and manage ideas sent to your startup opportunities.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Status Filter */}
                        <div className="relative">
                            <RiFilter2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:bg-white/10 focus:border-[#ff7a21]/30 transition-all font-bold text-sm shadow-2xl appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-[#0e1d2a]">All Statuses</option>
                                <option value="1" className="bg-[#0e1d2a]">Pending</option>
                                <option value="2" className="bg-[#0e1d2a]">Shortlisted</option>
                                <option value="3" className="bg-[#0e1d2a]">Rejected</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="relative">
                            <RiSortAsc className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:bg-white/10 focus:border-[#ff7a21]/30 transition-all font-bold text-sm shadow-2xl appearance-none cursor-pointer"
                            >
                                <option value="desc" className="bg-[#0e1d2a]">Newest First</option>
                                <option value="asc" className="bg-[#0e1d2a]">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <Loader />
                ) : submissions && submissions.length > 0 ? (
                    <div className="flex-grow flex flex-col overflow-hidden animate-lift delay-100">
                        
                        {/* DESKTOP TABLE VIEW (Visible on LG screens and up) */}
                        <div className="hidden lg:flex flex-col flex-grow overflow-hidden bg-white rounded-3xl shadow-2xl border border-white/10">
                            <div className="flex-grow overflow-auto">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead className="sticky top-0 z-20">
                                        <tr className="bg-[#f7f9ff] border-b border-gray-100 shadow-sm">
                                            <th className="w-[25%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Entrepreneur</th>
                                            <th className="w-[25%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Category</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Submitted</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Status</th>
                                            <th className="w-[20%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Withdrawal</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {submissions.map((submission) => (
                                            <tr key={submission._id} className="transition-all duration-200 hover:bg-slate-50/80">
                                                <td className="px-6 py-5 overflow-hidden">
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-sm font-black text-gray-900 truncate">{submission.userName}</span>
                                                        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tight italic truncate">ID: {submission._id.slice(-6)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm text-gray-600 font-bold uppercase tracking-tighter truncate block">
                                                        {submission.startupProfileId?.category || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-gray-500 font-medium text-center">
                                                    {new Date(submission.submissionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    {getStatusBadge(submission)}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        {submission.isWithdrawn ? (
                                                            <button 
                                                                onClick={() => handleOpenReasonModal("Withdrawal Reason", submission.withdrawalReason)}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                                                title="View Withdrawal Reason"
                                                            >
                                                                <RiFileTextLine size={16} />
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-300 font-bold">—</span>
                                                        )}
                                                        {submission.status === 'rejected' && submission.rejectionFeedback && (
                                                            <button 
                                                                onClick={() => handleOpenReasonModal("Rejection Feedback", submission.rejectionFeedback)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                                                title="View Your Feedback"
                                                            >
                                                                <RiFileTextLine size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleViewDetails(submission)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                                                            title="View Details"
                                                            disabled={submission.isWithdrawn}
                                                        >
                                                            <RiEyeLine size={16} />
                                                        </button>
                                                        {submission.status !== 'approved' && !submission.isWithdrawn && (
                                                            <button 
                                                                onClick={() => openConfirm('shortlist', submission._id)}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all border border-transparent hover:border-green-100"
                                                                title="Shortlist"
                                                            >
                                                                <RiCheckLine size={16} />
                                                            </button>
                                                        )}
                                                        {submission.status !== 'rejected' && !submission.isWithdrawn && (
                                                            <button 
                                                                onClick={() => handleRejectClick(submission._id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                                                title="Reject"
                                                            >
                                                                <RiCloseLine size={16} />
                                                            </button>
                                                        )}
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
                            {submissions.map((submission) => (
                                <div key={submission._id} className="bg-white rounded-3xl p-5 shadow-xl border-l-[4px] border-[#ff7a21] space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 overflow-hidden">
                                            <div className="flex flex-col mb-1 truncate">
                                                <span className="text-xs font-black text-[#0e1d2a] leading-tight truncate">{submission.userName}</span>
                                                <span className="text-[9px] text-gray-400 font-medium italic truncate">ID: {submission._id.slice(-6)}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-700 font-black uppercase tracking-tight truncate block">
                                                {submission.startupProfileId?.category || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {getStatusBadge(submission)}
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">
                                                {new Date(submission.submissionDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {submission.isWithdrawn && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="flex-grow py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-100 text-center">
                                                Withdrawn
                                            </div>
                                            <button 
                                                onClick={() => handleOpenReasonModal("Withdrawal Reason", submission.withdrawalReason)}
                                                className="p-3 bg-red-50 text-red-500 rounded-xl border border-red-100 transition-all active:scale-95"
                                            >
                                                <RiFileTextLine size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {submission.status === 'rejected' && submission.rejectionFeedback && !submission.isWithdrawn && (
                                        <div className="pt-2">
                                            <button 
                                                onClick={() => handleOpenReasonModal("Your Rejection Feedback", submission.rejectionFeedback)}
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-100 transition-all active:scale-95"
                                            >
                                                <RiFileTextLine size={14} /> View Feedback
                                            </button>
                                        </div>
                                    )}

                                    {!submission.isWithdrawn && (
                                        <div className="flex items-center gap-2 pt-1">
                                            <button 
                                                onClick={() => handleViewDetails(submission)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-100 transition-all active:scale-95"
                                            >
                                                <RiEyeLine size={14} /> Review
                                            </button>
                                            <div className="flex gap-2">
                                                {submission.status !== 'approved' && (
                                                    <button 
                                                        onClick={() => openConfirm('shortlist', submission._id)}
                                                        className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100 transition-all active:scale-95"
                                                    >
                                                        <RiCheckLine size={14} />
                                                    </button>
                                                )}
                                                {submission.status !== 'rejected' && (
                                                    <button 
                                                        onClick={() => handleRejectClick(submission._id)}
                                                        className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 transition-all active:scale-95"
                                                    >
                                                        <RiCloseLine size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
                        message="No submissions found matching your criteria."
                        icon="📂"
                    />
                )}
            </div>

            {/* View Details Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Startup Idea Details"
            >
                {selectedSubmission && (
                    <div className="space-y-6 text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Entrepreneur</p>
                                <p className="font-bold text-lg">{selectedSubmission.userName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target Category</p>
                                <p className="font-bold text-lg text-[#ff7a21]">{selectedSubmission.startupProfileId?.category}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-2xl grid grid-cols-3 gap-4 border border-gray-100">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Potential</p>
                                <p className="font-black text-blue-600">{selectedSubmission.marketPotential}%</p>
                            </div>
                            <div className="text-center border-x border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Launch</p>
                                <p className="font-black text-gray-800">{new Date(selectedSubmission.launchYear).getFullYear()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Funding</p>
                                <p className="font-black text-green-600">₹{selectedSubmission.expectedFunding?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pitch Deck (PDF)</p>
                            <a 
                                href={`http://localhost:8080/${selectedSubmission.pitchDeckFile}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl text-[#ff7a21] font-black text-xs uppercase tracking-wider hover:bg-orange-100 transition-all group"
                            >
                                <RiFilePdfLine className="text-2xl" />
                                <span>View Full Pitch Deck</span>
                                <RiRocketLine className="ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </a>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Entrepreneur Address</p>
                            <p className="text-sm font-medium bg-white border border-gray-100 p-4 rounded-2xl leading-relaxed">
                                {selectedSubmission.address}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Rejection Feedback Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => !rejectLoading && setShowRejectModal(false)}
                title="Reject this idea?"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Please provide a reason for rejection. This feedback will be shared with the entrepreneur.
                    </p>
                    
                    <div>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => {
                                setFeedbackText(e.target.value);
                                if (e.target.value.trim().length >= 10) setFeedbackError('');
                            }}
                            placeholder="Write your feedback for the entrepreneur (required)..."
                            className={`w-full h-32 p-4 bg-slate-50 border ${feedbackError ? 'border-red-300' : 'border-slate-200'} rounded-2xl outline-none focus:border-[#ff7a21] transition-all text-sm font-medium resize-none`}
                        />
                        {feedbackError && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">{feedbackError}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            disabled={rejectLoading}
                            className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmRejection}
                            disabled={rejectLoading}
                            className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                        >
                            {rejectLoading ? 'Processing...' : 'Confirm Rejection'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={confirmAction.show}
                onCancel={() => setConfirmAction({ show: false, type: '', id: null })}
                onConfirm={handleConfirmAction}
                title={`Confirm ${confirmAction.type === 'delete' ? 'Deletion' : 'Shortlisting'}`}
                message={`Are you sure you want to ${confirmAction.type} this submission?`}
                confirmText={`Yes, ${confirmAction.type === 'delete' ? 'Delete' : 'Shortlist'}`}
                danger={confirmAction.type === 'delete'}
            />

            {/* Rejection/Withdrawal Reason View Modal */}
            <Modal
                isOpen={reasonModal.show}
                onClose={() => setReasonModal({ ...reasonModal, show: false })}
                title={reasonModal.title}
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-[#f7f9ff] rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-50">
                            <RiFileTextLine className="text-xl text-[#ff7a21]" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Justification Details</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
                        "{reasonModal.content}"
                    </p>
                    <button
                        onClick={() => setReasonModal({ ...reasonModal, show: false })}
                        className="w-full py-4 bg-[#0e1d2a] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#162a3f] transition-all shadow-xl"
                    >
                        Close Details
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default StartupSubmissions;
