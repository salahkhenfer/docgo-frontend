import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18n";
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
    Send,
    MessageSquare,
    Pause,
    Target,
    GraduationCap,
    BookOpen,
    User,
} from "lucide-react";
import { clientProgramsAPI } from "../API/Programs";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import VideoPlayer from "../components/Common/VideoPlayer";
import ProgramFAQSection from "../components/Program/ProgramFAQSection";
import toast from "react-hot-toast";
import axios from "../utils/axios";

export function ProgramDetails() {
    const { t, i18n } = useTranslation();
    const { programId } = useParams();
    const navigate = useNavigate();

    // State
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState({
        subject: "",
        message: "",
        name: "",
        email: "",
    });
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);

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
        if (!dateString) return t("Not defined") || "Not defined";
        return new Date(dateString).toLocaleDateString(
            i18n.language === "ar" ? "ar-DZ" : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
            }
        );
    };

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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-green-100 text-green-800 border-green-200";
            case "closed":
                return "bg-red-100 text-red-800 border-red-200";
            case "draft":
                return "bg-gray-100 text-gray-800 border-gray-200";
            case "coming_soon":
            case "upcoming":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return t("Open") || "Open";
            case "closed":
                return t("Closed") || "Closed";
            case "draft":
                return t("Draft") || "Draft";
            case "coming_soon":
            case "upcoming":
                return t("Coming Soon") || "Coming Soon";
            default:
                return t(status) || status || "Unknown";
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

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        if (
            !contactForm.name ||
            !contactForm.email ||
            !contactForm.subject ||
            !contactForm.message
        ) {
            toast.error(
                t("Please fill all fields") || "Please fill all fields"
            );
            return;
        }

        try {
            setIsSubmittingContact(true);
            await axios.post("/contact", {
                name: contactForm.name,
                email: contactForm.email,
                subject: contactForm.subject,
                message: contactForm.message,
                relatedType: "program",
                relatedId: programId,
            });

            toast.success(
                t("Message sent successfully") || "Message sent successfully"
            );

            setContactForm({ subject: "", message: "", name: "", email: "" });
            setShowContactForm(false);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(t("Error sending message") || "Error sending message");
        } finally {
            setIsSubmittingContact(false);
        }
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
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Hero Section */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                            {/* Image or Video Section */}
                            <div className="h-96 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden relative">
                                {program.Image ? (
                                    <>
                                        <img
                                            src={`${
                                                import.meta.env.VITE_API_URL
                                            }/${program.Image}`}
                                            alt={title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                        {/* Video Play Button - will be functional when video field is added */}
                                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                            <button
                                                onClick={() =>
                                                    setShowVideo(true)
                                                }
                                                className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-105"
                                            >
                                                <Play className="w-12 h-12 text-purple-600" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <GraduationCap className="w-20 h-20 text-purple-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg">
                                                {t("No image available") ||
                                                    "No image available"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8">
                                {/* Title and Status */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                                                    program.status
                                                )}`}
                                            >
                                                {getStatusText(program.status)}
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
                                            {category && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                                    {category}
                                                </span>
                                            )}
                                        </div>

                                        <h1
                                            className="text-4xl font-bold text-gray-900 mb-2"
                                            dir={
                                                i18n.language === "ar"
                                                    ? "rtl"
                                                    : "ltr"
                                            }
                                        >
                                            {title ||
                                                t("Program Title") ||
                                                "Program Title"}
                                        </h1>

                                        {shortDescription && (
                                            <p
                                                className="text-xl text-gray-600 mb-4"
                                                dir={
                                                    i18n.language === "ar"
                                                        ? "rtl"
                                                        : "ltr"
                                                }
                                            >
                                                {shortDescription}
                                            </p>
                                        )}

                                        {/* Organization */}
                                        {organization && (
                                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                                <Building className="w-5 h-5" />
                                                <span>{organization}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Key Information Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                                                        program.price ||
                                                            program.Price
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
                                                    {t("Duration") ||
                                                        "Duration"}
                                                </p>
                                                <p className="text-lg font-bold text-blue-800">
                                                    {program.duration ||
                                                        program.Duration ||
                                                        t("Not defined") ||
                                                        "Not defined"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Capacity */}
                                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-purple-700 font-medium">
                                                    {t("Capacity") ||
                                                        "Capacity"}
                                                </p>
                                                <p className="text-lg font-bold text-purple-800">
                                                    {program.capacity ||
                                                        program.Capacity ||
                                                        t("Unlimited") ||
                                                        "Unlimited"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Level */}
                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
                                        <div className="flex items-center gap-3">
                                            <Award className="w-5 h-5 text-orange-600" />
                                            <div>
                                                <p className="text-sm text-orange-700 font-medium">
                                                    {t("Level") || "Level"}
                                                </p>
                                                <p className="text-lg font-bold text-orange-800">
                                                    {program.level ||
                                                        program.Level ||
                                                        t("All levels") ||
                                                        "All levels"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <div className="mb-8">
                                    <button
                                        onClick={handleApply}
                                        disabled={
                                            program.status?.toLowerCase() ===
                                            "closed"
                                        }
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                                            program.status?.toLowerCase() ===
                                            "closed"
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        }`}
                                    >
                                        {program.status?.toLowerCase() ===
                                        "closed"
                                            ? t("Registration Closed") ||
                                              "Registration Closed"
                                            : program.price || program.Price
                                            ? `${
                                                  t("Apply Now") || "Apply Now"
                                              } - ${formatCurrency(
                                                  program.price || program.Price
                                              )}`
                                            : t("Apply for Free") ||
                                              "Apply for Free"}
                                    </button>
                                </div>

                                {/* Detailed Description */}
                                {description && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            {t("Detailed Description") ||
                                                "Detailed Description"}
                                        </h2>
                                        <div
                                            className="prose prose-lg max-w-none text-gray-700"
                                            dir={
                                                i18n.language === "ar"
                                                    ? "rtl"
                                                    : "ltr"
                                            }
                                        >
                                            {typeof description === "string" ? (
                                                <p>{description}</p>
                                            ) : (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: description,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Benefits */}
                                {benefits && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            {t("Benefits") || "Benefits"}
                                        </h2>
                                        <div
                                            className="prose prose-lg max-w-none text-gray-700"
                                            dir={
                                                i18n.language === "ar"
                                                    ? "rtl"
                                                    : "ltr"
                                            }
                                        >
                                            {typeof benefits === "string" ? (
                                                <p>{benefits}</p>
                                            ) : (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: benefits,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Requirements */}
                                {requirements && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" />
                                            {t("Requirements") ||
                                                "Requirements"}
                                        </h2>
                                        <div
                                            className="prose prose-lg max-w-none text-gray-700"
                                            dir={
                                                i18n.language === "ar"
                                                    ? "rtl"
                                                    : "ltr"
                                            }
                                        >
                                            {typeof requirements ===
                                            "string" ? (
                                                <p>{requirements}</p>
                                            ) : (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: requirements,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <ProgramFAQSection programId={programId} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Contact Form */}
                        {showContactForm && (
                            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    {t("Contact for this program") ||
                                        "Contact for this program"}
                                </h3>
                                <form
                                    onSubmit={handleContactSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("Name") || "Name"}
                                        </label>
                                        <input
                                            type="text"
                                            value={contactForm.name}
                                            onChange={(e) =>
                                                setContactForm({
                                                    ...contactForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder={
                                                t("Your name") || "Your name"
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("Email") || "Email"}
                                        </label>
                                        <input
                                            type="email"
                                            value={contactForm.email}
                                            onChange={(e) =>
                                                setContactForm({
                                                    ...contactForm,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder={
                                                t("Your email") || "Your email"
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("Subject") || "Subject"}
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
                                            {t("Message") || "Message"}
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder={
                                                t(
                                                    "Your message about this program..."
                                                ) ||
                                                "Your message about this program..."
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

                        {/* Program Information */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5" />
                                {t("Information") || "Information"}
                            </h3>
                            <div className="space-y-4">
                                {/* Dates */}
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {t("Dates") || "Dates"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t("Start") || "Start"}:{" "}
                                            {formatDate(
                                                program.start_date ||
                                                    program.StartDate
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {t("End") || "End"}:{" "}
                                            {formatDate(
                                                program.end_date ||
                                                    program.EndDate
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Location */}
                                {location && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {t("Location") || "Location"}
                                            </p>
                                            <p
                                                className="text-sm text-gray-600"
                                                dir={
                                                    i18n.language === "ar"
                                                        ? "rtl"
                                                        : "ltr"
                                                }
                                            >
                                                {location}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Language */}
                                {program.language && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {t("Language") || "Language"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {program.language}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Instructor */}
                                {program.instructor && (
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {t("Instructor") ||
                                                    "Instructor"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {program.instructor}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* External Link */}
                                {program.external_link && (
                                    <div className="flex items-start gap-3">
                                        <ExternalLink className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {t("External Link") ||
                                                    "External Link"}
                                            </p>
                                            <a
                                                href={program.external_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                                            >
                                                {t("Visit site") ||
                                                    "Visit site"}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal - Placeholder for future video feature */}
            {showVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                {t("Program Presentation") ||
                                    "Program Presentation"}
                            </h3>
                            <button
                                onClick={() => setShowVideo(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Pause className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                {t(
                                    "Presentation video will be available soon."
                                ) ||
                                    "Presentation video will be available soon."}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                {t("Feature under development") ||
                                    "Feature under development"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProgramDetails;
