/**
 * Footer.jsx — Theme-Aware Footer
 * 
 * Uses CSS custom properties for all colors, ensuring it adapts
 * seamlessly when the user toggles between Light and Dark themes.
 */

import React from 'react';
import { RiMailLine, RiPhoneLine, RiMapPinLine } from 'react-icons/ri';

const Footer = () => {
    return (
        <footer 
            className="py-6 px-8 font-inter transition-all duration-300"
            style={{ 
                background: 'var(--theme-footer-bg)', 
                borderTop: '1px solid var(--theme-nav-border)' 
            }}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Branding & Rights */}
                <div className="flex items-center gap-4">
                    <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: '16px', color: 'var(--theme-nav-text)', letterSpacing: '-0.02em' }}>
                        Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                    </span>
                    <span className="h-4 w-[1px] hidden md:block" style={{ background: 'var(--theme-nav-border)' }}></span>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--theme-footer-text)' }}>
                        © 2026 Ecosystem. All Rights Reserved.
                    </p>
                </div>

                {/* Subtle Contact Info */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 group cursor-default">
                        <RiPhoneLine className="text-sm transition-colors" style={{ color: 'var(--theme-footer-text)' }} />
                        <span className="text-[10px] font-bold tracking-tight" style={{ color: 'var(--theme-footer-text)' }}>+91 98765 43210</span>
                    </div>

                    <div className="flex items-center gap-2 group cursor-default">
                        <RiMailLine className="text-sm transition-colors" style={{ color: 'var(--theme-footer-text)' }} />
                        <span className="text-[10px] font-bold tracking-tight italic" style={{ color: 'var(--theme-footer-text)' }}>incubator@startupnest.com</span>
                    </div>

                    <div className="flex items-center gap-2 group cursor-default">
                        <RiMapPinLine className="text-sm transition-colors" style={{ color: 'var(--theme-footer-text)' }} />
                        <span className="text-[10px] font-bold tracking-tight" style={{ color: 'var(--theme-footer-text)' }}>Tech City Hub</span>
                    </div>
                </div>

                {/* Extra Links */}
                <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-footer-text)' }}>
                    <button className="transition-colors hover:opacity-80" style={{ color: 'var(--theme-footer-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-footer-text-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-footer-text)'}
                    >Privacy</button>
                    <button className="transition-colors hover:opacity-80" style={{ color: 'var(--theme-footer-text)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--theme-footer-text-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-footer-text)'}
                    >Terms</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
