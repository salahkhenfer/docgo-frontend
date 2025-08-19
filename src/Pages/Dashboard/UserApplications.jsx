import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
    AcademicCapIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../../AppContext";
import apiClient from "../../services/apiClient";

const UserApplications = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAppContext();
    const [applications, setApplications] = useState({
        programs: [],
        courses: [],
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("programs");

    const isRTL = i18n.language === "ar";

    useEffect(() => {
        if (user?.id) {
            fetchApplications();
        }
    }, [user?.id]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/Users/${user.id}/Profile`);

            if (response.data.success && response.data.data.applications) {
                setApplications(response.data.data.applications);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
            setApplications({ programs: [], courses: [] });
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
            case "accepted":
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case "rejected":
            case "declined":
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case "pending":
            case "under_review":
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return (
                    <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
                );
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "approved":
            case "accepted":
                return "bg-green-100 text-green-800";
            case "rejected":
            case "declined":
                return "bg-red-100 text-red-800";
            case "pending":
            case "under_review":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const tabs = [
        {
            id: "programs",
            name: t("applications.programs", "Program Applications"),
            icon: AcademicCapIcon,
            count: applications.programs.length,
        },
        {
            id: "courses",
            name: t("applications.courses", "Course Applications"),
            icon: DocumentTextIcon,
            count: applications.courses.length,
        },
    ];

    const ApplicationCard = ({ application, type }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                        <img
                            src={
                                application[
                                    type === "program" ? "Program" : "Course"
                                ]?.Image
                                    ? `${import.meta.env.VITE_API_URL}${
                                          application[
                                              type === "program"
                                                  ? "Program"
                                                  : "Course"
                                          ].Image
                                      }`
                                    : `/placeholder-${type}.png`
                            }
                            alt={
                                application[
                                    type === "program" ? "Program" : "Course"
                                ]?.Title ||
                                application[
                                    type === "program" ? "Program" : "Course"
                                ]?.Name
                            }
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                                e.target.src = `/placeholder-${type}.png`;
                            }}
                        />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {application[
                                    type === "program" ? "Program" : "Course"
                                ]?.Title ||
                                    application[
                                        type === "program"
                                            ? "Program"
                                            : "Course"
                                    ]?.Name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {
                                    application[
                                        type === "program"
                                            ? "Program"
                                            : "Course"
                                    ]?.Description
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {getStatusIcon(application.Status)}
                        <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                                application.Status
                            )}`}
                        >
                            {application.Status}
                        </span>
                    </div>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span>
                            {t("applications.appliedOn", "Applied")}:{" "}
                            {new Date(
                                application.createdAt
                            ).toLocaleDateString()}
                        </span>
                    </div>
                    {application.ReviewedAt && (
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                                {t("applications.reviewedOn", "Reviewed")}:{" "}
                                {new Date(
                                    application.ReviewedAt
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                    {type === "program" && application.ScholarshipAmount && (
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                                {t(
                                    "applications.scholarshipAmount",
                                    "Scholarship"
                                )}
                                : ${application.ScholarshipAmount}
                            </span>
                        </div>
                    )}
                </div>

                {/* Application Message */}
                {application.ApplicationMessage && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {t("applications.message", "Application Message")}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                            {application.ApplicationMessage}
                        </p>
                    </div>
                )}

                {/* Admin Response */}
                {application.AdminResponse && (
                    <div
                        className={`mb-4 p-3 rounded-lg border-l-4 ${
                            application.Status.toLowerCase() === "approved" ||
                            application.Status.toLowerCase() === "accepted"
                                ? "bg-green-50 border-l-green-400"
                                : application.Status.toLowerCase() ===
                                      "rejected" ||
                                  application.Status.toLowerCase() ===
                                      "declined"
                                ? "bg-red-50 border-l-red-400"
                                : "bg-yellow-50 border-l-yellow-400"
                        }`}
                    >
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {t("applications.adminResponse", "Admin Response")}
                        </h4>
                        <p className="text-sm text-gray-700">
                            {application.AdminResponse}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                        {t("applications.applicationId", "Application ID")}:{" "}
                        {application.id}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link
                            to={
                                type === "program"
                                    ? `/programs/${
                                          application.ProgramId ||
                                          application.Program?.id
                                      }`
                                    : `/courses/${
                                          application.CourseId ||
                                          application.Course?.id
                                      }`
                            }
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                        >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            {t("applications.view", "View Details")}
                        </Link>

                        {(application.Status.toLowerCase() === "approved" ||
                            application.Status.toLowerCase() ===
                                "accepted") && (
                            <Link
                                to={
                                    type === "program"
                                        ? "/dashboard"
                                        : `/courses/${application.CourseId}/learn`
                                }
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                                {type === "program"
                                    ? t(
                                          "applications.viewProgram",
                                          "View Program"
                                      )
                                    : t(
                                          "applications.startCourse",
                                          "Start Course"
                                      )}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`max-w-6xl mx-auto p-6 ${isRTL ? "rtl" : "ltr"}`}>
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <AcademicCapIcon className="h-7 w-7 text-blue-600 mr-3" />
                            {t("applications.title", "My Applications")}
                        </h1>
                        <p className="mt-1 text-gray-600">
                            {t(
                                "applications.subtitle",
                                "Track your course and program applications"
                            )}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <Icon
                                        className={`${
                                            isRTL ? "ml-2" : "mr-2"
                                        } h-5 w-5 ${
                                            activeTab === tab.id
                                                ? "text-blue-500"
                                                : "text-gray-400 group-hover:text-gray-500"
                                        }`}
                                    />
                                    {tab.name}
                                    {tab.count > 0 && (
                                        <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">
                            {t(
                                "applications.loading",
                                "Loading applications..."
                            )}
                        </p>
                    </div>
                ) : (
                    <>
                        {activeTab === "programs" && (
                            <div>
                                {applications.programs.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                        <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {t(
                                                "applications.noProgramApplications",
                                                "No program applications"
                                            )}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {t(
                                                "applications.noProgramApplicationsText",
                                                "You haven't applied to any programs yet."
                                            )}
                                        </p>
                                        <Link
                                            to="/programs"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            {t(
                                                "applications.browsePrograms",
                                                "Browse Programs"
                                            )}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {applications.programs.map(
                                            (application) => (
                                                <ApplicationCard
                                                    key={application.id}
                                                    application={application}
                                                    type="program"
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "courses" && (
                            <div>
                                {applications.courses.length === 0 ? (
                                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                        <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {t(
                                                "applications.noCourseApplications",
                                                "No course applications"
                                            )}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {t(
                                                "applications.noCourseApplicationsText",
                                                "You haven't applied to any courses yet."
                                            )}
                                        </p>
                                        <Link
                                            to="/courses"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            {t(
                                                "applications.browseCourses",
                                                "Browse Courses"
                                            )}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {applications.courses.map(
                                            (application) => (
                                                <ApplicationCard
                                                    key={application.id}
                                                    application={application}
                                                    type="course"
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserApplications;
