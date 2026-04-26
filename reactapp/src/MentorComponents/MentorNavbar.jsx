// This file is the Navbar specifically for the Mentor role.
// It shows links that only mentors should see (like profile management) and handles logout.

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiLogoutBoxLine, RiRocketLine, RiUser3Line } from 'react-icons/ri';
import { logoutSuccess } from '../userSlice';
import api from '../apiConfig';

const MentorNavbar = () => {
    // Hooks for navigation, redux dispatch, and reading state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // We get the mentor's name from our Redux storage
    const { userName } = useSelector((state) => state.user);

    // This function handles the logout process
    const handleLogout = async () => {
        // Confirm with the user before logging them out
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        
        if (confirmLogout) {
            try {
                // Call the backend to clear the login cookie
                await api.post('/user/logout');
            } catch (error) {
                // If the API fails, we still clear the frontend
                console.log("Logout API failed, clearing local state.");
            } finally {
                // Clear the user data from Redux
                dispatch(logoutSuccess());
                
                // Go back to the login page
                navigate('/login');
            }
        }
    };

    return (
        <nav className="bg-[#1E3A5F] text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
            {/* Logo Section */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <RiRocketLine className="text-[#F97316] text-2xl" />
                <span className="text-xl font-black tracking-tight italic">STARTUPNEST</span>
            </div>

            {/* Navigation Links for Mentors */}
            <div className="hidden md:flex items-center gap-8 font-semibold">
                <Link to="/" className="hover:text-[#F97316] transition-colors">Home</Link>
                
                {/* A simple menu for Startup Profiles */}
                <Link to="/view-profiles" className="hover:text-[#F97316] transition-colors">Startup Profiles</Link>
                
                {/* Link to see entrepreneur submissions */}
                <Link to="/startup-submissions" className="hover:text-[#F97316] transition-colors">Startup Submissions</Link>
            </div>

            {/* User Info and Logout Section */}
            <div className="flex items-center gap-6">
                {/* User Badge for Mentor */}
                <div className="flex items-center gap-2 bg-[#2D5282] px-3 py-1.5 rounded-full text-xs font-bold uppercase border border-white/10">
                    <RiUser3Line />
                    <span>{userName} / Mentor</span>
                </div>

                {/* Logout Button */}
                <button 
                    onClick={handleLogout}
                    className="bg-[#F97316] hover:bg-[#EA6C0A] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                    <RiLogoutBoxLine />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default MentorNavbar;
