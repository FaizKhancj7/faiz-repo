import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RiLogoutBoxLine, RiRocketLine, RiUser3Line, RiArrowDownSLine } from 'react-icons/ri';
import { logoutSuccess } from '../../slices/userSlice';
import api from '../../apiConfig';
import ConfirmDialog from './ConfirmDialog';

const Navbar = ({ role, links }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    // Get the user's name from Redux
    const { userName } = useSelector((state) => state.user);

    // Logout logic (same for everyone)
    const handleConfirmLogout = async () => {
        setShowLogoutConfirm(false);
        try {
            await api.post('/user/logout');
        } catch (error) {
            console.log("Logout API failed, clearing local state.");
        } finally {
            dispatch(logoutSuccess());
            navigate('/');
        }
    };

    return (
        <nav className="bg-[#1E3A5F] text-white px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
            {/* 1. LOGO SECTION */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                <RiRocketLine className="text-[#F97316] text-3xl group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-2xl font-black tracking-tighter italic text-white uppercase">STARTUPNEST</span>
            </div>

            {/* 2. DYNAMIC NAVIGATION LINKS */}
            <div className="hidden lg:flex items-center gap-10 font-bold text-sm tracking-wide">
                {links.map((link, index) => (
                    <React.Fragment key={index}>
                        {link.subLinks ? (
                            /* DROPDOWN MENU */
                            <div className="relative group cursor-pointer py-2">
                                <div className="flex items-center gap-1 hover:text-[#F97316] transition-colors uppercase">
                                    <span>{link.label}</span>
                                    <RiArrowDownSLine className="text-lg group-hover:rotate-180 transition-transform duration-300" />
                                </div>

                                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 border border-gray-100">
                                    <div className="py-2">
                                        {link.subLinks.map((sub, subIndex) => (
                                            <Link 
                                                key={subIndex}
                                                to={sub.path} 
                                                className="block px-6 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <span className="flex flex-col">
                                                    <span className="font-bold">{sub.label}</span>
                                                    {sub.desc && <span className="text-[10px] text-gray-400 uppercase">{sub.desc}</span>}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* SIMPLE LINK */
                            <Link to={link.path} className="hover:text-[#F97316] transition-colors uppercase">
                                {link.label}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* 3. USER ACTIONS */}
            <div className="flex items-center gap-6 h-full">
                {/* User Badge */}
                <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-400 py-2">
                    <RiUser3Line className="text-sm" />
                    <span className="text-white">{userName} <span className="text-white/40 mx-1">|</span> {role}</span>
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

export default Navbar;
