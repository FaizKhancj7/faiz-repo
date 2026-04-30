import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RiRocketLine, RiCheckLine, RiTimeLine, RiCloseLine, RiBarChartFill, RiNavigationLine } from 'react-icons/ri';
import startupSubmissionService from '../services/startupSubmissionService';

const HomePage = () => {
    const { userName, role } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, pending: 0, shortlisted: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

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
                        pending: data.filter(s => s.status === 1).length,
                        shortlisted: data.filter(s => s.status === 2).length,
                        rejected: data.filter(s => s.status === 3).length
                    });
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };

        if (role) fetchStats();
    }, [role]);

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <div className="h-full w-full overflow-hidden flex flex-col relative"
            style={{ 
                backgroundImage: "url('/a9e1854aa28ce1bc5566caf480952112.jpg')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                fontFamily: "'Inter', sans-serif" 
            }}>
            
            {/* Dark Ambient Overlay */}
            <div className="absolute inset-0 bg-[#0e1d2a]/75 backdrop-blur-[2px]"></div>

            {/* Content Area */}
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 text-white">
                
                {/* Hero Greeting */}
                <div className="text-center mb-12 animate-lift">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff7a21] mb-4">
                        Dashboard System
                    </p>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '56px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                        Welcome back, <span style={{ color: '#ff7a21' }}>{userName}</span>
                    </h1>
                    <div className="mt-4 flex items-center justify-center gap-3">
                        <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest">
                            Authenticated as
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-black text-white tracking-wider">
                            {role}
                        </span>
                    </div>
                    <p className="text-white/40 text-lg mt-6 max-w-2xl mx-auto font-medium">
                        {role === 'Mentor' 
                            ? "Your central hub for mentorship. Review pitches and discover the next big thing."
                            : "Your central hub for innovation. Track your pitches and manage your growth."}
                    </p>
                </div>

                {/* Shared Stats Grid */}
                {(role === 'Entrepreneur' || role === 'Mentor') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl animate-lift delay-200">
                        
                        {/* Total Card */}
                        <div className="group relative bg-[#162a3f]/80 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 transition-all duration-500 hover:bg-[#1c354f] hover:-translate-y-2 shadow-2xl">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiBarChartFill size={80} />
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3.5 rounded-2xl bg-[#0e1d2a] border border-white/10 text-white shadow-xl">
                                    <RiBarChartFill size={24} />
                                </div>
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter">{loading ? '...' : stats.total}</h3>
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mt-2">
                                {role === 'Mentor' ? 'Total Submissions Received' : 'Total Submissions Made'}
                            </p>
                        </div>

                        {/* Pending Card */}
                        <div className="group relative bg-[#162a3f]/80 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 transition-all duration-500 hover:bg-[#1c354f] hover:-translate-y-2 shadow-2xl">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiTimeLine size={80} />
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3.5 rounded-2xl bg-[#0e1d2a] border border-white/10 text-yellow-400 shadow-xl">
                                    <RiTimeLine size={24} />
                                </div>
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter">{loading ? '...' : stats.pending}</h3>
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mt-2">Pending Review</p>
                        </div>

                        {/* Shortlisted Card */}
                        <div className="group relative bg-[#162a3f]/80 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 transition-all duration-500 hover:bg-[#1c354f] hover:-translate-y-2 shadow-2xl">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiCheckLine size={80} />
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3.5 rounded-2xl bg-[#0e1d2a] border border-white/10 text-green-400 shadow-xl">
                                    <RiCheckLine size={24} />
                                </div>
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter">{loading ? '...' : stats.shortlisted}</h3>
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mt-2">Shortlisted</p>
                        </div>

                        {/* Rejected Card */}
                        <div className="group relative bg-[#162a3f]/80 backdrop-blur-2xl border border-white/20 rounded-[32px] p-8 transition-all duration-500 hover:bg-[#1c354f] hover:-translate-y-2 shadow-2xl">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <RiCloseLine size={80} />
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3.5 rounded-2xl bg-[#0e1d2a] border border-white/10 text-red-400 shadow-xl">
                                    <RiCloseLine size={24} />
                                </div>
                            </div>
                            <h3 className="text-5xl font-black tracking-tighter">{loading ? '...' : stats.rejected}</h3>
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mt-2">Closed/Rejected</p>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default HomePage;