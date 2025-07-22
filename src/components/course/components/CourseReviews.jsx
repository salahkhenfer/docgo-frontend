import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const CourseReviews = ({ courseStats, course }) => {
    const { t } = useTranslation();
    const reviews = course.reviews || [];
    const averageRating = courseStats?.averageRating || 0;
    const totalReviews = courseStats?.reviewCount || reviews.length || 0;

    // Generate rating distribution for visualization
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
        const count = reviews.filter(
            (review) => Math.floor(review.rating) === rating
        ).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return { rating, count, percentage };
    });

    const renderStars = (rating, size = "text-sm") => {
        return (
            <div className={`flex items-center ${size}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
                <span className="text-yellow-500 text-xl mr-3">⭐</span>
                <h3 className="text-xl font-bold text-gray-900">
                    {t("course_data.studentReviews") || "Student Reviews"}
                </h3>
            </div>

            {totalReviews > 0 ? (
                <div>
                    {/* Rating Summary */}
                    <div className="flex items-center mb-8">
                        <div className="text-center mr-8">
                            <div className="text-4xl font-bold text-gray-900 mb-1">
                                {averageRating.toFixed(1)}
                            </div>
                            {renderStars(averageRating, "text-lg")}
                            <div className="text-sm text-gray-500 mt-1">
                                {totalReviews}{" "}
                                {totalReviews !== 1
                                    ? t("course_data.reviews") || "reviews"
                                    : t("course_data.review") || "review"}
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="flex-1">
                            {ratingDistribution.map(
                                ({ rating, count, percentage }) => (
                                    <div
                                        key={rating}
                                        className="flex items-center mb-2"
                                    >
                                        <span className="text-sm text-gray-600 w-6">
                                            {rating}
                                        </span>
                                        <FaStar className="text-yellow-400 text-xs mx-2" />
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-500 w-8 text-right">
                                            {count}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900">
                            {t("course_data.recentReviews") || "Recent Reviews"}
                        </h4>
                        {reviews.slice(0, 5).map((review, index) => (
                            <div
                                key={review.id || index}
                                className="border-b border-gray-100 pb-6 last:border-b-0"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                            {(
                                                review.user?.name ||
                                                review.userName ||
                                                "A"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {review.user?.name ||
                                                    review.userName ||
                                                    "Anonymous Student"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(
                                                    review.createdAt ||
                                                        review.date
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {renderStars(review.rating)}
                                </div>

                                {review.title && (
                                    <h5 className="font-medium text-gray-900 mb-2">
                                        {review.title}
                                    </h5>
                                )}

                                <p className="text-gray-700 leading-relaxed">
                                    {review.comment ||
                                        review.content ||
                                        review.text}
                                </p>

                                {review.helpful && (
                                    <div className="flex items-center mt-3 text-sm text-gray-500">
                                        <span className="mr-1">👍</span>
                                        <span>
                                            {review.helpful}{" "}
                                            {t("course_data.foundHelpful") ||
                                                "found this helpful"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {reviews.length > 5 && (
                            <div className="text-center pt-4">
                                <button className="text-blue-600 hover:text-blue-700 font-medium">
                                    {t("course_data.viewAllReviews", {
                                        count: totalReviews,
                                    }) || `View All ${totalReviews} Reviews`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">⭐</div>
                    <p className="text-gray-500 mb-2">
                        {t("course_data.noReviewsYet") || "No reviews yet"}
                    </p>
                    <p className="text-sm text-gray-400">
                        {t("course_data.beFirstToReview") ||
                            "Be the first to review this course!"}
                    </p>
                </div>
            )}
        </div>
    );
};

CourseReviews.propTypes = {
    courseStats: PropTypes.object,
    course: PropTypes.object.isRequired,
};

export default CourseReviews;
