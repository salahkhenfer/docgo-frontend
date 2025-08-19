import { useTranslation } from "react-i18next";
import { CourseCard } from "./CourseCard";
import { CourseCardSkeleton } from "../UI/LoadingSpinner";
import { useEffect } from "react";
import PropTypes from "prop-types";

export function CourseGrid({
    courses = [],
    loading = false,
    pagination,
    onPageChange,
    onCourseClick,
}) {
    const { t } = useTranslation();

    useEffect(() => {
        console.log("Courses loaded:", courses);
    }, [courses]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                    <CourseCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (courses.length === 0 && !loading) {
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
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        id={course.id}
                        Image={course.Image || course.coverImage}
                        title={course.Title}
                        description={
                            course.shortDescription || course.Description
                        }
                        price={course.Price}
                        discountPrice={course.discountPrice}
                        currency={course.Currency || "USD"}
                        level={course.Level || course.difficulty}
                        averageRating={
                            course.stats?.averageRating || course.Rate
                        }
                        totalReviews={
                            course.stats?.totalcourse_reviews ||
                            course.totalRatings
                        }
                        isEnrolled={course.userStatus?.isEnrolled || false}
                        enrollmentStatus={course.userStatus?.enrollmentStatus}
                        progress={course.userStatus?.progress || 0}
                        onClick={() =>
                            onCourseClick && onCourseClick(course.id)
                        }
                    />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                        onClick={() => onPageChange(pagination.currentPage - 1)}
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
                                    onClick={() => onPageChange(page)}
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
                        onClick={() => onPageChange(pagination.currentPage + 1)}
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

CourseGrid.propTypes = {
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

export default CourseGrid;
