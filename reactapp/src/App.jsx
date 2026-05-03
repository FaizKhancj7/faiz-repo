/**
 * App.jsx
 * This file handles the routing for our React app.
 * It strictly follows PRD Section 5.2.2 for route protection and role-based access.
 */

import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from './store/userSlice';
import api from './config/apiConfig';

// Import Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoute from './routes/AuthRoute';

// Import our shared components
import LandingPage from './pages/public/LandingPage';
import HomePage from './pages/public/HomePage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Mentor Components
import StartupProfileForm from './pages/mentor/StartupProfileForm';
import ViewStartupProfiles from './pages/mentor/ViewStartupProfiles';
import StartupSubmissions from './pages/mentor/StartupSubmissions';

// Entrepreneur Components
import ViewStartupOpportunities from './pages/entrepreneur/ViewStartupOpportunities';
import SubmitIdea from './pages/entrepreneur/SubmitIdea';
import MySubmissions from './pages/entrepreneur/MySubmissions';
import ErrorPage from './pages/errors/ErrorPage';

// Reusable Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ThemeProvider } from './context/ThemeContext';
import AnimatedBackground from './components/ui/AnimatedBackground';

// Define Navigation Links for each role
const MENTOR_LINKS = [
    { label: 'Home', path: '/' },
    { 
        label: 'Startup Profiles', 
        subLinks: [
            { label: 'Add Profile', path: '/mentor/create-profile', desc: 'Create new opportunity' },
            { label: 'View Profiles', path: '/view-profiles', desc: 'Manage your listings' }
        ] 
    },
    { label: 'Startup Submissions', path: '/startup-submissions' }
];

const ENTREPRENEUR_LINKS = [
    { label: 'Home', path: '/' },
    { 
        label: 'Startup Ideas', 
        subLinks: [
            { label: 'Browse Mentors', path: '/mentor-opportunities', desc: 'Find funding & support' },
            { label: 'My Submissions', path: '/entrepreneur/my-submissions', desc: 'Track your pitches' }
        ] 
    }
];

/**
 * MainLayout
 * This layout dynamically renders the correct Navbar based on the user's role.
 */
const MainLayout = () => {
    const { role } = useSelector((state) => state.user);

    return (
        <div className="h-screen flex flex-col overflow-hidden relative" style={{ background: 'var(--theme-bg-primary)' }}>
            {/* Global Animated Background for Dashboards */}
            <AnimatedBackground showOrnaments={false} />
            
            <Navbar 
                role={role} 
                links={role === 'Mentor' ? MENTOR_LINKS : ENTREPRENEUR_LINKS} 
            />
            <main className="flex-grow pt-16 overflow-hidden flex flex-col relative z-10 w-full min-h-0">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

/**
 * RootRoute
 * Decides whether to show the LandingPage or redirect to /home.
 */
const RootRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.user);
    
    if (isAuthenticated === null) return null; // Wait for session check
    return isAuthenticated ? <Navigate to="/home" /> : <LandingPage />;
};

function App() {
    const dispatch = useDispatch();

    // Rehydrate auth state on page reload
    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await api.get('/user/verify');
                if (response.data.success) {
                    dispatch(loginSuccess({
                        userName: response.data.data.userName,
                        role: response.data.data.role
                    }));
                } else {
                    dispatch(logoutSuccess());
                }
            } catch (error) {
                dispatch(logoutSuccess());
            }
        };

        verifyUser();
    }, [dispatch]);

    // Water Drop Effect — spawns a ripple at cursor on every mousedown
    useEffect(() => {
        const handleMouseDown = (e) => {
            const drop = document.createElement('div');
            drop.className = 'water-drop';
            drop.style.left = `${e.clientX}px`;
            drop.style.top = `${e.clientY}px`;
            document.body.appendChild(drop);
            setTimeout(() => drop.remove(), 600);
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, []);

    return (
        <ThemeProvider>
                <Router>
                    <Routes>
                        {/* --- 1. PUBLIC ROUTES --- */}
                        <Route path="/" element={<RootRoute />} />
                        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
                        <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

                        {/* --- 2. SHARED PROTECTED ROUTES (Catch all roles) --- */}
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route path="/home" element={<HomePage />} />
                        </Route>

                        {/* --- 3. MENTOR SPECIFIC ROUTES --- */}
                        <Route element={<ProtectedRoute requiredRole="Mentor"><MainLayout /></ProtectedRoute>}>
                            <Route path="/mentor/create-profile" element={<StartupProfileForm />} />
                            <Route path="/view-profiles" element={<ViewStartupProfiles />} />
                            <Route path="/startup-submissions" element={<StartupSubmissions />} />
                        </Route>

                        {/* --- 4. ENTREPRENEUR SPECIFIC ROUTES --- */}
                        <Route element={<ProtectedRoute requiredRole="Entrepreneur"><MainLayout /></ProtectedRoute>}>
                            <Route path="/mentor-opportunities" element={<ViewStartupOpportunities />} />
                            <Route path="/submit-idea" element={<SubmitIdea />} />
                            <Route path="/entrepreneur/my-submissions" element={<MySubmissions />} />
                        </Route>

                        {/* --- 5. FALLBACK --- */}
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </Router>
            </ThemeProvider>
    );
}

export default App;