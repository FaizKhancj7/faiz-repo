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
            className="py-6 px-8 transition-all duration-300"
            style={{ 
                background: 'var(--theme-bg-card)', 
                borderTop: '1px solid var(--theme-border)',
                backdropFilter: 'var(--theme-glass)'
            }}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Branding & Rights */}
                <div className="flex items-center gap-4">
                    <span className="text-lg font-black tracking-tighter" style={{ color: 'var(--theme-text-primary)' }}>
                        Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                    </span>
                    <span className="h-4 w-[1px] hidden md:block" style={{ background: 'var(--theme-border)' }}></span>
                    <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--theme-footer-text)' }}>
                        © 2026 Ecosystem. All Rights Reserved.
                    </p>
                </div>

                {/* Subtle Contact Info */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 group cursor-default">
                        <RiPhoneLine className="text-base transition-colors" style={{ color: 'var(--theme-footer-text)' }} />
                        <span className="text-xs font-bold tracking-tight" style={{ color: 'var(--theme-footer-text)' }}>+91 98765 43210</span>
                    </div>

                    <div className="flex items-center gap-2 group cursor-default">
                        <RiMailLine className="text-base transition-colors" style={{ color: 'var(--theme-footer-text)' }} />
                        <span className="text-xs font-bold tracking-tight italic" style={{ color: 'var(--theme-footer-text)' }}>incubator@startupnest.com</span>
                    </div>

                    <div className="flex items-center gap-2 group cursor-default">
                        <RiMapPinLine className="text-base transition-colors" style={{ color: 'var(--theme-footer-text)' }} />
                        <span className="text-xs font-bold tracking-tight" style={{ color: 'var(--theme-footer-text)' }}>Solar Hub</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
