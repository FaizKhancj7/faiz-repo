import React from 'react';
import { RiMailLine, RiPhoneLine, RiMapPinLine } from 'react-icons/ri';

const Footer = () => {
    return (
        <footer className="bg-[#0e1d2a] py-6 px-8 border-t border-white/5 font-inter">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Branding & Rights */}
                <div className="flex items-center gap-4">
                    <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: '16px', color: '#fff', letterSpacing: '-0.02em' }}>
                        Startup<span style={{ color: '#ff7a21' }}>Nest</span>
                    </span>
                    <span className="h-4 w-[1px] bg-white/10 hidden md:block"></span>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                        © 2026 Ecosystem. All Rights Reserved.
                    </p>
                </div>

                {/* Subtle Contact Info (Mini Version) */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 group cursor-default">
                        <RiPhoneLine className="text-white/20 group-hover:text-[#ff7a21] transition-colors text-sm" />
                        <span className="text-[10px] font-bold text-white/40 tracking-tight">+91 98765 43210</span>
                    </div>

                    <div className="flex items-center gap-2 group cursor-default">
                        <RiMailLine className="text-white/20 group-hover:text-[#ff7a21] transition-colors text-sm" />
                        <span className="text-[10px] font-bold text-white/40 tracking-tight italic">incubator@startupnest.com</span>
                    </div>

                    <div className="flex items-center gap-2 group cursor-default">
                        <RiMapPinLine className="text-white/20 group-hover:text-[#ff7a21] transition-colors text-sm" />
                        <span className="text-[10px] font-bold text-white/40 tracking-tight">Tech City Hub</span>
                    </div>
                </div>

                {/* Extra Links (Ultra Subtle) */}
                <div className="flex gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
