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
            
            {/* Section 1: Hero Section (Occupies full height now that footer is global) */}
            <div 
                className="relative flex-grow w-full flex items-center justify-center bg-cover bg-center"
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
        </div>
    );
};

export default HomePage;