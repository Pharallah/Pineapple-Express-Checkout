import React from "react";
import Signup from "../pages/Signup";
import { useNavigate } from "react-router";

const ProtectedDashboardRoute = ({ children, isAuthenticated }) => {
    const navigate = useNavigate()

    if (!isAuthenticated) {
        return navigate('/login')
    }

    // Render protected content if authenticated
    return children;
};

export default ProtectedDashboardRoute;
