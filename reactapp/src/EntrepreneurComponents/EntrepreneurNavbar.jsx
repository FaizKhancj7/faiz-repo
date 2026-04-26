// This file is the Navbar specifically for the Entrepreneur role.
// It shows links that only entrepreneurs should see and handles the logout process.

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiLogoutBoxLine, RiRocketLine, RiUser3Line } from 'react-icons/ri';
import { logoutSuccess } from '../userSlice';
import api from '../apiConfig';

const EntrepreneurNavbar = () => {
    // Hooks for navigation, redux, and getting user data
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // We get the user's name from our Redux storage
    const { userName } = useSelector((state) => state.user);

    // This function handles the logout logic
    const handleLogout = async () => {
        // We show a simple confirmation prompt before logging out
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        
        if (confirmLogout) {
            try {
                // We call the backend to clear the login cookie
                // Even if this fails, we will still clear the frontend state
                await api.post('/user/logout');
            } catch (error) {
                // We don't need to show an error here because we are logging out anyway
                console.log("Logout API failed, but clearing frontend state.");
            } finally {
                // We clear the user data from our Redux store
                dispatch(logoutSuccess());
                
                // We send the user back to the login page
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

            {/* Navigation Links for Entrepreneurs */}
            <div className="hidden md:flex items-center gap-8 font-semibold">
                <Link to="/" className="hover:text-[#F97316] transition-colors">Home</Link>
                <Link to="/mentor-opportunities" className="hover:text-[#F97316] transition-colors">Mentor Opportunities</Link>
                <Link to="/my-submissions" className="hover:text-[#F97316] transition-colors">My Submissions</Link>
            </div>

            {/* User Profile and Logout Section */}
            <div className="flex items-center gap-6">
                {/* User Badge showing the name and role */}
                <div className="flex items-center gap-2 bg-[#2D5282] px-3 py-1.5 rounded-full text-xs font-bold uppercase border border-white/10">
                    <RiUser3Line />
                    <span>{userName} / Entrepreneur</span>
                </div>

                {/* Logout Button with Accent Color */}
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

export default EntrepreneurNavbar;
