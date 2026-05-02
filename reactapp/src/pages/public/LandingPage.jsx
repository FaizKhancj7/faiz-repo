// LandingPage — Kinetic Mentor Redesign
// Features: Solar-gradient accents, glassmorphism, and HD Memphis illustrations.
// Uses CSS custom properties for theme-awareness.

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine, RiShieldUserLine, RiEyeLine, RiRocketLine, RiTeamLine, RiSeedlingLine, RiLineChartLine } from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Pure Code, No Images) ---

const MemphisFounder = () => (
    <svg viewBox="0 0 400 400" className="w-full max-w-[320px] lg:max-w-[440px] h-auto drop-shadow-2xl animate-float">
        <defs>
            <linearGradient id="solar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8c00" />
                <stop offset="100%" stopColor="#904d00" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <circle cx="200" cy="200" r="180" fill="var(--theme-accent-light)" opacity="0.4" />
        {/* Floating Abstract Shapes for 'HD' look */}
        <rect x="50" y="50" width="40" height="40" rx="10" fill="var(--theme-accent)" opacity="0.2" className="animate-spin-slow" />
        <circle cx="320" cy="80" r="20" fill="var(--theme-accent)" opacity="0.3" className="animate-pulse" />
        
        {/* Desk with shadow */}
        <rect x="80" y="280" width="240" height="12" rx="6" fill="var(--theme-text-primary)" opacity="0.1" />
        
        {/* Person - High Contrast/Detailed */}
        <path d="M150 320 Q120 280 140 220 L160 140 Q165 120 185 120 L215 120 Q235 120 240 140 L260 220 Q280 280 250 320" fill="url(#solar)" filter="url(#glow)" />
        <circle cx="200" cy="90" r="18" fill="url(#solar)" />
        
        {/* Arms with multi-layer strokes */}
        <path d="M160 160 Q80 180 100 240" fill="none" stroke="var(--theme-accent)" strokeWidth="22" strokeLinecap="round" />
        <path d="M240 160 Q320 180 300 240" fill="none" stroke="var(--theme-accent)" strokeWidth="22" strokeLinecap="round" />
        
        {/* Laptop - Glass Style */}
        <rect x="160" y="190" width="80" height="50" rx="8" fill="var(--theme-bg-card)" stroke="var(--theme-border)" strokeWidth="2" />
        <rect x="170" y="200" width="60" height="30" rx="4" fill="var(--theme-accent)" opacity="0.8" />
        <path d="M175 210 L190 210" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
);

const MemphisInvestor = () => (
    <svg viewBox="0 0 400 400" className="w-full max-w-[320px] lg:max-w-[440px] h-auto drop-shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
        <defs>
            <linearGradient id="investor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ad2c00" />
                <stop offset="100%" stopColor="#ff8c00" />
            </linearGradient>
        </defs>
        <path d="M50 200 Q100 50 200 50 T350 200" fill="var(--theme-accent-light)" opacity="0.4" />
        
        {/* Chart Lines in Background */}
        <path d="M100 250 L150 180 L200 220 L300 100" fill="none" stroke="var(--theme-accent)" strokeWidth="4" strokeDasharray="8 8" opacity="0.3" />
        
        {/* Person - Sharp Details */}
        <path d="M180 300 L200 150 L220 300" fill="url(#investor-grad)" />
        <circle cx="200" cy="120" r="14" fill="url(#investor-grad)" />
        <path d="M200 160 Q350 120 380 250" fill="none" stroke="url(#investor-grad)" strokeWidth="20" strokeLinecap="round" />
        
        {/* Legs with better definition */}
        <path d="M180 300 Q150 400 50 380" fill="none" stroke="url(#investor-grad)" strokeWidth="20" strokeLinecap="round" />
        <path d="M220 300 Q250 400 350 380" fill="none" stroke="url(#investor-grad)" strokeWidth="20" strokeLinecap="round" />
        
        {/* Vision Lens */}
        <circle cx="360" cy="240" r="35" fill="var(--theme-accent)" opacity="0.9" filter="url(#glow)" />
        <circle cx="360" cy="240" r="25" fill="white" opacity="0.3" />
        <path d="M350 240 L370 240 M360 230 L360 250" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
    </svg>
);

const useScrollReveal = () => {
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('animate-grow'); obs.unobserve(e.target); } });
        }, { threshold: 0.15 });
        ref.current?.querySelectorAll('.scroll-reveal').forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);
    return ref;
};

