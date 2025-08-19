import { useState, useEffect, useContext, useCallback } from "react";
import { useAppContext } from "../AppContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLoading from "../MainLoading";
import apiClient from "../services/apiClient";
const UserDashboard = () => {
    const { user } = useAppContext();
    const { t, i18n } = useTranslation();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        console.log("user in this page : ", user);
    }, [user?.id]);

    const isRTL = i18n.language === "ar";

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);

            const response = await apiClient.get(`/Users/${user.id}/Profile`);

            if (response.status > 299) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Dashboard data fetched successfully:", response);

            setDashboardData(response);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
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
                        onClick={() => window.location.reload()}
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
                        {t("noData")}
                    </h2>
                    <Link
                        to="/courses"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {t("browseCourses")}
                    </Link>
                </div>
            </div>
        );
    }

    const {
        enrollments = [],
        courseApplications = [],
        programApplications = [],
        favoritesCourses = [],
        favoritesPrograms = [],
    } = dashboardData;

    // Get recent activity (last 5 items from enrollments and applications)
    const recentEnrollments = enrollments.slice(0, 3);
    const recentApplications = [...courseApplications, ...programApplications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    return (
        <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {t("dashboard.welcome")}, {user?.firstName}{" "}
                                {user?.lastName}!
                            </h1>
                            <p className="text-gray-600">
                                {t("dashboard.dashboardSubtitle")}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            {user?.profile_pic_link ? (
                                <img
                                    src={
                                        import.meta.env.VITE_API_URL +
                                        user.profile_pic_link
                                    }
                                    alt="Profile"
                                    className="w-36 h-36 rounded-xl object-cover"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                            "flex";
                                    }}
                                />
                            ) : null}
                            <div
                                className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${
                                    user?.profile_pic_link ? "hidden" : "flex"
                                }`}
                                style={{
                                    display: user?.profile_pic_link
                                        ? "none"
                                        : "flex",
                                }}
                            >
                                <svg
                                    className="w-8 h-8 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                                <p className="text-2xl font-bold text-gray-900">
                                    {enrollments.length}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {t("dashboard.enrolledCourses")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                                <p className="text-2xl font-bold text-gray-900">
                                    {courseApplications.length +
                                        programApplications.length}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {t("dashboard.applications")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                            <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                                <p className="text-2xl font-bold text-gray-900">
                                    {favoritesCourses.length +
                                        favoritesPrograms.length}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {t("dashboard.favorites")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        enrollments.filter(
                                            (e) => e.progress >= 100
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-gray-600">
                                    {t("dashboard.completedCourses")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Learning Courses */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {t("dashboard.recentEnrollments")}
                                </h2>
                                <Link
                                    to="/courses"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    {t("dashboard.viewAll")}
                                </Link>
                            </div>

                            {recentEnrollments.length > 0 ? (
                                <div className="space-y-4">
                                    {recentEnrollments.map((enrollment) => (
                                        <div
                                            key={enrollment.id}
                                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {enrollment.Course
                                                            ?.title ||
                                                            t(
                                                                "dashboard.courseTitle"
                                                            )}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {enrollment.Course?.description?.substring(
                                                            0,
                                                            100
                                                        )}
                                                        ...
                                                    </p>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{
                                                                    width: `${
                                                                        enrollment.progress ||
                                                                        0
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {enrollment.progress ||
                                                                0}
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/courses/${enrollment.Course?.id}`}
                                                    className={`${
                                                        isRTL ? "mr-4" : "ml-4"
                                                    } px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm`}
                                                >
                                                    {t("dashboard.continue")}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">
                                        {t("dashboard.noEnrollments")}
                                    </p>
                                    <Link
                                        to="/courses"
                                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        {t("dashboard.browseCourses")}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scholarship Applications */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {t("dashboard.recentApplications")}
                                </h2>
                                <Link
                                    to="/myapplications"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    {t("dashboard.viewAll")}
                                </Link>
                            </div>

                            {recentApplications.length > 0 ? (
                                <div className="space-y-3">
                                    {recentApplications.map((application) => (
                                        <div
                                            key={`${
                                                application.applicationCourse
                                                    ? "course"
                                                    : "program"
                                            }-${application.id}`}
                                            className="border rounded-lg p-3"
                                        >
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                {application.applicationCourse
                                                    ?.title ||
                                                    application
                                                        .applicationProgram
                                                        ?.title ||
                                                    t(
                                                        "dashboard.applicationTitle"
                                                    )}
                                            </h4>
                                            <p className="text-xs text-gray-600 mb-2">
                                                {application.applicationCourse
                                                    ? t("dashboard.course")
                                                    : t("dashboard.program")}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        application.status ===
                                                        "approved"
                                                            ? "bg-green-100 text-green-800"
                                                            : application.status ===
                                                              "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {t(
                                                        `dashboard.${application.status}`
                                                    )}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(
                                                        application.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 text-sm mb-3">
                                        {t("dashboard.noApplications")}
                                    </p>
                                    <Link
                                        to="/programs"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        {t("dashboard.browsePrograms")}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {t("dashboard.quickActions")}
                            </h2>
                            <div className="space-y-3">
                                <Link
                                    to="/courses"
                                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                                            <svg
                                                className="w-4 h-4 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-700">
                                            {t("dashboard.browseCourses")}
                                        </span>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                                <Link
                                    to="/programs"
                                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-green-100 p-2 rounded-full mr-3">
                                            <svg
                                                className="w-4 h-4 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-700">
                                            {t("dashboard.browsePrograms")}
                                        </span>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                                <Link
                                    to="/favorites"
                                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-yellow-100 p-2 rounded-full mr-3">
                                            <svg
                                                className="w-4 h-4 text-yellow-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-700">
                                            {t("dashboard.viewFavorites")}
                                        </span>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                                            <svg
                                                className="w-4 h-4 text-purple-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-700">
                                            {t("dashboard.editProfile")}
                                        </span>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
