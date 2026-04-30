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
    RiInboxArchiveLine
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

    const getStatusBadge = (status) => {
        const styles = {
            1: "bg-yellow-50 text-yellow-600 border-yellow-100",
            2: "bg-green-50 text-green-600 border-green-100",
            3: "bg-red-50 text-red-600 border-red-100"
        };
        const labels = { 1: "Pending", 2: "Shortlisted", 3: "Rejected" };
        return (
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[status]}`}>
                {labels[status]}
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

                {/* Content Area (Internal Scroll) */}
                {loading ? (
                    <Loader />
                ) : submissions && submissions.length > 0 ? (
                    <div className="flex-grow overflow-hidden animate-lift delay-100 pb-10">
                    <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                        
                        {/* Table Header Wrapper (Sticky) */}
                        <div className="overflow-hidden flex-shrink-0">
                            <table className="w-full text-left border-collapse min-w-[1200px]">
                                <thead>
                                    <tr className="bg-[#f7f9ff] border-b border-gray-100 shadow-sm">
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Entrepreneur</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Startup Category</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Submitted On</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-grow overflow-auto pr-1">
                            <table className="w-full text-left border-collapse min-w-[1200px]">
                                <tbody className="divide-y divide-gray-50">
                                    {submissions.map((submission) => (
                                        <tr key={submission._id} className="transition-all duration-200 hover:bg-slate-50/80">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900">{submission.userName}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight italic">Submission ID: {submission._id.slice(-6)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm text-gray-600 font-bold uppercase tracking-tighter">
                                                    {submission.startupProfileId?.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-500 font-medium text-center">
                                                {new Date(submission.submissionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {getStatusBadge(submission.status)}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleViewDetails(submission)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-blue-100"
                                                    >
                                                        <RiEyeLine size={14} />
                                                        <span>View</span>
                                                    </button>
                                                    {submission.status !== 2 && (
                                                        <button 
                                                            onClick={() => openConfirm('shortlist', submission._id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-green-100"
                                                        >
                                                            <RiCheckLine size={14} />
                                                            <span>Shortlist</span>
                                                        </button>
                                                    )}
                                                    {submission.status !== 3 && (
                                                        <button 
                                                            onClick={() => openConfirm('reject', submission._id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-red-100"
                                                        >
                                                            <RiCloseLine size={14} />
                                                            <span>Reject</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

            {/* Confirmation Dialog */}
            <ConfirmDialog 
                isOpen={confirmAction.show}
                onCancel={() => setConfirmAction({ show: false, type: '', id: null })}
                onConfirm={handleConfirmAction}
                title={`Confirm ${confirmAction.type === 'delete' ? 'Deletion' : 'Status Update'}`}
                message={`Are you sure you want to ${confirmAction.type} this submission? This action will notify the entrepreneur.`}
                confirmText={`Yes, ${confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}`}
                danger={confirmAction.type === 'delete' || confirmAction.type === 'reject'}
            />
        </div>
    );
};

export default StartupSubmissions;
