import { useTranslation } from "react-i18next";
import { CourseCard } from "./CourseCard";
import { useCourses } from "../../hooks/useCourses";
import { CourseCardSkeleton } from "../UI/LoadingSpinner";
import { ErrorMessage } from "../UI/ErrorMessage";

export function CourseGrid({ filters }) {
    const { t } = useTranslation();
    const { courses, loading, error, pagination, isAuthenticated, changePage } =
        useCourses(filters);

    if (loading) {
        return (
            <section className="self-end mt-12 w-full max-w-[1368px] max-md:mt-10 max-md:max-w-full">
                <h2 className="text-3xl font-semibold text-zinc-800 max-md:max-w-full">
                    {t("TousLesCours")}
                </h2>
                <div className="flex flex-wrap gap-8 items-center mt-12 max-w-full w-[1280px] max-md:mt-10">
                    {/* Loading skeleton */}
                    {Array.from({ length: 8 }).map((_, index) => (
                        <CourseCardSkeleton key={index} />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="self-end mt-12 w-full max-w-[1368px] max-md:mt-10 max-md:max-w-full">
                <h2 className="text-3xl font-semibold text-zinc-800 max-md:max-w-full">
                    {t("TousLesCours")}
                </h2>
                <ErrorMessage
                    message={error}
                    type="error"
                    onRetry={() => window.location.reload()}
                    className="mt-12"
                />
            </section>
        );
    }

    return (
        <section className="self-end mt-12 w-full max-w-[1368px] max-md:mt-10 max-md:max-w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-zinc-800 max-md:max-w-full">
                    {t("TousLesCours")}
                </h2>

                {/* Guest mode indicator */}
                {!isAuthenticated && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-blue-600 text-sm">
                            👋 {t("ViewingAsGuest") || "Viewing as guest"}
                        </span>
                        <span className="text-blue-500 text-xs">
                            {t("LoginForFullAccess") || "Login for full access"}
                        </span>
                    </div>
                )}
            </div>

            {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-12 p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">
                        {t("NoCoursesFound") || "No courses found"}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        {t("TryAdjustingFilters") ||
                            "Try adjusting your search filters"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap gap-8 items-center mt-12 max-w-full w-[1280px] max-md:mt-10">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                imageUrl={course.ImageUrl || course.coverImage}
                                title={course.Title}
                                description={
                                    course.shortDescription ||
                                    course.Description
                                }
                                price={course.Price}
                                discountPrice={course.discountPrice}
                                currency={course.Currency}
                                level={course.Level}
                                averageRating={course.stats?.averageRating}
                                totalReviews={course.stats?.totalReviews}
                                isEnrolled={course.userStatus?.isEnrolled}
                                enrollmentStatus={
                                    course.userStatus?.enrollmentStatus
                                }
                                progress={course.userStatus?.progress}
                                hasImage={
                                    !!course.ImageUrl || !!course.coverImage
                                }
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 gap-4">
                            <button
                                onClick={() =>
                                    changePage(pagination.currentPage - 1)
                                }
                                disabled={!pagination.hasPrevPage}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
                            >
                                {t("Previous") || "Previous"}
                            </button>

                            <span className="text-gray-600">
                                {t("Page") || "Page"} {pagination.currentPage}{" "}
                                {t("of") || "of"} {pagination.totalPages}
                            </span>

                            <button
                                onClick={() =>
                                    changePage(pagination.currentPage + 1)
                                }
                                disabled={!pagination.hasNextPage}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
                            >
                                {t("Next") || "Next"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
