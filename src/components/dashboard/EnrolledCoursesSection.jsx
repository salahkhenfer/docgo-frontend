import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const EnrolledCoursesSection = ({ enrollments }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!enrollments || enrollments.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="max-w-md mx-auto">
                    <div className="mb-6">
                        <svg
                            className="w-16 h-16 text-blue-400 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {t(
                                "dashboard.noEnrolledCourses",
                                "No Enrolled Courses"
                            )}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t(
                                "dashboard.noEnrolledCoursesDescription",
                                "Start learning by enrolling in courses!"
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/courses")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        {t("dashboard.browseCourses", "Browse Courses")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
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
                    <h2 className="text-2xl font-bold text-gray-900">
                        {t("dashboard.enrolledCourses", "My Enrolled Courses")}
                    </h2>
                </div>
                <div className="text-sm text-gray-500">
                    {enrollments.length} {t("dashboard.courses", "courses")}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                    <div
                        key={enrollment.id}
                        className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() =>
                            navigate(`/my-courses/${enrollment.CourseId}`)
                        }
                    >
                        <div className="flex items-start gap-4">
                            <img
                                src={
                                    enrollment.Course?.Image
                                        ? `${import.meta.env.VITE_API_URL}${
                                              enrollment.Course.Image
                                          }`
                                        : "/placeholder-course.png"
                                }
                                alt={enrollment.Course?.Title}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                    {enrollment.Course?.Title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {enrollment.Course?.Category} •{" "}
                                    {enrollment.Course?.Level}
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">
                                            {t(
                                                "dashboard.progress",
                                                "Progress"
                                            )}
                                        </span>
                                        <span className="text-blue-600 font-medium">
                                            {Math.round(
                                                enrollment.progressPercentage ||
                                                    0
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.round(
                                                    enrollment.progressPercentage ||
                                                        0
                                                )}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            enrollment.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {enrollment.status === "completed"
                                            ? t(
                                                  "dashboard.completed",
                                                  "Completed"
                                              )
                                            : t("dashboard.active", "Active")}
                                    </span>
                                    {enrollment.status === "completed" &&
                                        enrollment.certificateIssued && (
                                            <div className="flex items-center gap-1 text-yellow-600">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className="text-xs font-medium">
                                                    {t(
                                                        "dashboard.certified",
                                                        "Certified"
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                </div>

                                {/* Enrollment Date */}
                                <div className="mt-2 text-xs text-gray-500">
                                    {t("dashboard.enrolledOn", "Enrolled on")}:{" "}
                                    {new Date(
                                        enrollment.enrollmentDate
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            {enrollments.length > 6 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/my-courses")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {t("dashboard.viewAllCourses", "View All My Courses")}
                        <svg
                            className="w-4 h-4"
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
                    </button>
                </div>
            )}
        </div>
    );
};

EnrolledCoursesSection.propTypes = {
    enrollments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            CourseId: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
            enrollmentDate: PropTypes.string.isRequired,
            progressPercentage: PropTypes.number,
            certificateIssued: PropTypes.bool,
            Course: PropTypes.shape({
                Title: PropTypes.string,
                Image: PropTypes.string,
                Category: PropTypes.string,
                Level: PropTypes.string,
            }),
        })
    ),
};

export default EnrolledCoursesSection;
