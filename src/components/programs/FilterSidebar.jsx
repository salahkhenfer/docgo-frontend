import React from "react";
import { useTranslation } from "react-i18next";
import {
    Filter,
    X,
    RotateCcw,
    Search,
    MapPin,
    Building,
    Star,
    Calendar,
    Tag,
    DollarSign,
} from "lucide-react";

const FilterSidebar = ({
    filters,
    onFilterChange,
    categories,
    organizations,
    onReset,
}) => {
    const { t } = useTranslation();

    const statusOptions = [
        { value: "", label: t("All Status") || "All Status" },
        { value: "open", label: t("Open") || "Open" },
        { value: "closed", label: t("Closed") || "Closed" },
        { value: "upcoming", label: t("Upcoming") || "Upcoming" },
    ];

    const programTypeOptions = [
        { value: "", label: t("All Types") || "All Types" },
        { value: "scholarship", label: t("Scholarship") || "Scholarship" },
        { value: "exchange", label: t("Exchange") || "Exchange" },
        { value: "grant", label: t("Grant") || "Grant" },
        { value: "internship", label: t("Internship") || "Internship" },
    ];

    const featuredOptions = [
        { value: "", label: t("All Programs") || "All Programs" },
        { value: "true", label: t("Featured Only") || "Featured Only" },
    ];

    const hasActiveFilters = Object.entries(filters).some(
        ([key, value]) => key !== "search" && value !== ""
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t("Filters") || "Filters"}
                    </h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t("Reset") || "Reset"}
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Category Filter */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                        <Tag className="w-4 h-4 text-blue-600" />
                        {t("Category") || "Category"}
                    </label>
                    <select
                        value={filters.category}
                        onChange={(e) =>
                            onFilterChange("category", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        <option value="">
                            {t("All Categories") || "All Categories"}
                        </option>
                        {categories.map((category, index) => {
                            // Handle both object {category, category_ar} and string formats
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
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                        <Building className="w-4 h-4 text-blue-600" />
                        {t("Organization") || "Organization"}
                    </label>
                    <select
                        value={filters.organization}
                        onChange={(e) =>
                            onFilterChange("organization", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        <option value="">
                            {t("All Organizations") || "All Organizations"}
                        </option>
                        {organizations.map((org, index) => {
                            // Handle both object {organization, organization_ar} and string formats
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
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {t("Status") || "Status"}
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            onFilterChange("status", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Program Type Filter */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                        <Star className="w-4 h-4 text-blue-600" />
                        {t("Program Type") || "Program Type"}
                    </label>
                    <select
                        value={filters.programType}
                        onChange={(e) =>
                            onFilterChange("programType", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        {programTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Featured Filter */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {t("Featured") || "Featured"}
                    </label>
                    <select
                        value={filters.featured}
                        onChange={(e) =>
                            onFilterChange("featured", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        {featuredOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Scholarship Amount Range */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        {t("Scholarship Amount") || "Scholarship Amount"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder={t("Min") || "Min"}
                            value={filters.minScholarship}
                            onChange={(e) =>
                                onFilterChange("minScholarship", e.target.value)
                            }
                            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                            type="number"
                            placeholder={t("Max") || "Max"}
                            value={filters.maxScholarship}
                            onChange={(e) =>
                                onFilterChange("maxScholarship", e.target.value)
                            }
                            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {/* Tags Filter */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                        <Tag className="w-4 h-4 text-purple-600" />
                        {t("Tags") || "Tags"}
                    </label>
                    <input
                        type="text"
                        placeholder={
                            t("Enter tags separated by commas") ||
                            "Enter tags separated by commas"
                        }
                        value={filters.tags}
                        onChange={(e) => onFilterChange("tags", e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t("Example: medicine, europe, masters") ||
                            "Example: medicine, europe, masters"}
                    </p>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                        {t("Active Filters") || "Active Filters"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(filters).map(([key, value]) => {
                            if (key === "search" || !value) return null;
                            return (
                                <span
                                    key={key}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                    {value}
                                    <button
                                        onClick={() => onFilterChange(key, "")}
                                        className="hover:bg-blue-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterSidebar;
