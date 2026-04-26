// This file handles the routing for our React app.
// It decides which page to show based on the URL and checks if the user is allowed to see it.

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from './userSlice';
import api from './apiConfig';

// Import our pages
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';

// This component blocks access to protected pages if the user is NOT logged in.
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    
    // 🟡 TRAFFIC LIGHT: null means we are still checking the session
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // 🔴 TRAFFIC LIGHT: false means confirmed logged out
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // 🟢 TRAFFIC LIGHT: true means confirmed logged in
    return children;
};

// This component blocks access to Login/Signup if the user IS already logged in.
const AuthRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    
    // 🟡 TRAFFIC LIGHT: null means we are still checking the session
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // 🟢 TRAFFIC LIGHT: true means confirmed logged in, so redirect to home
    if (isAuthenticated) {
        return <Navigate to="/home" />;
    }

    // 🔴 TRAFFIC LIGHT: false means confirmed logged out, show the auth page
    return children;
};

function App() {
    const dispatch = useDispatch();

    // Rehydrate auth state on page reload
    useEffect(() => {
        const verifyUser = async () => {
            try {
                // Call the backend to see if we have a valid session cookie
                const response = await api.get('/user/verify');
                if (response.data.success) {
                    // 🟢 Set state to true with user data
                    dispatch(loginSuccess({
                        userName: response.data.data.userName,
                        role: response.data.data.role
                    }));
                } else {
                    // 🔴 Set state to false
                    dispatch(logoutSuccess());
                }
            } catch (error) {
                // 🔴 Set state to false if API fails
                dispatch(logoutSuccess());
            }
        };

        verifyUser();
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                
                {/* Public Auth Routes */}
                <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
                <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

                {/* Dashboard Routes */}
                <Route path="/mentor-dashboard" element={<ProtectedRoute><div className="p-20 text-center font-bold">Mentor Dashboard (Coming Soon)</div></ProtectedRoute>} />
                <Route path="/entrepreneur-dashboard" element={<ProtectedRoute><div className="p-20 text-center font-bold">Entrepreneur Dashboard (Coming Soon)</div></ProtectedRoute>} />

                {/* Wildcard redirect */}
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
        </Router>
    );
}

export default App;