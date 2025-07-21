import React, { Children, use } from 'react';
import { Navigate } from 'react-router';
import useUserRole from '../Hooks/useUserRole';
import { AuthContext } from '../Provider/AuthProvider';

const ModeratorRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const { role, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if (!user || role !== 'moderator') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }

    return children;
};

export default ModeratorRoute;