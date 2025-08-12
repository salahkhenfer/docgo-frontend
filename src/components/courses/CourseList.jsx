import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Star } from "lucide-react";

export function CourseList({
    courses = [],
    loading = false,
    pagination,
    onPageChange,
    onCourseClick,
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
        <div className="relative transition-all duration-300">
            <div className="space-y-4 relative">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-2xl
                         shadow-sm hover:shadow-md transition-all 
                         duration-200 overflow-hidden cursor-pointer relative"
                        onClick={() =>
                            onCourseClick && onCourseClick(course.id)
                        }
                    >
                        <div className="flex flex-col md:flex-row relative">
                            {course.isFeatured && (
                                <div className="absolute top-3 right-3">
                                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        <span className="text-xs font-semibold">
                                            Vedette
                                        </span>
                                    </div>
                                </div>
                            )}
                            {/* Course Image */}
                            <div className="md:w-48 h-48 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                {course.image ||
                                course.Image ||
                                course.coverImage ? (
                                    <img
                                        src={
                                            course.image ||
                                            course.Image ||
                                            course.coverImage
                                        }
                                        alt={course.title || course.Title}
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
                                            {course.title || course.Title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {course.description ||
                                                course.Description ||
                                                course.shortDescription}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        {(course.price || course.Price) > 0 ? (
                                            <>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    $
                                                    {course.price ||
                                                        course.Price}
                                                </div>
                                                {(course.discountPrice ||
                                                    course.originalPrice) &&
                                                    (course.discountPrice ||
                                                        course.originalPrice) >
                                                        (course.price ||
                                                            course.Price) && (
                                                        <div className="text-sm text-gray-500 line-through">
                                                            $
                                                            {course.discountPrice ||
                                                                course.originalPrice}
                                                        </div>
                                                    )}
                                            </>
                                        ) : (
                                            <div className="text-2xl font-bold text-green-600">
                                                {t("free") || "Free"}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(course.category || course.Category) && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {course.category || course.Category}
                                        </span>
                                    )}
                                    {(course.specialty || course.Specialty) && (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            {course.specialty ||
                                                course.Specialty}
                                        </span>
                                    )}
                                    {(course.difficulty || course.Level) && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                            {course.difficulty || course.Level}
                                        </span>
                                    )}
                                    {course.certificate && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                            🏆{" "}
                                            {t("Certificate") || "Certificate"}
                                        </span>
                                    )}
                                    {course.isFeatured && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">
                                            ⭐ {t("Featured") || "Featured"}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {(course.duration ||
                                            course.Duration) && (
                                            <span>
                                                ⏱️{" "}
                                                {course.duration ||
                                                    course.Duration}
                                            </span>
                                        )}
                                        {(course.level || course.Level) && (
                                            <span>
                                                📊{" "}
                                                {course.level || course.Level}
                                            </span>
                                        )}
                                        {(course.language ||
                                            course.Language) && (
                                            <span>
                                                🌐{" "}
                                                {course.language ||
                                                    course.Language}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCourseClick &&
                                                    onCourseClick(course.id);
                                            }}
                                        >
                                            {t("View Details") ||
                                                "View Details"}
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Handle enrollment
                                            }}
                                        >
                                            {t("Enroll Now") || "Enroll Now"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                        onClick={() =>
                            onPageChange &&
                            onPageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage <= 1}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("Previous") || "Previous"}
                    </button>

                    {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() =>
                                        onPageChange && onPageChange(page)
                                    }
                                    className={`px-4 py-2 rounded-xl ${
                                        pagination.currentPage === page
                                            ? "bg-blue-600 text-white"
                                            : "border border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        }
                    )}

                    <button
                        onClick={() =>
                            onPageChange &&
                            onPageChange(pagination.currentPage + 1)
                        }
                        disabled={
                            pagination.currentPage >= pagination.totalPages
                        }
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("Next") || "Next"}
                    </button>
                </div>
            )}
        </div>
    );
}

CourseList.propTypes = {
    courses: PropTypes.array,
    loading: PropTypes.bool,
    pagination: PropTypes.shape({
        currentPage: PropTypes.number,
        totalPages: PropTypes.number,
        totalCourses: PropTypes.number,
    }),
    onPageChange: PropTypes.func,
    onCourseClick: PropTypes.func,
};

export default CourseList;
