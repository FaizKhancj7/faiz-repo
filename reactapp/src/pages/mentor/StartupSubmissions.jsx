/**
 * StartupSubmissions Component — Theme-Aware Implementation
 * This component provides a dashboard for Mentors to review startup ideas.
 * Uses CSS custom properties for layouts, cards, and accent colors.
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
    RiFileTextLine,
    RiSearchLine
} from 'react-icons/ri';

// Import our reusable components
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import Dropdown from '../../components/ui/Dropdown';
import TableSkeleton from '../../components/ui/TableSkeleton';

import startupSubmissionService from '../../services/startupSubmissionService';

const StartupSubmissions = () => {
    // --- 1. STATE MANAGEMENT ---
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    
    // REJECTION FEEDBACK STATES
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackError, setFeedbackError] = useState('');
    const [rejectLoading, setRejectLoading] = useState(false);

    const statusOptions = [
        { label: 'All Statuses', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'Shortlisted', value: 'approved' },
        { label: 'Rejected', value: 'rejected' }
    ];

    const sortOptions = [
        { label: 'Newest First', value: 'desc' },
        { label: 'Oldest First', value: 'asc' }
    ];

    const [confirmAction, setConfirmAction] = useState({ show: false, type: '', id: null });

    // REASON MODAL STATES
    const [reasonModal, setReasonModal] = useState({ show: false, title: '', content: '' });

    // DEBOUNCE SEARCH
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // --- 2. DATA FETCHING ---
    const loadSubmissions = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                status: statusFilter,
                order: sortOrder,
                keyword: debouncedSearch
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
    }, [statusFilter, sortOrder, debouncedSearch]);

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
                <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border"
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
            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all"
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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-lift flex-shrink-0 relative z-40">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 transition-all duration-300"
                            style={{
                                background: 'var(--theme-accent-light)',
                                borderRadius: 'var(--theme-radius)',
                                border: '1px solid var(--theme-border)'
                            }}
                        >
                            <RiInboxArchiveLine style={{ color: 'var(--theme-accent)' }} className="text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Review Center</span>
                        </div>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '36px', fontWeight: 800, color: 'var(--theme-text-on-dark)', letterSpacing: '-0.04em', lineHeight: 1 }} className="transition-all duration-300">
                            Startup Submissions
                        </h1>
                        <p className="text-sm mt-2 font-medium transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Review and manage ideas sent to your startup opportunities.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto z-30">
                        {/* Smart Search Bar */}
                        <div className="w-full md:w-64 relative">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--theme-text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search submissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm font-medium outline-none transition-all duration-300"
                                style={{
                                    background: 'var(--theme-bg-input)',
                                    border: '2px solid var(--theme-border)',
                                    borderRadius: 'var(--theme-radius)',
                                    color: 'var(--theme-text-primary)'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--theme-accent)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--theme-border)'}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="w-full md:w-48 relative">
                            <Dropdown
                                value={statusFilter}
                                options={statusOptions}
                                onChange={setStatusFilter}
                                icon={RiFilter2Line}
                            />
                        </div>

                        {/* Sort Order */}
                        <div className="w-full md:w-48 relative">
                            <Dropdown
                                value={sortOrder}
                                options={sortOptions}
                                onChange={setSortOrder}
                                icon={RiSortAsc}
                            />
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <TableSkeleton columns={6} rows={5} />
                ) : submissions && submissions.length > 0 ? (
                    <div className="flex-grow flex flex-col overflow-hidden animate-lift delay-100">
                        
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
                                            <th className="w-[25%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-accent)' }}>Entrepreneur</th>
                                            <th className="w-[25%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-accent)' }}>Category</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-accent)' }}>Submitted</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-center" style={{ color: 'var(--theme-accent)' }}>Status</th>
                                            <th className="w-[20%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-accent)' }}>Withdrawal</th>
                                            <th className="w-[15%] px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase text-right" style={{ color: 'var(--theme-accent)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderTop: '1px solid transparent', borderColor: 'var(--theme-border)' }}>
                                        {submissions.map((submission) => (
                                            <tr key={submission._id} className="transition-all duration-200" onMouseEnter={(e) => e.currentTarget.style.background = 'var(--theme-bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                <td className="px-6 py-5 overflow-hidden">
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-sm font-black truncate transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{submission.userName}</span>
                                                        <span className="text-[9px] font-medium uppercase tracking-tight italic truncate transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>ID: {submission._id.slice(-6)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-bold uppercase tracking-tighter truncate block transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                                                        {submission.startupProfileId?.category || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-center transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
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
                                                                className="p-2 rounded-lg transition-all border border-transparent"
                                                                style={{ color: 'var(--theme-status-rejected-text)' }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-rejected-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-rejected-border)'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                                title="View Withdrawal Reason"
                                                            >
                                                                <RiFileTextLine size={16} />
                                                            </button>
                                                        ) : (
                                                            <span className="font-bold transition-all" style={{ color: 'var(--theme-border)' }}>—</span>
                                                        )}
                                                        {submission.status === 'rejected' && submission.rejectionFeedback && (
                                                            <button 
                                                                onClick={() => handleOpenReasonModal("Rejection Feedback", submission.rejectionFeedback)}
                                                                className="p-2 rounded-lg transition-all border border-transparent"
                                                                style={{ color: 'var(--theme-status-rejected-text)' }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-rejected-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-rejected-border)'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
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
                                                            className="p-2 rounded-lg transition-all border border-transparent"
                                                            style={{ color: 'var(--theme-accent)' }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-accent-light)'; e.currentTarget.style.borderColor = 'var(--theme-border)'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                            title="View Details"
                                                            disabled={submission.isWithdrawn}
                                                        >
                                                            <RiEyeLine size={16} />
                                                        </button>
                                                        {submission.status !== 'approved' && !submission.isWithdrawn && (
                                                            <button 
                                                                onClick={() => openConfirm('shortlist', submission._id)}
                                                                className="p-2 rounded-lg transition-all border border-transparent"
                                                                style={{ color: 'var(--theme-status-approved-text)' }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-approved-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-approved-border)'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                                                                title="Shortlist"
                                                            >
                                                                <RiCheckLine size={16} />
                                                            </button>
                                                        )}
                                                        {submission.status !== 'rejected' && !submission.isWithdrawn && (
                                                            <button 
                                                                onClick={() => handleRejectClick(submission._id)}
                                                                className="p-2 rounded-lg transition-all border border-transparent"
                                                                style={{ color: 'var(--theme-status-rejected-text)' }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-status-rejected-bg)'; e.currentTarget.style.borderColor = 'var(--theme-status-rejected-border)'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
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
                                            <div className="flex flex-col mb-1 truncate">
                                                <span className="text-xs font-black leading-tight truncate transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{submission.userName}</span>
                                                <span className="text-[9px] font-medium italic truncate transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>ID: {submission._id.slice(-6)}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tight truncate block transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                                                {submission.startupProfileId?.category || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {getStatusBadge(submission)}
                                            <p className="text-[8px] font-black uppercase tracking-widest mt-2 transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>
                                                {new Date(submission.submissionDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {submission.isWithdrawn && (
                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="flex-grow py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border text-center transition-all"
                                                style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}>
                                                Withdrawn
                                            </div>
                                            <button 
                                                onClick={() => handleOpenReasonModal("Withdrawal Reason", submission.withdrawalReason)}
                                                className="p-3 rounded-xl border transition-all active:scale-95"
                                                style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}
                                            >
                                                <RiFileTextLine size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {submission.status === 'rejected' && submission.rejectionFeedback && !submission.isWithdrawn && (
                                        <div className="pt-2">
                                            <button 
                                                onClick={() => handleOpenReasonModal("Your Rejection Feedback", submission.rejectionFeedback)}
                                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95"
                                                style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}
                                            >
                                                <RiFileTextLine size={14} /> View Feedback
                                            </button>
                                        </div>
                                    )}

                                    {!submission.isWithdrawn && (
                                        <div className="flex items-center gap-2 pt-1">
                                            <button 
                                                onClick={() => handleViewDetails(submission)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95"
                                                style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)', borderColor: 'var(--theme-border)' }}
                                            >
                                                <RiEyeLine size={14} /> Review
                                            </button>
                                            <div className="flex gap-2">
                                                {submission.status !== 'approved' && (
                                                    <button 
                                                        onClick={() => openConfirm('shortlist', submission._id)}
                                                        className="p-3 rounded-xl border transition-all active:scale-95"
                                                        style={{ background: 'var(--theme-status-approved-bg)', color: 'var(--theme-status-approved-text)', borderColor: 'var(--theme-status-approved-border)' }}
                                                    >
                                                        <RiCheckLine size={14} />
                                                    </button>
                                                )}
                                                {submission.status !== 'rejected' && (
                                                    <button 
                                                        onClick={() => handleRejectClick(submission._id)}
                                                        className="p-3 rounded-xl border transition-all active:scale-95"
                                                        style={{ background: 'var(--theme-status-rejected-bg)', color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)' }}
                                                    >
                                                        <RiCloseLine size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
                    <div className="space-y-6 transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--theme-text-primary)' }}>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Entrepreneur</p>
                                <p className="font-bold text-lg">{selectedSubmission.userName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Target Category</p>
                                <p className="font-bold text-lg transition-all" style={{ color: 'var(--theme-accent)' }}>{selectedSubmission.startupProfileId?.category}</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl grid grid-cols-3 gap-4 border transition-all"
                            style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Potential</p>
                                <p className="font-black" style={{ color: 'var(--theme-accent)' }}>{selectedSubmission.marketPotential}%</p>
                            </div>
                            <div className="text-center border-x transition-all" style={{ borderColor: 'var(--theme-border)' }}>
                                <p className="text-[10px] font-black uppercase mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Launch</p>
                                <p className="font-black">{new Date(selectedSubmission.launchYear).getFullYear()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Funding</p>
                                <p className="font-black" style={{ color: 'var(--theme-status-approved-text)' }}>₹{selectedSubmission.expectedFunding?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Pitch Deck (PDF)</p>
                            <a 
                                href={`http://localhost:8080/${selectedSubmission.pitchDeckFile}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-4 border rounded-2xl font-black text-xs uppercase tracking-wider transition-all group"
                                style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)', borderColor: 'var(--theme-border)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--theme-shadow-sm)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <RiFilePdfLine className="text-2xl" />
                                <span>View Full Pitch Deck</span>
                                <RiRocketLine className="ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                            </a>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 transition-all" style={{ color: 'var(--theme-text-muted)' }}>Entrepreneur Address</p>
                            <p className="text-sm font-medium border p-4 rounded-2xl leading-relaxed transition-all"
                                style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)' }}>
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
                    <p className="text-sm font-medium transition-all" style={{ color: 'var(--theme-text-secondary)' }}>
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
                            className="w-full h-32 p-4 border rounded-2xl outline-none transition-all text-sm font-medium resize-none"
                            style={{ 
                                background: 'var(--theme-bg-input)', 
                                borderColor: feedbackError ? 'var(--theme-status-rejected-border)' : 'var(--theme-border)',
                                color: 'var(--theme-text-primary)'
                            }}
                            onFocus={(e) => { if(!feedbackError) { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; } }}
                            onBlur={(e) => { if(!feedbackError) { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; } }}
                        />
                        {feedbackError && (
                            <p className="text-[10px] font-bold mt-1 uppercase tracking-wider transition-all" style={{ color: 'var(--theme-status-rejected-text)' }}>{feedbackError}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            disabled={rejectLoading}
                            className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            style={{ background: 'var(--theme-bg-secondary)', color: 'var(--theme-text-secondary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-text-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-text-secondary)'; }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmRejection}
                            disabled={rejectLoading}
                            className="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-50"
                            style={{ background: 'var(--theme-status-rejected-text)', boxShadow: '0 4px 12px var(--theme-status-rejected-border)' }}
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
                    <div className="flex items-center gap-3 p-4 rounded-2xl border shadow-sm transition-all"
                        style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>
                        <div className="p-2 rounded-lg shadow-sm border" style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)' }}>
                            <RiFileTextLine className="text-xl" style={{ color: 'var(--theme-accent)' }} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>Justification Details</span>
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
                        Close Details
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default StartupSubmissions;
