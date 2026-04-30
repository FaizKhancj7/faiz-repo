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

    const viewPitchDeck = (filePath) => {
        const url = `http://localhost:8080/${filePath}`;
        window.open(url, '_blank');
    };

    const getStatusBadge = (status) => {
        const styles = {
            1: "bg-yellow-50 text-yellow-600 border-yellow-100",
            2: "bg-green-50 text-green-600 border-green-100",
            3: "bg-red-50 text-red-600 border-red-100"
        };
        const labels = { 1: "Pending", 2: "Shortlisted", 3: "Rejected" };
        return (
            <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
                {labels[status]}
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

                {/* Content Area (Scrollable Table) */}
                {loading ? (
                    <Loader />
                ) : submissions && submissions.length > 0 ? (
                    <div className="flex flex-col h-full overflow-hidden animate-lift delay-100">
                        {/* Table Container with Internal Scroll */}
                        <div className="flex-grow overflow-auto border border-white/10 rounded-3xl shadow-2xl bg-white scrollbar-hide">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead className="sticky top-0 z-20">
                                    <tr className="bg-[#f7f9ff] border-b border-gray-100 shadow-sm">
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Mentor</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase">Category</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-center">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[#ff7a21] uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {submissions.map((submission) => (
                                        <tr key={submission._id} className="transition-all duration-200 hover:bg-slate-50/80">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{submission.startupProfileId?.mentorId?.userName || 'N/A'}</span>
                                                    <span className="text-xs text-gray-400 font-medium italic">{submission.startupProfileId?.mentorId?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700 font-bold uppercase tracking-tight">
                                                    {submission.startupProfileId?.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium text-center">
                                                {new Date(submission.submissionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(submission.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleViewProfile(submission.startupProfileId)}
                                                        className="flex items-center gap-1.5 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-blue-100"
                                                    >
                                                        <RiEyeLine size={14} />
                                                        <span>Profile</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => viewPitchDeck(submission.pitchDeckFile)}
                                                        className="flex items-center gap-1.5 px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-orange-100"
                                                    >
                                                        <RiFilePdfLine size={14} />
                                                        <span>Pitch</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOpenDelete(submission._id)}
                                                        className="flex items-center gap-1.5 px-3 py-1 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider border border-transparent hover:border-red-100"
                                                    >
                                                        <RiDeleteBin6Line size={14} />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination (Fixed at bottom) */}
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
