// Login Page — Ascent Modernism Design System
// Fixed viewport (no scroll). Same visual language as Signup/LandingPage.
// Functionality is 100% unchanged.

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { RiRocketLine, RiArrowRightLine } from 'react-icons/ri';
import api from '../apiConfig';
import { loginSuccess } from '../slices/userSlice';
import Button from './Reusable/Button';
import Input from './Reusable/Input';

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
        <div className="h-screen overflow-hidden flex" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* LEFT — Illustration Panel */}
            <div className="hidden lg:flex w-[480px] flex-shrink-0 flex-col justify-between relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0e1d2a 0%, #162a3f 100%)' }}>

                {/* Background Image (same as Signup) */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "url('/8640544.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                </div>

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Logo */}
                    <div className="p-10">
                        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="p-2 rounded-xl transition-all duration-300 group-hover:rotate-12"
                                style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                                <RiRocketLine className="text-white text-lg" />
                            </div>
                            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '18px', color: '#fff' }}>
                                Startup<span style={{ color: '#ff7a21' }}>Nest</span>
                            </span>
                        </div>
                    </div>

                    {/* Tagline */}
                    <div className="p-10">
                        <h2 className="animate-lift" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '36px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#fff' }}>
                            Welcome back to the{' '}<span style={{ color: '#ff7a21', fontStyle: 'italic' }}>nest.</span>
                        </h2>
                        <p className="animate-lift delay-100 mt-4" style={{ fontSize: '14px', lineHeight: 1.7, color: '#bdc7de' }}>
                            Continue your journey where big ideas take flight.
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="p-10">
                        <p style={{ fontSize: '10px', color: '#75777d', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                            © 2026 StartupNest Ecosystem
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT — Login Form */}
            <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #f7f9ff 0%, #e8effd 60%, #f7f9ff 100%)' }}>

                {/* Background illustration (same as user's request for signup) */}
                <div className="absolute inset-0 pointer-events-none" 
                    style={{ 
                        backgroundImage: "url('/4c84fce09eb8ec512786dcca4a3fc136.jpg')", 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat', 
                        opacity: 0.6 
                    }}>
                </div>

                {/* Ambient blurs */}
                <div className="absolute top-10 -left-20 w-80 h-80 rounded-full opacity-15 blur-[100px] pointer-events-none" style={{ background: '#ff7a21' }}></div>
                <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full opacity-10 blur-[100px] pointer-events-none" style={{ background: '#3b82f6' }}></div>

                <div className="w-full max-w-md relative z-10 animate-lift delay-100">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #ff7a21, #ff9a52)' }}>
                            <RiRocketLine className="text-white text-lg" />
                        </div>
                        <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: '18px', color: '#0e1d2a' }}>
                            Startup<span style={{ color: '#ff7a21' }}>Nest</span>
                        </span>
                    </div>

                    {/* The main card for the login form */}
                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-2xl shadow-orange-900/5">
                        
                        {/* Header */}
                        <div className="mb-6 md:mb-8 text-center">
                            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", letterSpacing: '-0.03em', color: '#0e1d2a' }} className="text-2xl md:text-[28px] font-extrabold">Welcome Back</h2>
                            <p className="mt-2 text-xs md:text-sm text-slate-500">Enter your details to access your account</p>
                        </div>

                        {/* The Login Form */}
                        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />

                            <div className="space-y-1">
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
                                    <Link to="/forgot-password" intrinsic="true" className="text-[11px] md:text-sm font-bold text-[#ff7a21] hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <button type="submit" className="w-full flex items-center justify-center gap-2 text-white text-[12px] md:text-sm font-bold uppercase transition-all duration-300 active:scale-95"
                                style={{ 
                                    fontFamily: "'Plus Jakarta Sans'", 
                                    letterSpacing: '0.1em', 
                                    background: 'linear-gradient(135deg, #ff7a21, #ff9a52)', 
                                    padding: '14px', 
                                    borderRadius: '9999px', 
                                    boxShadow: '0 6px 24px rgba(255,122,33,0.3)', 
                                    marginTop: '8px' 
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(255,122,33,0.45)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,122,33,0.3)'; }}>
                                <span>Login</span>
                                <RiArrowRightLine className="text-lg" />
                            </button>
                        </form>

                        {/* Link to the Signup page */}
                        <div className="mt-6 md:mt-8 text-center pt-5 md:pt-6 border-t border-slate-50">
                            <p className="text-xs md:text-sm text-slate-500">
                                New here?{' '}
                                <Link to="/signup" className="font-bold transition-colors duration-300 hover:underline" style={{ color: '#ff7a21' }}>
                                    Create an Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-[10px] md:text-xs font-black text-slate-400 hover:text-[#0e1d2a] uppercase tracking-widest transition-colors">
                            ← Back to Landing Page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;