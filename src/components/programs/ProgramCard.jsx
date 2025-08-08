import React from "react";
import {
    ArrowRight,
    MapPin,
    Calendar,
    Users,
    Star,
    Clock,
    Tag,
    Bookmark,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function ProgramCard({ program, onClick, language = "en" }) {
    const { t } = useTranslation();

    if (!program) return null;

    // Multi-language content handling
    const title =
        language === "ar" && program.Title_ar
            ? program.Title_ar
            : program.Title;
    const description =
        language === "ar" && program.Description_ar
            ? program.Description_ar
            : program.Description;
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

    const getProgramTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case "scholarship":
                return "bg-purple-100 text-purple-800";
            case "exchange":
                return "bg-blue-100 text-blue-800";
            case "grant":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <article className="group relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 cursor-pointer">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div
                className="relative"
                onClick={() => onClick && onClick(program.id)}
            >
                {/* Program Image */}
                <div className="relative overflow-hidden">
                    <img
                        src={
                            import.meta.env.VITE_API_URL + program.Image ||
                            import.meta.env.VITE_API_URL + program.image ||
                            null
                        }
                        alt={title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Status Badge */}
                    <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            program.status
                        )}`}
                    >
                        {t(program.status) || program.status}
                    </div>

                    {/* Featured Badge */}
                    {program.featured && (
                        <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium border border-yellow-200 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {t("Featured")}
                        </div>
                    )}

                    {/* Bookmark Button */}
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Bookmark className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-200 line-clamp-2">
                                {title}
                            </h2>
                        </div>

                        {/* Organization and Category */}
                        <div className="flex items-center gap-2 mb-3">
                            {organization && (
                                <span className="text-sm text-gray-600 font-medium">
                                    {organization}
                                </span>
                            )}
                            {organization && category && (
                                <span className="text-gray-300">•</span>
                            )}
                            {category && (
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${getProgramTypeColor(
                                        program.programType
                                    )}`}
                                >
                                    {category}
                                </span>
                            )}
                        </div>

                        {/* Location and Date */}
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
                                    <span>{formatDate(program.deadline)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed line-clamp-3 text-sm">
                            {shortDescription}
                        </p>
                    </div>

                    {/* Tags */}
                    {program.tags && program.tags.length > 0 && (
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {program.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                    >
                                        <Tag size={10} />
                                        {tag}
                                    </span>
                                ))}
                                {program.tags.length > 3 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
                                        +{program.tags.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {/* Scholarship Amount */}
                        <div className="flex items-center gap-2">
                            {program.scholarshipAmount && (
                                <div className="text-lg font-bold text-green-600">
                                    $
                                    {program.scholarshipAmount.toLocaleString()}
                                </div>
                            )}
                            {program.maxApplications && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Users size={14} />
                                    <span>
                                        {program.currentApplications || 0}/
                                        {program.maxApplications}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Apply Button */}
                        <Link
                            to={`/searchprogram/${program.id}`}
                            className="group/btn inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>{t("Apply") || "Apply"}</span>
                            <ArrowRight
                                size={16}
                                className="transition-transform duration-200 group-hover/btn:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </article>
    );
}

export default ProgramCard;
