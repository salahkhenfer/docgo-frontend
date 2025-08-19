import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    MapPin,
    Calendar,
    Users,
    Star,
    Clock,
    DollarSign,
    Building,
    Globe,
    FileText,
    Award,
    Share2,
    Heart,
    ArrowLeft,
    Play,
    ExternalLink,
    Mail,
    Phone,
    CreditCard,
    CheckCircle,
    Info,
    Timer,
} from "lucide-react";
import { clientProgramsAPI } from "../API/Programs";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import VideoPlayer from "../components/Common/VideoPlayer";
import ProgramFAQSection from "../components/Program/ProgramFAQSection";
import toast from "react-hot-toast";

export function ProgramDetails() {
    const { t, i18n } = useTranslation();
    const { programId } = useParams();
    const navigate = useNavigate();

    // State
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    // Fetch program details
    useEffect(() => {
        const fetchProgram = async () => {
            if (!programId) return;

            setLoading(true);
            try {
                const response = await clientProgramsAPI.getProgramDetails(
                    programId
                );
                console.log("Fetched program details:", response);
                setProgram(response.program || response);
                setError(null);
            } catch (error) {
                console.error("Error fetching program:", error);
                setError("Failed to load program details.");
                toast.error(
                    t("Failed to load program details") ||
                        "Failed to load program details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [programId, t]);

    // Utility functions
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString(
            i18n.language === "ar" ? "ar-DZ" : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    const formatCurrency = (amount, currency = "USD") => {
        if (!amount) return "Free";
        /* eslint-disable-next-line no-undef */
        return new Intl.NumberFormat(
            i18n.language === "ar" ? "ar-DZ" : "en-US",
            {
                style: "currency",
                currency: currency,
            }
        ).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-green-100 text-green-800 border-green-200";
            case "closed":
                return "bg-red-100 text-red-800 border-red-200";
            case "upcoming":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const handleShare = async () => {
        if (!program) return;

        const title =
            i18n.language === "ar" && program.Title_ar
                ? program.Title_ar
                : program.Title;
        const shortDescription =
            i18n.language === "ar" && program.shortDescription_ar
                ? program.shortDescription_ar
                : program.shortDescription;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: shortDescription,
                    url: window.location.href,
                });
            } catch (error) {
                console.log("Share cancelled");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success(
                t("Link copied to clipboard") || "Link copied to clipboard"
            );
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

    const handleApply = () => {
        if (!program) return;

        // Navigate to payment page with program data
        navigate(`/payment/program/${programId}`, {
            state: {
                program: program,
                type: "program",
            },
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <LoadingSpinner size="xl" className="h-screen" />
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t("Program Not Found") || "Program Not Found"}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {error ||
                            t(
                                "The program you're looking for doesn't exist or has been removed."
                            ) ||
                            "The program you're looking for doesn't exist or has been removed."}
                    </p>
                    <button
                        onClick={() => navigate("/Programs")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        {t("Back to Programs") || "Back to Programs"}
                    </button>
                </div>
            </div>
        );
    }

    // Multi-language content
    const title =
        i18n.language === "ar" && program.Title_ar
            ? program.Title_ar
            : program.Title;
    const description =
        i18n.language === "ar" && program.Description_ar
            ? program.Description_ar
            : program.Description;
    const shortDescription =
        i18n.language === "ar" && program.shortDescription_ar
            ? program.shortDescription_ar
            : program.shortDescription;
    const requirements =
        i18n.language === "ar" && program.requirements_ar
            ? program.requirements_ar
            : program.requirements;
    const benefits =
        i18n.language === "ar" && program.benefits_ar
            ? program.benefits_ar
            : program.benefits;
    const organization =
        i18n.language === "ar" && program.organization_ar
            ? program.organization_ar
            : program.organization;
    const category =
        i18n.language === "ar" && program.Category_ar
            ? program.Category_ar
            : program.Category;
    const location =
        i18n.language === "ar" && program.location_ar
            ? program.location_ar
            : program.location;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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
                                <p className="text-gray-600">
                                    {t("Complete program information") ||
                                        "Complete program information"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
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

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Hero Section */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                            {/* Image or Video */}
                            {program.Image && (
                                <div className="h-96 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}/${
                                            program.Image
                                        }`}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                </div>
                            )}

                            <div className="p-8">
                                {/* Title and Status */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                                                    program.status
                                                )}`}
                                            >
                                                {t(program.status) ||
                                                    program.status ||
                                                    "Open"}
                                            </span>
                                            {program.featured && (
                                                <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <Star className="w-4 h-4" />
                                                    <span className="text-sm font-semibold">
                                                        {t("Featured") ||
                                                            "Featured"}
                                                    </span>
                                                </div>
                                            )}
                                            {program.videoUrl && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <Play className="w-4 h-4" />
                                                    {t("Video") || "Video"}
                                                </span>
                                            )}
                                        </div>

                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                            {title || "Program Title"}
                                        </h1>
                                        {i18n.language === "ar" &&
                                            program.title_ar && (
                                                <h1
                                                    className="text-3xl font-bold text-gray-600 mb-4"
                                                    dir="rtl"
                                                >
                                                    {program.title_ar}
                                                </h1>
                                            )}

                                        {shortDescription && (
                                            <p className="text-xl text-gray-600 mb-2">
                                                {shortDescription}
                                            </p>
                                        )}
                                        {i18n.language === "ar" &&
                                            program.shortDescription_ar && (
                                                <p
                                                    className="text-xl text-gray-600 mb-4"
                                                    dir="rtl"
                                                >
                                                    {
                                                        program.shortDescription_ar
                                                    }
                                                </p>
                                            )}

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {category && (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {category}
                                                </span>
                                            )}
                                            {i18n.language === "ar" &&
                                                program.Category_ar && (
                                                    <span
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                        dir="rtl"
                                                    >
                                                        {program.Category_ar}
                                                    </span>
                                                )}
                                            {organization && (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    {organization}
                                                </span>
                                            )}
                                            {i18n.language === "ar" &&
                                                program.organization_ar && (
                                                    <span
                                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                                        dir="rtl"
                                                    >
                                                        {
                                                            program.organization_ar
                                                        }
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mb-6">
                                    <button
                                        onClick={handleApply}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        {t("Apply & Pay Now") ||
                                            "Apply & Pay Now"}
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {t(
                                            "Secure payment • Instant confirmation"
                                        ) ||
                                            "Secure payment • Instant confirmation"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Video Section */}
                        {program.videoUrl && (
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {t("Program Presentation") ||
                                        "Program Presentation"}
                                </h2>
                                <VideoPlayer
                                    src={`${import.meta.env.VITE_API_URL}${
                                        program.videoUrl
                                    }`}
                                    title={title}
                                    className="w-full"
                                    height="400px"
                                />
                            </div>
                        )}

                        {/* Description */}
                        {description && (
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {t("Program Description") ||
                                        "Program Description"}
                                </h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Arabic Description */}
                        {i18n.language === "ar" && program.Description_ar && (
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    وصف البرنامج
                                </h2>
                                <div className="prose max-w-none" dir="rtl">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {program.Description_ar}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Requirements */}
                        {requirements && (
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    {t("Requirements") || "Requirements"}
                                </h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {requirements}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Benefits */}
                        {benefits && (
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-blue-600" />
                                    {t("Benefits") || "Benefits"}
                                </h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {benefits}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Contact Information */}
                        {(program.contactEmail || program.contactPhone) && (
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Info className="w-6 h-6 text-gray-600" />
                                    {t("Contact Information") ||
                                        "Contact Information"}
                                </h2>
                                <div className="space-y-3">
                                    {program.contactEmail && (
                                        <a
                                            href={`mailto:${program.contactEmail}`}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Mail className="w-4 h-4" />
                                            {program.contactEmail}
                                        </a>
                                    )}
                                    {program.contactPhone && (
                                        <a
                                            href={`tel:${program.contactPhone}`}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Phone className="w-4 h-4" />
                                            {program.contactPhone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Quick Details */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {t("Program Details") || "Program Details"}
                            </h3>

                            <div className="space-y-6">
                                {/* Application Deadline */}
                                {program.applicationDeadline && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-red-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {t("Application Deadline") ||
                                                    "Application Deadline"}
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {formatDate(
                                                    program.applicationDeadline
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Program Duration */}
                                {program.startDate && program.endDate && (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    {t("Program Start") ||
                                                        "Program Start"}
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {formatDate(
                                                        program.startDate
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-orange-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    {t("Program End") ||
                                                        "Program End"}
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {formatDate(
                                                        program.endDate
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-indigo-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        {t("Total Duration") ||
                                                            "Total Duration"}
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {Math.ceil(
                                                            (new Date(
                                                                program.endDate
                                                            ) -
                                                                new Date(
                                                                    program.startDate
                                                                )) /
                                                                (1000 *
                                                                    60 *
                                                                    60 *
                                                                    24)
                                                        )}{" "}
                                                        {t("days") || "days"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Organization */}
                                {organization && (
                                    <div className="flex items-center gap-3">
                                        <Building className="w-5 h-5 text-indigo-600" />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600">
                                                {t("Organization") ||
                                                    "Organization"}
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {organization}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                {location && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-red-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {t("Location") || "Location"}
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {location}
                                                {program.country &&
                                                    `, ${program.country}`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Language */}
                                {program.language && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {t("Language") || "Language"}
                                            </p>
                                            <p className="font-semibold text-gray-900">
                                                {program.language}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Slots */}
                        {(program.totalSlots ||
                            program.availableSlots ||
                            program.maxApplications) && (
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {t("Available Places") ||
                                        "Available Places"}
                                </h3>

                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">
                                            {program.availableSlots ||
                                                program.maxApplications -
                                                    (program.currentApplications ||
                                                        0) ||
                                                0}{" "}
                                            /{" "}
                                            {program.totalSlots ||
                                                program.maxApplications ||
                                                0}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t("places available") ||
                                                "places available"}
                                        </p>
                                    </div>
                                </div>

                                {(program.totalSlots ||
                                    program.maxApplications) && (
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.max(
                                                    ((program.availableSlots ||
                                                        program.maxApplications -
                                                            (program.currentApplications ||
                                                                0) ||
                                                        0) /
                                                        (program.totalSlots ||
                                                            program.maxApplications ||
                                                            1)) *
                                                        100,
                                                    5
                                                )}%`,
                                            }}
                                        ></div>
                                    </div>
                                )}

                                {/* Urgency indicator */}
                                {(program.availableSlots ||
                                    program.maxApplications -
                                        (program.currentApplications || 0)) <=
                                    5 && (
                                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Timer className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm font-medium text-orange-800">
                                                {t("Only few places left!") ||
                                                    "Only few places left!"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Financial Information */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {t("Financial Information") ||
                                    "Financial Information"}
                            </h3>

                            <div className="space-y-4">
                                {/* Program Price */}
                                {(program.price ||
                                    program.scholarshipAmount) && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            <span className="text-sm text-gray-600">
                                                {program.price
                                                    ? t("Program Fee") ||
                                                      "Program Fee"
                                                    : t("Scholarship") ||
                                                      "Scholarship"}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-lg text-gray-900">
                                            {formatCurrency(
                                                program.price ||
                                                    program.scholarshipAmount
                                            )}
                                        </span>
                                    </div>
                                )}

                                {/* Scholarship details */}
                                {program.scholarshipAmount && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">
                                                {t("Scholarship Available") ||
                                                    "Scholarship Available"}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Payment deadline */}
                                {program.paymentDeadline && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            {t("Payment Deadline") ||
                                                "Payment Deadline"}
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {formatDate(
                                                program.paymentDeadline
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <ProgramFAQSection faqs={program.faqs || []} />
            </div>
        </div>
    );
}

export default ProgramDetails;
