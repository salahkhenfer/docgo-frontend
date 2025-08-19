import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../../AppContext";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bars3Icon } from "@heroicons/react/24/outline";
import MainLoading from "../../MainLoading";
import apiClient from "../../services/apiClient";
import UserSidebar from "../../components/dashboard/Sidebar";
import DashboardOverview from "../../components/dashboard/DashboardOverview";

const UserDashboard = () => {
    const { user } = useAppContext();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isRTL = i18n.language === "ar";

    // Check if we're on the dashboard root path
    const isRootDashboard =
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/";

    const fetchDashboardData = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get(`/Users/${user.id}/Profile`);

            if (response.data.success) {
                setDashboardData(response.data.data);
            } else {
                throw new Error(
                    response.data.message || "Failed to fetch dashboard data"
                );
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load dashboard data"
            );
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
        }
    }, [user?.id, fetchDashboardData]);

    if (loading) return <MainLoading />;

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        {t("error")}
                    </h2>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {t("retry")}
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">
                        {t("no_data")}
                    </h2>
                    <button
                        onClick={fetchDashboardData}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {t("browseCourses", "Browse Courses")}
                    </button>
                </div>
            </div>
        );
    }

    const {
        applications = { programs: [], courses: [] },
        enrollments = { courses: [], programs: [] },
        certificates = { courses: [] },
        favorites = { courses: [], programs: [], all: [] },
        statistics = {},
        recentActivity = {
            applications: [],
            progress: [],
            certificates: [],
            enrollments: [],
        },
    } = dashboardData;

    return (
        <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
            {/* Dashboard with Sidebar Layout */}
            <div className="flex">
                {/* Fixed Sidebar */}
                <UserSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content with proper spacing for fixed sidebar */}
                <div className="flex-1 lg:pl-64">
                    {/* Mobile header with menu button */}
                    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Dashboard Content */}
                    <div className="min-h-screen">
                        {isRootDashboard ? (
                            <DashboardOverview
                                user={user}
                                t={t}
                                isRTL={isRTL}
                                dashboardData={dashboardData}
                                applications={applications}
                                enrollments={enrollments}
                                certificates={certificates}
                                favorites={favorites}
                                statistics={statistics}
                                recentActivity={recentActivity}
                            />
                        ) : (
                            <Outlet />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
