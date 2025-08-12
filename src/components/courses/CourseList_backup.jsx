import { useTranslation } from "react-i18next";
import { Clock, Users, Star, Award } from "lucide-react";
import PropTypes from "prop-types";

export function CourseList({ 
    courses = [], 
    loading = false, 
    pagination, 
    onPageChange, 
    onCourseClick 
}) {
    const { t } = useTranslation();

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
                    >
                        <div className="flex gap-6">
                            <div className="w-48 h-32 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                type="error"
                onRetry={() => window.location.reload()}
                className="mt-8"
            />
        );
    }

    if (courses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-12 p-12 bg-white rounded-2xl shadow-sm">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-600 text-xl font-medium mb-2">
                    {t("NoCoursesFound") || "No courses found"}
                </p>
                <p className="text-gray-500 text-center max-w-md">
                    {t("TryAdjustingFilters") ||
                        "Try adjusting your search filters or browse different categories"}
                </p>
            </div>
        );
    }

    return (
        <div
            className={`relative transition-all duration-300 ${
                searchLoading ? "opacity-60" : "opacity-100"
            }`}
        >
            {searchLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-2xl">
                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-700 font-medium">
                            {t("Searching") || "Searching"}...
                        </span>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Course Image */}
                            <div className="md:w-48 h-48 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                {course.image ? (
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-white text-4xl">
                                        📚
                                    </div>
                                )}
                            </div>

                            {/* Course Info */}
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {course.description}
                                        </p>
                                    </div>
                                    {course.price && (
                                        <div className="text-right ml-4">
                                            <div className="text-2xl font-bold text-blue-600">
                                                ${course.price}
                                            </div>
                                            {course.originalPrice &&
                                                course.originalPrice >
                                                    course.price && (
                                                    <div className="text-sm text-gray-500 line-through">
                                                        ${course.originalPrice}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {course.category && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {course.category}
                                        </span>
                                    )}
                                    {course.specialty && (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            {course.specialty}
                                        </span>
                                    )}
                                    {course.difficulty && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                            {course.difficulty}
                                        </span>
                                    )}
                                    {course.certificate && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                            🏆{" "}
                                            {t("Certificate") || "Certificate"}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {course.duration && (
                                            <span>⏱️ {course.duration}</span>
                                        )}
                                        {course.level && (
                                            <span>📊 {course.level}</span>
                                        )}
                                        {course.students && (
                                            <span>
                                                👥 {course.students}{" "}
                                                {t("students") || "students"}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors">
                                            {t("View Details") ||
                                                "View Details"}
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                                            {t("Enroll Now") || "Enroll Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

CourseList.propTypes = {
    filters: PropTypes.object.isRequired,
};
