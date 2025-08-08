import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    useDraggable,
} from "@heroui/react";
import {
    MapPin,
    Calendar,
    Users,
    Star,
    Clock,
    Tag,
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
} from "lucide-react";
import { clientProgramsAPI } from "../API/Programs";
import Payment from "../components/Payment/Payment";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import VideoPlayer from "../components/Common/VideoPlayer";
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

    // Modal state
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Draggable modal
    const targetRef = React.useRef(null);
    const { moveProps } = useDraggable({
        targetRef,
        canOverflow: true,
        isDisabled: !isOpen,
    });

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
        onOpen();
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
                        onClick={() => navigate("/searchprogram")}
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
                            {program.videoUrl ? (
                                <div className="h-96 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
                                    <VideoPlayer
                                        src={`${import.meta.env.VITE_API_URL}${
                                            program.videoUrl
                                        }`}
                                        poster={`${
                                            import.meta.env.VITE_API_URL
                                        }${program.Image || program.image}`}
                                        title={title}
                                        className="w-full h-full"
                                        height="100%"
                                    />
                                </div>
                            ) : null}

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
                                        {program.Image || program.image ? (
                                            <div className="h-96 my-6 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
                                                <img
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_API_URL
                                                    }${program.Image}`}
                                                    alt={title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                        {shortDescription && (
                                            <p className="text-xl text-gray-600 mb-6">
                                                {shortDescription}
                                            </p>
                                        )}

                                        {/* Pricing Section */}
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {t(
                                                            "Program Investment"
                                                        ) ||
                                                            "Program Investment"}
                                                    </h3>
                                                    <div className="flex items-baseline gap-2">
                                                        {program.price ? (
                                                            <>
                                                                <span className="text-4xl font-bold text-indigo-600">
                                                                    {formatCurrency(
                                                                        program.price
                                                                    )}
                                                                </span>
                                                            </>
                                                        ) : program.scholarshipAmount ? (
                                                            <>
                                                                <span className="text-4xl font-bold text-green-600">
                                                                    {formatCurrency(
                                                                        program.scholarshipAmount
                                                                    )}
                                                                </span>
                                                                <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                                                    {t(
                                                                        "Scholarship"
                                                                    ) ||
                                                                        "Scholarship"}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-4xl font-bold text-gray-900">
                                                                {t("Free") ||
                                                                    "Free"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {program.originalPrice &&
                                                        program.price &&
                                                        program.originalPrice >
                                                            program.price && (
                                                            <div className="mt-2">
                                                                <span className="text-lg text-gray-500 line-through mr-2">
                                                                    {formatCurrency(
                                                                        program.originalPrice
                                                                    )}
                                                                </span>
                                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                                                                    {Math.round(
                                                                        ((program.originalPrice -
                                                                            program.price) /
                                                                            program.originalPrice) *
                                                                            100
                                                                    )}
                                                                    % OFF
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>

                                                {/* Professional Apply Button */}
                                                <div className="text-center">
                                                    <button
                                                        onClick={handleApply}
                                                        className="relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 group"
                                                    >
                                                        <DollarSign className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                                                        {t("Apply & Pay") ||
                                                            "Apply & Pay"}
                                                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />

                                                        {/* Shine effect */}
                                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                                                    </button>

                                                    <p className="text-sm text-gray-600 mt-2">
                                                        {t(
                                                            "Secure payment • Instant access"
                                                        ) ||
                                                            "Secure payment • Instant access"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Additional pricing info */}
                                            {(program.deadline ||
                                                program.maxApplications) && (
                                                <div className="mt-4 pt-4 border-t border-indigo-200">
                                                    <div className="flex items-center justify-between text-sm">
                                                        {program.deadline && (
                                                            <div className="flex items-center gap-2 text-orange-600">
                                                                <Clock className="w-4 h-4" />
                                                                <span>
                                                                    {t(
                                                                        "Deadline"
                                                                    ) ||
                                                                        "Deadline"}
                                                                    :{" "}
                                                                    {formatDate(
                                                                        program.deadline
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {program.maxApplications && (
                                                            <div className="flex items-center gap-2 text-blue-600">
                                                                <Users className="w-4 h-4" />
                                                                <span>
                                                                    {program.maxApplications -
                                                                        (program.currentApplications ||
                                                                            0)}{" "}
                                                                    {t(
                                                                        "spots left"
                                                                    ) ||
                                                                        "spots left"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {category && (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {category}
                                                </span>
                                            )}
                                            {organization && (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    {organization}
                                                </span>
                                            )}
                                            {location && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

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

                        {/* Requirements */}
                        {requirements && (
                            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-green-600" />
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
                                    <Star className="w-6 h-6 text-yellow-600" />
                                    {t("Program Benefits") ||
                                        "Program Benefits"}
                                </h2>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {benefits}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {program.tags &&
                            Array.isArray(program.tags) &&
                            program.tags.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Tag className="w-6 h-6 text-indigo-600" />
                                        {t("Keywords") || "Keywords"}
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {program.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Pricing Summary Card */}
                        <div className="bg-white rounded-xl shadow-sm border-2 border-indigo-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                                <h3 className="text-xl font-bold mb-2">
                                    {t("Investment Summary") ||
                                        "Investment Summary"}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    {program.price ? (
                                        <>
                                            <span className="text-3xl font-bold">
                                                {formatCurrency(program.price)}
                                            </span>
                                        </>
                                    ) : program.scholarshipAmount ? (
                                        <>
                                            <span className="text-3xl font-bold">
                                                {formatCurrency(
                                                    program.scholarshipAmount
                                                )}
                                            </span>
                                            <span className="text-green-200 bg-green-500/20 px-2 py-1 rounded-full text-sm">
                                                {t("Scholarship") ||
                                                    "Scholarship"}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold">
                                            {t("Free") || "Free"}
                                        </span>
                                    )}
                                </div>
                                {program.originalPrice &&
                                    program.price &&
                                    program.originalPrice > program.price && (
                                        <div className="mt-2">
                                            <span className="text-indigo-200 line-through mr-2">
                                                {formatCurrency(
                                                    program.originalPrice
                                                )}
                                            </span>
                                            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold">
                                                SAVE{" "}
                                                {formatCurrency(
                                                    program.originalPrice -
                                                        program.price
                                                )}
                                            </span>
                                        </div>
                                    )}
                            </div>

                            <div className="p-6">
                                {/* Value Proposition */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        </div>
                                        {t("Lifetime access to content") ||
                                            "Lifetime access to content"}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        </div>
                                        {t("Expert instructor support") ||
                                            "Expert instructor support"}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        </div>
                                        {t("Certificate of completion") ||
                                            "Certificate of completion"}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        </div>
                                        {t("30-day money-back guarantee") ||
                                            "30-day money-back guarantee"}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={handleApply}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 group"
                                >
                                    <DollarSign className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                    {t("Enroll Now") || "Enroll Now"}
                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-3">
                                    {t("Secure checkout • Instant access") ||
                                        "Secure checkout • Instant access"}
                                </p>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                {t("Program Details") || "Program Details"}
                            </h3>
                            <div className="space-y-4">
                                {organization && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Building className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block">
                                                {t("Organization") ||
                                                    "Organization"}
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {organization}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {location && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block">
                                                {t("Location") || "Location"}
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {location}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {category && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Tag className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block">
                                                {t("Category") || "Category"}
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {category}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {program.deadline && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block">
                                                {t("Deadline") || "Deadline"}
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {formatDate(program.deadline)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {program.programType && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block">
                                                {t("Type") || "Type"}
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {program.programType}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {program.duration && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block">
                                                {t("Duration") || "Duration"}
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {program.duration}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {program.language && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Globe className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 block">
                                                {t("Language") || "Language"}
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {program.language}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Application Stats */}
                        {(program.maxApplications ||
                            program.currentApplications) && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    {t("Application Stats") ||
                                        "Application Stats"}
                                </h3>
                                <div className="space-y-4">
                                    {program.maxApplications && (
                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-700 font-medium">
                                                    {t("Available Spots") ||
                                                        "Available Spots"}
                                                </span>
                                            </div>
                                            <span className="font-bold text-blue-600">
                                                {program.maxApplications -
                                                    (program.currentApplications ||
                                                        0)}
                                            </span>
                                        </div>
                                    )}
                                    {program.currentApplications && (
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-5 h-5 text-green-600" />
                                                <span className="text-gray-700 font-medium">
                                                    {t(
                                                        "Applications Received"
                                                    ) ||
                                                        "Applications Received"}
                                                </span>
                                            </div>
                                            <span className="font-bold text-green-600">
                                                {program.currentApplications}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Trust Signals */}
                        {/* <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                {t("Why Choose This Program") ||
                                    "Why Choose This Program"}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Star className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {t("Expert-Led Content") ||
                                                "Expert-Led Content"}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {t(
                                                "Learn from industry professionals with years of experience"
                                            ) ||
                                                "Learn from industry professionals with years of experience"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Award className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {t("Recognized Certification") ||
                                                "Recognized Certification"}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {t(
                                                "Get an industry-recognized certificate upon completion"
                                            ) ||
                                                "Get an industry-recognized certificate upon completion"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Users className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {t("Community Support") ||
                                                "Community Support"}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {t(
                                                "Join a community of learners and get peer support"
                                            ) ||
                                                "Join a community of learners and get peer support"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            {t("Flexible Learning") ||
                                                "Flexible Learning"}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {t(
                                                "Learn at your own pace with lifetime access"
                                            ) ||
                                                "Learn at your own pace with lifetime access"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* Contact Info */}
                        {(program.contactEmail || program.contactPhone) && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    {t("Contact Information") ||
                                        "Contact Information"}
                                </h3>
                                <div className="space-y-4">
                                    {program.contactEmail && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 block">
                                                    {t("Email") || "Email"}
                                                </label>
                                                <a
                                                    href={`mailto:${program.contactEmail}`}
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    {program.contactEmail}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {program.contactPhone && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 block">
                                                    {t("Phone") || "Phone"}
                                                </label>
                                                <a
                                                    href={`tel:${program.contactPhone}`}
                                                    className="text-green-600 hover:text-green-700 font-medium"
                                                >
                                                    {program.contactPhone}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                ref={targetRef}
                {...moveProps}
                size="2xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {t("Apply for") || "Apply for"} {title}
                            </ModalHeader>
                            <ModalBody>
                                <Payment program={program} />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    {t("Cancel") || "Cancel"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ProgramDetails;
