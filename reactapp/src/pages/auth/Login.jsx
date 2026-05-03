// Login Page — Corporate Memphis Redesign (Sharpened)
// Features: HD illustrations, theme-aware colors, and full navigation.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { RiRocketLine, RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri';
import api from '../../config/apiConfig';
import { loginSuccess } from '../../store/userSlice';
import Input from '../../components/ui/Input';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Sharpened & Theme-Aware) ---

const MemphisLogin = () => (
    <svg viewBox="0 0 400 400" className="w-full max-w-[380px] h-auto transition-all duration-500">
        <defs>
            <filter id="hd-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                <feOffset dx="0" dy="10" result="offsetblur" />
                <feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer>
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <g filter="url(#hd-shadow)">
            <circle cx="200" cy="200" r="180" fill="var(--theme-accent-light)" opacity="0.4" />
            {/* Door/Portal with sharp border */}
            <path d="M120 320 L120 120 Q120 80 160 80 L240 80 Q280 80 280 120 L280 320" fill="var(--theme-bg-card)" stroke="var(--theme-accent)" strokeWidth="4" />
            {/* Person - Walking into portal (Kinetic Palette) */}
            <path d="M180 320 L200 220 L220 320" fill="#ff8c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
            <circle cx="200" cy="180" r="15" fill="#ad2c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
            <path d="M190 230 Q250 200 280 250" fill="none" stroke="#ff8c00" strokeWidth="14" strokeLinecap="round" />
            <path d="M185 320 Q160 400 120 390" fill="none" stroke="#ff8c00" strokeWidth="14" strokeLinecap="round" />
            <path d="M215 320 Q240 400 280 390" fill="none" stroke="#ad2c00" strokeWidth="14" strokeLinecap="round" />
            {/* Key Icon */}
            <g transform="translate(300, 100) rotate(-15)">
                <circle cx="20" cy="20" r="15" fill="var(--theme-accent)" stroke="var(--theme-text-primary)" strokeWidth="2" />
                <rect x="15" y="35" width="10" height="15" fill="var(--theme-accent)" stroke="var(--theme-text-primary)" strokeWidth="2" />
            </g>
        </g>
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { email: '', password: '' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!formData.email) {
            newErrors.email = 'Email is required.';
            valid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please correct the errors in the form.");
            return;
        }

        try {
            const response = await api.post('/user/login', formData);
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(loginSuccess({
                    role: response.data.data.role,
                    userName: response.data.data.userName
                }));
                navigate('/home');
            }
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong during login.";
            toast.error(message);
        }
    }, [formData, navigate, dispatch]);

    return (
        <div className="min-h-screen overflow-x-hidden overflow-y-auto flex flex-col lg:flex-row transition-all duration-300 relative" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                background: 'var(--theme-bg-primary)',
                color: 'var(--theme-text-primary)'
            }}>
            
            {/* Background Memphis Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-liquid" style={{ background: 'var(--theme-accent)' }}></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 animate-liquid" style={{ background: '#ff8c00' }}></div>

            {/* LEFT — Illustration Panel */}
            <div className="hidden lg:flex w-[500px] flex-shrink-0 flex-col justify-between relative overflow-hidden border-r-2"
                style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>

                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="p-12">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="p-2.5 rounded-2xl transition-all duration-500 group-hover:rotate-12"
                                style={{ background: 'var(--theme-accent-gradient)' }}>
                                <RiRocketLine className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter" style={{ color: 'var(--theme-text-primary)' }}>
                                Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center p-12">
                        <MemphisLogin />
                    </div>

                    <div className="p-12">
                        <h2 className="text-4xl font-black leading-tight tracking-tight mb-4">
                            Welcome back<br />
                            to the <span style={{ color: 'var(--theme-accent)' }}>nest.</span>
                        </h2>
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[var(--theme-accent)] transition-all">
                            <RiArrowLeftLine /> Back to Landing Page
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT — Login Form */}
            <div className="w-full lg:flex-grow flex items-center justify-center p-6 sm:p-10 relative">
                <div className="w-full max-w-md relative z-10 animate-lift">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-12 justify-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 rounded-xl" style={{ background: 'var(--theme-accent-gradient)' }}>
                            <RiRocketLine className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">StartupNest</span>
                    </div>

                    <div className="p-10 shadow-2xl transition-all duration-300 border-2"
                        style={{
                            background: 'var(--theme-bg-card)',
                            borderRadius: '40px',
                            borderColor: 'var(--theme-border)',
                            boxShadow: 'var(--theme-shadow-lg)'
                        }}
                    >
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--theme-text-primary)' }}>Member Login</h2>
                            <p className="text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Ready for the next big leap?</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="john@startupnest.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />

                            <div className="space-y-2">
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                />
                                <div className="text-right">
                                    <Link to="/forgot-password" intrinsic="true" className="text-xs font-black uppercase tracking-widest hover:text-[var(--theme-accent)] transition-colors" style={{ color: 'var(--theme-accent)' }}>
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <button type="submit" className="group w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                                style={{ background: 'var(--theme-accent-gradient)', boxShadow: '0 20px 40px -10px var(--theme-accent-glow)' }}>
                                <span>Sign In</span>
                                <RiArrowRightLine className="text-xl transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>

                        <div className="mt-10 pt-8 text-center border-t-2" style={{ borderColor: 'var(--theme-border)' }}>
                            <p className="text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-black hover:text-[var(--theme-accent)] transition-colors" style={{ color: 'var(--theme-accent)' }}>
                                    Join the Hub
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
