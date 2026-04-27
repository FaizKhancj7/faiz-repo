/**
 * EntrepreneurNavbar Component
 * This file is the navigation bar for the Entrepreneur role.
 * It includes a hover-based dropdown for opportunity browsing and submission tracking.
 * Strictly follows the UI requirements for a premium MERN application.
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiLogoutBoxLine, RiRocketLine, RiUser3Line, RiArrowDownSLine } from 'react-icons/ri';
import { logoutSuccess } from '../userSlice';
import api from '../apiConfig';

const EntrepreneurNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get the entrepreneur's name from Redux
    const { userName } = useSelector((state) => state.user);

    // Logout logic with confirmation
    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        
        if (confirmLogout) {
            try {
                await api.post('/user/logout');
            } catch (error) {
                console.log("Logout API failed, clearing local state.");
            } finally {
                dispatch(logoutSuccess());
                navigate('/login');
            }
        }
    };

    return (
        <nav className="bg-[#1E3A5F] text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
            {/* 1. LOGO SECTION */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <RiRocketLine className="text-[#F97316] text-3xl group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-2xl font-black tracking-tighter italic text-white">STARTUPNEST</span>
            </div>

            {/* 2. NAVIGATION LINKS */}
            <div className="hidden lg:flex items-center gap-10 font-bold text-sm tracking-wide">
                <Link to="/" className="hover:text-[#F97316] transition-colors uppercase">Home</Link>
                
                {/* OPPORTUNITIES DROPDOWN (Hover-based) */}
                <div className="relative group cursor-pointer py-2">
                    <div className="flex items-center gap-1 hover:text-[#F97316] transition-colors uppercase">
                        <span>Startup Ideas</span>
                        <RiArrowDownSLine className="text-lg group-hover:rotate-180 transition-transform duration-300" />
                    </div>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 border border-gray-100">
                        <div className="py-2">
                            <Link 
                                to="/mentor-opportunities" 
                                className="block px-6 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-50 last:border-0"
                            >
                                <span className="flex flex-col">
                                    <span className="font-bold">Browse Mentors</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Find funding & support</span>
                                </span>
                            </Link>
                            <Link 
                                to="/my-submissions" 
                                className="block px-6 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                                <span className="flex flex-col">
                                    <span className="font-bold">My Submissions</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Track your pitches</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. USER ACTIONS */}
            <div className="flex items-center gap-6">
                {/* Entrepreneur Badge */}
                <div className="hidden sm:flex items-center gap-2 bg-[#2D5282] px-4 py-2 rounded-xl text-xs font-black uppercase border border-white/5 tracking-wider">
                    <RiUser3Line className="text-orange-400" />
                    <span>{userName} <span className="text-white/40 mx-1">|</span> Entrepreneur</span>
                </div>

                {/* Logout Button */}
                <button 
                    onClick={handleLogout}
                    className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs font-black uppercase transition-all shadow-lg shadow-orange-900/20 active:scale-95"
                >
                    <RiLogoutBoxLine className="text-base" />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default EntrepreneurNavbar;
