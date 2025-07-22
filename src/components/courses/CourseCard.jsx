import { t } from "i18next";
import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export function CourseCard({
    id,
    imageUrl,
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
    const [liked, setLiked] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [hasImageError, setHasImageError] = useState(false);

    const toggleLike = () => setLiked(!liked);
   
    const formatPrice = (price) => {
        if (!price || price === 0) return t("Free") || "Free";
        return `${price} ${currency}`;
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
        <article className="flex relative grow shrink gap-9 items-start self-stretch my-auto min-w-60 w-[325px]">
            <div className="flex z-0 flex-col flex-1 shrink my-auto w-full bg-white basis-0 min-w-60 rounded-xl shadow-md p-4">
                {hasImage ? (
                    <>
                        {/* Skeleton shown while image loads or fails */}
                        {(!isImageLoaded || hasImageError) && (
                            <div className="w-full absolute aspect-[2.06] bg-gray-200 animate-pulse rounded-lg mb-4" />
                        )}
                        {/* Actual Image */}
                        {!hasImageError && (
                            <img
                                src={imageUrl}
                                alt={title}
                                onLoad={() => setIsImageLoaded(true)}
                                onError={() => setHasImageError(true)}
                                className={`object-contain w-full aspect-[2.06] rounded-lg mb-4 transition-opacity duration-300 ${
                                    isImageLoaded ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        )}
                    </>
                ) : (
                    <div className="w-full aspect-[2.06] bg-gray-200 animate-pulse rounded-lg mb-4" />
                )}

                {/* Title & Description */}
                <div className="w-full">
                    <h3 className="text-2xl font-semibold text-zinc-800">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm leading-5 text-neutral-600">
                        {description}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                        {/* {averageRating && (
                            <div className="flex items-center gap-1">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`text-lg ${
                                                star <=
                                                Math.floor(averageRating)
                                                    ? "text-yellow-500"
                                                    : star ===
                                                          Math.ceil(
                                                              averageRating
                                                          ) &&
                                                      averageRating % 1 !== 0
                                                    ? "text-yellow-300"
                                                    : "text-gray-300"
                                            }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600 ml-1">
                                    {averageRating} ({totalReviews || 0})
                                </span> 
                            </div>
                        )} */}

                        {level && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                {level}
                            </span>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-3">
                        {discountPrice ? (
                            <>
                                <span className="text-lg font-bold text-green-600">
                                    {formatPrice(discountPrice)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-800">
                                {formatPrice(price)}
                            </span>
                        )}
                    </div>

                    {/* Enrollment Status */}
                    {getEnrollmentStatusText() && (
                        <div className="mt-3">
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                    enrollmentStatus === "approved"
                                        ? "bg-green-100 text-green-600"
                                        : enrollmentStatus === "pending"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-red-100 text-red-600"
                                }`}
                            >
                                {getEnrollmentStatusText()}
                            </span>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {shouldShowProgress && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>{t("Progress") || "Progress"}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Button */}
                <Link
                    to={`/CourseDetails/${id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    aria-label={t("Detail")}
                    data-testid="course-detail-link"
                    className="gap-2 self-start px-8 py-3 mt-4 text-base leading-relaxed text-white bg-blue-500 rounded-full hover:bg-blue-600 transition w-full text-center"
                >
                    {isEnrolled && enrollmentStatus === "approved"
                        ? t("ContinueCourse") || "Continue Course"
                        : t("Detail") || "View Details"}
                </Link>
            </div>

            {/* Heart Icon */}
            <div className="flex absolute z-10 gap-4 items-center self-start right-[21px] top-[21px]">
                <BsHeartFill
                    onClick={toggleLike}
                    className={`w-10 h-10 cursor-pointer transition-colors duration-300 ${
                        liked ? "text-red-600" : "text-gray-300"
                    }`}
                />
            </div>
        </article>
    );
}
