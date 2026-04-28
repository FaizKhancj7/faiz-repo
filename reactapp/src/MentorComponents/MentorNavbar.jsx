/**
 * MentorNavbar Component
 * This file is the navigation bar for the Mentor role.
 * It includes a hover-based dropdown for profile management and handles the logout process.
 * Strictly follows the UI requirements for a premium, clean experience.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiLogoutBoxLine, RiRocketLine, RiUser3Line, RiArrowDownSLine } from 'react-icons/ri';
import { logoutSuccess } from '../userSlice';
import api from '../apiConfig';
import ConfirmDialog from '../Components/Reusable/ConfirmDialog';

const MentorNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    // Get the mentor's name from Redux
    const { userName } = useSelector((state) => state.user);

    // Logout logic
    const handleConfirmLogout = async () => {
        setShowLogoutConfirm(false);
        try {
            await api.post('/user/logout');
        } catch (error) {
            console.log("Logout API failed, clearing local state.");
        } finally {
            dispatch(logoutSuccess());
            // Redirect to landing page as per request
            navigate('/');
        }
    };

    return (
        <nav className="bg-[#1E3A5F] text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
            {/* 1. LOGO SECTION */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <RiRocketLine className="text-[#F97316] text-3xl group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-2xl font-black tracking-tighter italic">STARTUPNEST</span>
            </div>

            {/* 2. NAVIGATION LINKS */}
            <div className="hidden lg:flex items-center gap-10 font-bold text-sm tracking-wide">
                <Link to="/" className="hover:text-[#F97316] transition-colors uppercase">Home</Link>
                
                {/* STARTUP PROFILES DROPDOWN (Hover-based using Tailwind) */}
                <div className="relative group cursor-pointer py-2">
                    <div className="flex items-center gap-1 hover:text-[#F97316] transition-colors uppercase">
                        <span>Startup Profiles</span>
                        <RiArrowDownSLine className="text-lg group-hover:rotate-180 transition-transform duration-300" />
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 border border-gray-100">
                        <div className="py-2">
                            <Link 
                                to="/mentor/create-profile" 
                                className="block px-6 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-50 last:border-0"
                            >
                                <span className="flex flex-col">
                                    <span className="font-bold">Add Profile</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Create new opportunity</span>
                                </span>
                            </Link>
                            <Link 
                                to="/view-profiles" 
                                className="block px-6 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                                <span className="flex flex-col">
                                    <span className="font-bold">View Profiles</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Manage your listings</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                
                <Link to="/startup-submissions" className="hover:text-[#F97316] transition-colors uppercase">Startup Submissions</Link>
            </div>

            {/* 3. USER ACTIONS */}
            <div className="flex items-center gap-6 h-full">
                {/* Mentor Badge - Plain text as requested */}
                <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-400 py-2">
                    <RiUser3Line className="text-sm" />
                    <span className="text-white">{userName} <span className="text-white/40 mx-1">|</span> Mentor</span>
                </div>

                {/* Logout Button */}
                <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase transition-all shadow-lg shadow-orange-900/20 active:scale-95 border border-transparent"
                >
                    <RiLogoutBoxLine className="text-base" />
                    <span>Logout</span>
                </button>
            </div>

            {/* Logout Confirmation */}
            <ConfirmDialog 
                isOpen={showLogoutConfirm}
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={handleConfirmLogout}
                title="Logout Confirmation"
                message="Are you sure you want to logout? You will need to login again to access your dashboard."
                confirmText="Logout"
                danger={true}
            />
        </nav>
    );
};

export default MentorNavbar;
