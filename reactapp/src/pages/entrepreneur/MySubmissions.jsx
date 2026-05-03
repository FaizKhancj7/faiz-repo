// MySubmissions — Kinetic Mentor Redesign
// Features: Pitch Tracker dashboard, high-fidelity status badges, and portfolio-themed illustrations.

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { 
    RiSearchLine, 
    RiEyeLine, 
    RiFilePdfLine, 
    RiDeleteBin6Line,
    RiRocket2Line,
    RiFileTextLine,
    RiNavigationLine,
    RiInboxArchiveLine,
    RiArrowRightUpLine,
    RiHistoryLine
} from 'react-icons/ri';

// Import our reusable components
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import TableSkeleton from '../../components/ui/TableSkeleton';
import Dropdown from '../../components/ui/Dropdown';

import startupSubmissionService from '../../services/startupSubmissionService';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Kinetic Palette) ---

const MemphisHistory = () => (
    <svg viewBox="0 0 400 200" className="w-full max-w-[280px] h-auto drop-shadow-xl animate-float">
        <circle cx="200" cy="100" r="80" fill="var(--theme-accent-light)" opacity="0.3" />
        {/* Progress Line */}
        <path d="M100 140 L150 100 L200 120 L250 60 L300 80" fill="none" stroke="var(--theme-accent)" strokeWidth="6" strokeLinecap="round" />
        <circle cx="300" cy="80" r="8" fill="var(--theme-accent)" />
        {/* Decorative elements */}
        <rect x="140" y="50" width="30" height="30" rx="8" fill="#ad2c00" opacity="0.2" transform="rotate(-15, 155, 65)" />
        <circle cx="120" cy="70" r="15" fill="#ff8c00" opacity="0.2" />
    </svg>
);

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
    const [statusFilter, setStatusFilter] = useState('');

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

    const loadSubmissions = useCallback(async (page = 1, keyword = '', status = '') => {
        setLoading(true);
        try {
            const response = await startupSubmissionService.getMySubmissions({ 
                page, 
                keyword,
                status
            });
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
    }, []);

    useEffect(() => {
        loadSubmissions(1, debouncedSearch, statusFilter);
    }, [debouncedSearch, statusFilter, loadSubmissions]);

    const handlePageChange = (newPage) => {
        loadSubmissions(newPage, debouncedSearch, statusFilter);
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
                toast.success("Submission removed");
                loadSubmissions(pagination.currentPage, debouncedSearch);
            }
        } catch (error) {
            toast.error(error.message || "Failed to delete");
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
            setWithdrawError("Please provide a valid reason.");
            return;
        }

        setWithdrawLoading(true);
        try {
            const response = await startupSubmissionService.withdrawSubmission(selectedWithdrawId, withdrawReason);
            if (response.success) {
                toast.success("Idea withdrawn.");
                setShowWithdrawModal(false);
                loadSubmissions(pagination.currentPage, debouncedSearch);
            }
        } catch (error) {
            setWithdrawError(error.message || "Failed to withdraw");
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
        const labels = { 'pending': "In Review", 'approved': "Shortlisted", 'rejected': "Rejected" };
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
                
                {/* HEADER — Portfolio Context (Reduced Margins) */}
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-6 animate-lift flex-shrink-0">
                    <div className="text-center lg:text-left flex-1">
                        <div className="inline-flex items-center gap-3 px-3 py-1.5 mb-2 rounded-full" 
                            style={{ background: 'var(--theme-accent-light)', border: '1px solid var(--theme-border)' }}>
                            <RiHistoryLine style={{ color: 'var(--theme-accent)' }} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Venture Tracker</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-2">
                            My <span style={{ color: 'var(--theme-accent)' }}>Pitches.</span>
                        </h1>
                        <p className="text-xs font-medium max-w-lg" style={{ color: 'var(--theme-text-secondary)' }}>
                            Track the status of your submitted ideas. Review mentor feedback and manage your venture portfolio.
                        </p>
                    </div>

                    <div className="hidden md:block flex-shrink-0">
                        <MemphisHistory />
                    </div>
                </div>

                {/* SEARCH & FILTER STRIP */}
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-[32px] border-2 mb-6 flex flex-col lg:flex-row items-center gap-4 animate-lift delay-100 relative z-[100]" style={{ borderColor: 'var(--theme-border)', backdropFilter: 'blur(10px)' }}>
                    <div className="relative w-full lg:w-96 flex-shrink-0">
                        <RiSearchLine className="absolute left-6 top-1/2 -translate-y-1/2 text-xl" style={{ color: 'var(--theme-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Smart search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl outline-none transition-all font-bold text-sm"
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
                        <div className="w-full sm:w-64">
                            <Dropdown 
                                value={statusFilter}
                                options={[
                                    { label: 'All States', value: '' },
                                    { label: 'In Review', value: 'pending' },
                                    { label: 'Shortlisted', value: 'approved' },
                                    { label: 'Rejected', value: 'rejected' },
                                    { label: 'Withdrawn', value: 'withdrawn' }
                                ]}
                                onChange={setStatusFilter}
                                icon={RiHistoryLine}
                            />
                        </div>
                    </div>
                </div>

                {/* CONTENT — Table/Cards */}
                {loading ? (
                    <TableSkeleton columns={5} rows={5} />
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
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Lead Mentor</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Venture Ecosystem</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--theme-text-muted)' }}>Submission State</th>
                                        <th className="px-8 py-5 text-[11px] font-black tracking-[0.2em] uppercase text-right" style={{ color: 'var(--theme-text-muted)' }}>Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ borderColor: 'var(--theme-border)' }}>
                                    {submissions.map((submission) => (
                                        <tr key={submission._id} className="group transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all group-hover:scale-110"
                                                        style={{ background: 'var(--theme-bg-secondary)', border: '1px solid var(--theme-border)', color: 'var(--theme-accent)' }}>
                                                        <RiInboxArchiveLine />
                                                    </div>
                                                    <div className="flex flex-col truncate">
                                                        <p className="text-sm font-black transition-all" style={{ color: 'var(--theme-text-primary)' }}>{submission.startupProfileId?.mentorId?.userName || 'Mentor N/A'}</p>
                                                        <p className="text-[10px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>{submission.startupProfileId?.mentorId?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                                                        style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-accent)', borderColor: 'var(--theme-border)' }}>
                                                        {submission.startupProfileId?.category || 'General'}
                                                    </span>
                                                    <p className="text-[9px] font-bold" style={{ color: 'var(--theme-text-muted)' }}>
                                                        {new Date(submission.submissionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col items-start gap-2">
                                                    {getStatusBadge(submission)}
                                                    
                                                    {/* Prominent Feedback Button for Rejected Ideas */}
                                                    {submission.status === 'rejected' && submission.rejectionFeedback && (
                                                        <button 
                                                            onClick={() => handleOpenReasonModal("Mentor Feedback", submission.rejectionFeedback)}
                                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm mt-1"
                                                            style={{ 
                                                                background: 'var(--theme-status-rejected-bg)', 
                                                                color: 'var(--theme-status-rejected-text)',
                                                                border: '1px solid var(--theme-status-rejected-border)'
                                                            }}
                                                        >
                                                            <RiFileTextLine className="text-sm" /> 
                                                            Why was I rejected?
                                                        </button>
                                                    )}
 
                                                    {/* Withdrawal Log for Withdrawn Ideas */}
                                                    {submission.isWithdrawn && (
                                                        <button 
                                                            onClick={() => handleOpenReasonModal("Withdrawal Log", submission.withdrawalReason)}
                                                            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest transition-all hover:text-[var(--theme-accent)] mt-1"
                                                            style={{ color: 'var(--theme-text-muted)' }}
                                                        >
                                                            <RiFileTextLine /> View Withdrawal Reason
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {!submission.isWithdrawn && submission.status === 'approved' && (
                                                        <button 
                                                            onClick={() => handleOpenWithdraw(submission._id)}
                                                            className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95"
                                                            style={{ color: 'var(--theme-status-rejected-text)', borderColor: 'var(--theme-status-rejected-border)', background: 'var(--theme-status-rejected-bg)' }}
                                                        >
                                                            Withdraw
                                                        </button>
                                                    )}
                                                    {!submission.isWithdrawn && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleViewProfile(submission.startupProfileId)}
                                                                className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2"
                                                                style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)', color: 'var(--theme-accent)' }}
                                                                title="Opportunity Details"
                                                            >
                                                                <RiEyeLine size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => viewPitchDeck(submission.pitchDeckFile)}
                                                                className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2 shadow-xl"
                                                                style={{ background: 'var(--theme-accent-gradient)', borderColor: 'transparent', color: 'var(--theme-text-on-accent)' }}
                                                                title="View My Pitch"
                                                            >
                                                                <RiFilePdfLine size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleOpenDelete(submission._id)}
                                                                className="p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2"
                                                                style={{ background: 'var(--theme-status-rejected-bg)', borderColor: 'var(--theme-status-rejected-border)', color: 'var(--theme-status-rejected-text)' }}
                                                                title="Remove Submission"
                                                            >
                                                                <RiDeleteBin6Line size={18} />
                                                            </button>
                                                        </>
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
                        message={searchTerm ? "No results found for your search." : "You haven't launched any pitches yet. Start your journey today!"} 
                        icon={<RiRocket2Line className="text-6xl mb-6 opacity-20" />}
                    />
                )}
            </div>

            {/* Opportunity Details Modal */}
            <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Lead Venture Profile">
                {selectedProfile && (
                    <div className="space-y-8 py-4 text-center lg:text-left" style={{ color: 'var(--theme-text-primary)' }}>
                        <div className="p-8 rounded-[40px] border-2 shadow-inner" style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>
                            <div className="w-20 h-20 mx-auto lg:mx-0 rounded-full flex items-center justify-center text-4xl shadow-lg border-2 mb-6"
                                style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-accent)', color: 'var(--theme-accent)' }}>
                                <RiNavigationLine />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight">{selectedProfile.category}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">Ecosystem Target</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-[32px] border-2" style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Max Funding</p>
                                <p className="text-xl font-black" style={{ color: 'var(--theme-accent)' }}>₹{selectedProfile.fundingLimit?.toLocaleString()}</p>
                            </div>
                            <div className="p-6 rounded-[32px] border-2" style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Equity Expectation</p>
                                <p className="text-xl font-black">{selectedProfile.avgEquityExpectation}%</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] border-2 italic font-medium leading-relaxed shadow-sm" style={{ background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-secondary)' }}>
                            "{selectedProfile.description}"
                        </div>
                    </div>
                )}
            </Modal>

            {/* Log View Modal */}
            <Modal
                isOpen={reasonModal.show}
                onClose={() => setReasonModal({ ...reasonModal, show: false })}
                title="System Evaluation Log"
            >
                <div className="space-y-6 py-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-xl border-2"
                        style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)', color: 'var(--theme-accent)' }}>
                        <RiFileTextLine />
                    </div>
                    <p className="text-lg font-black tracking-tight">{reasonModal.title}</p>
                    <div className="p-8 rounded-[40px] border-2 shadow-inner italic font-bold text-sm leading-relaxed"
                        style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-secondary)' }}>
                        "{reasonModal.content}"
                    </div>
                    <button
                        onClick={() => setReasonModal({ ...reasonModal, show: false })}
                        className="w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95"
                        style={{ 
                            background: 'var(--theme-accent-gradient)', 
                            color: 'var(--theme-text-on-accent)',
                            boxShadow: '0 15px 30px -10px var(--theme-accent-glow)'
                        }}
                    >
                        Return to Tracker
                    </button>
                </div>
            </Modal>

            {/* Withdrawal Reason Modal */}
            <Modal
                isOpen={showWithdrawModal}
                onClose={() => !withdrawLoading && setShowWithdrawModal(false)}
                title="Withdrawal Rationale"
            >
                <div className="space-y-6 py-2">
                    <div className="p-5 rounded-2xl border-2" style={{ background: 'var(--theme-status-rejected-bg)', borderColor: 'var(--theme-status-rejected-border)', color: 'var(--theme-status-rejected-text)' }}>
                        <p className="text-xs font-black leading-tight uppercase tracking-widest text-center">Important: This action is permanent.</p>
                    </div>
                    
                    <textarea
                        value={withdrawReason}
                        onChange={(e) => {
                            setWithdrawReason(e.target.value);
                            if (e.target.value.trim().length >= 10) setWithdrawError('');
                        }}
                        placeholder="Please state your reason for withdrawing..."
                        className="w-full h-40 p-6 border-2 rounded-[32px] outline-none transition-all text-sm font-bold resize-none"
                        style={{ 
                            background: 'var(--theme-bg-input)', 
                            borderColor: withdrawError ? 'var(--theme-status-rejected-border)' : 'var(--theme-border)',
                            color: 'var(--theme-text-primary)'
                        }}
                    />
                    {withdrawError && <p className="text-[10px] font-black uppercase tracking-widest text-center" style={{ color: 'var(--theme-status-rejected-text)' }}>{withdrawError}</p>}

                    <div className="flex gap-4">
                        <button onClick={() => setShowWithdrawModal(false)} disabled={withdrawLoading} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest opacity-60">Cancel</button>
                        <button
                            onClick={handleConfirmWithdrawal}
                            disabled={withdrawLoading}
                            className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl disabled:opacity-50"
                            style={{ background: 'var(--theme-status-rejected-text)', boxShadow: '0 10px 20px -5px var(--theme-status-rejected-border)' }}
                        >
                            {withdrawLoading ? 'Processing...' : 'Confirm Withdrawal'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog 
                isOpen={deleteConfirm.show}
                onCancel={() => setDeleteConfirm({ show: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Remove Venture Record?"
                message="This will permanently delete this pitch record from your portfolio. This action cannot be reversed."
                confirmText="Yes, Remove Record"
                danger={true}
            />
        </div>
    );
};

export default MySubmissions;