const LandingPage = () => {
    const navigate = useNavigate();
    const sectionRef = useScrollReveal();
    const { cycleTheme, themeName, themeIcon } = useTheme();

    return (
        <div ref={sectionRef} className="min-h-screen overflow-x-hidden transition-all duration-300" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                color: 'var(--theme-text-primary)', 
                background: 'var(--theme-bg-secondary)' 
            }}>

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-5 flex justify-between items-center transition-all duration-300" 
                style={{ 
                    background: 'var(--theme-nav-bg)', 
                    backdropFilter: 'var(--theme-glass)', 
                    borderBottom: '2px solid var(--theme-nav-border)' 
                }}>
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="p-2 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" style={{ background: 'var(--theme-accent-gradient)' }}>
                        <RiRocketLine className="text-white text-xl" />
                    </div>
                    <span className="text-xl font-black tracking-tighter" style={{ color: 'var(--theme-nav-text)' }}>
                        Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 md:gap-5">
                    <button onClick={cycleTheme} className="p-2.5 rounded-xl border transition-all hover:scale-110 active:scale-95" 
                        style={{ background: 'var(--theme-accent-light)', borderColor: 'var(--theme-nav-border)' }}>
                        {themeIcon}
                    </button>
                    <button onClick={() => navigate('/login')} className="text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--theme-nav-text)' }}>
                        Login
                    </button>
                    <button onClick={() => navigate('/signup')} className="text-sm font-black text-white px-8 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl" 
                        style={{ background: 'var(--theme-accent-gradient)', color: 'var(--theme-text-on-accent)' }}>
                        Join Now
                    </button>
                </div>
            </nav>

            {/* HERO SECTION - CORPORATE MEMPHIS STYLE */}
            <section className="relative pt-40 md:pt-56 pb-24 md:pb-48 px-6 lg:px-16 flex flex-col items-center text-center overflow-hidden">
                {/* Background Blobs (Memphis Elements) */}
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 animate-liquid" style={{ background: 'var(--theme-accent)' }}></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-liquid" style={{ background: '#ff8c00' }}></div>
                
                <div className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="animate-lift inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8" style={{ background: 'var(--theme-accent-light)', border: '2px solid var(--theme-nav-border)' }}>
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                            <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-accent)' }}>Venture Capital Reimagined</span>
                        </div>
                        
                        <h1 className="animate-lift delay-100 text-[clamp(48px,10vw,100px)] font-black leading-[0.9] tracking-tighter mb-8">
                            Accelerate Your<br />
                            <span style={{ color: 'var(--theme-accent)' }}>Evolutionary</span><br />
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--theme-accent-gradient)' }}>Startup.</span>
                        </h1>

                        <p className="animate-lift delay-200 text-lg md:text-xl font-medium max-w-xl mb-12 leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                            The most inclusive platform for high-growth startups to meet world-class mentors and secure institutional funding.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-lift delay-300">
                            <button onClick={() => navigate('/signup')} className="group flex items-center gap-3 px-10 py-5 rounded-[24px] text-white font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-2xl"
                                style={{ background: 'var(--theme-accent-gradient)', boxShadow: '0 20px 40px -10px var(--theme-accent-glow)' }}>
                                Start Pitching <RiArrowRightLine className="text-2xl transition-transform group-hover:translate-x-2" />
                            </button>
                        </div>
                    </div>

                    {/* HERO ILLUSTRATION */}
                    <div className="flex-1 flex justify-center animate-lift delay-200">
                        <div className="relative">
                            <MemphisFounder />
                            {/* Decorative Squiggles */}
                            <svg className="absolute -top-10 -right-10 w-24 h-24 opacity-40 animate-spin-slow" viewBox="0 0 100 100">
                                <path d="M10 50 Q30 10 50 50 T90 50" fill="none" stroke="var(--theme-accent)" strokeWidth="6" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="px-6 lg:px-16 py-24 md:py-40 transition-all duration-300" style={{ background: 'var(--theme-bg-primary)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 scroll-reveal" style={{ opacity: 0 }}>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Designed for Growth.</h2>
                        <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'var(--theme-text-secondary)' }}>Everything you need to scale from zero to unicorn, built into one seamless ecosystem.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Smart Matchmaking', desc: 'Our algorithm connects you with mentors who specifically match your industry and stage.', icon: RiTeamLine, color: '#FF7EB3' },
                            { title: 'Seed-to-Scale', desc: 'Secure funding from pre-seed to Series A through our network of vetted institutional investors.', icon: RiSeedlingLine, color: '#65D2E1' },
                            { title: 'Real-time Analytics', desc: 'Track your pitch progress, investor engagement, and growth metrics in one dashboard.', icon: RiLineChartLine, color: '#FFB347' }
                        ].map((feat, i) => (
                            <div key={i} className="scroll-reveal p-10 rounded-[40px] border-2 transition-all duration-500 hover:-translate-y-4"
                                style={{ opacity: 0, background: 'var(--theme-bg-card)', borderColor: 'var(--theme-border)', transitionDelay: `${i * 100}ms` }}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ background: feat.color + '20' }}>
                                    <feat.icon className="text-3xl" style={{ color: feat.color }} />
                                </div>
                                <h3 className="text-2xl font-black mb-4">{feat.title}</h3>
                                <p className="font-medium leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DUAL SECTION - INVESTOR SIDE */}
            <section className="px-6 lg:px-16 py-24 md:py-40 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-20">
                    <div className="flex-1 text-center lg:text-left scroll-reveal" style={{ opacity: 0 }}>
                        <h2 className="text-4xl md:text-7xl font-black leading-tight tracking-tight mb-8">
                            High-Signal<br />
                            <span style={{ color: 'var(--theme-accent)' }}>Deal Flow.</span>
                        </h2>
                        <p className="text-lg md:text-xl font-medium mb-12 leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                            For investors and mentors, we provide a pre-vetted stream of innovation, backed by deep due-diligence and verified metrics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500/20 text-green-500 font-bold">12k</div>
                                <p className="text-sm font-black uppercase tracking-widest">Active Mentors</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-500 font-bold">$2B+</div>
                                <p className="text-sm font-black uppercase tracking-widest">Capital Deployed</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center scroll-reveal" style={{ opacity: 0 }}>
                        <MemphisInvestor />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
