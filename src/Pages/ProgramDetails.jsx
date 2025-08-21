import { useParams, useNavigate } from "react-router-dom";
import { IoMdRefresh } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
    ArrowLeft,
    MessageSquare,
    Send,
    Star,
    Clock,
    Users,
    Share2,
    Heart,
    PlayCircle,
    GraduationCap,
} from "lucide-react";
import { useProgram } from "../hooks/useProgram";
import { useAppContext } from "../AppContext";
import MainLoading from "../MainLoading";
import toast from "react-hot-toast";
import axios from "../utils/axios";

// Import component parts
import ProgramFAQSection from "../components/Program/ProgramFAQSection";

export const ProgramDetails = () => {
    const { t, i18n } = useTranslation();
    const { programId } = useParams();
    const navigate = useNavigate();
    const { user } = useAppContext();

    const [showVideo, setShowVideo] = useState(false);
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
        programData,
        loading,
        applying,
        refetching,
        error,
        hasError,
        retry,
        handleApplyClick,
        hasApplied,
        applicationStatus,
        isFree,
        programPrice,
        currency,
        hasData,
    } = useProgram(programId);

    const formatCurrency = (amount, currency = "DZD") => {
        if (!amount) return t("Free") || "Free";
        // eslint-disable-next-line no-undef
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-DZ" : "en-US",
            {
                style: "currency",
                currency: currency,
            }
        ).format(amount);
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        if (!contactForm.subject || !contactForm.message) {
            toast.error(
                t("Please fill all fields") || "Please fill all fields"
            );
            return;
        }

        if (!user && (!contactForm.name || !contactForm.email)) {
            toast.error(
                t("Please fill all fields") || "Please fill all fields"
            );
            return;
        }

        try {
            setIsSubmittingContact(true);

            const requestData = {
                subject: contactForm.subject,
                message: contactForm.message,
                programId: programId,
                programTitle: programData?.program?.Title || "Program",
                ...(user
                    ? {
                          userId: user.id,
                          userName: `${user.firstName} ${user.lastName}`,
                          userEmail: user.email,
                      }
                    : {
                          name: contactForm.name,
                          email: contactForm.email,
                      }),
            };

            const response = await axios.post("/contact", requestData);

            if (response.status === 200) {
                toast.success(
                    t("Message sent successfully!") ||
                        "Message sent successfully!"
                );
                setShowContactForm(false);
                setContactForm({
                    subject: "",
                    message: "",
                    name: user ? `${user.firstName} ${user.lastName}` : "",
                    email: user?.email || "",
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(
                t("Failed to send message. Please try again.") ||
                    "Failed to send message. Please try again."
            );
        } finally {
            setIsSubmittingContact(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: programData?.program?.Title || "Program",
            text:
                programData?.program?.shortDescription ||
                "Check out this amazing program!",
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error("Error sharing:", error);
                navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => {
                        toast.success(
                            t("Link copied to clipboard!") ||
                                "Link copied to clipboard!"
                        );
                    })
                    .catch(() => {
                        toast.error(
                            t("Failed to copy link") || "Failed to copy link"
                        );
                    });
            }
        } else {
            navigator.clipboard
                .writeText(window.location.href)
                .then(() => {
                    toast.success(
                        t("Link copied to clipboard!") ||
                            "Link copied to clipboard!"
                    );
                })
                .catch(() => {
                    toast.error(
                        t("Failed to copy link") || "Failed to copy link"
                    );
                });
        }
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(
            isFavorite
                ? t("Removed from favorites") || "Removed from favorites"
                : t("Added to favorites") || "Added to favorites"
        );
    };

    if (loading) {
        return <MainLoading />;
    }

    if (hasError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t("Something went wrong") || "Something went wrong"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error ||
                            t("Failed to load program") ||
                            "Failed to load program"}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={retry}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <IoMdRefresh className="text-lg" />
                            {t("Try Again") || "Try Again"}
                        </button>
                        <button
                            onClick={() => navigate("/Programs")}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {t("Browse Programs") || "Browse Programs"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t("Program not found") || "Program not found"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t("This program doesn't exist or has been removed.") ||
                            "This program doesn't exist or has been removed."}
                    </p>
                    <button
                        onClick={() => navigate("/Programs")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t("Browse Programs") || "Browse Programs"}
                    </button>
                </div>
            </div>
        );
    }

    const { program } = programData;

    const programTitle =
        i18n.language === "ar" && program.Title_ar
            ? program.Title_ar
            : program.Title;
    const programDescription =
        i18n.language === "ar" && program.Description_ar
            ? program.Description_ar
            : program.Description;

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
                                    {t("Program Details") || "Program Details"}
                                </h1>
                                <p className="text-gray-600">{programTitle}</p>
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
                                    className={`w-5 h-5 ${
                                        isFavorite ? "fill-current" : ""
                                    }`}
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
                    {/* Program Image/Video */}
                    <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden relative rounded-xl mb-8">
                        {program.Image ? (
                            <>
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${
                                        program.Image
                                    }`}
                                    alt={programTitle}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    <button
                                        onClick={() => setShowVideo(true)}
                                        className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-105"
                                    >
                                        <PlayCircle className="w-12 h-12 text-blue-600" />
                                    </button>
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

                    {/* Program Title and Info */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
                        <div className="flex-1">
                            <h1
                                className="text-4xl font-bold text-gray-900 mb-4"
                                dir={i18n.language === "ar" ? "rtl" : "ltr"}
                            >
                                {programTitle}
                            </h1>
                            {programDescription && (
                                <p
                                    className="text-xl text-gray-600 mb-6"
                                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                                >
                                    {programDescription}
                                </p>
                            )}

                            {/* Program Stats */}
                            <div className="flex flex-wrap gap-6 mb-6">
                                {program.startDate && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-5 h-5" />
                                        <span>
                                            {t("Starts") || "Starts"}:{" "}
                                            {new Date(
                                                program.startDate
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                                {program.participantCount && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users className="w-5 h-5" />
                                        <span>
                                            {program.participantCount}{" "}
                                            {t("participants") ||
                                                "participants"}
                                        </span>
                                    </div>
                                )}
                                {program.rating && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Star className="w-5 h-5 fill-current text-yellow-400" />
                                        <span>{program.rating}</span>
                                        {program.reviewsCount && (
                                            <span className="text-gray-500">
                                                ({program.reviewsCount}{" "}
                                                {t("reviews") || "reviews"})
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Application Card */}
                        <div className="lg:w-80 xl:w-96">
                            <div className="bg-white border rounded-xl shadow-lg p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    {isFree ? (
                                        <div className="text-4xl font-bold text-green-600">
                                            {t("Free") || "Free"}
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="text-4xl font-bold text-gray-900">
                                                {formatCurrency(
                                                    programPrice,
                                                    currency
                                                )}
                                            </div>
                                            {program.originalPrice &&
                                                program.originalPrice >
                                                    programPrice && (
                                                    <div className="text-lg text-gray-500 line-through">
                                                        {formatCurrency(
                                                            program.originalPrice,
                                                            currency
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>

                                {/* Application Status or Button */}
                                {hasApplied ? (
                                    <div className="mb-6">
                                        <div
                                            className={`p-4 rounded-lg text-center ${
                                                applicationStatus === "approved"
                                                    ? "bg-green-50 border border-green-200"
                                                    : applicationStatus ===
                                                      "rejected"
                                                    ? "bg-red-50 border border-red-200"
                                                    : "bg-yellow-50 border border-yellow-200"
                                            }`}
                                        >
                                            <div
                                                className={`text-2xl mb-2 ${
                                                    applicationStatus ===
                                                    "approved"
                                                        ? "text-green-600"
                                                        : applicationStatus ===
                                                          "rejected"
                                                        ? "text-red-600"
                                                        : "text-yellow-600"
                                                }`}
                                            >
                                                {applicationStatus ===
                                                "approved"
                                                    ? "✅"
                                                    : applicationStatus ===
                                                      "rejected"
                                                    ? "❌"
                                                    : "⏳"}
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {applicationStatus ===
                                                "approved"
                                                    ? t(
                                                          "Application Approved"
                                                      ) ||
                                                      "Application Approved"
                                                    : applicationStatus ===
                                                      "rejected"
                                                    ? t(
                                                          "Application Rejected"
                                                      ) ||
                                                      "Application Rejected"
                                                    : t(
                                                          "Application Pending"
                                                      ) ||
                                                      "Application Pending"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {applicationStatus ===
                                                "approved"
                                                    ? t(
                                                          "Congratulations! Your application has been approved."
                                                      ) ||
                                                      "Congratulations! Your application has been approved."
                                                    : applicationStatus ===
                                                      "rejected"
                                                    ? t(
                                                          "Your application was not approved this time."
                                                      ) ||
                                                      "Your application was not approved this time."
                                                    : t(
                                                          "Your application is under review."
                                                      ) ||
                                                      "Your application is under review."}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleApplyClick}
                                        disabled={applying}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 text-lg ${
                                            applying
                                                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                                : isFree
                                                ? "bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl"
                                                : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        }`}
                                    >
                                        {applying ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                                {t("Applying...") ||
                                                    "Applying..."}
                                            </div>
                                        ) : isFree ? (
                                            <>
                                                {t("Apply for Free") ||
                                                    "Apply for Free"}
                                            </>
                                        ) : (
                                            <>{t("Apply Now") || "Apply Now"}</>
                                        )}
                                    </button>
                                )}

                                {/* Program Features */}
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <GraduationCap className="w-4 h-4" />
                                        <span className="text-sm">
                                            {t("Certificate included") ||
                                                "Certificate included"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm">
                                            {t("Community access") ||
                                                "Community access"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-sm">
                                            {t("Support included") ||
                                                "Support included"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                            <div className="p-6">
                                <nav className="border-b border-gray-200 mb-6">
                                    <div className="flex space-x-8">
                                        <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                                            {t("Overview") || "Overview"}
                                        </button>
                                    </div>
                                </nav>

                                {/* Program Content */}
                                <div className="space-y-6">
                                    {programDescription && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                {t("About this program") ||
                                                    "About this program"}
                                            </h3>
                                            <div
                                                className="prose max-w-none text-gray-700"
                                                dangerouslySetInnerHTML={{
                                                    __html: programDescription,
                                                }}
                                            />
                                        </div>
                                    )}

                                    {program.requirements && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                {t("Requirements") ||
                                                    "Requirements"}
                                            </h3>
                                            <div
                                                className="prose max-w-none text-gray-700"
                                                dangerouslySetInnerHTML={{
                                                    __html: program.requirements,
                                                }}
                                            />
                                        </div>
                                    )}

                                    {program.benefits && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                {t("What you'll learn") ||
                                                    "What you'll learn"}
                                            </h3>
                                            <div
                                                className="prose max-w-none text-gray-700"
                                                dangerouslySetInnerHTML={{
                                                    __html: program.benefits,
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
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

                        {/* FAQ Section */}
                        <ProgramFAQSection programId={programId} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Program Information Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {t("Program Information") ||
                                    "Program Information"}
                            </h3>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="text-center">
                                    {isFree ? (
                                        <div className="text-3xl font-bold text-green-600">
                                            {t("Free") || "Free"}
                                        </div>
                                    ) : (
                                        <div className="text-3xl font-bold text-gray-900">
                                            {formatCurrency(
                                                programPrice,
                                                currency
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Application Status or Button */}
                            {hasApplied ? (
                                <div className="mb-4">
                                    <div
                                        className={`p-3 rounded-lg text-center ${
                                            applicationStatus === "approved"
                                                ? "bg-green-50 border border-green-200 text-green-800"
                                                : applicationStatus ===
                                                  "rejected"
                                                ? "bg-red-50 border border-red-200 text-red-800"
                                                : "bg-yellow-50 border border-yellow-200 text-yellow-800"
                                        }`}
                                    >
                                        <div className="font-semibold">
                                            {applicationStatus === "approved"
                                                ? t("Application Approved") ||
                                                  "Application Approved"
                                                : applicationStatus ===
                                                  "rejected"
                                                ? t("Application Rejected") ||
                                                  "Application Rejected"
                                                : t("Application Pending") ||
                                                  "Application Pending"}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleApplyClick}
                                    disabled={applying}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                                        applying
                                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                            : isFree
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                                >
                                    {applying ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                            {t("Applying...") || "Applying..."}
                                        </div>
                                    ) : isFree ? (
                                        t("Apply for Free") || "Apply for Free"
                                    ) : (
                                        t("Apply Now") || "Apply Now"
                                    )}
                                </button>
                            )}

                            {/* Program Details */}
                            <div className="space-y-4 pt-4 border-t">
                                {program.startDate && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {t("Start Date") ||
                                                    "Start Date"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(
                                                    program.startDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {program.duration && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {t("Duration") || "Duration"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {program.duration}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {program.level && (
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="w-4 h-4 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {t("Level") || "Level"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {program.level}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form Modal */}
            {showContactForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {t("Contact Us") || "Contact Us"}
                                </h3>
                                <button
                                    onClick={() => setShowContactForm(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <form
                                onSubmit={handleContactSubmit}
                                className="space-y-4"
                            >
                                {!user && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t("Name") || "Name"} *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={contactForm.name}
                                                onChange={(e) =>
                                                    setContactForm({
                                                        ...contactForm,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t("Email") || "Email"} *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={contactForm.email}
                                                onChange={(e) =>
                                                    setContactForm({
                                                        ...contactForm,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t("Subject") || "Subject"} *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={contactForm.subject}
                                        onChange={(e) =>
                                            setContactForm({
                                                ...contactForm,
                                                subject: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t("Message") || "Message"} *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={contactForm.message}
                                        onChange={(e) =>
                                            setContactForm({
                                                ...contactForm,
                                                message: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowContactForm(false)
                                        }
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        {t("Cancel") || "Cancel"}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingContact}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmittingContact ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                {t("Sending...") ||
                                                    "Sending..."}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                {t("Send Message") ||
                                                    "Send Message"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal - Placeholder for future video feature */}
            {showVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {t("Program Video") || "Program Video"}
                                </h3>
                                <button
                                    onClick={() => setShowVideo(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-8 text-center bg-gray-50">
                            <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg text-gray-600 mb-2">
                                {t("Program video will be available soon") ||
                                    "Program video will be available soon"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {t("This feature is under development") ||
                                    "This feature is under development"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgramDetails;
