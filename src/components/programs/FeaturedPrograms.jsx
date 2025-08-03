import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Star,
    ArrowRight,
    PlayCircle,
    Award,
    Clock,
    Users,
    ExternalLink,
} from "lucide-react";
import { clientProgramsAPI } from "../../API/Programs";
import { useTranslation } from "react-i18next";

const FeaturedPrograms = ({ limit = 6, showViewAll = true }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFeaturedPrograms = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await clientProgramsAPI.getFeaturedPrograms({
                limit,
            });

            if (response.success) {
                setPrograms(response.data.programs || []);
            } else {
                throw new Error(
                    response.message || "Failed to fetch featured programs"
                );
            }
        } catch (err) {
            console.error("Error fetching featured programs:", err);
            setError(err.message);
            setPrograms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeaturedPrograms();
    }, [limit]);

    const handleProgramClick = (programId) => {
        navigate(`/programs/${programId}`);
    };

    const handleViewAllClick = () => {
        navigate("/programs?featured=true");
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString(
            i18n.language === "ar" ? "ar-EG" : "fr-FR",
            {
                month: "short",
                day: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(limit)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm animate-pulse"
                            >
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || programs.length === 0) {
        return null; // Don't show the section if there are no featured programs
    }

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                        <h2 className="text-3xl font-bold text-gray-900">
                            {t("programs.featured.title")}
                        </h2>
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t("programs.featured.subtitle")}
                    </p>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {programs.map((program) => (
                        <div
                            key={program.id}
                            onClick={() => handleProgramClick(program.id)}
                            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
                        >
                            {/* Program Image */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
                                {program.Image ? (
                                    <img
                                        src={`${
                                            import.meta.env.VITE_SERVER_URL
                                        }/public${program.Image}`}
                                        alt={
                                            i18n.language === "ar" &&
                                            program.Title_ar
                                                ? program.Title_ar
                                                : program.Title
                                        }
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Award className="w-16 h-16 text-blue-300" />
                                    </div>
                                )}

                                {/* Featured Badge */}
                                <div className="absolute top-3 left-3">
                                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs font-medium">
                                            {t("programs.featuredBadge")}
                                        </span>
                                    </div>
                                </div>

                                {/* Video Indicator */}
                                {program.videoUrl && (
                                    <div className="absolute bottom-3 right-3">
                                        <div className="bg-purple-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                                            <PlayCircle className="w-3 h-3" />
                                            <span className="text-xs font-medium">
                                                {t("programs.video")}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            program.status?.toLowerCase() ===
                                            "open"
                                                ? "bg-green-100 text-green-800"
                                                : program.status?.toLowerCase() ===
                                                  "closed"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}
                                    >
                                        {program.status?.toLowerCase() ===
                                        "open"
                                            ? t("programs.status.open")
                                            : program.status?.toLowerCase() ===
                                              "closed"
                                            ? t("programs.status.closed")
                                            : t("programs.status.comingSoon")}
                                    </span>
                                </div>
                            </div>

                            {/* Program Content */}
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {i18n.language === "ar" && program.Title_ar
                                        ? program.Title_ar
                                        : program.Title}
                                </h3>

                                {(program.shortDescription ||
                                    program.shortDescription_ar) && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {i18n.language === "ar" &&
                                        program.shortDescription_ar
                                            ? program.shortDescription_ar
                                            : program.shortDescription}
                                    </p>
                                )}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {program.Category && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {i18n.language === "ar" &&
                                            program.Category_ar
                                                ? program.Category_ar
                                                : program.Category}
                                        </span>
                                    )}
                                    {program.organization && (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            {i18n.language === "ar" &&
                                            program.organization_ar
                                                ? program.organization_ar
                                                : program.organization}
                                        </span>
                                    )}
                                </div>

                                {/* Program Info */}
                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    {program.applicationDeadline && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {t("programs.deadline")}:{" "}
                                                {formatDate(
                                                    program.applicationDeadline
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {program.Users_count > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                {program.Users_count}{" "}
                                                {t("programs.applicants")}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Action */}
                                <div className="pt-4 border-t border-gray-100">
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 group-hover:shadow-md">
                                        <span>{t("programs.viewDetails")}</span>
                                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                {showViewAll && (
                    <div className="text-center">
                        <button
                            onClick={handleViewAllClick}
                            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <span>{t("programs.viewAllFeatured")}</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeaturedPrograms;
