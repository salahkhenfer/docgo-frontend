import {
    ArrowLeft,
    Clock,
    DollarSign,
    GraduationCap,
    Heart,
    Mail,
    MessageSquare,
    PlayCircle,
    Send,
    Share2,
    Star,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoMdRefresh } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../AppContext"; // Add auth context
import { useCourse } from "../hooks/useCourse";
import MainLoading from "../MainLoading";
import axios from "../utils/axios";

// Import component parts
import VideoPlayer from "../components/Common/VideoPlayer";
import CourseContent from "../components/course/components/CourseContent";
import CourseFAQSection from "../components/course/components/CourseFAQSection";
import CourseReviews from "../components/course/components/CourseReviews";
import CourseSmallCard from "../components/course/components/CourseSmallCard";

export const Course = () => {
    const { t, i18n } = useTranslation();
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAppContext(); // Use context for auth
    const [showVideo, setShowVideo] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [contactForm, setContactForm] = useState({
        subject: "",
        message: "",
        name: user ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
    });
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);

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
        paymentStatus, // Add payment status
    } = useCourse(courseId);

    const formatCurrency = (amount) => {
        if (!amount) return t("Free") || "Free";
        // eslint-disable-next-line no-undef
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-DZ" : "en-US",
            {
                style: "currency",
                currency: "DZD",
            },
        ).format(amount);
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!contactForm.subject || !contactForm.message) {
            toast.error(
                t("Please fill all fields") || "Please fill all fields",
            );
            return;
        }

        // For non-authenticated users, validate name and email
        if (!user && (!contactForm.name || !contactForm.email)) {
            toast.error(
                t("Please fill all fields") || "Please fill all fields",
            );
            return;
        }

        try {
            setIsSubmittingContact(true);

            const requestData = {
                subject: contactForm.subject,
                message: contactForm.message,
                relatedType: "course",
                relatedId: courseId,
            };

            // For non-authenticated users, include name and email
            if (!user) {
                requestData.name = contactForm.name;
                requestData.email = contactForm.email;
            }

            const endpoint = user ? "/contact" : "/contact";
            await axios.post(endpoint, requestData);

            toast.success(
                t("Message sent successfully") || "Message sent successfully",
            );

            setContactForm({
                subject: "",
                message: "",
                name: user ? `${user.firstName} ${user.lastName}` : "",
                email: user?.email || "",
            });
            setShowContactForm(false);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(t("Error sending message") || "Error sending message");
        } finally {
            setIsSubmittingContact(false);
        }
    };

    const handleShare = async () => {
        if (!courseData?.course) return;

        const course = courseData.course;
        const title =
            i18n.language === "ar" && course.Title_ar
                ? course.Title_ar
                : course.Title;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: course.Description || course.shortDescription,
                    url: window.location.href,
                });
            } catch (error) {
                // Error sharing
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success(
                t("Link copied to clipboard") || "Link copied to clipboard",
            );
        }
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(
            isFavorite
                ? t("Removed from favorites") || "Removed from favorites"
                : t("Added to favorites") || "Added to favorites",
        );
    };

    if (loading) {
        return <MainLoading />;
    }

    if (hasError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-4xl sm:text-5xl mb-4">
                        ❌
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {t("Unable to Load Course") || "Unable to Load Course"}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                        {error ||
                            t(
                                "Something went wrong while loading the course details.",
                            ) ||
                            "Something went wrong while loading the course details."}
                    </p>
                    <button
                        onClick={retry}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto text-sm sm:text-base"
                    >
                        <IoMdRefresh className="mr-2 w-4 h-4" />
                        {t("Try Again") || "Try Again"}
                    </button>
                    <Link
                        to="/Courses"
                        className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
                    >
                        ← {t("Back to Courses") || "Back to Courses"}
                    </Link>
                </div>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
                    <div className="text-gray-400 text-4xl sm:text-5xl mb-4">
                        📚
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {t("Course Not Found") || "Course Not Found"}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                        {t(
                            "The course you're looking for doesn't exist or has been removed.",
                        ) ||
                            "The course you're looking for doesn't exist or has been removed."}
                    </p>
                    <Link
                        to="/Courses"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 inline-block text-sm sm:text-base"
                    >
                        {t("Browse Courses") || "Browse Courses"}
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
        setCurrentVideo(video);
        setShowVideo(true);
    };

    const handleCloseVideo = () => {
        setShowVideo(false);
        setCurrentVideo(null);
    };

    // Get video URL with API base - check multiple possible field names
    const getVideoUrl = (video) => {
        if (!video) return null;

        // Check various possible field names for video URL
        const videoPath =
            video.videoUrl ||
            video.video_url ||
            video.url ||
            video.VideoUrl ||
            video.path ||
            video.videoPath ||
            video.Video ||
            video.video;

        if (!videoPath) return null;
        if (videoPath.startsWith("http")) return videoPath;
        return import.meta.env.VITE_API_URL + videoPath;
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

    // Get course title based on language
    const courseTitle =
        i18n.language === "ar" && course.Title_ar
            ? course.Title_ar
            : course.Title;
    const courseDescription =
        i18n.language === "ar" && course.Description_ar
            ? course.Description_ar
            : course.Description;

    return (
        <div className="min-h-screen bg-gray-50 w-full">
            {/* Enhanced Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {t("Course Details") || "Course Details"}
                                </h1>
                                <p className="text-gray-600">{courseTitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setShowContactForm(!showContactForm)
                                }
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {t("Contact") || "Contact"}
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleFavorite}
                                className={`p-2 rounded-lg transition-colors ${
                                    isFavorite
                                        ? "bg-red-50 text-red-600"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                <Heart
                                    className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            {refetching && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg flex items-center text-sm sm:text-base">
                        <IoMdRefresh className="animate-spin mr-2 w-4 h-4" />
                        <span className="hidden sm:inline">
                            {t("Refreshing...") || "Refreshing..."}
                        </span>
                        <span className="sm:hidden">...</span>
                    </div>
                </div>
            )}

            {/* Enhanced Hero Section with Video */}
            <div className="bg-white shadow-sm mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Course Image/Video */}
                    <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative rounded-xl mb-8">
                        {course.Image ? (
                            <>
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${course.Image}`}
                                    alt={courseTitle}
                                    className="w-full h-full object-cover"
                                />
                                {/* Video Play Button */}
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    {isEnrolled ? (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/Courses/${courseId}/watch`,
                                                )
                                            }
                                            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-6 transition-all transform hover:scale-105 shadow-lg"
                                        >
                                            <PlayCircle className="w-16 h-16" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowVideo(true)}
                                            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-105"
                                        >
                                            <PlayCircle className="w-12 h-12 text-blue-600" />
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <GraduationCap className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">
                                        {t("No image available") ||
                                            "No image available"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Course Title and Info */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
                        <div className="flex-1">
                            <h1
                                className="text-4xl font-bold text-gray-900 mb-4"
                                dir={i18n.language === "ar" ? "rtl" : "ltr"}
                            >
                                {courseTitle}
                            </h1>
                            {courseDescription && (
                                <p
                                    className="text-xl text-gray-600 mb-6"
                                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                                >
                                    {courseDescription}
                                </p>
                            )}

                            {/* Watch Course Button for Enrolled Users */}
                            {isEnrolled && (
                                <button
                                    onClick={() =>
                                        navigate(`/Courses/${courseId}/watch`)
                                    }
                                    className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center gap-3"
                                >
                                    <PlayCircle className="w-6 h-6" />
                                    {t("Watch Course") || "Watch Course"}
                                </button>
                            )}

                            {/* Course Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Price */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-sm text-green-700 font-medium">
                                                {t("Price") || "Price"}
                                            </p>
                                            <p className="text-lg font-bold text-green-800">
                                                {formatCurrency(
                                                    coursePrice,
                                                    currency,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-blue-700 font-medium">
                                                {t("Duration") || "Duration"}
                                            </p>
                                            <p className="text-lg font-bold text-blue-800">
                                                {formatTotalDuration(
                                                    courseStats?.totalDuration,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Students */}
                                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-purple-700 font-medium">
                                                {t("Students") || "Students"}
                                            </p>
                                            <p className="text-lg font-bold text-purple-800">
                                                {courseStats?.enrolledCount ||
                                                    0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-100">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-5 h-5 text-yellow-600" />
                                        <div>
                                            <p className="text-sm text-yellow-700 font-medium">
                                                {t("Rating") || "Rating"}
                                            </p>
                                            <p className="text-lg font-bold text-yellow-800">
                                                {courseStats?.averageRating
                                                    ? `${courseStats.averageRating}/5`
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8 order-2 lg:order-1">
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

                        {/* FAQ Section */}
                        <CourseFAQSection faqs={course.RelatedFAQs || []} />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1 space-y-4 lg:space-y-6 order-1 lg:order-2">
                        {/* Contact Form */}
                        {showContactForm && (
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    {t("Contact for this course") ||
                                        "Contact for this course"}
                                </h3>
                                <form
                                    onSubmit={handleContactSubmit}
                                    className="space-y-4"
                                >
                                    {/* Name and Email fields for non-authenticated users */}
                                    {!user && (
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t("Name") || "Name"}{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={contactForm.name}
                                                    onChange={(e) =>
                                                        setContactForm({
                                                            ...contactForm,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder={
                                                        t("Your full name") ||
                                                        "Your full name"
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {t("Email") || "Email"}{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="email"
                                                    value={contactForm.email}
                                                    onChange={(e) =>
                                                        setContactForm({
                                                            ...contactForm,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder={
                                                        t(
                                                            "Your email address",
                                                        ) ||
                                                        "Your email address"
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("Subject") || "Subject"}{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={contactForm.subject}
                                            onChange={(e) =>
                                                setContactForm({
                                                    ...contactForm,
                                                    subject: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder={
                                                t("Message subject") ||
                                                "Message subject"
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("Message") || "Message"}{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            value={contactForm.message}
                                            onChange={(e) =>
                                                setContactForm({
                                                    ...contactForm,
                                                    message: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder={
                                                t(
                                                    "Your message about this course...",
                                                ) ||
                                                "Your message about this course..."
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingContact}
                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            {isSubmittingContact
                                                ? t("Sending...") ||
                                                  "Sending..."
                                                : t("Send") || "Send"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowContactForm(false)
                                            }
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            {t("Cancel") || "Cancel"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Course Card */}
                        <div className="lg:sticky lg:top-6">
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
                                paymentStatus={paymentStatus}
                            />
                        </div>

                        {/* Info Card */}
                        {!showContactForm && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                <div className="text-center">
                                    <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                        {t("Questions about this course?") ||
                                            "Questions about this course?"}
                                    </h3>
                                    <p className="text-blue-700 text-sm mb-4">
                                        {t(
                                            "Click the Contact button to get in touch with us",
                                        ) ||
                                            "Click the Contact button to get in touch with us"}
                                    </p>
                                    <button
                                        onClick={() => setShowContactForm(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                                    >
                                        {t("Contact Us") || "Contact Us"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {showVideo && currentVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="bg-black rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-900">
                            <h3 className="text-lg font-semibold text-white">
                                {currentVideo.title || t("Course Video")}
                            </h3>
                            <button
                                onClick={handleCloseVideo}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-black">
                            {getVideoUrl(currentVideo) ? (
                                <VideoPlayer
                                    src={getVideoUrl(currentVideo)}
                                    title={currentVideo.title}
                                    autoPlay={true}
                                    className="w-full"
                                />
                            ) : (
                                <div className="bg-gray-900 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                                    <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-400">
                                        {t("Video not available") ||
                                            "Video not available"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Check console for video data structure
                                    </p>
                                </div>
                            )}
                        </div>
                        {currentVideo.description && (
                            <div className="p-4 bg-gray-900 text-white">
                                <p className="text-sm text-gray-300">
                                    {currentVideo.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default Course;
