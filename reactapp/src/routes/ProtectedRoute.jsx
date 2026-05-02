import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
        return <Navigate to="/" />;
    }

    if (requiredRole && role !== requiredRole) {
        // If they have the wrong role, we send them back to /home where the correct layout will catch them
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
