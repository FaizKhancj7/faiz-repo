/**
 * Navbar.jsx — Theme-Aware Navigation Bar
 * 
 * Features:
 * - Dynamic colors driven by CSS custom properties (var(--theme-*))
 * - Theme toggle button that switches between Light and Dark modes
 * - Active scale-95 on all interactive elements for tactile feedback
 * - Mobile responsive with slide-down menu
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiLogoutBoxLine, RiRocketLine, RiArrowDownSLine, RiPaletteLine } from 'react-icons/ri';
import { logoutSuccess } from '../../store/userSlice';
import api from '../../config/apiConfig';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ role, links }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    const { userName } = useSelector((state) => state.user);
    const { cycleTheme, themeName, themeIcon } = useTheme();

    const handleConfirmLogout = async () => {
        setShowLogoutConfirm(false);
        try {
            await api.post('/user/logout');
        } catch (error) {
            console.log("Logout API failed, clearing local state.");
        } finally {
            dispatch(logoutSuccess());
            navigate('/');
        }
    };

    return (
        <>
            <nav 
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 transition-all duration-300"
                style={{ 
                    background: 'var(--theme-nav-bg)', 
                    backdropFilter: 'var(--theme-glass, blur(12px))',
                    borderBottom: '1px solid var(--theme-nav-border)',
                    fontFamily: "'Inter', sans-serif" 
                }}
            >
                
                {/* 1. LOGO SECTION (Left) */}
                <div className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0" onClick={() => { setIsMenuOpen(false); navigate('/'); }}>
                    <div className="p-2 rounded-xl transition-all duration-300 group-hover:rotate-12 active:scale-95" style={{ background: 'var(--theme-accent-gradient)' }}>
                        <RiRocketLine className="text-white text-lg" />
                    </div>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: 'var(--theme-nav-text)', letterSpacing: '-0.02em' }}>
                        Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                    </span>
                </div>

                {/* 2. NAVIGATION & USER ACTIONS */}
                <div className="flex items-center gap-4 lg:gap-8">
                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-8 font-bold text-sm tracking-wider uppercase">
                        {links.map((link, index) => (
                            <React.Fragment key={index}>
                                {link.subLinks ? (
                                    <div className="relative group cursor-pointer py-2">
                                        <div className="flex items-center gap-1.5 transition-all duration-300" style={{ color: 'var(--theme-nav-text-muted)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-nav-text-muted)'}
                                        >
                                            <span>{link.label}</span>
                                            <RiArrowDownSLine className="text-lg group-hover:rotate-180 transition-transform duration-300" />
                                        </div>
                                        <div 
                                            className="absolute top-full right-0 mt-2 w-64 overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top scale-95 group-hover:scale-100"
                                            style={{ 
                                                background: 'var(--theme-nav-dropdown)', 
                                                borderRadius: 'var(--theme-radius-lg)',
                                                border: '1px solid var(--theme-nav-border)',
                                                boxShadow: 'var(--theme-shadow-lg)'
                                            }}
                                        >
                                            <div className="py-2">
                                                {link.subLinks.map((sub, subIndex) => (
                                                    <Link 
                                                        key={subIndex}
                                                        to={sub.path} 
                                                        className="block px-6 py-4 transition-all active:scale-95"
                                                        style={{ color: 'var(--theme-nav-text-muted)', borderBottom: '1px solid var(--theme-nav-border)' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-accent)'; e.currentTarget.style.background = 'var(--theme-accent-light)'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-nav-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                                                    >
                                                        <span className="flex flex-col">
                                                            <span className="font-bold text-base">{sub.label}</span>
                                                            {sub.desc && <span className="text-xs font-medium tracking-normal mt-0.5" style={{ opacity: 0.4 }}>{sub.desc}</span>}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link 
                                        to={link.path} 
                                        className="transition-all duration-300"
                                        style={{ color: 'var(--theme-nav-text-muted)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-nav-text-muted)'}
                                    >
                                        {link.label}
                                    </Link>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="hidden lg:block h-5 w-[1px] mx-2" style={{ background: 'var(--theme-nav-border)' }}></div>

                    {/* User Info & Actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* User Name & Role */}
                        <div className="hidden sm:flex flex-col items-end gap-0.5 leading-none px-2">
                            <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--theme-nav-text)' }}>{userName}</span>
                            <span className="text-sm font-black uppercase tracking-[0.1em]" style={{ color: 'var(--theme-accent)' }}>{role}</span>
                        </div>

                        {/* Theme Toggle Button */}
                        <button 
                            onClick={cycleTheme}
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


                        {/* Logout Button */}
                        <button 
                            onClick={() => setShowLogoutConfirm(true)}
                            className="group flex items-center justify-center p-2 transition-all duration-300 active:scale-95"
                            style={{ borderRadius: 'var(--theme-radius)', border: '1px solid var(--theme-nav-border)' }}
                            title="Logout"
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--theme-accent-light)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <RiLogoutBoxLine className="text-lg transition-colors" style={{ color: 'var(--theme-text-muted)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-accent)'}
                            />
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 active:scale-95 transition-all"
                            style={{ 
                                borderRadius: 'var(--theme-radius)', 
                                background: 'var(--theme-accent-light)', 
                                border: '1px solid var(--theme-nav-border)',
                                color: 'var(--theme-nav-text)' 
                            }}
                        >
                            {isMenuOpen ? <RiArrowDownSLine className="rotate-180 transition-transform" /> : <RiArrowDownSLine className="transition-transform" />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU (Absolute overlay) */}
                {isMenuOpen && (
                    <div 
                        className="lg:hidden absolute top-full left-0 right-0 shadow-2xl animate-slide-down overflow-hidden"
                        style={{ 
                            background: 'var(--theme-nav-dropdown)', 
                            borderBottom: '1px solid var(--theme-nav-border)' 
                        }}
                    >
                        <div className="px-6 py-8 space-y-6">
                            {links.map((link, idx) => (
                                <div key={idx} className="space-y-4">
                                    <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-accent)' }}>{link.label}</p>
                                    {link.subLinks ? (
                                        <div className="grid grid-cols-1 gap-3 pl-2">
                                            {link.subLinks.map((sub, sIdx) => (
                                                <Link 
                                                    key={sIdx} 
                                                    to={sub.path} 
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex flex-col p-4 active:scale-95 transition-all"
                                                    style={{ 
                                                        background: 'var(--theme-accent-light)', 
                                                        borderRadius: 'var(--theme-radius-lg)',
                                                        border: '1px solid var(--theme-nav-border)' 
                                                    }}
                                                >
                                                    <span className="font-bold text-base" style={{ color: 'var(--theme-nav-text)' }}>{sub.label}</span>
                                                    {sub.desc && <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>{sub.desc}</span>}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <Link 
                                            to={link.path} 
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block p-4 font-bold text-base active:scale-95 transition-all"
                                            style={{ 
                                                background: 'var(--theme-accent-light)', 
                                                borderRadius: 'var(--theme-radius-lg)',
                                                border: '1px solid var(--theme-nav-border)',
                                                color: 'var(--theme-nav-text)' 
                                            }}
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            {/* Mobile Theme Toggle */}
                            <div className="pt-4" style={{ borderTop: '1px solid var(--theme-nav-border)' }}>
                                <button 
                                    onClick={cycleTheme}
                                    className="w-full flex items-center justify-center gap-2 p-4 active:scale-95 transition-all"
                                    style={{ 
                                        background: 'var(--theme-accent-light)', 
                                        borderRadius: 'var(--theme-radius-lg)',
                                        border: '1px solid var(--theme-nav-border)' 
                                    }}
                                >
                                    <span className="text-lg">{themeIcon}</span>
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-accent)' }}>Switch Theme: {themeName}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Logout Confirmation */}
            <ConfirmDialog 
                isOpen={showLogoutConfirm}
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={handleConfirmLogout}
                title="Logout Confirmation"
                message="Ready to head out? You will need to login again to access your dashboard."
                confirmText="Logout"
                danger={true}
            />
        </>
    );
};

export default Navbar;
