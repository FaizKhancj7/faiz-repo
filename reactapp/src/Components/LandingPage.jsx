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
            <nav className="fixed top-0 w-full z-50 px-6 lg:px-16 py-4 flex justify-between items-center" style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="p-2 rounded-xl transition-all duration-300 group-hover:rotate-12" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                        <RiRocketLine className="text-white text-xl" />
                    </div>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '20px', color: '#fff', letterSpacing: '-0.02em' }}>
                        Startup<span style={{ color: '#ff7a21' }}>Nest</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/login')} className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300" style={{ color: '#bdc7de', border: '1px solid rgba(255,255,255,0.12)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#bdc7de'; }}>
                        Login
                    </button>
                    <button onClick={() => navigate('/signup')} className="text-sm font-bold text-white px-6 py-2.5 rounded-full transition-all duration-300" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', boxShadow: '0 4px 20px rgba(255,122,33,0.35)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,122,33,0.5)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,122,33,0.35)'; }}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-28 px-6 lg:px-16 overflow-hidden" style={{ paddingBottom: '120px', background: 'linear-gradient(180deg, #f7f9ff 0%, #e8effd 50%, #f7f9ff 100%)' }}>
                <div className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-20 blur-[100px]" style={{ background: '#ff7a21' }}></div>
                <div className="absolute bottom-10 -right-32 w-96 h-96 rounded-full opacity-15 blur-[100px]" style={{ background: '#3b82f6' }}></div>

                <div className="relative max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
                    <div className="pt-8 lg:pt-20">
                        <h1 className="animate-lift" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                            Where Big Ideas{' '}<span style={{ color: '#ff7a21', fontStyle: 'italic' }}>Take Flight.</span>
                        </h1>
                        <p className="animate-lift delay-100 mt-6 max-w-md" style={{ fontSize: '16px', lineHeight: 1.7, color: '#45474c' }}>
                            StartupNest bridges the gap between visionary entrepreneurs and experienced mentors, providing the capital, network, and expertise needed to scale rapidly.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-10 animate-lift delay-200">
                            <button onClick={() => navigate('/signup')} className="flex items-center gap-2 text-white text-sm font-bold uppercase active:scale-95 transition-all duration-300"
                                style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '0.1em', background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', padding: '14px 28px', borderRadius: '9999px', boxShadow: '0 6px 24px rgba(255,122,33,0.3)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(255,122,33,0.45)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,122,33,0.3)'; }}>
                                <span>Get Started Now</span><RiArrowRightLine className="text-lg" />
                            </button>
                            <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="text-sm font-bold uppercase active:scale-95 transition-all duration-300"
                                style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '0.1em', border: '2px solid #c5c6cd', color: '#0e1d2a', padding: '14px 28px', borderRadius: '9999px' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#0e1d2a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0e1d2a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0e1d2a'; e.currentTarget.style.borderColor = '#c5c6cd'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                Learn More
                            </button>
                        </div>
                    </div>

                    <div className="relative animate-lift delay-300">
                        <div className="transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(197,198,205,0.5)', boxShadow: '0 16px 48px rgba(14,29,42,0.1)' }}>
                            <img src="/hero-meeting.png" alt="Startup team" className="w-full object-cover" style={{ height: '340px' }} />
                        </div>
                        <div className="absolute flex items-center gap-4 transition-all duration-300 hover:scale-105" style={{ bottom: '-32px', left: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '16px 24px', boxShadow: '0 8px 32px rgba(14,29,42,0.1)' }}>
                            <div className="flex items-center justify-center" style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', borderRadius: '9999px' }}>
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: '10px', fontWeight: 700, color: '#75777d', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans'" }}>Growth Metrics</p>
                                <p style={{ fontSize: '24px', fontWeight: 800, color: '#0e1d2a', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans'" }}>+240%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DUAL-ROLE ECOSYSTEM */}
            <section style={{ padding: '120px 0', background: 'linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%)' }} className="px-6 lg:px-16">
                <div className="max-w-[1280px] mx-auto">
                    <div className="text-center mb-20 scroll-reveal" style={{ opacity: 0 }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#75777d', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans'" }}>Our Infrastructure</p>
                        <h2 className="mt-3" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>Dual-Role Ecosystem</h2>
                        <div className="mx-auto mt-5" style={{ width: '48px', height: '4px', background: 'linear-gradient(90deg, #ff7a21, #ff9a52)', borderRadius: '9999px' }}></div>
                    </div>
                    <div className="grid md:grid-cols-2 max-w-5xl mx-auto gap-6">
                        <div className="scroll-reveal transition-all duration-500 hover:-translate-y-2" style={{ opacity: 0, background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid #e5e7eb' }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,29,42,0.08)'; e.currentTarget.style.borderBottomColor = '#ff7a21'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderBottomColor = '#e5e7eb'; }}>
                            <div className="flex items-center justify-center mb-8 transition-all duration-300 hover:scale-110" style={{ width: '56px', height: '56px', background: '#e3efff', borderRadius: '16px' }}>
                                <RiShieldUserLine style={{ fontSize: '24px', color: '#0e1d2a' }} />
                            </div>
                            <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>For Founders</h3>
                            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#45474c', marginBottom: '28px' }}>Access pre-seed to Series A funding, world-class mentorship from exited founders, and a proprietary talent network to build your core team.</p>
                            <ul className="space-y-3">
                                {['Direct Venture Capital Access', 'Curated Mentor Matchmaking'].map((item) => (
                                    <li key={item} className="flex items-center gap-3" style={{ fontSize: '14px', fontWeight: 600, color: '#0e1d2a' }}>
                                        <div style={{ width: '6px', height: '6px', background: '#ff7a21', borderRadius: '9999px', flexShrink: 0 }}></div>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="scroll-reveal transition-all duration-500 hover:-translate-y-2" style={{ opacity: 0, background: 'linear-gradient(135deg, #0e1d2a 0%, #1a2d44 100%)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(125,134,154,0.3)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(14,29,42,0.2)'; e.currentTarget.style.borderBottomColor = '#ff7a21'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderBottomColor = 'rgba(125,134,154,0.3)'; }}>
                            <div className="flex items-center justify-center mb-8 transition-all duration-300 hover:scale-110 hover:rotate-6" style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', borderRadius: '16px' }}>
                                <RiEyeLine style={{ fontSize: '24px', color: '#fff' }} />
                            </div>
                            <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>For Investors</h3>
                            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#7a8499', marginBottom: '28px' }}>Get exclusive access to pre-vetted, high-potential startups. Leverage our due-diligence framework to build a diverse venture portfolio.</p>
                            <ul className="space-y-3">
                                {['Investor portal access', 'Portfolio Management Tools'].map((item) => (
                                    <li key={item} className="flex items-center gap-3" style={{ fontSize: '14px', fontWeight: 600, color: '#bdc7de' }}>
                                        <div style={{ width: '6px', height: '6px', background: '#ff7a21', borderRadius: '9999px', flexShrink: 0 }}></div>{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* NETWORK EFFECT */}
            <section style={{ padding: '120px 0', background: 'linear-gradient(180deg, #edf0f7 0%, #e3e8f2 50%, #edf0f7 100%)' }} className="px-6 lg:px-16">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
                    <div className="scroll-reveal" style={{ opacity: 0 }}>
                        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', fontStyle: 'italic' }}>The Network Effect</h2>
                        <p className="mt-6 max-w-md" style={{ fontSize: '14px', lineHeight: 1.7, color: '#45474c' }}>StartupNest isn't just a platform; it's a compounding engine. As our community grows, the opportunities for collaboration and resource sharing increase exponentially.</p>
                        <div className="mt-10">
                            <div className="flex">
                                {[{ bg: '#ff7a21', l: 'A' }, { bg: '#3b82f6', l: 'R' }, { bg: '#10b981', l: 'K' }, { bg: '#8b5cf6', l: 'S' }, { bg: '#121c2d', l: '+5' }].map((a, i) => (
                                    <div key={i} className="flex items-center justify-center text-white text-xs font-bold transition-transform duration-300 hover:scale-110 hover:z-10" style={{ width: '40px', height: '40px', borderRadius: '9999px', background: a.bg, border: '2.5px solid #edf0f7', marginLeft: i ? '-10px' : '0', zIndex: 5 - i, position: 'relative' }}>{a.l}</div>
                                ))}
                            </div>
                            <p className="mt-4" style={{ fontSize: '10px', fontWeight: 700, color: '#75777d', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans'" }}>Joined this month by leading founders</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 scroll-reveal" style={{ opacity: 0 }}>
                        {[{ v: '500+', l: 'Portfolio Companies', a: false }, { v: '45k+', l: 'Active Community', a: false }, { v: '$2.4B', l: 'Total Funding Raised', a: true }, { v: '12', l: 'Global Hubs', a: false }].map((s) => (
                            <div key={s.l} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                style={{ background: s.a ? 'linear-gradient(135deg, #ff7a21, #ff9a52)' : '#fff', padding: '28px', borderRadius: '16px', border: s.a ? 'none' : '1px solid #e5e7eb', boxShadow: s.a ? '0 8px 24px rgba(255,122,33,0.2)' : 'none' }}>
                                <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', color: s.a ? '#fff' : '#0e1d2a' }}>{s.v}</p>
                                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '8px', fontFamily: "'Plus Jakarta Sans'", color: s.a ? 'rgba(255,255,255,0.8)' : '#75777d' }}>{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: 'linear-gradient(180deg, #0e1d2a 0%, #0a1420 100%)', padding: '56px 0' }} className="px-6 lg:px-16">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}><RiRocketLine className="text-white text-sm" /></div>
                            <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: '18px', color: '#fff' }}>Startup<span style={{ color: '#ff7a21' }}>Nest</span></span>
                        </div>
                        <p style={{ fontSize: '10px', fontWeight: 500, color: '#75777d', marginTop: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>© 2026 StartupNest. Built for the non-growth ecosystem.</p>
                    </div>
                    <div className="flex gap-20">
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: 700, color: '#75777d', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans'", marginBottom: '16px' }}>Company</p>
                            <ul className="space-y-3">
                                <li><a href="#" className="transition-colors duration-300 hover:text-white" style={{ fontSize: '14px', color: '#bdc7de', fontWeight: 500 }}>Platform</a></li>
                                <li><a href="#" className="transition-colors duration-300 hover:text-white" style={{ fontSize: '14px', color: '#bdc7de', fontWeight: 500 }}>Resources</a></li>
                            </ul>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: 700, color: '#ff7a21', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans'", marginBottom: '16px' }}>Legal</p>
                            <ul className="space-y-3">
                                <li><a href="#" className="transition-colors duration-300 hover:text-white" style={{ fontSize: '14px', color: '#bdc7de', fontWeight: 500 }}>Privacy Policy</a></li>
                                <li><a href="#" className="transition-colors duration-300 hover:text-white" style={{ fontSize: '14px', color: '#bdc7de', fontWeight: 500 }}>Terms of Use</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="#" className="flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ width: '36px', height: '36px', borderRadius: '9999px', background: '#1e293b' }}><RiShareLine style={{ color: '#75777d', fontSize: '14px' }} /></a>
                        <a href="#" className="flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ width: '36px', height: '36px', borderRadius: '9999px', background: '#1e293b' }}><RiGlobalLine style={{ color: '#75777d', fontSize: '14px' }} /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
