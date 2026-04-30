import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine, RiShieldUserLine, RiEyeLine, RiShareLine, RiGlobalLine, RiRocketLine } from 'react-icons/ri';

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

    return (
        <div ref={sectionRef} className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif", color: '#0e1d2a' }}>

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-10 lg:px-16 py-4 flex justify-between items-center transition-all" style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="p-1.5 md:p-2 rounded-xl transition-all duration-300 group-hover:rotate-12" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                        <RiRocketLine className="text-white text-lg md:text-xl" />
                    </div>
                    <span className="text-lg md:text-[20px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                        Startup<span style={{ color: '#ff7a21' }}>Nest</span>
                    </span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={() => navigate('/login')} className="text-xs md:text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300" style={{ color: '#bdc7de', border: '1px solid rgba(255,255,255,0.12)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#bdc7de'; }}>
                        Login
                    </button>
                    <button onClick={() => navigate('/signup')} className="text-xs md:text-sm font-bold text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-300 hidden sm:block" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', boxShadow: '0 4px 20px rgba(255,122,33,0.35)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,122,33,0.5)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,122,33,0.35)'; }}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-24 md:pt-32 px-6 lg:px-16 overflow-hidden pb-20 md:pb-32" style={{ background: 'linear-gradient(180deg, #f7f9ff 0%, #e8effd 50%, #f7f9ff 100%)' }}>
                <div className="absolute top-20 -left-32 w-64 md:w-96 h-64 md:h-96 rounded-full opacity-20 blur-[80px] md:blur-[100px]" style={{ background: '#ff7a21' }}></div>
                <div className="absolute bottom-10 -right-32 w-64 md:w-96 h-64 md:h-96 rounded-full opacity-15 blur-[80px] md:blur-[100px]" style={{ background: '#3b82f6' }}></div>

                <div className="relative max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 md:gap-16">
                    <div className="pt-4 lg:pt-20 text-center lg:text-left">
                        <h1 className="animate-lift" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                            Where Big Ideas{' '}<span style={{ color: '#ff7a21', fontStyle: 'italic' }}>Take Flight.</span>
                        </h1>
                        <p className="animate-lift delay-100 mt-6 max-w-md mx-auto lg:mx-0 text-sm md:text-base" style={{ lineHeight: 1.7, color: '#45474c' }}>
                            StartupNest bridges the gap between visionary entrepreneurs and experienced mentors, providing the capital, network, and expertise needed to scale rapidly.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 mt-10 animate-lift delay-200">
                            <button onClick={() => navigate('/signup')} className="flex items-center gap-2 text-white text-xs md:text-sm font-bold uppercase active:scale-95 transition-all duration-300 px-6 md:px-8 py-3 md:py-3.5 rounded-full"
                                style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '0.1em', background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', boxShadow: '0 6px 24px rgba(255,122,33,0.3)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(255,122,33,0.45)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,122,33,0.3)'; }}>
                                <span>Get Started Now</span><RiArrowRightLine className="text-lg" />
                            </button>
                            <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="text-xs md:text-sm font-bold uppercase active:scale-95 transition-all duration-300 px-6 md:px-8 py-3 md:py-3.5 rounded-full"
                                style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '0.1em', border: '2px solid #c5c6cd', color: '#0e1d2a' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#0e1d2a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0e1d2a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0e1d2a'; e.currentTarget.style.borderColor = '#c5c6cd'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                Learn More
                            </button>
                        </div>
                    </div>

                    <div className="relative animate-lift delay-300 px-4 md:px-0">
                        <div className="transition-all duration-500 hover:scale-[1.02]" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,122,33,0.2)', boxShadow: '0 20px 50px rgba(255,122,33,0.25)' }}>
                            <img src="/4a245c3a98c6c7d1d44b7259595ab8ce.jpg" alt="Startup team" className="w-full object-cover h-[300px] md:h-[420px]" />
                        </div>
                        <div className="absolute flex items-center gap-3 md:gap-4 transition-all duration-300 hover:scale-105 bottom-[-20px] md:bottom-[-32px] left-[10px] md:left-[24px] bg-white rounded-2xl border border-slate-200 p-3 md:p-4 shadow-xl shadow-slate-900/10">
                            <div className="flex items-center justify-center shrink-0 w-9 md:w-11 h-9 md:h-11 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Growth Metrics</p>
                                <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-sans">+240%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DUAL-ROLE ECOSYSTEM */}
            <section className="px-6 lg:px-16 py-20 md:py-32" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%)' }}>
                <div className="max-w-[1280px] mx-auto">
                    <div className="text-center mb-12 md:mb-20 scroll-reveal" style={{ opacity: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#75777d', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans'" }}>Our Infrastructure</p>
                        <h2 className="mt-3" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Dual-Role Ecosystem</h2>
                        <div className="mx-auto mt-5" style={{ width: '48px', height: '4px', background: 'linear-gradient(90deg, #ff7a21, #ff9a52)', borderRadius: '9999px' }}></div>
                    </div>
                    <div className="grid md:grid-cols-2 max-w-5xl mx-auto gap-6 lg:gap-10">
                        <div className="scroll-reveal transition-all duration-500 hover:-translate-y-2 bg-white p-8 md:p-10 rounded-[32px] border border-slate-100" style={{ opacity: 0 }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,29,42,0.08)'; e.currentTarget.style.borderBottomColor = '#ff7a21'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderBottomColor = '#f1f5f9'; }}>
                            <div className="flex items-center justify-center mb-6 md:mb-8 transition-all duration-300 hover:scale-110" style={{ width: '56px', height: '56px', background: '#e3efff', borderRadius: '16px' }}>
                                <RiShieldUserLine style={{ fontSize: '24px', color: '#0e1d2a' }} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold mb-3" style={{ fontFamily: "'Plus Jakarta Sans'" }}>For Founders</h3>
                            <p className="text-sm md:text-base leading-relaxed text-slate-500 mb-8">Access pre-seed to Series A funding, world-class mentorship from exited founders, and a proprietary talent network to build your core team.</p>
                            <ul className="space-y-3">
                                {['Direct Venture Capital Access', 'Curated Mentor Matchmaking'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-900">
                                        <div style={{ width: '6px', height: '6px', background: '#ff7a21', borderRadius: '9999px', flexShrink: 0 }}></div>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="scroll-reveal transition-all duration-500 hover:-translate-y-2 p-8 md:p-10 rounded-[32px] border border-slate-800" style={{ opacity: 0, background: 'linear-gradient(135deg, #0e1d2a 0%, #1a2d44 100%)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,29,42,0.2)'; e.currentTarget.style.borderBottomColor = '#ff7a21'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderBottomColor = '#1e293b'; }}>
                            <div className="flex items-center justify-center mb-6 md:mb-8 transition-all duration-300 hover:scale-110 hover:rotate-6" style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', borderRadius: '16px' }}>
                                <RiEyeLine style={{ fontSize: '24px', color: '#fff' }} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-extrabold mb-3 text-white" style={{ fontFamily: "'Plus Jakarta Sans'" }}>For Investors</h3>
                            <p className="text-sm md:text-base leading-relaxed text-slate-400 mb-8">Get exclusive access to pre-vetted, high-potential startups. Leverage our due-diligence framework to build a diverse venture portfolio.</p>
                            <ul className="space-y-3">
                                {['Investor portal access', 'Portfolio Management Tools'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                                        <div style={{ width: '6px', height: '6px', background: '#ff7a21', borderRadius: '9999px', flexShrink: 0 }}></div>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* NETWORK EFFECT */}
            <section className="px-6 lg:px-16 py-20 md:py-32" style={{ background: 'linear-gradient(180deg, #edf0f7 0%, #e3e8f2 50%, #edf0f7 100%)' }}>
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
                    <div className="scroll-reveal text-center lg:text-left" style={{ opacity: 0 }}>
                        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', fontStyle: 'italic' }}>The Network Effect</h2>
                        <p className="mt-6 max-w-md mx-auto lg:mx-0 text-sm md:text-base leading-relaxed text-slate-600">StartupNest isn't just a platform; it's a compounding engine. As our community grows, the opportunities for collaboration and resource sharing increase exponentially.</p>
                        <div className="mt-10 flex flex-col items-center lg:items-start">
                            <div className="flex">
                                {[{ bg: '#ff7a21', l: 'A' }, { bg: '#3b82f6', l: 'R' }, { bg: '#10b981', l: 'K' }, { bg: '#8b5cf6', l: 'S' }, { bg: '#121c2d', l: '+5' }].map((a, i) => (
                                    <div key={i} className="flex items-center justify-center text-white text-[10px] md:text-xs font-black transition-transform duration-300 hover:scale-110 hover:z-10 w-9 md:w-10 h-9 md:h-10 rounded-full border-2 border-slate-100 relative" style={{ background: a.bg, marginLeft: i ? '-12px' : '0', zIndex: 5 - i }}>{a.l}</div>
                                ))}
                            </div>
                            <p className="mt-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined this month by leading founders</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:gap-6 scroll-reveal" style={{ opacity: 0 }}>
                        {[{ v: '500+', l: 'Portfolio Companies', a: false }, { v: '45k+', l: 'Active Community', a: false }, { v: '$2.4B', l: 'Total Funding Raised', a: true }, { v: '12', l: 'Global Hubs', a: false }].map((s) => (
                            <div key={s.l} className="transition-all duration-300 hover:-translate-y-1 p-5 md:p-8 rounded-2xl border"
                                style={{ background: s.a ? 'linear-gradient(135deg, #ff7a21, #ff9a52)' : '#fff', borderColor: s.a ? 'transparent' : '#f1f5f9', boxShadow: s.a ? '0 12px 32px rgba(255,122,33,0.2)' : 'none' }}>
                                <p className="text-2xl md:text-4xl font-black tracking-tight" style={{ color: s.a ? '#fff' : '#0e1d2a', fontFamily: "'Plus Jakarta Sans'" }}>{s.v}</p>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-2" style={{ color: s.a ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: 'linear-gradient(180deg, #0e1d2a 0%, #0a1420 100%)' }} className="px-6 lg:px-16 py-16 md:py-20">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="text-center md:text-left mx-auto md:mx-0">
                        <div className="flex items-center justify-center md:justify-start gap-2.5">
                            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}><RiRocketLine className="text-white text-base" /></div>
                            <span className="text-xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans'" }}>Startup<span style={{ color: '#ff7a21' }}>Nest</span></span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 mt-5 uppercase tracking-widest leading-loose">© 2026 StartupNest Ecosystem.<br className="md:hidden"/> Empowering the next wave of visionary founders.</p>
                    </div>
                    <div className="flex justify-center md:justify-start gap-16 lg:gap-24 w-full md:w-auto">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Explore</p>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Platform</a></li>
                                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Ecosystem</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#ff7a21] uppercase tracking-widest mb-6">Legal</p>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Privacy</a></li>
                                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-auto">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#ff7a21] transition-all"><RiShareLine /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#ff7a21] transition-all"><RiGlobalLine /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
