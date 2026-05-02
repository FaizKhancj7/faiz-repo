import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

export default AuthRoute;
