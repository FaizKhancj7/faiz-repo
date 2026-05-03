// Signup Page — Corporate Memphis Redesign (Sharpened & Compact)
// Features: HD illustrations, theme-aware colors, and NON-SCROLLABLE layout.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiRocketLine, RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri';
import api from '../../config/apiConfig';
import Input from '../../components/ui/Input';

// --- CORPORATE MEMPHIS SVG ILLUSTRATIONS (Sharpened & Compact) ---

const MemphisSignup = () => (
    <svg viewBox="0 0 400 400" className="w-full max-w-[320px] h-auto transition-all duration-500">
        <defs>
            <filter id="hd-shadow-signup" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                <feOffset dx="0" dy="8" result="offsetblur" />
                <feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer>
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>
        <g filter="url(#hd-shadow-signup)">
            <circle cx="200" cy="200" r="180" fill="var(--theme-accent-light)" opacity="0.3" />
            <rect x="50" y="300" width="300" height="20" rx="10" fill="var(--theme-text-primary)" opacity="0.1" stroke="var(--theme-text-primary)" strokeWidth="1" />
            <path d="M120 300 Q100 200 140 180" fill="none" stroke="#ad2c00" strokeWidth="16" strokeLinecap="round" />
            <circle cx="150" cy="160" r="14" fill="#ad2c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
            <path d="M280 300 Q300 200 260 180" fill="none" stroke="var(--theme-accent)" strokeWidth="16" strokeLinecap="round" />
            <circle cx="250" cy="160" r="14" fill="var(--theme-accent)" stroke="var(--theme-text-primary)" strokeWidth="2" />
            <path d="M160 160 Q200 120 240 160" fill="none" stroke="var(--theme-text-primary)" strokeWidth="3" strokeDasharray="6 6" />
            <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                <path d="M200 100 L215 130 L185 130 Z" fill="#ff8c00" stroke="var(--theme-text-primary)" strokeWidth="2" />
                <path d="M195 130 L205 130 L200 145 Z" fill="#ad2c00" />
            </g>
        </g>
    </svg>
);

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        role: 'Entrepreneur',
        secretQuestionAnswer: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const userNameRegex = /^[a-zA-Z0-9_]{3,}$/;
        if (!userNameRegex.test(formData.userName)) {
            newErrors.userName = 'Min 3 chars';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email';
            isValid = false;
        }

        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(formData.mobile)) {
            newErrors.mobile = 'Invalid mobile';
            isValid = false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Strong password req.';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mismatch';
            isValid = false;
        }

        if (!formData.secretQuestionAnswer) {
            newErrors.secretQuestionAnswer = 'Answer req.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignup = useCallback(async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fix errors.");
            return;
        }

        try {
            const response = await api.post('/user/signup', formData);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login');
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create account.";
            toast.error(message);
        }
    }, [formData, navigate]);

    return (
        <div className="min-h-screen overflow-x-hidden overflow-y-auto flex flex-col lg:flex-row transition-all duration-300 relative" 
            style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                background: 'var(--theme-bg-primary)',
                color: 'var(--theme-text-primary)'
            }}>
            
            {/* Background Memphis Blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[130px] opacity-20 animate-liquid" style={{ background: 'var(--theme-accent)' }}></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[110px] opacity-20 animate-liquid" style={{ background: '#ad2c00' }}></div>

            {/* LEFT — Illustration Panel */}
            <div className="hidden lg:flex w-[460px] flex-shrink-0 flex-col justify-between relative overflow-hidden border-r-2"
                style={{ background: 'var(--theme-bg-secondary)', borderColor: 'var(--theme-border)' }}>

                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="p-8">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="p-2 rounded-xl transition-all duration-500 group-hover:rotate-12"
                                style={{ background: 'var(--theme-accent-gradient)' }}>
                                <RiRocketLine className="text-white text-lg" />
                            </div>
                            <span className="text-xl font-black tracking-tighter" style={{ color: 'var(--theme-text-primary)' }}>
                                Startup<span style={{ color: 'var(--theme-accent)' }}>Nest</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center p-4">
                        <MemphisSignup />
                    </div>

                    <div className="p-8">
                        <h2 className="text-3xl font-black leading-tight tracking-tight mb-3">
                            Start your<br />
                            journey <span style={{ color: 'var(--theme-accent)' }}>today.</span>
                        </h2>
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-[var(--theme-accent)] transition-all">
                            <RiArrowLeftLine /> Back to Landing Page
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT — Signup Form */}
            <div className="w-full lg:flex-grow flex items-center justify-center p-6 sm:p-10 relative">
                <div className="w-full max-w-md relative z-10 animate-lift">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-6 justify-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 rounded-xl" style={{ background: 'var(--theme-accent-gradient)' }}>
                            <RiRocketLine className="text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">StartupNest</span>
                    </div>

                    <div className="p-6 md:p-8 shadow-2xl transition-all duration-300 border-2"
                        style={{
                            background: 'var(--theme-bg-card)',
                            borderRadius: '32px',
                            borderColor: 'var(--theme-border)',
                            boxShadow: 'var(--theme-shadow-lg)'
                        }}
                    >
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--theme-text-primary)' }}>Create Account</h2>
                            <p className="text-[13px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Join the world's most vibrant startup ecosystem.</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Username" name="userName" placeholder="johndoe" value={formData.userName} onChange={handleChange} error={errors.userName} className="py-2" />
                                <Input label="Mobile" name="mobile" placeholder="9876543210" value={formData.mobile} onChange={handleChange} error={errors.mobile} className="py-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} error={errors.email} className="py-2" />
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Your Role</label>
                                    <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl outline-none border-2 transition-all appearance-none cursor-pointer font-bold text-sm"
                                        style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)', color: 'var(--theme-text-primary)' }}>
                                        <option value="Entrepreneur">Entrepreneur</option>
                                        <option value="Mentor">Mentor</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} className="py-2" />
                                <Input label="Confirm" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} className="py-2" />
                            </div>

                            <div className="p-4 rounded-2xl border-2" style={{ background: 'var(--theme-bg-input)', borderColor: 'var(--theme-border)' }}>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Security Question: School Name?</p>
                                <Input label="" name="secretQuestionAnswer" placeholder="Your Answer" value={formData.secretQuestionAnswer} onChange={handleChange} error={errors.secretQuestionAnswer} className="py-1.5" />
                            </div>

                            <button type="submit" className="group w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.01] active:scale-95 shadow-xl"
                                style={{ background: 'var(--theme-accent-gradient)', boxShadow: '0 15px 30px -10px var(--theme-accent-glow)' }}>
                                <span>Complete Registration</span>
                                <RiArrowRightLine className="text-lg transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>

                        <div className="mt-6 pt-4 text-center border-t-2" style={{ borderColor: 'var(--theme-border)' }}>
                            <p className="text-xs font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                                Already a member?{' '}
                                <Link to="/login" className="font-black hover:text-[var(--theme-accent)] transition-colors" style={{ color: 'var(--theme-accent)' }}>
                                    Login Instead
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
