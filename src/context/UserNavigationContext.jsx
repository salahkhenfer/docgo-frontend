import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const UserNavigationContext = createContext();

export const useUserNavigation = () => {
    const context = useContext(UserNavigationContext);
    if (!context) {
        throw new Error(
            "useUserNavigation must be used within a UserNavigationProvider",
        );
    }
    return context;
};

export const UserNavigationProvider = ({ children }) => {
    const [pageTitle, setPageTitle] = useState("DocGo");
    const location = useLocation();

    // Route to page title mapping - memoized
    const titleMapping = useMemo(
        () => ({
            "/": "DocGo - Home",
            "/home": "DocGo - Home",
            "/programs": "DocGo - Explore Programs",
            "/courses": "DocGo - Browse Courses",
            "/faq": "DocGo - Frequently Asked Questions",
            "/favorites": "DocGo - My Favorites",
            "/notifications": "DocGo - Notifications",
            "/myapplications": "DocGo - My Applications",
            "/my-applications": "DocGo - My Applications",
            "/profile": "DocGo - My Profile",
            "/profile/edit": "DocGo - Edit Profile",
            "/dashboard": "DocGo - Dashboard",
            "/dashboard/my-learning": "DocGo - My Learning",
            "/dashboard/my-programs": "DocGo - My Programs",
        }),
        [],
    );

    // Update page title based on current route
    useEffect(() => {
        const currentPath = location.pathname.toLowerCase();

        // Check for exact route match first
        if (titleMapping[currentPath]) {
            const title = titleMapping[currentPath];
            setPageTitle(title);
            document.title = title;
            return;
        }

        // Handle dynamic routes
        if (currentPath.startsWith("/courses/")) {
            if (currentPath.includes("/watch")) {
                if (currentPath.includes("/quiz")) {
                    const title = "DocGo - Course Quiz";
                    setPageTitle(title);
                    document.title = title;
                } else if (currentPath.includes("/certificate")) {
                    const title = "DocGo - Certificate";
                    setPageTitle(title);
                    document.title = title;
                } else if (currentPath.includes("/resources")) {
                    const title = "DocGo - Course Resources";
                    setPageTitle(title);
                    document.title = title;
                } else {
                    const title = "DocGo - Watching Course";
                    setPageTitle(title);
                    document.title = title;
                }
            } else if (currentPath.includes("/videos")) {
                const title = "DocGo - Course Content";
                setPageTitle(title);
                document.title = title;
            } else {
                const title = "DocGo - Course Details";
                setPageTitle(title);
                document.title = title;
            }
            return;
        }

        // Handle program details
        if (currentPath.startsWith("/programs/")) {
            const title = "DocGo - Program Details";
            setPageTitle(title);
            document.title = title;
            return;
        }

        // Handle payment pages
        if (currentPath.startsWith("/payment/")) {
            if (currentPath.includes("/success")) {
                const title = "DocGo - Payment Successful";
                setPageTitle(title);
                document.title = title;
            } else {
                const title = "DocGo - Payment";
                setPageTitle(title);
                document.title = title;
            }
            return;
        }

        // Handle search
        if (currentPath.startsWith("/search")) {
            const title = "DocGo - Search Results";
            setPageTitle(title);
            document.title = title;
            return;
        }

        // Handle dashboard sub-pages
        if (currentPath.startsWith("/dashboard/")) {
            const pathSegment = currentPath.split("/")[2];
            const dashboardTitles = {
                messages: "DocGo - Dashboard - Messages",
                applications: "DocGo - Dashboard - My Applications",
                certificates: "DocGo - Dashboard - My Certificates",
                favorites: "DocGo - Dashboard - My Favorites",
                notifications: "DocGo - Dashboard - Notifications",
                settings: "DocGo - Dashboard - Settings",
                "my-learning": "DocGo - My Learning",
                "my-programs": "DocGo - My Programs",
            };
            const title = dashboardTitles[pathSegment] || "DocGo - Dashboard";
            setPageTitle(title);
            document.title = title;
            return;
        }

        // Default
        setPageTitle("DocGo");
        document.title = "DocGo";
    }, [location.pathname, titleMapping]);

    // Determine active navigation item based on current route
    const getActiveNavItem = useMemo(() => {
        const currentPath = location.pathname.toLowerCase();

        if (
            currentPath === "/" ||
            currentPath === "/home" ||
            currentPath === "/dashboard"
        ) {
            return "home";
        } else if (
            currentPath === "/programs" ||
            currentPath.startsWith("/programs/")
        ) {
            return "programs";
        } else if (
            currentPath === "/courses" ||
            currentPath.startsWith("/courses/")
        ) {
            return "courses";
        } else if (currentPath === "/faq") {
            return "faq";
        } else if (currentPath === "/favorites") {
            return "favorites";
        } else if (
            currentPath === "/myapplications" ||
            currentPath === "/my-applications"
        ) {
            return "applications";
        } else if (currentPath === "/notifications") {
            return "notifications";
        } else if (
            currentPath === "/profile" ||
            currentPath === "/profile/edit"
        ) {
            return "profile";
        } else if (currentPath.startsWith("/dashboard")) {
            return "dashboard";
        } else if (currentPath.startsWith("/payment")) {
            return "payment";
        }

        return null;
    }, [location.pathname]);

    const value = {
        pageTitle,
        getActiveNavItem,
    };

    return (
        <UserNavigationContext.Provider value={value}>
            {children}
        </UserNavigationContext.Provider>
    );
};

UserNavigationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
