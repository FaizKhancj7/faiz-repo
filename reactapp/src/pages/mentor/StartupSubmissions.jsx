// StartupSubmissions — Kinetic Mentor Redesign
// Features: Review-station dashboard, high-fidelity status badges, and evaluation-themed illustrations.

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
    RiSearchLine,
    RiUser6Line,
    RiCalendarLine,
    RiFeedbackLine
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

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Kinetic Palette) ---

const MemphisReview = () => (
    <svg viewBox="0 0 400 200" className="w-full max-w-[280px] h-auto drop-shadow-xl animate-float">
        <circle cx="200" cy="100" r="80" fill="var(--theme-accent-light)" opacity="0.3" />
        {/* Document stack */}
        <rect x="140" y="60" width="100" height="80" rx="12" fill="var(--theme-bg-card)" stroke="var(--theme-border)" strokeWidth="2" transform="rotate(-5, 190, 100)" />
        <rect x="150" y="50" width="100" height="80" rx="12" fill="var(--theme-bg-card)" stroke="var(--theme-border)" strokeWidth="2" />
        {/* Checkmark and Cross icons floating around */}
        <circle cx="280" cy="60" r="15" fill="var(--theme-status-approved-bg)" stroke="var(--theme-status-approved-border)" strokeWidth="2" />
        <RiCheckLine className="absolute" style={{ color: 'var(--theme-status-approved-text)', left: '272px', top: '52px', fontSize: '16px' }} />
        
        <circle cx="100" cy="140" r="15" fill="var(--theme-status-rejected-bg)" stroke="var(--theme-status-rejected-border)" strokeWidth="2" />
        <RiCloseLine className="absolute" style={{ color: 'var(--theme-status-rejected-text)', left: '92px', top: '132px', fontSize: '16px' }} />

        {/* Person - Evaluating */}
        <path d="M300 160 Q280 100 240 120" fill="none" stroke="#ff8c00" strokeWidth="16" strokeLinecap="round" />
        <circle cx="230" cy="100" r="12" fill="#ad2c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
    </svg>
);

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
        { label: 'Pending Review', value: 'pending' },
        { label: 'Shortlisted', value: 'approved' },
        { label: 'Rejected', value: 'rejected' }
    ];

    const sortOptions = [
        { label: 'Newest First', value: 'desc' },
        { label: 'Oldest First', value: 'asc' }
    ];

    const [confirmAction, setConfirmAction] = useState({ show: false, type: '', id: null });
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
                    toast.success("Submission deleted");
                    loadSubmissions(pagination.currentPage);
                }
            } else if (type === 'shortlist') {
                const response = await startupSubmissionService.updateStatus(id, 'approved');
                if (response.success) {
                    toast.success("Shortlisted!");
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
            setFeedbackError("Feedback is required.");
            return;
        }
        if (feedbackText.trim().length < 10) {
            setFeedbackError("Feedback too short.");
            return;
        }

        setRejectLoading(true);
        try {
            const response = await startupSubmissionService.rejectSubmission(rejectId, feedbackText);
            if (response.success) {
                toast.success("Rejected with feedback.");
                setShowRejectModal(false);
                loadSubmissions(pagination.currentPage);
            }
        } catch (error) {
            setFeedbackError(error.message || "Failed to reject");
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
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border"
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
        const labels = { 'pending': "Pending", 'approved': "Shortlisted", 'rejected': "Rejected" };
        const s = styles[submission.status] || styles['pending'];

        return (
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all"
                style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                {labels[submission.status] || "Pending"}
            </span>
        );
    };

    return (
        <div className="min-h-full relative flex flex-col transition-all duration-300" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: 'var(--theme-bg-primary)',
                color: 'var(--theme-text-primary)'
            }}>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex-grow flex flex-col min-h-0">
                
                {/* HEADER — Context (Reduced Margins) */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-6 animate-lift flex-shrink-0">
                    <div className="text-center lg:text-left flex-1">
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 mb-2 rounded-full" 
                            style={{ background: 'var(--theme-accent-light)', border: '1px solid var(--theme-border)' }}>
                            <RiRocketLine style={{ color: 'var(--theme-accent)' }} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Review Station</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-2">
                            Pitch <span style={{ color: 'var(--theme-accent)' }}>Inbound.</span>
                        </h1>
                        <p className="text-xs font-medium max-w-lg" style={{ color: 'var(--theme-text-secondary)' }}>
                            Evaluate new startup ideas, review pitch decks, and provide constructive feedback to help entrepreneurs grow.
                        </p>
                    </div>

                    <div className="hidden md:block flex-shrink-0">
                        <MemphisReview />
                    </div>
                </div>

                {/* SEARCH & FILTER STRIP */}
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-[32px] border-2 mb-6 flex flex-col lg:flex-row items-center gap-4 animate-lift delay-100 relative z-[100]" style={{ borderColor: 'var(--theme-border)', backdropFilter: 'blur(10px)' }}>
                    <div className="relative w-full lg:w-96 flex-shrink-0">
                        <RiSearchLine className="absolute left-5 top-1/2 -translate-y-1/2 text-xl" style={{ color: 'var(--theme-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Smart search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl outline-none transition-all font-bold text-sm"
                            style={{
                                background: 'var(--theme-bg-input)',
                                border: '1px solid var(--theme-border)',
                                color: 'var(--theme-text-primary)'
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-bg-card)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.background = 'var(--theme-bg-input)'; }}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-grow justify-end">
                        <div className="w-full sm:w-48">
                            <Dropdown value={statusFilter} options={statusOptions} onChange={setStatusFilter} icon={RiFilter2Line} />
                        </div>
                    <div className="w-full sm:w-48">
                            <Dropdown value={sortOrder} options={sortOptions} onChange={setSortOrder} icon={RiSortAsc} />
                        </div>
                    </div>
                </div>

                {/* CONTENT — Table/Cards */}
                {loading ? (
                    <TableSkeleton columns={6} rows={5} />
                ) : submissions && submissions.length > 0 ? (
                    <div className="flex-grow flex flex-col min-h-0 animate-lift delay-200">
                        <div className="flex-grow overflow-auto custom-scrollbar border-2 rounded-[40px] shadow-2xl min-h-0"
                            style={{
                                background: 'var(--theme-bg-card)',
                                borderColor: 'var(--theme-border)',
                                backdropFilter: 'var(--theme-glass)'
                            }}
                        >
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-20" style={{ background: 'var(--theme-bg-secondary)' }}>
                                    <tr>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Entrepreneur</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Category</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Status / Date</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase text-right" style={{ color: 'var(--theme-text-muted)' }}>Evaluation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: 'var(--theme-border)' }}>
                                    {submissions.map((submission) => (
                                        <tr key={submission._id} className="group transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all group-hover:scale-110"
                                                        style={{ background: 'var(--theme-bg-secondary)', border: '1px solid var(--theme-border)', color: 'var(--theme-accent)' }}>
                                                        <RiUser6Line />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-black transition-all" style={{ color: 'var(--theme-text-primary)' }}>{submission.userName}</p>
                                                        <p className="text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>ID: {submission._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                                                    style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)', borderColor: 'var(--theme-border)' }}>
                                                    {submission.startupProfileId?.category || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-start gap-1.5">
                                                    {getStatusBadge(submission)}
                                                    <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>
                                                        <RiCalendarLine />
                                                        {new Date(submission.submissionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleViewDetails(submission)}
                                                        className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2"
                                                        style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)', color: 'var(--theme-accent)' }}
                                                        disabled={submission.isWithdrawn}
                                                        title="Review Details"
                                                    >
                                                        <RiEyeLine size={20} />
                                                    </button>
                                                    {!submission.isWithdrawn && (
                                                        <div className="flex gap-3">
                                                            {submission.status !== 'approved' && (
                                                                <button 
                                                                    onClick={() => openConfirm('shortlist', submission._id)}
                                                                    className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2"
                                                                    style={{ background: 'var(--theme-status-approved-bg)', borderColor: 'var(--theme-status-approved-border)', color: 'var(--theme-status-approved-text)' }}
                                                                    title="Shortlist Submission"
                                                                >
                                                                    <RiCheckLine size={20} />
                                                                </button>
                                                            )}
                                                            {submission.status !== 'rejected' && (
                                                                <button 
                                                                    onClick={() => handleRejectClick(submission._id)}
                                                                    className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2"
                                                                    style={{ background: 'var(--theme-status-rejected-bg)', borderColor: 'var(--theme-status-rejected-border)', color: 'var(--theme-status-rejected-text)' }}
                                                                    title="Reject Submission"
                                                                >
                                                                    <RiCloseLine size={20} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {submission.isWithdrawn && (
                                                        <button 
                                                            onClick={() => handleOpenReasonModal("Withdrawal Reason", submission.withdrawalReason)}
                                                            className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2"
                                                            style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-secondary)' }}
                                                            title="View Note"
                                                        >
                                                            <RiFileTextLine size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="mt-6 flex-shrink-0">
                            <Pagination 
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                ) : (
                    <EmptyState 
                        message={searchTerm ? "No submissions match your filters." : "Your review station is currently empty."} 
                        icon={<RiInboxArchiveLine className="text-6xl mb-6 opacity-20" />}
                    />
                )}
            </div>

            {/* View Details Modal */}
            <Modal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                title="Venture Evaluation"
            >
                {selectedSubmission && (
                    <div className="space-y-8 py-4 transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                        <div className="flex items-center gap-6 p-6 rounded-[32px] border-2" style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                                style={{ background: 'var(--theme-bg-card)', border: '2px solid var(--theme-accent)', color: 'var(--theme-accent)' }}>
                                <RiUser6Line />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black">{selectedSubmission.userName}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>Entrepreneur Portfolio</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-[32px] border-2 space-y-4" style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)' }}>
                                        <RiRocketLine size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>Market Context</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: 'var(--theme-text-secondary)' }}>Target Category</p>
                                    <p className="text-lg font-black" style={{ color: 'var(--theme-accent)' }}>{selectedSubmission.startupProfileId?.category || 'General'}</p>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>Market Potential</p>
                                        <p className="font-black text-xl">{selectedSubmission.marketPotential}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>Launch Year</p>
                                        <p className="font-black text-xl">{new Date(selectedSubmission.launchYear).getFullYear()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-[32px] border-2 space-y-4 shadow-xl" style={{ background: 'var(--theme-accent-gradient)', borderColor: 'transparent', color: 'var(--theme-text-on-accent)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/20">
                                        <RiFilePdfLine size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Pitch Documentation</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold opacity-80">Expected Funding</p>
                                    <p className="text-2xl font-black">₹{selectedSubmission.expectedFunding?.toLocaleString()}</p>
                                </div>
                                <a 
                                    href={`http://localhost:8080/${selectedSubmission.pitchDeckFile}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg"
                                >
                                    Open Pitch Deck
                                </a>
                            </div>
                        </div>

                        <div className="p-6 rounded-[32px] border-2 space-y-2" style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)' }}>
                            <div className="flex items-center gap-3 mb-2">
                                <RiFileTextLine className="text-xl" style={{ color: 'var(--theme-text-muted)' }} />
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>Submission Address</span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed italic" style={{ color: 'var(--theme-text-secondary)' }}>
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
                title="Review Feedback"
            >
                <div className="space-y-6 py-2">
                    <div className="flex items-center gap-4 p-4 rounded-2xl border-2 shadow-sm" style={{ background: 'var(--theme-status-rejected-bg)', borderColor: 'var(--theme-status-rejected-border)' }}>
                        <RiFeedbackLine className="text-3xl" style={{ color: 'var(--theme-status-rejected-text)' }} />
                        <p className="text-xs font-bold leading-tight" style={{ color: 'var(--theme-status-rejected-text)' }}>
                            Constructive feedback helps entrepreneurs improve. Please provide a clear reason for rejection.
                        </p>
                    </div>
                    
                    <textarea
                        value={feedbackText}
                        onChange={(e) => {
                            setFeedbackText(e.target.value);
                            if (e.target.value.trim().length >= 10) setFeedbackError('');
                        }}
                        placeholder="Detail your evaluation here..."
                        className="w-full h-40 p-6 border-2 rounded-[32px] outline-none transition-all text-sm font-bold resize-none"
                        style={{ 
                            background: 'var(--theme-bg-input)', 
                            borderColor: feedbackError ? 'var(--theme-status-rejected-text)' : 'var(--theme-border)',
                            color: 'var(--theme-text-primary)'
                        }}
                    />
                    {feedbackError && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: 'var(--theme-status-rejected-text)' }}>{feedbackError}</p>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            disabled={rejectLoading}
                            className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ color: 'var(--theme-text-muted)' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmRejection}
                            disabled={rejectLoading}
                            className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl disabled:opacity-50"
                            style={{ background: 'var(--theme-status-rejected-text)', boxShadow: '0 10px 20px -5px var(--theme-status-rejected-border)' }}
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
                title={confirmAction.type === 'delete' ? "Expunge Submission?" : "Shortlist Venture?"}
                message={`This action will ${confirmAction.type === 'delete' ? 'permanently remove' : 'move to shortlisted status'} this submission.`}
                confirmText={confirmAction.type === 'delete' ? "Yes, Delete" : "Yes, Shortlist"}
                danger={confirmAction.type === 'delete'}
            />

            {/* Justification Modal */}
            <Modal
                isOpen={reasonModal.show}
                onClose={() => setReasonModal({ ...reasonModal, show: false })}
                title="Evaluation Note"
            >
                <div className="space-y-6 py-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-xl border-2"
                        style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)', color: 'var(--theme-accent)' }}>
                        <RiFileTextLine />
                    </div>
                    <p className="text-lg font-black tracking-tight" style={{ color: 'var(--theme-text-primary)' }}>
                        {reasonModal.title}
                    </p>
                    <div className="p-8 rounded-[40px] border-2 shadow-inner italic font-bold text-sm leading-relaxed"
                        style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-secondary)' }}>
                        "{reasonModal.content}"
                    </div>
                    <button
                        onClick={() => setReasonModal({ ...reasonModal, show: false })}
                        className="w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95"
                        style={{ background: 'var(--theme-bg-secondary)', border: '2px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                    >
                        Back to Station
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default StartupSubmissions;
