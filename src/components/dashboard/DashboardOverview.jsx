import React from "react";
import { Link } from "react-router-dom";
import EnrolledCoursesSection from "./EnrolledCoursesSection";
import EnrolledProgramsSection from "./EnrolledProgramsSection";
import PendingApplicationsSection from "./PendingApplicationsSection";
import Stats from "./Stats";
import ContactForm from "../contact/ContactForm";
import Action_Rapid from "./Action_Rapid";

const DashboardOverview = ({
    user,
    t,
    isRTL,
    dashboardData,
    applications,
    enrollments,
    certificates,
    favorites,
    statistics,
    recentActivity,
}) => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Section and Quick Actions - Flexed horizontally */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8 items-start">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 flex-1 h-full">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex-1 h-full">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {t("dashboard_data.welcome", "Welcome")},{" "}
                                {user?.firstName} {user?.lastName}!
                            </h1>
                            <p className="text-gray-600">
                                {t(
                                    "dashboard_data.subtitle",
                                    "Suivez vos progrès d'apprentissage et vos demandes de bourses"
                                )}
                            </p>
                        </div>
                        <div className="hidden md:flex items-center ml-4">
                            {user?.profile_pic_link ? (
                                <img
                                    src={
                                        import.meta.env.VITE_API_URL +
                                        user.profile_pic_link
                                    }
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                            "flex";
                                    }}
                                />
                            ) : null}
                            <div
                                className={`w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center ${
                                    user?.profile_pic_link ? "hidden" : "flex"
                                }`}
                            >
                                <svg
                                    className="w-10 h-10 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="w-full lg:w-auto lg:flex-shrink-0">
                    <Action_Rapid />
                </div>
            </div>
            {/* Quick Stats */}
            <Stats
                statistics={statistics}
                enrollments={enrollments}
                applications={applications}
                certificates={certificates}
                favorites={favorites}
            />
            {/* New Enrollment and Application Sections */}
            <div className="space-y-8">
                {/* Pending Applications Section */}
                <PendingApplicationsSection applications={applications} />

                {/* Enrolled Courses Section */}
                <EnrolledCoursesSection enrollments={enrollments.courses} />

                {/* Enrolled Programs Section */}
                <EnrolledProgramsSection enrollments={enrollments.programs} />
            </div>

            {/* Main Content Grid */}
            <div className="mt-6  gap-8">
                {/* Left Column - Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Course Progress */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {t(
                                    "dashboard_data.recentCourses",
                                    "Recent Course Progress"
                                )}
                            </h3>
                            <Link
                                to="/courses"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                {t("dashboard_data.viewAll", "View All")}
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.progress.length > 0 ? (
                                recentActivity.progress.map((progress) => (
                                    <div
                                        key={progress.id}
                                        className="flex items-center p-4 border border-gray-200 rounded-lg"
                                    >
                                        <img
                                            src={
                                                progress.Course?.Image
                                                    ? `${
                                                          import.meta.env
                                                              .VITE_API_URL
                                                      }${progress.Course.Image}`
                                                    : "/placeholder-course.png"
                                            }
                                            alt={progress.Course?.Title}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div
                                            className={`${
                                                isRTL ? "mr-4" : "ml-4"
                                            } flex-1`}
                                        >
                                            <h4 className="font-medium text-gray-900">
                                                {progress.Course?.Title}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {progress.Course?.Category} •{" "}
                                                {progress.Course?.Level}
                                            </p>
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>
                                                        {Math.round(
                                                            progress.CompletionPercentage ||
                                                                0
                                                        )}
                                                        %{" "}
                                                        {t(
                                                            "dashboard_data.complete",
                                                            "Complete"
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${
                                                            progress.IsCompleted
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-blue-100 text-blue-800"
                                                        }`}
                                                    >
                                                        {progress.IsCompleted
                                                            ? t(
                                                                  "dashboard_data.completed",
                                                                  "Completed"
                                                              )
                                                            : t(
                                                                  "dashboard_data.inProgress",
                                                                  "In Progress"
                                                              )}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{
                                                            width: `${Math.round(
                                                                progress.CompletionPercentage ||
                                                                    0
                                                            )}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    {t(
                                        "dashboard_data.noCourses",
                                        "No course progress yet"
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Recent Applications - Additional content would go here */}
                </div>

                <div className="space-y-6">
                    <ContactForm
                        context="dashboard"
                        title={t("dashboard_data.contactSupport", "Need Help?")}
                    />

                    {statistics.coursesInProgress > 0 && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">
                                {t(
                                    "dashboard_data.learningProgress",
                                    "Learning Progress"
                                )}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>
                                        {t(
                                            "dashboard_data.coursesInProgress",
                                            "Courses in Progress"
                                        )}
                                    </span>
                                    <span className="font-semibold">
                                        {statistics.coursesInProgress}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>
                                        {t(
                                            "dashboard_data.coursesCompleted",
                                            "Courses Completed"
                                        )}
                                    </span>
                                    <span className="font-semibold">
                                        {statistics.coursesCompleted}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>
                                        {t(
                                            "dashboard_data.certificatesEarned",
                                            "Certificates Earned"
                                        )}
                                    </span>
                                    <span className="font-semibold">
                                        {statistics.totalCertificates}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
