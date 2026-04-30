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

    // Logout logic
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
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md transition-all duration-300 border-b border-white/5"
            style={{ background: 'rgba(14, 29, 42, 0.85)', fontFamily: "'Inter', sans-serif" }}>
            
            {/* 1. LOGO SECTION (Left) */}
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="p-2 rounded-xl transition-all duration-300 group-hover:rotate-12" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                    <RiRocketLine className="text-white text-lg" />
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: '#fff', letterSpacing: '-0.02em' }}>
                    Startup<span style={{ color: '#ff7a21' }}>Nest</span>
                </span>
            </div>

            {/* 2. NAVIGATION & USER ACTIONS (Right Side Only) */}
            <div className="flex items-center gap-8">
                {/* Dynamic Links */}
                <div className="hidden lg:flex items-center gap-8 font-bold text-xs tracking-wider uppercase">
                    {links.map((link, index) => (
                        <React.Fragment key={index}>
                            {link.subLinks ? (
                                <div className="relative group cursor-pointer py-2">
                                    <div className="flex items-center gap-1.5 text-white/70 hover:text-[#ff7a21] transition-all duration-300">
                                        <span>{link.label}</span>
                                        <RiArrowDownSLine className="text-lg group-hover:rotate-180 transition-transform duration-300" />
                                    </div>
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#0e1d2a] rounded-2xl shadow-2xl overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 border border-white/5">
                                        <div className="py-2">
                                            {link.subLinks.map((sub, subIndex) => (
                                                <Link 
                                                    key={subIndex}
                                                    to={sub.path} 
                                                    className="block px-6 py-4 text-white/60 hover:bg-white/5 hover:text-[#ff7a21] transition-all border-b border-white/5 last:border-0"
                                                >
                                                    <span className="flex flex-col">
                                                        <span className="font-bold text-sm">{sub.label}</span>
                                                        {sub.desc && <span className="text-[10px] text-white/30 font-medium tracking-normal mt-0.5">{sub.desc}</span>}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to={link.path} className="text-white/70 hover:text-[#ff7a21] transition-all duration-300">
                                    {link.label}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Divider */}
                <div className="hidden lg:block h-5 w-[1px] bg-white/10 mx-2"></div>

                {/* User Info & Logout */}
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end gap-0.5 leading-none px-2">
                        <span className="text-[12px] font-bold text-white tracking-tight">{userName}</span>
                        <span className="text-[9px] font-black text-[#ff7a21] uppercase tracking-[0.1em]">{role}</span>
                    </div>

                    <button 
                        onClick={() => setShowLogoutConfirm(true)}
                        className="group flex items-center justify-center p-2 rounded-xl transition-all duration-300 hover:bg-white/5 border border-white/10"
                        title="Logout"
                    >
                        <RiLogoutBoxLine className="text-white/40 text-lg group-hover:text-[#ff7a21] transition-colors" />
                    </button>
                </div>
            </div>

            {/* Logout Confirmation */}
            <ConfirmDialog 
                isOpen={showLogoutConfirm}
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={handleConfirmLogout}
                title="Logout Confirmation"
                message="Ready to head out? You will need to login again to access your dashboard."
                confirmText="Logout"
                danger={true}
            />
        </nav>
    );
};

export default Navbar;
