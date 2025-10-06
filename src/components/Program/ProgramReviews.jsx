import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Star, ThumbsUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "../../utils/axios";

const ProgramReviews = ({ programId }) => {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    });

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/programs/${programId}/reviews`);
            if (response.data.success) {
                setReviews(response.data.reviews || []);
                setStats(
                    response.data.stats || {
                        averageRating: 0,
                        totalReviews: 0,
                        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                    }
                );
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            // Don't show error to user, just show empty state
        } finally {
            setLoading(false);
        }
    }, [programId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("Reviews") || "Reviews"}
                </h3>
                <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {t("No reviews yet") || "No reviews yet"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        {t("Be the first to review this program") ||
                            "Be the first to review this program"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t("Reviews") || "Reviews"}
            </h3>

            {/* Reviews Summary */}
            <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Average Rating */}
                    <div className="text-center md:text-left">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-bold text-gray-900">
                                {stats.averageRating.toFixed(1)}
                            </span>
                            <span className="text-gray-500">
                                {t("out of 5") || "out of 5"}
                            </span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start mb-1">
                            {renderStars(Math.round(stats.averageRating))}
                        </div>
                        <p className="text-sm text-gray-500">
                            {stats.totalReviews} {t("reviews") || "reviews"}
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1 max-w-md">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = stats.distribution[rating] || 0;
                            const percentage =
                                stats.totalReviews > 0
                                    ? (count / stats.totalReviews) * 100
                                    : 0;
                            return (
                                <div
                                    key={rating}
                                    className="flex items-center gap-2 mb-2"
                                >
                                    <span className="text-sm text-gray-600 w-12">
                                        {rating} {t("star") || "star"}
                                    </span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500 w-12 text-right">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                    >
                        <div className="flex items-start gap-4">
                            {/* User Avatar */}
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-semibold">
                                    {review.userName?.[0]?.toUpperCase() || "U"}
                                </span>
                            </div>

                            {/* Review Content */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {review.userName || t("Anonymous")}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                review.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {renderStars(review.rating)}
                                </div>

                                {review.comment && (
                                    <p className="text-gray-700 mb-3">
                                        {review.comment}
                                    </p>
                                )}

                                {/* Helpful Button */}
                                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>
                                        {t("Helpful") || "Helpful"} (
                                        {review.helpfulCount || 0})
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

ProgramReviews.propTypes = {
    programId: PropTypes.string.isRequired,
};

export default ProgramReviews;
