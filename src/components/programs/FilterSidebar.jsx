import {
    Building,
    Calendar,
    Filter,
    MapPin,
    Monitor,
    RotateCcw,
    Sparkles,
    Star,
    Tag,
} from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({
    filters,
    onFilterChange,
    categories,
    organizations,
    locations = [],
    onReset,
}) => {
    const { t } = useTranslation();

    const statusOptions = [
        { value: "", label: t("All Status") || "All Status" },
        { value: "open", label: t("Open") || "Open" },
        { value: "closed", label: t("Closed") || "Closed" },
        { value: "upcoming", label: t("Upcoming") || "Upcoming" },
    ];

    const hasActiveFilters = Object.entries(filters).some(
        ([key, value]) => key !== "search" && value !== "",
    );

    const isFreeFilter = filters.maxPrice === "0" && filters.minPrice === "0";
    const handleFreeToggle = (value) => {
        if (value === "free") {
            onFilterChange("maxPrice", "0");
            onFilterChange("minPrice", "0");
        } else {
            onFilterChange("maxPrice", "");
            onFilterChange("minPrice", "");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                        {t("Filtres") || "Filtres"}
                    </h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                    >
                        <RotateCcw className="w-3 h-3" />
                        {t("Reset") || "Reset"}
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {/* Free Programs Filter */}
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                        <Sparkles className="w-4 h-4 text-green-600" />
                        {t("Price Type") || "Price Type"}
                    </label>
                    <div className="space-y-1">
                        {[
                            {
                                value: "all",
                                label: t("All Programs") || "All Programs",
                            },
                            {
                                value: "free",
                                label: t("Free Only") || "🆓 Free Only",
                            },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className={`flex items-center gap-2 cursor-pointer p-1.5 rounded text-xs ${
                                    (
                                        option.value === "free"
                                            ? isFreeFilter
                                            : !isFreeFilter
                                    )
                                        ? "bg-green-200 border border-green-400"
                                        : "hover:bg-green-100"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="programPriceType"
                                    value={option.value}
                                    checked={
                                        option.value === "free"
                                            ? isFreeFilter
                                            : !isFreeFilter
                                    }
                                    onChange={() =>
                                        handleFreeToggle(option.value)
                                    }
                                    className="w-3 h-3 text-green-600"
                                />
                                <span>
                                    {option.value === "free" ? "🆓 " : "💻 "}
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Featured Filter */}
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                        <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                        {t("Featured Programs") || "Featured Programs"}
                    </label>
                    <div className="space-y-1">
                        {[
                            {
                                value: "",
                                label: t("All Programs") || "All Programs",
                            },
                            {
                                value: "true",
                                label: t("Featured Only") || "Featured Only",
                            },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer hover:bg-yellow-100 p-1.5 rounded text-xs"
                            >
                                <input
                                    type="radio"
                                    name="featured"
                                    value={option.value}
                                    checked={filters.featured === option.value}
                                    onChange={(e) =>
                                        onFilterChange(
                                            "featured",
                                            e.target.value,
                                        )
                                    }
                                    className="w-3 h-3 text-yellow-600"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-600" />
                        {t("Category") || "Category"}
                    </label>
                    <select
                        value={filters.category}
                        onChange={(e) =>
                            onFilterChange("category", e.target.value)
                        }
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white"
                    >
                        <option value="">
                            {t("All Categories") || "All Categories"}
                        </option>
                        {categories.map((category, index) => {
                            const categoryValue =
                                typeof category === "object"
                                    ? category.category || category.value
                                    : category;
                            const categoryLabel =
                                typeof category === "object"
                                    ? category.category || category.label
                                    : category;
                            return (
                                <option
                                    key={`category-${categoryValue}-${index}`}
                                    value={categoryValue}
                                >
                                    {categoryLabel}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Organization Filter */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                        <Building className="w-3.5 h-3.5 text-green-600" />
                        {t("Organization") || "Organization"}
                    </label>
                    <select
                        value={filters.organization}
                        onChange={(e) =>
                            onFilterChange("organization", e.target.value)
                        }
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white"
                    >
                        <option value="">
                            {t("All Organizations") || "All Organizations"}
                        </option>
                        {organizations.map((org, index) => {
                            const orgValue =
                                typeof org === "object"
                                    ? org.organization || org.value
                                    : org;
                            const orgLabel =
                                typeof org === "object"
                                    ? org.organization || org.label
                                    : org;
                            return (
                                <option
                                    key={`org-${orgValue}-${index}`}
                                    value={orgValue}
                                >
                                    {orgLabel}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        {t("Status") || "Status"}
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            onFilterChange("status", e.target.value)
                        }
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location Filter */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        {t("Location") || "Location"}
                    </label>
                    <select
                        value={filters.location}
                        onChange={(e) =>
                            onFilterChange("location", e.target.value)
                        }
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white"
                    >
                        <option value="">
                            {t("All Locations") || "All Locations"}
                        </option>
                        {Array.isArray(locations) &&
                            [
                                ...new Set(
                                    locations.map((location) =>
                                        typeof location === "object"
                                            ? location.location ||
                                              location.value
                                            : location,
                                    ),
                                ),
                            ]
                                .filter((locationValue) => locationValue)
                                .map((locationValue, index) => (
                                    <option
                                        key={`location-${locationValue}-${index}`}
                                        value={locationValue}
                                    >
                                        {locationValue}
                                    </option>
                                ))}
                    </select>
                </div>

                {/* Program Format Filter */}
                <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                        <Monitor className="w-4 h-4 text-cyan-600" />
                        {t("Program Format") || "Program Format"}
                    </label>
                    <div className="space-y-1">
                        {[
                            {
                                value: "",
                                label: t("All Formats") || "All Formats",
                            },
                            {
                                value: "true",
                                label:
                                    t("Online Programs") || "Online Programs",
                            },
                            {
                                value: "false",
                                label:
                                    t("On-site Programs") || "On-site Programs",
                            },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer hover:bg-cyan-100 p-1.5 rounded text-xs"
                            >
                                <input
                                    type="radio"
                                    name="programFormat"
                                    value={option.value}
                                    checked={filters.isRemote === option.value}
                                    onChange={(e) =>
                                        onFilterChange(
                                            "isRemote",
                                            e.target.value,
                                        )
                                    }
                                    className="w-3 h-3 text-cyan-600"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tags Filter */}
                <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                        <Tag className="w-3.5 h-3.5 text-pink-600" />
                        {t("Tags") || "Tags"}
                    </label>
                    <input
                        type="text"
                        placeholder={
                            t("Enter tags (comma separated)") ||
                            "Enter tags (comma separated)"
                        }
                        value={filters.tags}
                        onChange={(e) => onFilterChange("tags", e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white"
                    />
                </div>
            </div>
        </div>
    );
};

FilterSidebar.propTypes = {
    filters: PropTypes.shape({
        category: PropTypes.string,
        organization: PropTypes.string,
        status: PropTypes.string,
        programType: PropTypes.string,
        featured: PropTypes.string,
        priceRange: PropTypes.string,
        minPrice: PropTypes.string,
        maxPrice: PropTypes.string,
        tags: PropTypes.string,
        search: PropTypes.string,
        country: PropTypes.string,
        location: PropTypes.string,
        isRemote: PropTypes.string,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                category: PropTypes.string,
                category_ar: PropTypes.string,
                value: PropTypes.string,
                label: PropTypes.string,
            }),
        ]),
    ).isRequired,
    organizations: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                organization: PropTypes.string,
                organization_ar: PropTypes.string,
                value: PropTypes.string,
                label: PropTypes.string,
            }),
        ]),
    ).isRequired,
    locations: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                location: PropTypes.string,
                location_ar: PropTypes.string,
                value: PropTypes.string,
                label: PropTypes.string,
            }),
        ]),
    ).isRequired,
    onReset: PropTypes.func.isRequired,
};

export default FilterSidebar;
