import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "./AppContext";
import MainLoading from "./MainLoading";

const ProtectedRoute = ({ children, requireAuth = true }) => {
    const { user, loading, checkAuthStatus } = useAppContext();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            if (!user && requireAuth) {
                await checkAuthStatus();
            }
            setIsChecking(false);
        };

        verifyAuth();
    }, [user, requireAuth, checkAuthStatus]);

    // Show loading while checking authentication
    if (loading || isChecking) {
        return <MainLoading />;
    }

    // If auth is required but user is not authenticated
    if (requireAuth && !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is authenticated but trying to access auth pages
    if (
        !requireAuth &&
        user &&
        (location.pathname === "/login" || location.pathname === "/register")
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
