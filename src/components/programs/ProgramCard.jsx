import { BookOpen, Clock, MapPin, Star, Tag } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useFavorite } from "../../hooks/useFavorite";

export function ProgramCard({ program, onClick, language = "en" }) {
    const { t } = useTranslation();
    const [hasImageError, setHasImageError] = useState(false);

    // Use the favorite hook - call with optional chaining so the hook
    // is invoked in the same order regardless of `program` being present.
    const {
        isFavorited,
        loading: favoriteLoading,
        toggleFavorite,
    } = useFavorite(program?.id, "program");

    if (!program) return null;

    const defaultThumbnail = "/placeholder-program.jpg";

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Create item object for local storage
        const programItem = {
            id: program.id,
            title: title,
            short_description: shortDescription,
            Price: program.Price,
            discountPrice: program.discountPrice,
            currency: program.currency,
            organization: organizationText,
            location: locationText,
            Image: program.Image || defaultThumbnail,
        };

        toggleFavorite(programItem);
    };

    // Multi-language content handling
    const title =
        language === "ar" && program.title_ar
            ? program.title_ar
            : program.title;
    const shortDescription =
        language === "ar" && program.short_description_ar
            ? program.short_description_ar
            : program.short_description;
    const organizationText =
        language === "ar" && program.organization_ar
            ? program.organization_ar
            : program.organization;
    const categoryText =
        language === "ar" && program.category_ar
            ? program.category_ar
            : program.category;
    const locationText =
        language === "ar" && program.location_ar
            ? program.location_ar
            : program.location;

    // Normalize tags: backend may return an array, a comma-separated string,
    // or even a JSON-stringified array. Ensure we always work with an array.
    const tags = (() => {
        if (!program.tags) return [];
        if (Array.isArray(program.tags)) return program.tags;
        if (typeof program.tags === "string") {
            // Try parsing JSON first (in case it's a stringified array)
            try {
                const parsed = JSON.parse(program.tags);
                if (Array.isArray(parsed)) return parsed;
            } catch {
                // not JSON, continue
            }
            // Fallback: split comma-separated string
            return program.tags
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
        // Unknown shape -> return empty array to be safe
        return [];
    })();

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString(
            language === "ar" ? "ar-DZ" : "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            },
        );
    };

    const formatPrice = (price) => {
        if (!price || price === 0) return t("free") || "Free";
        // Format the price with proper number formatting
        const formattedNumber = Number(price).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
        return `${formattedNumber} DZD`;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "bg-green-100 text-green-700";
            case "closed":
                return "bg-red-100 text-red-700";
            case "upcoming":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getProgramTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case "scholarship":
                return "bg-purple-100 text-purple-800";
            case "exchange":
                return "bg-blue-100 text-blue-800";
            case "grant":
                return "bg-green-100 text-green-800";
            case "training":
                return "bg-orange-100 text-orange-800";
            case "internship":
                return "bg-teal-100 text-teal-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getProgramTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case "scholarship":
                return "🎓";
            case "exchange":
                return "🌍";
            case "grant":
                return "💰";
            case "training":
                return "📚";
            case "internship":
                return "💼";
            default:
                return "📋";
        }
    };

    return (
        <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative group max-w-sm mx-auto">
            {/* Featured Badge */}
            {program.isFeatured && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-semibold">
                            {t("Featured") || "Featured"}
                        </span>
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

            {/* Program Image */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                {!hasImageError && program.Image ? (
                    <img
                        src={import.meta.env.VITE_API_URL + program.Image}
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

            {/* Program Info */}
            <div className="p-6">
                {/* Title & Description */}
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {title}
                    </h3>
                    {organizationText && (
                        <p className="text-blue-600 text-sm font-medium mb-2">
                            {organizationText}
                        </p>
                    )}
                    {shortDescription && (
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                            {shortDescription}
                        </p>
                    )}
                </div>

                {/* Price Section */}
                <div className="mb-4">
                    {program.discountPrice !== undefined &&
                    program.discountPrice !== null ? (
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-2xl font-bold ${
                                    program.discountPrice === 0
                                        ? "text-green-600"
                                        : "text-blue-600"
                                }`}
                            >
                                {formatPrice(program.discountPrice)}
                            </span>
                            {program.Price > 0 && (
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(program.Price)}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div
                            className={`text-2xl font-bold ${
                                program.Price === 0 || !program.Price
                                    ? "text-green-600"
                                    : "text-blue-600"
                            }`}
                        >
                            {formatPrice(program.Price)}
                        </div>
                    )}
                </div>

                {/* Tags/Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {program.status && (
                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                                program.status,
                            )}`}
                        >
                            {t(program.status) || program.status}
                        </span>
                    )}
                    {program.programType && (
                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${getProgramTypeColor(
                                program.programType,
                            )}`}
                        >
                            {getProgramTypeIcon(program.programType)}{" "}
                            {program.programType}
                        </span>
                    )}
                    {categoryText && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                            {categoryText}
                        </span>
                    )}
                    {locationText && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {locationText}
                        </span>
                    )}
                    {program.isRemote && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            🌐 {t("Remote") || "Remote"}
                        </span>
                    )}
                </div>

                {/* Additional Info */}
                <div className="space-y-2 mb-4">
                    {/* Deadline */}
                    {program.applicationDeadline && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">
                                {t("Deadline") || "Deadline"}:
                            </span>
                            <span className="font-medium">
                                {formatDate(program.applicationDeadline)}
                            </span>
                        </div>
                    )}

                    {/* Scholarship Amount */}
                    {program.scholarshipAmount && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-gray-500">
                                {t("Amount") || "Amount"}:
                            </span>
                            <span className="font-medium text-green-600">
                                {program.scholarshipAmount} {program.currency}
                            </span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                                +{tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Action Button */}
                {(() => {
                    // Determine program price (discount > price > Price)
                    const pDiscount =
                        program.discountPrice !== undefined &&
                        program.discountPrice !== null
                            ? Number(program.discountPrice)
                            : 0;
                    const pPrice = Number(program.Price || program.price || 0);
                    const effectivePrice = pDiscount > 0 ? pDiscount : pPrice;

                    // Try to find linked course id on program object
                    const courseId =
                        program.courseId ||
                        program.CourseId ||
                        (program.linkedCourse && program.linkedCourse.id) ||
                        (program.Course && program.Course.id) ||
                        null;

                    // If program is free and has a linked course, go directly to course
                    if (effectivePrice === 0 && courseId) {
                        return (
                            <Link
                                to={`/Courses/${courseId}`}
                                onClick={() => {
                                    window.scrollTo(0, 0);
                                    console.log(
                                        "Free program - redirecting to course:",
                                        courseId,
                                    );
                                    if (onClick) onClick(program.id);
                                }}
                                className="w-full text-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                            >
                                {t("Go to Course") || "Go to Course"}
                            </Link>
                        );
                    }

                    // Default: go to program details
                    return (
                        <Link
                            to={`/Programs/${program.id}`}
                            onClick={() => {
                                window.scrollTo(0, 0);
                                if (onClick) {
                                    onClick(program.id);
                                }
                            }}
                            className="w-full text-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                            {t("View Details") || "View Details"}
                        </Link>
                    );
                })()}
            </div>
        </article>
    );
}

ProgramCard.propTypes = {
    program: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        title_ar: PropTypes.string,
        short_description: PropTypes.string,
        short_description_ar: PropTypes.string,
        description: PropTypes.string,
        description_ar: PropTypes.string,
        organization: PropTypes.string,
        organization_ar: PropTypes.string,
        category: PropTypes.string,
        category_ar: PropTypes.string,
        location: PropTypes.string,
        location_ar: PropTypes.string,
        Price: PropTypes.number,
        discountPrice: PropTypes.number,
        currency: PropTypes.string,
        programType: PropTypes.string,
        status: PropTypes.string,
        isFeatured: PropTypes.bool,
        isRemote: PropTypes.bool,
        Image: PropTypes.string,
        applicationDeadline: PropTypes.string,
        scholarshipAmount: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        totalSlots: PropTypes.number,
        availableSlots: PropTypes.number,
        tags: PropTypes.array,
    }).isRequired,
    onClick: PropTypes.func,
    language: PropTypes.string,
};

export default ProgramCard;
