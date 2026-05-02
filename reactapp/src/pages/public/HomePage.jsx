// HomePage — Theme-Aware Implementation
// Uses CSS custom properties for layouts, cards, and accent colors.

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiRocketLine, RiCheckLine, RiTimeLine, RiCloseLine, RiBarChartFill, RiNavigationLine } from 'react-icons/ri';
import startupSubmissionService from '../../services/startupSubmissionService';

const HomePage = () => {
    const { userName, role } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, pending: 0, shortlisted: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                let res;
                if (role === 'Entrepreneur') {
                    res = await startupSubmissionService.getMySubmissions({ limit: 1000 });
                } else if (role === 'Mentor') {
                    res = await startupSubmissionService.getMentorSubmissions({ limit: 1000 });
                }

                if (res && res.success) {
                    const data = res.data;
                    setStats({
                        total: res.pagination.totalRecords,
                        pending: data.filter(s => !s.isWithdrawn && (s.status === 'pending' || s.status === 2 || s.status === '2')).length,
                        shortlisted: data.filter(s => !s.isWithdrawn && (s.status === 'approved' || s.status === 1 || s.status === '1')).length,
                        rejected: data.filter(s => s.status === 'rejected' || s.status === 3 || s.status === '3' || s.isWithdrawn).length
                    });
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };

        if (role) fetchStats();
    }, [role, location.key]); // location.key ensures re-fetch on every visit

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Content Area */}
            <div className="relative z-10 flex-grow flex flex-col items-center px-4 md:px-6 py-12 md:py-0 overflow-y-auto custom-scrollbar md:justify-center">
                
                {/* Hero Greeting */}
                <div className="text-center mb-10 md:mb-16 animate-lift max-w-4xl w-full flex-shrink-0">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-3 md:mb-4 transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>
                        Dashboard System
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.1] transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                        Welcome back, <span style={{ color: 'var(--theme-accent)' }}>{userName}</span>
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>
                            Authenticated as
                        </span>
                        <span className="px-3 py-1 rounded-lg border text-[10px] font-black tracking-wider transition-all duration-300"
                            style={{ 
                                background: 'var(--theme-accent-light)', 
                                borderColor: 'var(--theme-border)', 
                                color: 'var(--theme-accent)' 
                            }}>
                            {role}
                        </span>
                    </div>
                    <p className="text-sm md:text-lg mt-6 max-w-2xl mx-auto font-medium leading-relaxed px-4 transition-all duration-300" style={{ color: 'var(--theme-text-secondary)' }}>
                        {role === 'Mentor' 
                            ? "Your central hub for mentorship. Review pitches and discover the next big thing."
                            : "Your central hub for innovation. Track your pitches and manage your growth."}
                    </p>
                </div>

                {/* Shared Stats Grid */}
                {(role === 'Entrepreneur' || role === 'Mentor') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl animate-lift delay-200 pb-10">
                        
                        {/* Total Card */}
                        <div className="group relative backdrop-blur-2xl border rounded-[32px] p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            style={{ 
                                background: 'var(--theme-bg-card)', 
                                borderColor: 'var(--theme-border)',
                                boxShadow: 'var(--theme-shadow-md)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--theme-shadow-lg)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--theme-shadow-md)'}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiBarChartFill size={80} style={{ color: 'var(--theme-text-primary)' }} />
                            </div>
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <div className="p-3 rounded-2xl border shadow-xl transition-all duration-300"
                                    style={{ 
                                        background: 'var(--theme-bg-secondary)', 
                                        borderColor: 'var(--theme-border)', 
                                        color: 'var(--theme-text-primary)' 
                                    }}>
                                    <RiBarChartFill size={20} className="md:size-6" />
                                </div>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{loading ? '...' : stats.total}</h3>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2 transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>
                                {role === 'Mentor' ? 'Total Submissions' : 'Total Made'}
                            </p>
                        </div>

                        {/* Pending Card */}
                        <div className="group relative backdrop-blur-2xl border rounded-[32px] p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            style={{ 
                                background: 'var(--theme-bg-card)', 
                                borderColor: 'var(--theme-border)',
                                boxShadow: 'var(--theme-shadow-md)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--theme-shadow-lg)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--theme-shadow-md)'}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiTimeLine size={80} style={{ color: 'var(--theme-status-pending-text)' }} />
                            </div>
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <div className="p-3 rounded-2xl border shadow-xl transition-all duration-300"
                                    style={{ 
                                        background: 'var(--theme-status-pending-bg)', 
                                        borderColor: 'var(--theme-status-pending-border)', 
                                        color: 'var(--theme-status-pending-text)' 
                                    }}>
                                    <RiTimeLine size={20} className="md:size-6" />
                                </div>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{loading ? '...' : stats.pending}</h3>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2 transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Pending Review</p>
                        </div>

                        {/* Shortlisted Card */}
                        <div className="group relative backdrop-blur-2xl border rounded-[32px] p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            style={{ 
                                background: 'var(--theme-bg-card)', 
                                borderColor: 'var(--theme-border)',
                                boxShadow: 'var(--theme-shadow-md)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--theme-shadow-lg)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--theme-shadow-md)'}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiCheckLine size={80} style={{ color: 'var(--theme-status-approved-text)' }} />
                            </div>
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <div className="p-3 rounded-2xl border shadow-xl transition-all duration-300"
                                    style={{ 
                                        background: 'var(--theme-status-approved-bg)', 
                                        borderColor: 'var(--theme-status-approved-border)', 
                                        color: 'var(--theme-status-approved-text)' 
                                    }}>
                                    <RiCheckLine size={20} className="md:size-6" />
                                </div>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{loading ? '...' : stats.shortlisted}</h3>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2 transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Shortlisted</p>
                        </div>

                        {/* Rejected Card */}
                        <div className="group relative backdrop-blur-2xl border rounded-[32px] p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            style={{ 
                                background: 'var(--theme-bg-card)', 
                                borderColor: 'var(--theme-border)',
                                boxShadow: 'var(--theme-shadow-md)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--theme-shadow-lg)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--theme-shadow-md)'}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiCloseLine size={80} style={{ color: 'var(--theme-status-rejected-text)' }} />
                            </div>
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <div className="p-3 rounded-2xl border shadow-xl transition-all duration-300"
                                    style={{ 
                                        background: 'var(--theme-status-rejected-bg)', 
                                        borderColor: 'var(--theme-status-rejected-border)', 
                                        color: 'var(--theme-status-rejected-text)' 
                                    }}>
                                    <RiCloseLine size={20} className="md:size-6" />
                                </div>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{loading ? '...' : stats.rejected}</h3>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2 transition-all duration-300" style={{ color: 'var(--theme-text-muted)' }}>Closed/Rejected</p>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default HomePage;