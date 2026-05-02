/**
 * MySubmissions.jsx — Theme-Aware Implementation
 * This component allows Entrepreneurs to track their pitches.
 * Uses CSS custom properties for backgrounds, cards, text, tables, and modals.
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
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import TableSkeleton from '../../components/ui/TableSkeleton';

import startupSubmissionService from '../../services/startupSubmissionService';

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

    const loadSubmissions = useCallback(async (page = 1, keyword = '') => {
        setLoading(true);
        try {
            const response = await startupSubmissionService.getMySubmissions({ 
                page, 
                keyword 
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
                <span className="px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all"
                    style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}>
                    Withdrawn
                </span>
            );
        }

        const styles = {
            'pending': { bg: 'var(--theme-status-pending-bg)', text: 'var(--theme-status-pending-text)', border: 'var(--theme-status-pending-border)' },
            'approved': { bg: 'var(--theme-status-approved-bg)', text: 'var(--theme-status-approved-text)', border: 'var(--theme-status-approved-border)' },
            'rejected': { bg: 'var(--theme-status-rejected-bg)', text: 'var(--theme-status-rejected-text)', border: 'var(--theme-status-rejected-border)' }
        };
        const labels = { 'pending': "Pending", 'approved': "Approved", 'rejected': "Rejected" };
        const s = styles[submission.status] || styles['pending'];

        return (
            <span className="px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all"
                style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                {labels[submission.status] || "Pending"}
            </span>
        );
    };

    return (
        <div className="h-full relative flex flex-col transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Background handled by global AnimatedBackground in MainLayout */}

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col h-full overflow-hidden">
                
                {/* Header Section (Static) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-lift flex-shrink-0">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 transition-all duration-300"
                            style={{ background: 'var(--theme-accent-light)', borderRadius: 'var(--theme-radius)', border: '1px solid var(--theme-border)' }}>
                            <RiFileTextLine style={{ color: 'var(--theme-accent)' }} className="text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>My Portfolio</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '36px', fontWeight: 800, color: 'var(--theme-text-on-dark)', letterSpacing: '-0.04em', lineHeight: 1 }} className="transition-all duration-300">
                            My Submissions
                        </h1>
                        <p className="text-sm mt-2 font-medium transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Track the journey of your startup ideas and pitches.</p>
                    </div>

                    {/* Premium Search Bar */}
                    <div className="relative w-full md:w-80">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Filter by category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all font-bold text-sm"
                            style={{ background: 'var(--theme-bg-input)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <TableSkeleton columns={5} rows={5} />
                ) : submissions && submissions.length > 0 ? (
                    <div className="flex flex-col h-full overflow-hidden animate-lift delay-100">
                        
                        {/* DESKTOP TABLE VIEW (Visible on LG screens and up) */}
                        <div className="hidden lg:flex flex-col flex-grow overflow-hidden border shadow-2xl transition-all duration-300"
                            style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius-xl)', backdropFilter: 'var(--theme-glass)' }}>
                            <div className="flex-grow overflow-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead className="sticky top-0 z-20 transition-all duration-300" style={{ background: 'var(--theme-bg-secondary)' }}>
                                        <tr style={{ borderBottom: '1px solid var(--theme-border)' }}>
                                            <th className="w-1/4 px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-accent)' }}>Mentor</th>
                                            <th className="w-1/5 px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-accent)' }}>Category</th>
                                            <th className="w-1/6 px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-accent)' }}>Date</th>
                                            <th className="w-1/6 px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-accent)' }}>Status</th>
                                            <th className="w-1/4 px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-right" style={{ color: 'var(--theme-accent)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderTop: '1px solid transparent', borderColor: 'var(--theme-border)' }}>
                                        {submissions.map((submission) => (
                                            <React.Fragment key={submission._id}>
                                                <tr className="transition-all duration-200" onMouseEnter={(e) => e.currentTarget.style.background = 'var(--theme-bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                    <td className="px-6 py-5 overflow-hidden">
                                                        <div className="flex flex-col truncate">
                                                            <span className="text-sm font-bold leading-tight truncate transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{submission.startupProfileId?.mentorId?.userName || 'N/A'}</span>
                                                            <span className="text-[10px] font-medium italic mt-0.5 truncate transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>{submission.startupProfileId?.mentorId?.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-sm font-bold uppercase tracking-tight truncate block transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                                                            {submission.startupProfileId?.category || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-medium text-center transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
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
                                                                    className="p-2 rounded-lg transition-all border border-transparent"
                                                                    style={{ color: 'var(--theme-status-rejected-text)' }}
                                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-rejected-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-rejected-border)'; }}
                                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                                    title="View Rejection Feedback"
                                                                >
                                                                    <RiFileTextLine size={16} />
                                                                </button>
                                                            )}
                                                            {(submission.isWithdrawn && submission.withdrawalReason) && (
                                                                <button 
                                                                    onClick={() => handleOpenReasonModal("Withdrawal Reason", submission.withdrawalReason)}
                                                                    className="p-2 rounded-lg transition-all border border-transparent"
                                                                    style={{ color: 'var(--theme-text-muted)' }}
                                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-bg-secondary)'; e.currentTarget.style.borderColor = 'var(--theme-border)'; }}
                                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                                    title="View Withdrawal Reason"
                                                                >
                                                                    <RiFileTextLine size={16} />
                                                                </button>
                                                            )}
                                                            {submission.status === 'approved' && !submission.isWithdrawn ? (
                                                                <button 
                                                                    onClick={() => handleOpenWithdraw(submission._id)}
                                                                    className="px-3 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider border"
                                                                    style={{ color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--theme-status-rejected-bg)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                                >
                                                                    Withdraw
                                                                </button>
                                                            ) : submission.isWithdrawn ? (
                                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Withdrawn</span>
                                                            ) : (
                                                                <>
                                                                    <button 
                                                                        onClick={() => handleViewProfile(submission.startupProfileId)}
                                                                        className="px-2 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider border border-transparent"
                                                                        style={{ color: 'var(--theme-accent)' }}
                                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-accent-light)'; e.currentTarget.style.borderColor = 'var(--theme-border)'; }}
                                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                                        title="View Profile"
                                                                    >
                                                                        <RiEyeLine size={14} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => viewPitchDeck(submission.pitchDeckFile)}
                                                                        className="px-2 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider border border-transparent"
                                                                        style={{ color: 'var(--theme-status-pending-text)' }}
                                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-pending-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-pending-border)'; }}
                                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                                        title="View Pitch"
                                                                    >
                                                                        <RiFilePdfLine size={14} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleOpenDelete(submission._id)}
                                                                        className="px-2 py-1.5 rounded-lg transition-all text-[9px] font-black uppercase tracking-wider border border-transparent"
                                                                        style={{ color: 'var(--theme-status-rejected-text)' }}
                                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-rejected-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-rejected-border)'; }}
                                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
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
                            {/* Desktop Pagination */}
                            <Pagination 
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>

                        {/* TABLET & MOBILE CARD VIEW (Visible below LG breakpoint) */}
                        <div className="lg:hidden flex-grow overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                            {submissions.map((submission) => (
                                <div key={submission._id} className="p-5 shadow-xl transition-all duration-300 space-y-4"
                                    style={{ background: 'var(--theme-bg-card)', borderRadius: 'var(--theme-radius-xl)', border: '1px solid var(--theme-border)', borderLeft: '4px solid var(--theme-accent)', backdropFilter: 'var(--theme-glass)' }}>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 overflow-hidden">
                                            <div className="flex flex-col mb-1 truncate">
                                                <span className="text-xs font-black leading-tight truncate transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{submission.startupProfileId?.mentorId?.userName || 'N/A'}</span>
                                                <span className="text-[9px] font-medium italic truncate transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>{submission.startupProfileId?.mentorId?.email}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tight transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>{submission.startupProfileId?.category || 'N/A'}</span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {getStatusBadge(submission)}
                                            <p className="text-[8px] font-black uppercase tracking-widest mt-2 transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>
                                                {new Date(submission.submissionDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 pt-1">
                                        {submission.status === 'approved' && !submission.isWithdrawn ? (
                                            <button 
                                                onClick={() => handleOpenWithdraw(submission._id)}
                                                className="flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95"
                                                style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}
                                            >
                                                Withdraw Idea
                                            </button>
                                        ) : submission.isWithdrawn ? (
                                            <div className="flex flex-1 items-center gap-2">
                                                <div className="flex-grow py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border text-center transition-all"
                                                    style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}>
                                                    Withdrawn
                                                </div>
                                                {submission.withdrawalReason && (
                                                    <button 
                                                        onClick={() => handleOpenReasonModal("Withdrawal Reason", submission.withdrawalReason)}
                                                        className="p-3 rounded-xl border transition-all active:scale-95"
                                                        style={{ background: 'var(--theme-bg-secondary)', color: 'var(--theme-text-muted)', borderColor: 'var(--theme-border)' }}
                                                    >
                                                        <RiFileTextLine size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleViewProfile(submission.startupProfileId)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95"
                                                    style={{ background: 'var(--theme-bg-secondary)', color: 'var(--theme-accent)', borderColor: 'var(--theme-border)' }}
                                                >
                                                    <RiEyeLine size={14} /> Profile
                                                </button>
                                                <button 
                                                    onClick={() => viewPitchDeck(submission.pitchDeckFile)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95"
                                                    style={{ background: 'var(--theme-status-pending-bg)', color: 'var(--theme-status-pending-text)', borderColor: 'var(--theme-status-pending-border)' }}
                                                >
                                                    <RiFilePdfLine size={14} /> Pitch
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDelete(submission._id)}
                                                    className="p-3 rounded-xl border transition-all active:scale-95"
                                                    style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}
                                                >
                                                    <RiDeleteBin6Line size={14} />
                                                </button>
                                            </>
                                        )}
                                        {(submission.status === 'rejected' && submission.rejectionFeedback) && (
                                            <button 
                                                onClick={() => handleOpenReasonModal("Mentor Feedback", submission.rejectionFeedback)}
                                                className="p-3 rounded-xl border transition-all active:scale-95"
                                                style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}
                                            >
                                                <RiFileTextLine size={14} />
                                            </button>
                                        )}
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
                        <p className="text-sm font-bold transition-all" style={{ color: 'var(--theme-text-primary)' }}>This action cannot be undone.</p>
                        <p className="text-xs font-medium transition-all" style={{ color: 'var(--theme-text-secondary)' }}>Please tell us why you are withdrawing.</p>
                    </div>
                    
                    <div>
                        <textarea
                            value={withdrawReason}
                            onChange={(e) => {
                                setWithdrawReason(e.target.value);
                                if (e.target.value.trim().length >= 10) setWithdrawError('');
                            }}
                            placeholder="Write your reason for withdrawing this idea (required)..."
                            className="w-full h-32 p-4 border rounded-2xl outline-none transition-all text-sm font-medium resize-none"
                            style={{ 
                                background: 'var(--theme-bg-input)', 
                                borderColor: withdrawError ? 'var(--theme-status-rejected-border)' : 'var(--theme-border)',
                                color: 'var(--theme-text-primary)'
                            }}
                            onFocus={(e) => { if(!withdrawError) { e.currentTarget.style.borderColor = 'var(--theme-status-rejected-border)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; } }}
                            onBlur={(e) => { if(!withdrawError) { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; } }}
                        />
                        {withdrawError && (
                            <p className="text-[10px] font-bold mt-1 uppercase tracking-wider transition-all" style={{ color: 'var(--theme-status-rejected-text)' }}>{withdrawError}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowWithdrawModal(false)}
                            disabled={withdrawLoading}
                            className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            style={{ background: 'var(--theme-bg-secondary)', color: 'var(--theme-text-secondary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-text-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-text-secondary)'; }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmWithdrawal}
                            disabled={withdrawLoading}
                            className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-50"
                            style={{ background: 'var(--theme-status-rejected-text)', boxShadow: '0 4px 12px var(--theme-status-rejected-border)' }}
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
                        <div className="flex items-center gap-4 p-5 rounded-2xl border shadow-sm transition-all"
                            style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>
                            <div className="p-3 rounded-xl shadow-sm border transition-all" style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)' }}>
                                <RiRocket2Line className="text-2xl transition-all" style={{ color: 'var(--theme-accent)' }} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest transition-all" style={{ color: 'var(--theme-accent)' }}>Target Category</p>
                                <p className="text-xl font-black uppercase italic tracking-tight transition-all" style={{ color: 'var(--theme-text-primary)' }}>{selectedProfile.category}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-5 rounded-2xl border transition-all" style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)' }}>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Max Funding</p>
                                <p className="text-lg font-black transition-all" style={{ color: 'var(--theme-text-primary)' }}>₹{selectedProfile.fundingLimit?.toLocaleString()}</p>
                            </div>
                            <div className="p-5 rounded-2xl border transition-all" style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)' }}>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Equity Expectation</p>
                                <p className="text-lg font-black transition-all" style={{ color: 'var(--theme-text-primary)' }}>{selectedProfile.avgEquityExpectation}%</p>
                            </div>
                        </div>
                        <div className="border-t pt-6 transition-all" style={{ borderColor: 'var(--theme-border)' }}>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-2 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Description</p>
                            <p className="text-sm leading-relaxed font-medium transition-all" style={{ color: 'var(--theme-text-secondary)' }}>{selectedProfile.description}</p>
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
                    <div className="flex items-center gap-3 p-4 rounded-2xl border shadow-sm transition-all"
                        style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>
                        <div className="p-2 rounded-lg shadow-sm border transition-all" style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)' }}>
                            <RiFileTextLine className="text-xl transition-all" style={{ color: 'var(--theme-accent)' }} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest transition-all" style={{ color: 'var(--theme-text-muted)' }}>Justification</span>
                    </div>
                    <p className="text-sm leading-relaxed font-medium p-6 rounded-3xl border italic transition-all"
                        style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-secondary)' }}>
                        "{reasonModal.content}"
                    </p>
                    <button
                        onClick={() => setReasonModal({ ...reasonModal, show: false })}
                        className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                        style={{ background: 'var(--theme-text-primary)', color: 'var(--theme-bg-primary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
