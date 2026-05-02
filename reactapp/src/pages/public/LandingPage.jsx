// LandingPage — Theme-Aware Implementation
// Uses CSS custom properties for layouts, cards, and accent colors.

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine, RiShieldUserLine, RiEyeLine, RiShareLine, RiGlobalLine, RiRocketLine } from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import AnimatedBackground from '../../components/ui/AnimatedBackground';

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
        <div ref={sectionRef} className="min-h-screen overflow-x-hidden transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--theme-text-primary)', background: 'var(--theme-bg-secondary)' }}>

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-10 lg:px-16 py-4 flex justify-between items-center transition-all duration-300" style={{ background: 'var(--theme-nav-bg)', backdropFilter: 'var(--theme-glass)', borderBottom: '1px solid var(--theme-nav-border)' }}>
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="p-1.5 md:p-2 rounded-xl transition-all duration-300 group-hover:rotate-12 active:scale-95" style={{ background: 'var(--theme-accent-gradient)' }}>
                        <RiRocketLine className="text-white text-lg md:text-xl" />
                    </div>
                    <span className="text-lg md:text-[20px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: 'var(--theme-nav-text)', letterSpacing: '-0.02em' }}>
                        Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={() => { cycleTheme(); }}
                        className="group flex items-center justify-center gap-1.5 px-3 py-2 transition-all duration-300 active:scale-95"
                        style={{ 
                            borderRadius: 'var(--theme-radius)',
                            border: '1px solid var(--theme-nav-border)',
                            background: 'var(--theme-accent-light)'
                        }}
                        title={`Current: ${themeName}. Click to switch.`}
                    >
                        <span className="text-sm">{themeIcon}</span>
                        <span className="hidden md:inline text-[9px] font-black uppercase tracking-wider" style={{ color: 'var(--theme-accent)' }}>{themeName}</span>
                    </button>
                    
                    <button onClick={() => { navigate('/login'); }} className="text-xs md:text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300 active:scale-95" style={{ color: 'var(--theme-nav-text)', border: '1px solid var(--theme-nav-border)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-accent-light)'; e.currentTarget.style.color = 'var(--theme-accent)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--theme-nav-text)'; }}>
                        Login
                    </button>
                    <button onClick={() => { navigate('/signup'); }} className="text-xs md:text-sm font-bold text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-300 hidden sm:block active:scale-95" style={{ background: 'var(--theme-accent-gradient)', boxShadow: '0 4px 20px var(--theme-accent-glow)', color: 'var(--theme-text-on-accent)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 28px var(--theme-accent-glow)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--theme-accent-glow)'; }}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-32 md:pt-48 px-6 lg:px-16 overflow-hidden pb-24 md:pb-40 transition-all duration-300">
                {/* Global High-Energy Background */}
                <AnimatedBackground showOrnaments={true} />

                <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
                    <div className="animate-lift mb-8">
                        <div className="animate-badge-bounce inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300"
                            style={{ background: 'var(--theme-accent-light)', borderColor: 'var(--theme-nav-border)' }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--theme-accent)' }}></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-accent)' }}>Next-Gen Venture Ecosystem</span>
                        </div>
                    </div>

                    <h1 className="animate-lift delay-100" style={{ 
                        fontFamily: "'Plus Jakarta Sans', sans-serif", 
                        fontSize: 'clamp(40px, 8vw, 90px)', 
                        fontWeight: 800, 
                        lineHeight: 1, 
                        letterSpacing: '-0.05em', 
                        color: 'var(--theme-text-primary)' 
                    }}>
                        Where Big Ideas<br />
                        <span style={{ 
                            background: 'var(--theme-accent-gradient)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>Take Flight.</span>
                    </h1>

                    <p className="animate-lift delay-200 mt-10 max-w-2xl text-base md:text-xl font-medium leading-relaxed transition-all duration-300" 
                        style={{ color: 'var(--theme-text-secondary)' }}>
                        StartupNest bridges the gap between visionary entrepreneurs and experienced mentors, providing the capital, network, and expertise needed to scale rapidly.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mt-12 animate-lift delay-300">
                        <button onClick={() => { navigate('/signup'); }} className="flex items-center gap-3 text-white text-xs md:text-sm font-bold uppercase active:scale-95 transition-all duration-300 px-10 py-4 rounded-full"
                            style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '0.15em', background: 'var(--theme-accent-gradient)', boxShadow: '0 8px 32px var(--theme-accent-glow)', color: 'var(--theme-text-on-accent)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px var(--theme-accent-glow)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px var(--theme-accent-glow)'; }}>
                            <span>Get Started</span><RiArrowRightLine className="text-xl" />
                        </button>
                        <button onClick={() => { window.scrollTo({ top: 800, behavior: 'smooth' }); }} className="text-xs md:text-sm font-bold uppercase active:scale-95 transition-all duration-300 px-10 py-4 rounded-full"
                            style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '0.15em', border: '2px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-text-primary)'; e.currentTarget.style.color = 'var(--theme-bg-primary)'; e.currentTarget.style.borderColor = 'var(--theme-text-primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--theme-text-primary)'; e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* DUAL-ROLE ECOSYSTEM */}
            <section className="px-6 lg:px-16 py-20 md:py-32 transition-all duration-300" style={{ background: 'var(--theme-bg-primary)' }}>
                <div className="max-w-[1280px] mx-auto">
                    <div className="text-center mb-12 md:mb-20 scroll-reveal" style={{ opacity: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--theme-text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans'" }}>Our Infrastructure</p>
                        <h2 className="mt-3" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--theme-text-primary)' }}>Dual-Role Ecosystem</h2>
                        <div className="mx-auto mt-5" style={{ width: '48px', height: '4px', background: 'var(--theme-accent-gradient)', borderRadius: '9999px' }}></div>
                    </div>
                    <div className="grid md:grid-cols-2 max-w-5xl mx-auto gap-6 lg:gap-10">
                        <div className="scroll-reveal transition-all duration-500 hover:-translate-y-2 p-8 md:p-10 rounded-[32px]" 
                            style={{ opacity: 0, background: 'var(--theme-bg-card)', border: '1px solid var(--theme-border)', borderBottomWidth: '4px' }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--theme-shadow-lg)'; e.currentTarget.style.borderBottomColor = 'var(--theme-accent)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderBottomColor = 'var(--theme-border)'; }}>
                            <div className="flex items-center justify-center mb-6 md:mb-8 transition-all duration-300 hover:scale-110" style={{ width: '56px', height: '56px', background: 'var(--theme-accent-light)', borderRadius: '16px' }}>
                                <RiShieldUserLine style={{ fontSize: '24px', color: 'var(--theme-accent)' }} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold mb-3" style={{ fontFamily: "'Plus Jakarta Sans'", color: 'var(--theme-text-primary)' }}>For Founders</h3>
                            <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: 'var(--theme-text-secondary)' }}>Access pre-seed to Series A funding, world-class mentorship from exited founders, and a proprietary talent network to build your core team.</p>
                            <ul className="space-y-3">
                                {['Direct Venture Capital Access', 'Curated Mentor Matchmaking'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm font-bold" style={{ color: 'var(--theme-text-primary)' }}>
                                        <div style={{ width: '6px', height: '6px', background: 'var(--theme-accent)', borderRadius: '9999px', flexShrink: 0 }}></div>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="scroll-reveal transition-all duration-500 hover:-translate-y-2 p-8 md:p-10 rounded-[32px]" 
                            style={{ opacity: 0, background: 'var(--theme-bg-secondary)', border: '1px solid var(--theme-border)', borderBottomWidth: '4px' }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--theme-shadow-lg)'; e.currentTarget.style.borderBottomColor = 'var(--theme-accent)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderBottomColor = 'var(--theme-border)'; }}>
                            <div className="flex items-center justify-center mb-6 md:mb-8 transition-all duration-300 hover:scale-110 hover:rotate-6" style={{ width: '56px', height: '56px', background: 'var(--theme-accent-gradient)', borderRadius: '16px' }}>
                                <RiEyeLine style={{ fontSize: '24px', color: 'var(--theme-text-on-accent)' }} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold mb-3" style={{ fontFamily: "'Plus Jakarta Sans'", color: 'var(--theme-text-primary)' }}>For Investors</h3>
                            <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: 'var(--theme-text-secondary)' }}>Get exclusive access to pre-vetted, high-potential startups. Leverage our due-diligence framework to build a diverse venture portfolio.</p>
                            <ul className="space-y-3">
                                {['Investor portal access', 'Portfolio Management Tools'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm font-bold" style={{ color: 'var(--theme-text-primary)' }}>
                                        <div style={{ width: '6px', height: '6px', background: 'var(--theme-accent)', borderRadius: '9999px', flexShrink: 0 }}></div>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* NETWORK EFFECT */}
            <section className="px-6 lg:px-16 py-20 md:py-32 transition-all duration-300" style={{ background: 'var(--theme-bg-secondary)' }}>
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
                    <div className="scroll-reveal text-center lg:text-left" style={{ opacity: 0 }}>
                        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', fontStyle: 'italic', color: 'var(--theme-text-primary)' }}>The Network Effect</h2>
                        <p className="mt-6 max-w-md mx-auto lg:mx-0 text-sm md:text-base leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>StartupNest isn't just a platform; it's a compounding engine. As our community grows, the opportunities for collaboration and resource sharing increase exponentially.</p>
                        <div className="mt-10 flex flex-col items-center lg:items-start">
                            <div className="flex">
                                {[{ bg: 'var(--theme-accent)', l: 'A' }, { bg: '#3b82f6', l: 'R' }, { bg: '#10b981', l: 'K' }, { bg: '#8b5cf6', l: 'S' }, { bg: 'var(--theme-text-primary)', l: '+5' }].map((a, i) => (
                                    <div key={i} className="flex items-center justify-center text-[10px] md:text-xs font-black transition-transform duration-300 hover:scale-110 hover:z-10 w-9 md:w-10 h-9 md:h-10 rounded-full border-2" style={{ background: a.bg, color: 'var(--theme-bg-primary)', borderColor: 'var(--theme-bg-secondary)', marginLeft: i ? '-12px' : '0', zIndex: 5 - i }}>{a.l}</div>
                                ))}
                            </div>
                            <p className="mt-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>Joined this month by leading founders</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:gap-6 scroll-reveal" style={{ opacity: 0 }}>
                        {[{ v: '500+', l: 'Portfolio Companies', a: false }, { v: '45k+', l: 'Active Community', a: false }, { v: '$2.4B', l: 'Total Funding Raised', a: true }, { v: '12', l: 'Global Hubs', a: false }].map((s) => (
                            <div key={s.l} className="transition-all duration-300 hover:-translate-y-1 p-5 md:p-8 rounded-2xl border"
                                style={{ background: s.a ? 'var(--theme-accent-gradient)' : 'var(--theme-bg-card)', borderColor: s.a ? 'transparent' : 'var(--theme-border)', boxShadow: s.a ? '0 12px 32px var(--theme-accent-glow)' : 'none' }}>
                                <p className="text-2xl md:text-4xl font-black tracking-tight" style={{ color: s.a ? 'var(--theme-text-on-accent)' : 'var(--theme-text-primary)', fontFamily: "'Plus Jakarta Sans'" }}>{s.v}</p>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2" style={{ color: s.a ? 'rgba(255,255,255,0.7)' : 'var(--theme-text-muted)' }}>{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: 'var(--theme-footer-bg)', borderTop: '1px solid var(--theme-nav-border)' }} className="px-6 lg:px-16 py-16 md:py-20 transition-all duration-300">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="text-center md:text-left mx-auto md:mx-0">
                        <div className="flex items-center justify-center md:justify-start gap-2.5">
                            <div className="p-2 rounded-xl" style={{ background: 'var(--theme-accent-gradient)' }}><RiRocketLine className="text-white text-base" /></div>
                            <span className="text-xl font-black" style={{ fontFamily: "'Plus Jakarta Sans'", color: 'var(--theme-nav-text)' }}>Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span></span>
                        </div>
                        <p className="text-[10px] font-medium mt-5 uppercase tracking-widest leading-loose" style={{ color: 'var(--theme-footer-text)' }}>© 2026 StartupNest Ecosystem.<br className="md:hidden"/> Empowering the next wave of visionary founders.</p>
                    </div>
                    <div className="flex justify-center md:justify-start gap-16 lg:gap-24 w-full md:w-auto">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--theme-footer-text)' }}>Explore</p>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm font-bold transition-colors" style={{ color: 'var(--theme-text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text-secondary)'}>Platform</a></li>
                                <li><a href="#" className="text-sm font-bold transition-colors" style={{ color: 'var(--theme-text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text-secondary)'}>Ecosystem</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--theme-accent)' }}>Legal</p>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm font-bold transition-colors" style={{ color: 'var(--theme-text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text-secondary)'}>Privacy</a></li>
                                <li><a href="#" className="text-sm font-bold transition-colors" style={{ color: 'var(--theme-text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-text-secondary)'}>Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-auto">
                        <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-accent)'; e.currentTarget.style.color = 'var(--theme-text-on-accent)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--theme-accent-light)'; e.currentTarget.style.color = 'var(--theme-text-secondary)'; }}><RiShareLine /></a>
                        <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all" style={{ background: 'var(--theme-accent-light)', color: 'var(--theme-text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--theme-accent)'; e.currentTarget.style.color = 'var(--theme-text-on-accent)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--theme-accent-light)'; e.currentTarget.style.color = 'var(--theme-text-secondary)'; }}><RiGlobalLine /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
