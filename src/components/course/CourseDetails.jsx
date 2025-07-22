import { useParams } from "react-router-dom";
import {
    FaDollarSign,
    FaClock,
    FaStar,
    FaPlay,
    FaLock,
    FaRefresh,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCourse } from "../../hooks/useCourse";
import MainLoading from "../../MainLoading";

export const CourseDetails = () => {
    const { courseId } = useParams();
    const {
        courseData,
        loading,
        enrolling,
        refetching,
        error,
        hasError,
        retry,
        refresh,
        handleEnrollClick,
        isEnrolled,
        isFree,
        coursePrice,
        currency,
        hasData,
    } = useCourse(courseId);

    if (loading) {
        return <MainLoading />;
    }

    if (hasError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={retry}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Course not found</p>
            </div>
        );
    }

    const handleVideoClick = (video) => {
        if (!video.isPreview && !isEnrolled) {
            console.log("Video is locked - user not enrolled");
            return;
        }
        console.log(`Playing video: ${video.title}`);
        // Add your video player logic here
    };

    // Helper function to format duration from seconds to MM:SS
    const formatDuration = (seconds) => {
        if (!seconds) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col max-w-full w-[797px] mx-auto px-4">
            <header className="relative">
                {/* Refresh button */}
                <button
                    onClick={refresh}
                    disabled={refetching}
                    className="absolute top-0 right-0 p-2 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
                    title="Refresh course data"
                >
                    <FaRefresh
                        className={`${refetching ? "animate-spin" : ""}`}
                    />
                </button>

                <h1 className="text-4xl font-bold text-zinc-800 max-md:text-3xl">
                    {courseData.course.Title}
                </h1>
                <p className="mt-4 text-base leading-7 text-neutral-600">
                    {courseData.course.Description}
                </p>
                {courseData.course.ImageUrl && (
                    <img
                        src={courseData.course.ImageUrl}
                        alt="Course Illustration"
                        className="mt-6 w-full h-auto rounded-2xl shadow-md"
                    />
                )}
                <div className="flex flex-wrap gap-4 items-center mt-6">
                    <span className="px-4 py-2 rounded-full bg-zinc-100 text-zinc-800 text-sm font-medium">
                        {courseData.course.Level || "Course"}
                    </span>
                    {courseData.course.Price && (
                        <div className="flex items-center gap-2 text-zinc-800 text-sm">
                            <FaDollarSign className="text-green-500" />
                            <span>
                                {courseData.course.discountPrice ? (
                                    <>
                                        <span className="line-through text-gray-500 mr-2">
                                            {courseData.course.Price}
                                        </span>
                                        <span className="text-green-600 font-semibold">
                                            {courseData.course.discountPrice}
                                        </span>
                                    </>
                                ) : (
                                    courseData.course.Price
                                )}
                                {" " + (courseData.course.Currency || "DZD")}
                            </span>
                        </div>
                    )}
                    {courseData.course.duration && (
                        <div className="flex items-center gap-2 text-zinc-800 text-sm">
                            <FaClock className="text-blue-500" />
                            <span>
                                {Math.floor(courseData.course.duration / 3600)}h{" "}
                                {Math.floor(
                                    (courseData.course.duration % 3600) / 60
                                )}
                                m
                            </span>
                        </div>
                    )}
                    {courseData.courseStats.averageRating > 0 && (
                        <div className="flex items-center gap-2 text-zinc-800 text-sm">
                            <FaStar className="text-yellow-400" />
                            <span>
                                {courseData.courseStats.averageRating.toFixed(
                                    1
                                )}
                            </span>
                            <span className="text-gray-500">
                                ({courseData.courseStats.totalReviews} reviews)
                            </span>
                        </div>
                    )}
                </div>

                {/* Enrollment Status and Actions */}
                <div className="mt-5">
                    {isEnrolled ? (
                        <Link
                            to={`/coursedetails/${courseData.course.id}/videos`}
                            className="px-6 py-3 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition"
                        >
                            Continue Learning
                        </Link>
                    ) : courseData.userStatus.applicationStatus ===
                      "pending" ? (
                        <div className="px-6 py-3 bg-yellow-500 text-white rounded-full text-sm">
                            Application Pending
                        </div>
                    ) : (
                        <button
                            className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={handleEnrollClick}
                            disabled={enrolling}
                        >
                            {enrolling ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Enrolling...
                                </span>
                            ) : isFree ? (
                                "Enroll for Free"
                            ) : (
                                `Enroll for ${coursePrice} ${currency}`
                            )}
                        </button>
                    )}
                </div>
            </header>

            {/* Videos Section */}
            <section className="mt-8">
                <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                    Course Content ({courseData.course.videos?.length || 0}{" "}
                    videos)
                </h2>
                <div className="space-y-3">
                    {courseData.course.videos?.map((video, index) => {
                        const isLocked = !video.isPreview && !isEnrolled;
                        return (
                            <div
                                key={video.id}
                                className={`flex items-center p-4 rounded-lg border transition-colors cursor-pointer ${
                                    isLocked
                                        ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                                        : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                                }`}
                                onClick={() => handleVideoClick(video)}
                            >
                                <div className="flex-shrink-0 mr-4">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            isLocked
                                                ? "bg-gray-300 text-gray-500"
                                                : "bg-blue-500 text-white"
                                        }`}
                                    >
                                        {isLocked ? (
                                            <FaLock className="text-sm" />
                                        ) : (
                                            <FaPlay className="text-sm ml-1" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3
                                                className={`text-sm font-medium ${
                                                    isLocked
                                                        ? "text-gray-500"
                                                        : "text-zinc-800"
                                                }`}
                                            >
                                                {index + 1}. {video.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-xs ${
                                                    isLocked
                                                        ? "text-gray-400"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {formatDuration(video.duration)}
                                            </span>
                                            {/* {video.isPreview && (
                                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                                    Preview
                                                </span>
                                            )} */}
                                            {courseData.userStatus?.progress?.completedVideos?.includes(
                                                video.id
                                            ) && (
                                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">
                                                        ✓
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info for locked content */}
                {!isEnrolled && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <FaLock className="inline mr-2" />
                            Enroll in this course to unlock all videos and
                            access the complete content.
                        </p>
                    </div>
                )}

                {/* Course Statistics */}
                {courseData.courseStats.averageRating > 0 && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">
                            Course Rating
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold text-yellow-500">
                                {courseData.courseStats.averageRating.toFixed(
                                    1
                                )}
                            </div>
                            <div>
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={
                                                star <=
                                                Math.round(
                                                    courseData.courseStats
                                                        .averageRating
                                                )
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Based on{" "}
                                    {courseData.courseStats.totalReviews}{" "}
                                    reviews
                                </p>
                            </div>
                        </div>

                        {/* Rating distribution */}
                        {courseData.courseStats.ratingDistribution && (
                            <div className="mt-4 space-y-2">
                                {courseData.courseStats.ratingDistribution.map(
                                    (dist) => (
                                        <div
                                            key={dist.rating}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-sm w-8">
                                                {dist.rating}★
                                            </span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-yellow-400 h-2 rounded-full"
                                                    style={{
                                                        width: `${
                                                            courseData
                                                                .courseStats
                                                                .totalReviews >
                                                            0
                                                                ? (dist.count /
                                                                      courseData
                                                                          .courseStats
                                                                          .totalReviews) *
                                                                  100
                                                                : 0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600 w-12">
                                                {dist.count}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Reviews Section */}
                {courseData.course.course_reviews &&
                    courseData.course.course_reviews.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">
                                Recent Reviews
                            </h3>
                            <div className="space-y-4">
                                {courseData.course.course_reviews.map(
                                    (review) => (
                                        <div
                                            key={review.id}
                                            className="border-b pb-4"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <FaStar
                                                                key={star}
                                                                className={
                                                                    star <=
                                                                    review.Rate
                                                                        ? "text-yellow-400"
                                                                        : "text-gray-300"
                                                                }
                                                                size={14}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {review.User?.FirstName}{" "}
                                                    {review.User?.LastName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(
                                                        review.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.Comment && (
                                                <p className="text-sm text-gray-700">
                                                    {review.Comment}
                                                </p>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
            </section>
        </div>
    );
};
