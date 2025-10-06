import { t } from "i18next";
import { useState } from "react";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useFavorite } from "../../hooks/useFavorite";
import { Star, BookOpen } from "lucide-react";
import PropTypes from "prop-types";
export function CourseCard({
    course,
    id,
    Image,
    title,
    description,
    price,
    discountPrice,
    currency = "USD",
    level,
    averageRating,
    totalReviews,
    isEnrolled = false,
    enrollmentStatus,
    progress = 0,
    hasImage = true,
}) {
    const [hasImageError, setHasImageError] = useState(false);
    const defaultThumbnail =
        "http://localhost:3000/Courses_Pictures/default-course-thumbnail.jpeg";

    // Use the favorite hook
    const {
        isFavorited,
        loading: favoriteLoading,
        toggleFavorite,
    } = useFavorite(id, "course");

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Create item object for local storage
        const courseItem = {
            id,
            title,
            description,
            price,
            discountPrice,
            currency,
            level,
            Image: Image || defaultThumbnail,
            hasImage,
        };

        toggleFavorite(courseItem);
    };

    const formatPrice = (price) => {
        if (!price || price === 0) return t("free") || "Free";
        // Format the price with proper number formatting
        const formattedNumber = Number(price).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
        return `${formattedNumber} ${currency}`;
    };

    const getEnrollmentStatusText = () => {
        if (!isEnrolled) return null;

        switch (enrollmentStatus) {
            case "pending":
                return t("ApplicationPending") || "Application Pending";
            case "approved":
                return t("Enrolled") || "Enrolled";
            case "rejected":
                return t("ApplicationRejected") || "Application Rejected";
            default:
                return null;
        }
    };

    const shouldShowProgress =
        isEnrolled && enrollmentStatus === "approved" && progress > 0;

    return (
        <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative group max-w-sm mx-auto">
            {/* Featured Badge */}
            {course.isFeatured && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-semibold">Featured</span>
                    </div>
                </div>
            )}

            {/* Heart Icon */}
            <div className="absolute top-4 left-4 z-20">
                {isFavorited ? (
                    <BsHeartFill
                        onClick={handleToggleFavorite}
                        className={`w-8 h-8 cursor-pointer transition-all duration-300 text-red-600 drop-shadow-sm ${
                            favoriteLoading ? "opacity-50" : "hover:scale-110"
                        }`}
                        title="Remove from favorites"
                    />
                ) : (
                    <BsHeart
                        onClick={handleToggleFavorite}
                        className={`w-8 h-8 cursor-pointer transition-all duration-300 text-white drop-shadow-lg hover:text-red-500 ${
                            favoriteLoading ? "opacity-50" : "hover:scale-110"
                        }`}
                        title="Add to favorites"
                    />
                )}
            </div>

            {/* Course Image */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                {hasImage && !hasImageError && Image ? (
                    <img
                        src={
                            import.meta.env.VITE_API_URL + Image ||
                            defaultThumbnail
                        }
                        alt={title}
                        onError={() => setHasImageError(true)}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="text-white text-4xl">
                        <BookOpen className="w-16 h-16" />
                    </div>
                )}
            </div>

            {/* Course Info */}
            <div className="p-6">
                {/* Title & Description */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* Price Section */}
                <div className="mb-4">
                    {discountPrice !== undefined && discountPrice !== null ? (
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-2xl font-bold ${
                                    discountPrice === 0
                                        ? "text-green-600"
                                        : "text-blue-600"
                                }`}
                            >
                                {formatPrice(discountPrice)}
                            </span>
                            {price > 0 && (
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(price)}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div
                            className={`text-2xl font-bold ${
                                price === 0 || !price
                                    ? "text-green-600"
                                    : "text-blue-600"
                            }`}
                        >
                            {formatPrice(price)}
                        </div>
                    )}
                </div>

                {/* Tags/Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {level && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                            📊 {level}
                        </span>
                    )}
                    {course.Category && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                            {course.Category}
                        </span>
                    )}
                    {course.Specialty && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            {course.Specialty}
                        </span>
                    )}
                    {course.certificate && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                            🏆 {t("Certificate") || "Certificate"}
                        </span>
                    )}
                    {course.Language && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
                            🌐 {course.Language}
                        </span>
                    )}
                </div>

                {/* Rating Section */}
                {averageRating !== undefined && averageRating !== null && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFullStar =
                                        star <= Math.floor(averageRating);
                                    const isHalfStar =
                                        star === Math.ceil(averageRating) &&
                                        averageRating % 1 !== 0;

                                    return (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                isFullStar
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : isHalfStar
                                                    ? "text-yellow-400 fill-yellow-200"
                                                    : "text-gray-300 fill-gray-200"
                                            } transition-colors`}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                                {averageRating.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                            {totalReviews || 0}{" "}
                            {totalReviews === 1 ? "review" : "reviews"}
                        </span>
                    </div>
                )}

                {/* Enrollment Status */}
                {getEnrollmentStatusText() && (
                    <div className="mb-4">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                enrollmentStatus === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : enrollmentStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {getEnrollmentStatusText()}
                        </span>
                    </div>
                )}

                {/* Progress Bar */}
                {shouldShowProgress && (
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span className="font-medium">
                                {t("Progress") || "Progress"}
                            </span>
                            <span className="font-semibold">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    to={`/Courses/${id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-full text-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                    {isEnrolled && enrollmentStatus === "approved"
                        ? t("ContinueCourse") || "Continue Course"
                        : t("View Details") || "View Details"}
                </Link>
            </div>
        </article>
    );
}

CourseCard.propTypes = {
    course: PropTypes.shape({
        isFeatured: PropTypes.bool,
        Category: PropTypes.string,
        Specialty: PropTypes.string,
        certificate: PropTypes.bool,
        Language: PropTypes.string,
    }),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Image: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number,
    discountPrice: PropTypes.number,
    currency: PropTypes.string,
    level: PropTypes.string,
    averageRating: PropTypes.number,
    totalReviews: PropTypes.number,
    isEnrolled: PropTypes.bool,
    enrollmentStatus: PropTypes.string,
    progress: PropTypes.number,
    hasImage: PropTypes.bool,
};
