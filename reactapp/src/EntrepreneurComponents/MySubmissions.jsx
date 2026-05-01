/**
 * MySubmissions.jsx — Ascent Modernism
 * This component allows Entrepreneurs to track their pitches.
 * Features: Background image, Normal Table with Orange Headers, and Action Buttons with text.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiEyeLine, 
    RiFilePdfLine, 
    RiDeleteBin6Line,
    RiRocket2Line,
    RiFileTextLine,
    RiNavigationLine
} from 'react-icons/ri';

// Import our reusable components
import Pagination from '../Components/Reusable/Pagination';
import EmptyState from '../Components/Reusable/EmptyState';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';
import Modal from '../Components/Reusable/Modal';
import Loader from '../Components/Reusable/Loader';

import startupSubmissionService from '../services/startupSubmissionService';

const MySubmissions = () => {
    // --- 1. STATE MANAGEMENT ---
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

    // WITHDRAWAL STATES
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [selectedWithdrawId, setSelectedWithdrawId] = useState(null);
    const [withdrawReason, setWithdrawReason] = useState('');
    const [withdrawError, setWithdrawError] = useState('');
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    
    // REASON MODAL STATES
    const [reasonModal, setReasonModal] = useState({ show: false, title: '', content: '' });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

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

    const handleOpenWithdraw = (id) => {
        setSelectedWithdrawId(id);
        setWithdrawReason('');
        setWithdrawError('');
        setShowWithdrawModal(true);
    };

    const handleConfirmWithdrawal = async () => {
        if (!withdrawReason.trim() || withdrawReason.trim().length < 10) {
            setWithdrawError("Please write a reason of at least 10 characters.");
            return;
        }

        setWithdrawLoading(true);
        try {
            const response = await startupSubmissionService.withdrawSubmission(selectedWithdrawId, withdrawReason);
            if (response.success) {
                toast.success("Your idea has been withdrawn.");
                setShowWithdrawModal(false);
                loadSubmissions(pagination.currentPage, debouncedSearch);
            }
        } catch (error) {
            setWithdrawError(error.message || "Failed to withdraw submission");
        } finally {
            setWithdrawLoading(false);
        }
    };

    const viewPitchDeck = (filePath) => {
        const url = `http://localhost:8080/${filePath}`;
        window.open(url, '_blank');
    };

    const handleOpenReasonModal = (title, content) => {
        setReasonModal({ show: true, title, content });
    };

    const getStatusBadge = (submission) => {
        if (submission.isWithdrawn) {
            return (
                <span className="px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 border-gray-100">
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
            <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${styles[submission.status] || styles['pending']}`}>
                {labels[submission.status] || "Pending"}
            </span>
        );
    };

    return (
        <div className="h-full relative flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0" 
                style={{ 
                    backgroundImage: "url('/32b8737b988d6a77f3b0042e33a62a69.jpg')", 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                }}>
                <div className="absolute inset-0 bg-[#0e1d2a]/80 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Static) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-lift flex-shrink-0">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff7a21]/10 border border-[#ff7a21]/20 mb-3">
                            <RiFileTextLine className="text-[#ff7a21] text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff7a21]">My Portfolio</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                            My Submissions
                        </h1>
                        <p className="text-white/40 text-sm mt-2 font-medium">Track the journey of your startup ideas and pitches.</p>
                    </div>

                    {/* Premium Search Bar */}
                    <div className="relative w-full md:w-80">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-xl" />
                        <input
                            type="text"
                            placeholder="Filter by category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 outline-none focus:bg-white/10 focus:border-[#ff7a21]/30 transition-all font-bold text-sm shadow-2xl"
                        />
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <Loader />
                ) : submissions && submissions.length > 0 ? (
                    <div className="flex flex-col h-full overflow-hidden animate-lift delay-100">
                        
                        {/* DESKTOP TABLE VIEW (Visible on LG screens and up) */}
                        <div className="hidden lg:flex flex-col flex-grow overflow-hidden border border-white/10 rounded-3xl shadow-2xl bg-white">
                            <div className="flex-grow overflow-auto">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead className="sticky top-0 z-20">
                                        <tr className="bg-[#f7f9ff] border-b border-gray-100 shadow-sm">
                                            <th className="w-1/4 px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Mentor</th>
                                            <th className="w-1/5 px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Category</th>
                                            <th className="w-1/6 px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Date</th>
                                            <th className="w-1/6 px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Status</th>
                                            <th className="w-1/4 px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {submissions.map((submission) => (
                                            <React.Fragment key={submission._id}>
                                                <tr className="transition-all duration-200 hover:bg-slate-50/80">
                                                    <td className="px-6 py-5 overflow-hidden">
                                                        <div className="flex flex-col truncate">
                                                            <span className="text-sm font-bold text-gray-900 leading-tight truncate">{submission.startupProfileId?.mentorId?.userName || 'N/A'}</span>
                                                            <span className="text-[10px] text-gray-400 font-medium italic mt-0.5 truncate">{submission.startupProfileId?.mentorId?.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-sm text-gray-700 font-bold uppercase tracking-tight truncate block">
                                                            {submission.startupProfileId?.category || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-gray-500 font-medium text-center">
                                                        {new Date(submission.submissionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        {getStatusBadge(submission)}
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {(submission.status === 'rejected' && submission.rejectionFeedback) && (
                                                                <button 
                                                                    onClick={() => handleOpenReasonModal("Mentor Feedback", submission.rejectionFeedback)}
                                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                                                                    title="View Rejection Feedback"
                                                                >
                                                                    <RiFileTextLine size={16} />
                                                                </button>
                                                            )}
                                                            {(submission.isWithdrawn && submission.withdrawalReason) && (
                                                                <button 
                                                                    onClick={() => handleOpenReasonModal("Withdrawal Reason", submission.withdrawalReason)}
                                                                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-gray-100"
                                                                    title="View Withdrawal Reason"
                                                                >
                                                                    <RiFileTextLine size={16} />
                                                                </button>
                                                            )}
                                                            {submission.status === 'approved' && !submission.isWithdrawn ? (
                                                                <button 
                                                                    onClick={() => handleOpenWithdraw(submission._id)}
                                                                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider border border-red-100"
                                                                >
                                                                    Withdraw
                                                                </button>
                                                            ) : submission.isWithdrawn ? (
                                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Withdrawn</span>
                                                            ) : (
                                                                <>
                                                                    <button 
                                                                        onClick={() => handleViewProfile(submission.startupProfileId)}
                                                                        className="px-2 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider border border-transparent hover:border-blue-100"
                                                                        title="View Profile"
                                                                    >
                                                                        <RiEyeLine size={14} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => viewPitchDeck(submission.pitchDeckFile)}
                                                                        className="px-2 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider border border-transparent hover:border-orange-100"
                                                                        title="View Pitch"
                                                                    >
                                                                        <RiFilePdfLine size={14} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleOpenDelete(submission._id)}
                                                                        className="px-2 py-1.5 text-gray-300 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider border border-transparent hover:border-red-100"
                                                                        title="Remove"
                                                                    >
                                                                        <RiDeleteBin6Line size={14} />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
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
                                                <span className="text-xs font-black text-[#0e1d2a] leading-tight truncate">{submission.startupProfileId?.mentorId?.userName || 'N/A'}</span>
                                                <span className="text-[9px] text-gray-400 font-medium italic truncate">{submission.startupProfileId?.mentorId?.email}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-700 font-black uppercase tracking-tight">{submission.startupProfileId?.category || 'N/A'}</span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {getStatusBadge(submission)}
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">
                                                {new Date(submission.submissionDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 pt-1">
                                        {submission.status === 'approved' && !submission.isWithdrawn ? (
                                            <button 
                                                onClick={() => handleOpenWithdraw(submission._id)}
                                                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-100 transition-all active:scale-95"
                                            >
                                                Withdraw Idea
                                            </button>
                                        ) : submission.isWithdrawn ? (
                                            <div className="flex flex-1 items-center gap-2">
                                                <div className="flex-grow py-3 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-100 text-center">
                                                    Withdrawn
                                                </div>
                                                {submission.withdrawalReason && (
                                                    <button 
                                                        onClick={() => handleOpenReasonModal("Withdrawal Reason", submission.withdrawalReason)}
                                                        className="p-3 bg-gray-50 text-gray-400 rounded-xl border border-gray-100 transition-all active:scale-95"
                                                    >
                                                        <RiFileTextLine size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleViewProfile(submission.startupProfileId)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 transition-all active:scale-95"
                                                >
                                                    <RiEyeLine size={14} /> Profile
                                                </button>
                                                <button 
                                                    onClick={() => viewPitchDeck(submission.pitchDeckFile)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-50 text-[#ff7a21] rounded-xl text-[9px] font-black uppercase tracking-widest border border-orange-100 transition-all active:scale-95"
                                                >
                                                    <RiFilePdfLine size={14} /> Pitch
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDelete(submission._id)}
                                                    className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 transition-all active:scale-95"
                                                >
                                                    <RiDeleteBin6Line size={14} />
                                                </button>
                                            </>
                                        )}
                                        {(submission.status === 'rejected' && submission.rejectionFeedback) && (
                                            <button 
                                                onClick={() => handleOpenReasonModal("Mentor Feedback", submission.rejectionFeedback)}
                                                className="p-3 bg-red-50 text-red-500 rounded-xl border border-red-100 transition-all active:scale-95"
                                            >
                                                <RiFileTextLine size={14} />
                                            </button>
                                        )}
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
                        message={searchTerm ? "No submissions match your search." : "You haven't submitted any startup ideas yet."}
                        icon="🚀"
                    />
                )}
            </div>

            {/* Withdraw Confirmation Modal */}
            <Modal
                isOpen={showWithdrawModal}
                onClose={() => !withdrawLoading && setShowWithdrawModal(false)}
                title="Withdraw your idea?"
            >
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-800 font-bold">This action cannot be undone.</p>
                        <p className="text-xs text-gray-500 font-medium">Please tell us why you are withdrawing.</p>
                    </div>
                    
                    <div>
                        <textarea
                            value={withdrawReason}
                            onChange={(e) => {
                                setWithdrawReason(e.target.value);
                                if (e.target.value.trim().length >= 10) setWithdrawError('');
                            }}
                            placeholder="Write your reason for withdrawing this idea (required)..."
                            className={`w-full h-32 p-4 bg-slate-50 border ${withdrawError ? 'border-red-300' : 'border-slate-200'} rounded-2xl outline-none focus:border-red-500 transition-all text-sm font-medium resize-none`}
                        />
                        {withdrawError && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider">{withdrawError}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowWithdrawModal(false)}
                            disabled={withdrawLoading}
                            className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmWithdrawal}
                            disabled={withdrawLoading}
                            className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                        >
                            {withdrawLoading ? 'Withdrawing...' : 'Confirm Withdrawal'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* View Profile Modal */}
            <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Mentor Opportunity Details">
                {selectedProfile && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-5 bg-[#f7f9ff] rounded-2xl border border-gray-100 shadow-sm">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-50">
                                <RiRocket2Line className="text-2xl text-[#ff7a21]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#ff7a21] uppercase tracking-widest">Target Category</p>
                                <p className="text-xl font-black text-[#0e1d2a] uppercase italic tracking-tight">{selectedProfile.category}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Max Funding</p>
                                <p className="text-lg font-black text-[#0e1d2a]">₹{selectedProfile.fundingLimit?.toLocaleString()}</p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Equity Expectation</p>
                                <p className="text-lg font-black text-[#0e1d2a]">{selectedProfile.avgEquityExpectation}%</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-6">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</p>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">{selectedProfile.description}</p>
                        </div>
                    </div>
                )}
            </Modal>

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
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Justification</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
                        "{reasonModal.content}"
                    </p>
                    <button
                        onClick={() => setReasonModal({ ...reasonModal, show: false })}
                        className="w-full py-4 bg-[#0e1d2a] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#162a3f] transition-all shadow-xl"
                    >
                        Close Feedback
                    </button>
                </div>
            </Modal>

            {/* Delete Confirmation */}
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
