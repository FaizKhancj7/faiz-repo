/**
 * HomePage Component
 * This is the landing page for all authenticated users.
 * It features a full-screen hero with a background image and a contact section.
 * Note: The navbar is handled at the App.jsx layout level.
 */

import React from 'react';

const HomePage = () => {
    return (
        <div className="h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col bg-[#1E3A5F]">
            
            {/* Section 1: Hero Section (Occupies 60% of vertical space) */}
            <div 
                className="relative h-[60%] w-full flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('/startupnest.png')" }}
            >
                {/* Darkened overlay for readability */}
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-4xl">
                    <div className="mb-6">
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                            StartupNest
                        </h1>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20">
                        <p className="text-white text-base md:text-xl font-medium leading-relaxed">
                            Welcome to StartupNest, your gateway to innovation. 
                            Our platform connects aspiring entrepreneurs with experienced mentors 
                            ready to support and fund the next big idea.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 2: Contact Us Section (Occupies remaining 40% of vertical space) */}
            <div className="h-[40%] bg-gradient-to-br from-[#1E3A5F] via-[#1E3A5F] to-[#2D5282] p-8 flex flex-col items-center justify-center text-white text-center border-t border-white/10">
                <div className="max-w-5xl w-full">
                    {/* Section Title */}
                    <h2 className="text-2xl font-black mb-8 tracking-tighter text-orange-400 uppercase italic">Get In Touch</h2>
                    
                    {/* Contact Details Grid - Responsive for desktop/mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                            <span className="text-3xl mb-3">📞</span>
                            <span className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Phone</span>
                            <span className="text-lg font-black">+91 98765 43210</span>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                            <span className="text-3xl mb-3">📧</span>
                            <span className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Email</span>
                            <span className="text-lg font-black italic">incubator@startupnest.com</span>
                        </div>
                        
                        <div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
                            <span className="text-3xl mb-3">📍</span>
                            <span className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Location</span>
                            <span className="text-base font-black leading-tight">456 Innovation Road, Tech City</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;