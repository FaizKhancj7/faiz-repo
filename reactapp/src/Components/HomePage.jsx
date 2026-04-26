// This file is the redesigned Landing Page of the application (HomePage).
// It features a full-screen hero with a background image and a contact section.

import React from 'react';
import { useSelector } from 'react-redux';
import MentorNavbar from '../MentorComponents/MentorNavbar';
import EntrepreneurNavbar from '../EntrepreneurComponents/EntrepreneurNavbar';

const HomePage = () => {
    // We check the Redux store to see what the user's role is to show the correct Navbar
    const { isAuthenticated, role } = useSelector((state) => state.user);

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Top: Role-based Navbar (Only shows if logged in) */}
            {isAuthenticated && (
                role === 'Mentor' ? <MentorNavbar /> : <EntrepreneurNavbar />
            )}

            {/* Section 1: Hero Section */}
            <div 
                className="relative h-[80vh] w-full flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('/startupnest.png')" }}
            >
                {/* Overlay to darken the background slightly so text is readable */}
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-4xl">
                    {/* The main title with a semi-transparent dark background */}
                    <div className="bg-black/60 px-10 py-4 rounded-xl mb-8">
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                            StartupNest
                        </h1>
                    </div>

                    {/* The welcome message inside a white semi-transparent card */}
                    <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl border border-white/20">
                        <p className="text-slate-800 text-lg md:text-xl font-medium leading-relaxed">
                            Welcome to StartupNest, your gateway to innovation and collaboration. 
                            Our platform connects aspiring entrepreneurs with experienced mentors 
                            ready to support and fund the next big idea. Whether you're crafting 
                            a pitch or evaluating submissions, StartupNest is where startup journeys begin.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 2: Contact Us Section */}
            <div className="flex-1 bg-gradient-to-br from-[#1E3A5F] via-[#1E3A5F] to-[#2D5282] py-20 px-6 flex flex-col items-center justify-center text-white text-center">
                <div className="max-w-2xl w-full">
                    {/* Section Title */}
                    <h2 className="text-4xl font-black mb-10 tracking-tight">Contact Us</h2>
                    
                    {/* Contact Details List */}
                    <div className="space-y-6 text-lg md:text-xl font-medium opacity-90">
                        <p>📞 Phone: +91 98765 43210</p>
                        <p>📧 Email: incubator@startupnest.com</p>
                        <p>📍 Address: 456 Innovation Road, Tech City, IN</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;