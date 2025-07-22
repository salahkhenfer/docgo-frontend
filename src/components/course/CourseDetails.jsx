import { useParams } from "react-router-dom";
import { IoMdRefresh } from "react-icons/io";
import { Link } from "react-router-dom";
import { useCourse } from "../../hooks/useCourse";
import MainLoading from "../../MainLoading";

// Import component parts
import CourseHero from "./components/CourseHero";
import CourseSmallCard from "./components/CourseSmallCard";
import CourseContent from "./components/CourseContent";
import CourseReviews from "./components/CourseReviews";

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">❌</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Unable to Load Course
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error ||
                            "Something went wrong while loading the course details."}
                    </p>
                    <button
                        onClick={retry}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
                    >
                        <IoMdRefresh className="mr-2" />
                        Try Again
                    </button>
                    <Link
                        to="/courses"
                        className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm"
                    >
                        ← Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-gray-400 text-5xl mb-4">📚</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Course Not Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        The course you&apos;re looking for doesn&apos;t exist or
                        has been removed.
                    </p>
                    <Link
                        to="/courses"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-block"
                    >
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    const {
        course,
        userStatus,
        courseStats,
        courseProgress,
        certificate,
        upcomingMeets,
    } = courseData;

    const handleVideoClick = (video) => {
        console.log("Playing video:", video);
        // TODO: Implement video player logic
    };

    // Helper function to format duration from seconds to MM:SS
    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    // Helper function to format total duration
    const formatTotalDuration = (seconds) => {
        if (!seconds) return "0h 0m";
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Refresh Button */}
            {refetching && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                        <IoMdRefresh className="animate-spin mr-2" />
                        Refreshing...
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <CourseHero
                course={course}
                courseStats={courseStats}
                formatTotalDuration={formatTotalDuration}
            />

            {/* Main Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Content */}
                        <CourseContent
                            course={course}
                            userStatus={userStatus}
                            isEnrolled={isEnrolled}
                            handleVideoClick={handleVideoClick}
                            formatDuration={formatDuration}
                            courseStats={courseStats}
                            upcomingMeets={upcomingMeets}
                            certificate={certificate}
                        />

                        {/* Reviews Section */}
                        <CourseReviews
                            courseStats={courseStats}
                            course={course}
                        />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Course Card */}
                        <CourseSmallCard
                            course={course}
                            userStatus={userStatus}
                            courseProgress={courseProgress}
                            certificate={certificate}
                            isEnrolled={isEnrolled}
                            isFree={isFree}
                            coursePrice={coursePrice}
                            currency={currency}
                            enrolling={enrolling}
                            handleEnrollClick={handleEnrollClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
