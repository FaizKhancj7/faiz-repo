/**
 * LandingPage Component
 * This is the public landing page for unauthenticated users.
 * It provides a high-level overview of StartupNest and its role-based benefits.
 * Strictly follows the PRD requirements for a clean, modern UI with Tailwind.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiRocketLine, RiTeamLine, RiLightbulbLine, RiHandCoinLine, RiArrowRightLine } from 'react-icons/ri';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
            
            {/* 1. PUBLIC NAVBAR */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <RiRocketLine className="text-[#F97316] text-3xl group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-2xl font-black tracking-tighter italic text-slate-800 uppercase">STARTUPNEST</span>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-[#F97316] transition-all px-6 py-3 rounded-xl hover:bg-slate-50"
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => navigate('/signup')}
                        className="bg-[#1E3A5F] hover:bg-[#2D5282] text-white text-xs font-black uppercase px-6 py-3 rounded-xl transition-all shadow-lg active:scale-95 border border-transparent"
                    >
                        Sign Up Free
                    </button>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <section className="relative pt-32 pb-20 px-8 flex flex-col items-center text-center max-w-7xl mx-auto">
                {/* Decorative background blur */}
                <div className="absolute top-0 -z-10 w-full h-full opacity-10">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-400 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
                </div>

                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-[#F97316] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 animate-bounce">
                    🚀 The Next Big Thing starts here
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                    Where Big Ideas <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-orange-400">Take Flight.</span>
                </h1>

                <p className="text-xl text-slate-500 max-w-3xl leading-relaxed mb-12 font-medium">
                    StartupNest bridges the gap between visionary entrepreneurs and experienced mentors. 
                    A secure ecosystem built to nurture innovation, secure funding, and scale dreams.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <button 
                        onClick={() => navigate('/signup')}
                        className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-10 py-5 rounded-2xl flex items-center gap-3 text-lg font-black uppercase transition-all shadow-2xl shadow-orange-500/20 active:scale-95"
                    >
                        <span>Get Started Now</span>
                        <RiArrowRightLine />
                    </button>
                    <button 
                        onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                        className="bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-800 px-10 py-5 rounded-2xl text-lg font-black uppercase transition-all active:scale-95"
                    >
                        Learn More
                    </button>
                </div>
            </section>

            {/* 3. FEATURES SECTION (Role-based) */}
            <section className="py-24 bg-slate-50 border-y border-slate-100 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Dual-Role Ecosystem</h2>
                        <div className="w-20 h-1.5 bg-[#F97316] mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        
                        {/* Mentor Card */}
                        <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-orange-200 transition-all group">
                            <div className="w-16 h-16 bg-orange-50 text-[#F97316] rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                                <RiTeamLine />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-6">For Mentors</h3>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-medium">
                                Share your expertise and discover the next unicorn. Evaluate pitches, shortlist promising startups, and invest in innovation.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {["List Investment Profiles", "Browse Pitch Submissions", "Shortlist Top Talent", "Collaborate on Ventures"].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-700 font-bold">
                                        <div className="w-1.5 h-1.5 bg-[#F97316] rounded-full"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Entrepreneur Card */}
                        <div className="bg-[#1E3A5F] p-12 rounded-[2.5rem] shadow-xl text-white hover:border-[#F97316] transition-all group border border-transparent">
                            <div className="w-16 h-16 bg-white/10 text-orange-400 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                                <RiLightbulbLine />
                            </div>
                            <h3 className="text-3xl font-black mb-6">For Entrepreneurs</h3>
                            <p className="text-white/70 text-lg leading-relaxed mb-8 font-medium">
                                Your vision deserves the right support. Connect with mentors who understand your industry and are ready to fund your journey.
                            </p>
                            <ul className="space-y-4 mb-10">
                                {["Browse Mentor Profiles", "Submit Startup Ideas", "Secure Funding & Support", "Track Pitch Status"].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-white/90 font-bold">
                                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. CALL TO ACTION */}
            <section className="py-24 px-8 text-center max-w-5xl mx-auto">
                <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2D5282] rounded-[3rem] p-16 relative overflow-hidden shadow-2xl">
                    {/* Decorative Icon */}
                    <RiHandCoinLine className="absolute -bottom-10 -right-10 text-white/5 text-[20rem] rotate-12" />
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
                        Ready to hatch your <br /> next big idea?
                    </h2>
                    <button 
                        onClick={() => navigate('/signup')}
                        className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-12 py-6 rounded-2xl text-xl font-black uppercase transition-all shadow-2xl shadow-orange-500/40 active:scale-95"
                    >
                        Join StartupNest Today
                    </button>
                    <p className="text-white/40 mt-8 font-bold text-sm tracking-widest uppercase italic">
                        Secured by Industry-Standard JWT Authorization
                    </p>
                </div>
            </section>

            {/* 5. FOOTER */}
            <footer className="py-12 border-t border-slate-100 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                © 2026 StartupNest Ecosystem. All Rights Reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
