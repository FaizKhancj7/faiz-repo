// HomePage — Theme-Aware Implementation
// Uses CSS custom properties for layouts, cards, and accent colors.

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiRocketLine, RiCheckLine, RiTimeLine, RiCloseLine, RiBarChartFill, RiNavigationLine } from 'react-icons/ri';
import startupSubmissionService from '../../services/startupSubmissionService';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Kinetic Palette) ---

const DashboardIllustration = ({ role }) => (
    <svg viewBox="0 0 400 400" className="w-full max-w-[280px] lg:max-w-[400px] h-auto drop-shadow-2xl animate-float">
        <defs>
            <linearGradient id="dash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--theme-accent)" />
                <stop offset="100%" stopColor="#ff8c00" />
            </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="180" fill="var(--theme-accent-light)" opacity="0.3" />
        
        {/* Abstract Data Shapes */}
        <rect x="100" y="220" width="40" height="80" rx="12" fill="url(#dash-grad)" opacity="0.8" className="animate-pulse" />
        <rect x="160" y="160" width="40" height="140" rx="12" fill="url(#dash-grad)" />
        <rect x="220" y="200" width="40" height="100" rx="12" fill="url(#dash-grad)" opacity="0.6" />
        <rect x="280" y="140" width="40" height="160" rx="12" fill="url(#dash-grad)" opacity="0.4" />

        {/* Floating Accent Circles */}
        <circle cx="320" cy="80" r="15" fill="var(--theme-accent)" opacity="0.2" className="animate-bounce" style={{ animationDuration: '3s' }} />
        <circle cx="80" cy="120" r="10" fill="#ad2c00" opacity="0.2" className="animate-bounce" style={{ animationDuration: '4s' }} />
        
        {/* Role-Specific Icon Overlay */}
        <g transform="translate(160, 50) scale(2)">
            {role === 'Mentor' ? (
                <RiBarChartFill className="text-white" style={{ color: 'var(--theme-accent)' }} />
            ) : (
                <RiNavigationLine className="text-white" style={{ color: 'var(--theme-accent)' }} />
            )}
        </g>
    </svg>
);

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
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: 'var(--theme-bg-secondary)'
            }}>
            
            {/* Background Liquid Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.07] animate-liquid pointer-events-none" style={{ background: 'var(--theme-accent)' }}></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.05] animate-liquid pointer-events-none" style={{ background: '#ff8c00', animationDelay: '2s' }}></div>

            {/* Content Area */}
            <div className="relative z-10 flex-grow flex flex-col items-center px-4 md:px-6 py-12 md:py-0 overflow-y-auto custom-scrollbar md:justify-center">
                
                {/* Hero Greeting Container */}
                <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between mb-10 md:mb-16 gap-12">
                    
                    {/* Text Section */}
                    <div className="flex-1 text-center lg:text-left animate-lift">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 transition-all duration-300" style={{ color: 'var(--theme-accent)' }}>
                            Venture Intelligence System
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[0.95] transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>
                            Welcome back,<br />
                            <span style={{ color: 'var(--theme-accent)' }}>{userName}</span>
                        </h1>
                        <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--theme-text-primary)' }}>
                                Authenticated as
                            </span>
                            <span className="px-4 py-1.5 rounded-xl border text-[10px] font-black tracking-wider transition-all duration-300"
                                style={{ 
                                    background: 'var(--theme-accent-light)', 
                                    borderColor: 'var(--theme-border)', 
                                    color: 'var(--theme-accent)' 
                                }}>
                                {role}
                            </span>
                        </div>
                        <p className="text-sm md:text-lg mt-8 max-w-xl font-medium leading-relaxed transition-all duration-300 opacity-80" style={{ color: 'var(--theme-text-primary)' }}>
                            {role === 'Mentor' 
                                ? "Your central hub for mentorship. Review pitches, analyze market data, and discover the next game-changing startup."
                                : "Your central hub for innovation. Track your pitch progress, manage your portfolio, and scale your venture to new heights."}
                        </p>
                    </div>

                    {/* Illustration Section */}
                    <div className="flex-shrink-0 animate-lift delay-100">
                        <DashboardIllustration role={role} />
                    </div>
                </div>

                {/* Shared Stats Grid */}
                {(role === 'Entrepreneur' || role === 'Mentor') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl animate-lift delay-200 pb-10">
                        
                        {/* Total Card */}
                        <div className="group relative backdrop-blur-3xl border rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.03)', 
                                borderColor: 'var(--theme-border)',
                                backdropFilter: 'blur(20px)'
                            }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiBarChartFill size={100} style={{ color: 'var(--theme-text-primary)' }} />
                            </div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-300 group-hover:scale-110"
                                    style={{ 
                                        background: 'var(--theme-accent-light)', 
                                        borderColor: 'var(--theme-border)', 
                                        color: 'var(--theme-accent)' 
                                    }}>
                                    <RiBarChartFill size={28} />
                                </div>
                            </div>
                            <h3 className="text-5xl md:text-6xl font-black tracking-tighter transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{loading ? '...' : stats.total}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 transition-all duration-300 opacity-50" style={{ color: 'var(--theme-text-primary)' }}>
                                {role === 'Mentor' ? 'Global Pitch Deck' : 'Personal Portfolio'}
                            </p>
                        </div>

                        {/* Pending Card */}
                        <div className="group relative backdrop-blur-3xl border rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.03)', 
                                borderColor: 'var(--theme-border)',
                                backdropFilter: 'blur(20px)'
                            }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiTimeLine size={100} style={{ color: 'var(--theme-status-pending-text)' }} />
                            </div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-300 group-hover:scale-110"
                                    style={{ 
                                        background: 'var(--theme-status-pending-bg)', 
                                        borderColor: 'var(--theme-status-pending-border)', 
                                        color: 'var(--theme-status-pending-text)' 
                                    }}>
                                    <RiTimeLine size={28} />
                                </div>
                            </div>
                            <h3 className="text-5xl md:text-6xl font-black tracking-tighter transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{loading ? '...' : stats.pending}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 transition-all duration-300 opacity-50" style={{ color: 'var(--theme-text-primary)' }}>Pipeline Review</p>
                        </div>

                        {/* Shortlisted Card */}
                        <div className="group relative backdrop-blur-3xl border rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.03)', 
                                borderColor: 'var(--theme-border)',
                                backdropFilter: 'blur(20px)'
                            }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiCheckLine size={100} style={{ color: 'var(--theme-status-approved-text)' }} />
                            </div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-300 group-hover:scale-110"
                                    style={{ 
                                        background: 'var(--theme-status-approved-bg)', 
                                        borderColor: 'var(--theme-status-approved-border)', 
                                        color: 'var(--theme-status-approved-text)' 
                                    }}>
                                    <RiCheckLine size={28} />
                                </div>
                            </div>
                            <h3 className="text-5xl md:text-6xl font-black tracking-tighter transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{loading ? '...' : stats.shortlisted}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 transition-all duration-300 opacity-50" style={{ color: 'var(--theme-text-primary)' }}>Accelerated Ideas</p>
                        </div>

                        {/* Rejected Card */}
                        <div className="group relative backdrop-blur-3xl border rounded-[40px] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.03)', 
                                borderColor: 'var(--theme-border)',
                                backdropFilter: 'blur(20px)'
                            }}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiCloseLine size={100} style={{ color: 'var(--theme-status-rejected-text)' }} />
                            </div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-300 group-hover:scale-110"
                                    style={{ 
                                        background: 'var(--theme-status-rejected-bg)', 
                                        borderColor: 'var(--theme-status-rejected-border)', 
                                        color: 'var(--theme-status-rejected-text)' 
                                    }}>
                                    <RiCloseLine size={28} />
                                </div>
                            </div>
                            <h3 className="text-5xl md:text-6xl font-black tracking-tighter transition-all duration-300" style={{ color: 'var(--theme-text-primary)' }}>{loading ? '...' : stats.rejected}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-3 transition-all duration-300 opacity-50" style={{ color: 'var(--theme-text-primary)' }}>Archived Entries</p>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default HomePage;