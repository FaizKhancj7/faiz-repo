/**
 * App.jsx
 * This file handles the routing for our React app.
 * It strictly follows PRD Section 5.2.2 for route protection and role-based access.
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from './userSlice';
import api from './apiConfig';

// Import our shared components
import LandingPage from './Components/LandingPage';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';

// Mentor Components
import MentorNavbar from './MentorComponents/MentorNavbar';
import StartupProfileForm from './MentorComponents/StartupProfileForm';
import ViewStartupProfiles from './MentorComponents/ViewStartupProfiles';

// Entrepreneur Components
import EntrepreneurNavbar from './EntrepreneurComponents/EntrepreneurNavbar';
import ViewStartupOpportunities from './EntrepreneurComponents/ViewStartupOpportunities';

/**
 * ProtectedRoute
 * Blocks access if not logged in. Optional role check.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, role } = useSelector((state) => state.user);
    
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center min-h-screen font-semibold text-gray-500">Authenticating...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && role !== requiredRole) {
        // If they have the wrong role, we send them back to /home where the correct layout will catch them
        return <Navigate to="/home" />;
    }

    return children;
};

/**
 * MainLayout
 * This layout dynamically renders the correct Navbar based on the user's role.
 * This prevents route collision on shared pages like /home.
 */
const MainLayout = () => {
    const { role } = useSelector((state) => state.user);

    return (
        <>
            {role === 'Mentor' ? <MentorNavbar /> : <EntrepreneurNavbar />}
            <div className="bg-gray-50 min-h-[calc(100vh-80px)]">
                <Outlet />
            </div>
        </>
    );
};

/**
 * AuthRoute
 * Blocks access to Login/Signup if already logged in.
 */
const AuthRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center min-h-screen font-semibold text-gray-500">Checking session...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/home" />;
    }

    return children;
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

    return (
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
                    <Route path="/startup-submissions" element={<div className="p-10 font-bold">Submissions Page (Coming Soon)</div>} />
                </Route>

                {/* --- 4. ENTREPRENEUR SPECIFIC ROUTES --- */}
                <Route element={<ProtectedRoute requiredRole="Entrepreneur"><MainLayout /></ProtectedRoute>}>
                    <Route path="/mentor-opportunities" element={<ViewStartupOpportunities />} />
                    <Route path="/my-submissions" element={<div className="p-10 font-bold">My Submissions (Coming Soon)</div>} />
                </Route>

                {/* --- 5. FALLBACK --- */}
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    );
}

export default App;