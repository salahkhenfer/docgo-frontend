import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
    MapPin,
    Calendar,
    Users,
    Star,
    Clock,
    Tag,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProgramsList = ({ programs, onProgramClick, language = "en" }) => {
    const { t } = useTranslation();

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString(
            language === "ar" ? "ar-DZ" : "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
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

    return (
        <div className="space-y-4">
            {programs.map((program) => {
                const title =
                    language === "ar" && program.Title_ar
                        ? program.Title_ar
                        : program.Title;
                const description =
                    language === "ar" && program.Description_ar
                        ? program.Description_ar
                        : null;
                const shortDescription =
                    language === "ar" && program.shortDescription_ar
                        ? program.shortDescription_ar
                        : program.shortDescription;
                const organization =
                    language === "ar" && program.organization_ar
                        ? program.organization_ar
                        : program.organization;
                const category =
                    language === "ar" && program.Category_ar
                        ? program.Category_ar
                        : program.Category;
                const location =
                    language === "ar" && program.location_ar
                        ? program.location_ar
                        : program.location;

                // Normalize tags into a local array to avoid runtime errors when
                // tags can be a string (comma-separated or JSON-stringified) or an array.
                const tags = (() => {
                    let _tags = [];
                    if (program.tags) {
                        if (Array.isArray(program.tags)) {
                            _tags = program.tags;
                        } else if (typeof program.tags === "string") {
                            try {
                                const parsed = JSON.parse(program.tags);
                                if (Array.isArray(parsed)) _tags = parsed;
                                else
                                    _tags = program.tags
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean);
                            } catch {
                                _tags = program.tags
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean);
                            }
                        }
                    }
                    return _tags;
                })();

                return (
                    <div
                        key={program.id}
                        onClick={() =>
                            onProgramClick && onProgramClick(program.id)
                        }
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-gray-300 cursor-pointer p-6"
                    >
                        {/* tags normalized via local `tags` const above */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Program Image */}
                            <div className="flex-shrink-0">
                                <div className="relative overflow-hidden rounded-xl">
                                    {program.isFeatured && (
                                        <div className="absolute top-3 right-3">
                                            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                <span className="text-xs font-semibold">
                                                    Vedette
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <img
                                        src={
                                            (program.Image &&
                                                import.meta.env.VITE_API_URL +
                                                    program.Image) ||
                                            (program.image &&
                                                import.meta.env.VITE_API_URL +
                                                    program.image) ||
                                            "/placeholder-program.jpg"
                                        }
                                        alt={title}
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            const fallbackDiv =
                                                e.target.nextElementSibling;
                                            if (fallbackDiv) {
                                                e.target.classList.add(
                                                    "hidden"
                                                );
                                                fallbackDiv.classList.remove(
                                                    "hidden"
                                                );
                                                fallbackDiv.classList.add(
                                                    "flex"
                                                );
                                            }
                                        }}
                                        onLoad={(e) => {
                                            const fallbackDiv =
                                                e.target.nextElementSibling;
                                            if (fallbackDiv) {
                                                e.target.classList.remove(
                                                    "hidden"
                                                );
                                                fallbackDiv.classList.add(
                                                    "hidden"
                                                );
                                                fallbackDiv.classList.remove(
                                                    "flex"
                                                );
                                            }
                                        }}
                                    />
                                    {/* Fallback icon when image fails to load */}
                                    <div className="hidden w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 items-center justify-center text-blue-600">
                                        <svg
                                            className="w-48 h-16 opacity-60"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>

                                    {/* Status Badge */}
                                    <div
                                        className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                            program.status
                                        )}`}
                                    >
                                        {t(program.status) || program.status}
                                    </div>
                                    {/* Featured Badge */}
                                    {program.featured && (
                                        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium border border-yellow-200 flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            {t("Featured")}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="mb-3">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                                                {title}
                                            </h3>
                                            {/* Pricing Information */}
                                            <div className="flex-shrink-0">
                                                {program.scholarshipAmount &&
                                                program.scholarshipAmount >
                                                    0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-green-600 font-medium">
                                                            {t("Scholarship") ||
                                                                "Scholarship"}
                                                        </span>
                                                        <div className="text-lg font-bold text-green-600 whitespace-nowrap">
                                                            $
                                                            {program.scholarshipAmount.toLocaleString()}
                                                        </div>
                                                    </div>
                                                ) : program.Price &&
                                                  program.Price > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        {program.discountPrice &&
                                                        program.discountPrice >
                                                            0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    $
                                                                    {program.Price.toLocaleString()}
                                                                </span>
                                                                <div className="text-lg font-bold text-blue-600 whitespace-nowrap">
                                                                    $
                                                                    {program.discountPrice.toLocaleString()}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-lg font-bold text-blue-600 whitespace-nowrap">
                                                                $
                                                                {program.Price.toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                                        {t("Free") || "Free"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Organization and Category */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {organization && (
                                                <span className="text-sm text-gray-600 font-medium">
                                                    {organization}
                                                </span>
                                            )}
                                            {organization && category && (
                                                <span className="text-gray-300">
                                                    •
                                                </span>
                                            )}
                                            {category && (
                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                    {category}
                                                </span>
                                            )}
                                        </div>

                                        {/* Meta Information */}
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            {location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    <span>{location}</span>
                                                </div>
                                            )}
                                            {program.deadline && (
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    <span>
                                                        {formatDate(
                                                            program.deadline
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {program.maxApplications && (
                                                <div className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    <span>
                                                        {program.currentApplications ||
                                                            0}
                                                        /
                                                        {
                                                            program.maxApplications
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-4 flex-1">
                                        <p className="text-gray-700 leading-relaxed line-clamp-2 text-sm">
                                            {shortDescription || description}
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    {tags && tags.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {tags
                                                        .slice(0, 4)
                                                        .map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                            >
                                                                <Tag
                                                                    size={10}
                                                                />
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    {tags.length > 4 && (
                                                        <span className="text-xs text-gray-500 px-2 py-1">
                                                            +{tags.length - 4}{" "}
                                                            more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Action */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {program.applicationDeadline && (
                                                <div className="flex items-center gap-1 text-sm text-orange-600">
                                                    <Calendar size={14} />
                                                    <span>
                                                        {t("Deadline")}:{" "}
                                                        {formatDate(
                                                            program.applicationDeadline
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            to={`/Programs/${program.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {t("Apply") || "Apply"}
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProgramsList;

ProgramsList.propTypes = {
    programs: PropTypes.array.isRequired,
    onProgramClick: PropTypes.func,
    language: PropTypes.string,
};
