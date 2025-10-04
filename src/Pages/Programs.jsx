import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Search, Filter, Grid, List, Star, ChevronDown } from "lucide-react";
import { clientProgramsAPI } from "../API/Programs";
import ProgramCard from "../components/programs/ProgramCard";
import ProgramsList from "../components/programs/ProgramsList";
import FilterSidebar from "../components/programs/FilterSidebar";
import StatsOverview from "../components/programs/StatsOverview";
import Pagination from "../components/programs/Pagination";
import LoadingSpinner from "../components/Common/LoadingSpinner";

export function Programs() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State management
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [searchLoading, setSearchLoading] = useState(false);
    const [showingFeatured, setShowingFeatured] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        featured: 0,
        organizations: 0,
    });

    // Debouncing state
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") || ""
    );
    const [debouncedSearch, setDebouncedSearch] = useState(
        searchParams.get("search") || ""
    );

    // Timeout ref for debouncing
    const timeoutRef = useRef(null);

    // Filter and search state
    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "",
        organization: searchParams.get("organization") || "",
        status: searchParams.get("status") || "open",
        featured: searchParams.get("featured") || "",
        programType: searchParams.get("programType") || "",
        priceRange: searchParams.get("priceRange") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        tags: searchParams.get("tags") || "",
        country: searchParams.get("country") || "",
        location: searchParams.get("location") || "",
        isRemote: searchParams.get("isRemote") || "",
    });
    // Use ref to avoid dependency issues
    const filtersRef = useRef(filters);
    filtersRef.current = filters;

    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: parseInt(searchParams.get("page")) || 1,
        totalPages: 1,
        totalPrograms: 0,
        limit: 12,
    });

    // Sorting state
    const [sortBy, setSortBy] = useState(
        searchParams.get("sortBy") || "createdAt"
    );
    const [sortOrder, setSortOrder] = useState(
        searchParams.get("sortOrder") || "desc"
    );

    // UI state
    const [showFilters, setShowFilters] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);

    // Fetch all programs with filters and search
    const fetchPrograms = useCallback(
        async (page = 1, forceRefresh = false, isFilterChange = false) => {
            try {
                // Only show main loading on initial load, not on filter changes to preserve scroll
                if (!isFilterChange && (page === 1 || forceRefresh)) {
                    setLoading(true);
                }

                // Show search loading for pagination or subtle loading for filter changes
                if (page > 1 && !forceRefresh) {
                    setSearchLoading(true);
                } else if (isFilterChange) {
                    // For filter changes, don't set any loading state to preserve scroll
                    setSearchLoading(false);
                    setLoading(false);
                }

                // Determine if we have any active filters or search
                const hasSearch = debouncedSearch?.trim();
                const hasFilters =
                    filters.category ||
                    filters.organization ||
                    filters.programType ||
                    filters.featured ||
                    filters.priceRange ||
                    filters.minPrice ||
                    filters.maxPrice ||
                    filters.tags ||
                    filters.country ||
                    filters.location ||
                    filters.isRemote;

                let response;

                if (hasSearch || hasFilters) {
                    // Use search endpoint with all parameters
                    const searchParams = {
                        search: debouncedSearch?.trim() || "",
                        category: filters.category || "",
                        organization: filters.organization || "",
                        programType: filters.programType || "",
                        featured: filters.featured || "",
                        priceRange: filters.priceRange || "",
                        minPrice: filters.minPrice || "",
                        maxPrice: filters.maxPrice || "",
                        tags: filters.tags || "",
                        country: filters.country || "",
                        location: filters.location || "",
                        isRemote: filters.isRemote || "",
                        page,
                        limit: pagination.limit,
                        sortBy,
                        sortOrder,
                    };

                    // Remove empty parameters
                    Object.keys(searchParams).forEach((key) => {
                        if (!searchParams[key] && searchParams[key] !== 0) {
                            delete searchParams[key];
                        }
                    });

                    response = await clientProgramsAPI.Programss(searchParams);
                } else {
                    // Use regular getPrograms endpoint for all programs
                    const getParams = {
                        page,
                        limit: pagination.limit,
                        sortBy,
                        sortOrder,
                        status: filters.status || "open",
                        featured: filters.featured || "",
                        programType: filters.programType || "",
                        priceRange: filters.priceRange || "",
                        minPrice: filters.minPrice || "",
                        maxPrice: filters.maxPrice || "",
                        tags: filters.tags || "",
                        country: filters.country || "",
                        location: filters.location || "",
                        isRemote: filters.isRemote || "",
                    };
                    response = await clientProgramsAPI.getPrograms(getParams);
                }

                const programsData = response.programs || [];

                // If first page and no search/filters, get featured programs too
                if (page === 1 && !hasSearch && !hasFilters) {
                    try {
                        const featuredResponse =
                            await clientProgramsAPI.getFeaturedPrograms(6);
                        const featuredPrograms =
                            featuredResponse.programs || [];

                        // Remove featured programs from regular results to avoid duplicates
                        const featuredIds = new Set(
                            featuredPrograms.map((p) => p.id)
                        );
                        const nonFeaturedPrograms = programsData.filter(
                            (p) => !featuredIds.has(p.id)
                        );

                        // Combine: featured first, then others
                        setPrograms([
                            ...featuredPrograms,
                            ...nonFeaturedPrograms,
                        ]);
                        setShowingFeatured(true);
                    } catch (featuredError) {
                        console.error(
                            "Error fetching featured programs:",
                            featuredError
                        );
                        setPrograms(programsData);
                        setShowingFeatured(false);
                    }
                } else {
                    setPrograms(programsData);
                    setShowingFeatured(false);
                }

                setPagination((prev) => ({
                    ...prev,
                    totalPages: response.totalPages || 1,
                    totalPrograms:
                        response.totalPrograms || programsData.length,
                    currentPage: page,
                }));

                // Update stats if provided in response
                if (response.stats) {
                    setStats((prevStats) => ({
                        total: response.stats.total || 0,
                        published: response.stats.published || 0,
                        featured: response.stats.featured || 0,
                        organizations: prevStats.organizations || 0,
                    }));
                }

                setError(null);
            } catch (error) {
                console.error("Error fetching programs:", error);
                setError("Failed to load programs. Please try again.");
                toast.error(t("Failed to load programs"));
                setPrograms([]);
            } finally {
                setLoading(false);
                setSearchLoading(false);
            }
        },
        [debouncedSearch, filters, pagination.limit, sortBy, sortOrder, t]
    );

    // Fetch categories and organizations
    const fetchFiltersData = async () => {
        try {
            const response = await clientProgramsAPI.getProgramCategories();

            // Ensure we always have arrays, even if the response is empty or malformed
            const categories = Array.isArray(response.categories)
                ? response.categories
                : [];
            const organizations = Array.isArray(response.organizations)
                ? response.organizations
                : [];

            setCategories(categories);
            setOrganizations(organizations);

            // Update organizations count in stats
            setStats((prevStats) => ({
                ...prevStats,
                organizations: organizations.length || 0,
            }));
        } catch (error) {
            console.error("Error fetching filter data:", error);
            // Set empty arrays on error to prevent crashes
            setCategories([]);
            setOrganizations([]);
        }
    };

    // Update URL params when filters change
    const updateURLParams = useCallback(
        (isPagination = false) => {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.set(key, value);
            });

            if (pagination.currentPage > 1)
                params.set("page", pagination.currentPage);
            if (sortBy !== "createdAt") params.set("sortBy", sortBy);
            if (sortOrder !== "desc") params.set("sortOrder", sortOrder);

            // Use replace: true for filter changes to prevent scroll restoration
            // Use normal navigation for pagination (user expects to scroll to top)
            setSearchParams(params, { replace: !isPagination });
        },
        [filters, pagination.currentPage, sortBy, sortOrder, setSearchParams]
    );

    // Effects
    useEffect(() => {
        fetchFiltersData();
        // Load programs initially
        fetchPrograms();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Effect for when search or filters change
    useEffect(() => {
        // Reset to page 1 when search/filters change
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        fetchPrograms(1, true, true); // Pass isFilterChange = true
    }, [
        debouncedSearch,
        filters.category,
        filters.organization,
        filters.programType,
        filters.featured,
        filters.priceRange,
        filters.minPrice,
        filters.maxPrice,
        filters.tags,
        filters.country,
        filters.location,
        filters.isRemote,
        sortBy,
        sortOrder,
        fetchPrograms,
    ]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle search with debouncing
    const handleSearch = useCallback((value) => {
        setSearchQuery(value);

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debouncing
        timeoutRef.current = setTimeout(() => {
            setDebouncedSearch(value);
        }, 500); // 500ms delay like in courses
    }, []);

    // Handle enter key press for immediate search
    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            // Clear any pending timeout and search immediately
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setDebouncedSearch(searchQuery);
        }
    };

    useEffect(() => {
        // This is for filter changes - use replace: true to preserve scroll
        updateURLParams(false);
    }, [updateURLParams]);

    // Event handlers
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));

        // For search, use debounced handler
        if (key === "search") {
            handleSearch(value);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage,
        }));

        // Update URL params for pagination (allows scroll restoration)
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        if (newPage > 1) params.set("page", newPage);
        if (sortBy !== "createdAt") params.set("sortBy", sortBy);
        if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
        setSearchParams(params, { replace: false }); // Normal navigation for pagination

        // Fetch programs for the new page
        fetchPrograms(newPage);
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleProgramClick = (programId) => {
        navigate(`/Programs/${programId}`);
    };

    const handleSortChange = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setShowSortMenu(false);
    };

    const resetFilters = () => {
        // Clear any pending search timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setFilters({
            search: "",
            category: "",
            organization: "",
            status: "open",
            featured: "",
            programType: "",
            priceRange: "",
            minPrice: "",
            maxPrice: "",
            tags: "",
            country: "",
            location: "",
            isRemote: "",
        });
        setSearchQuery("");
        setDebouncedSearch("");
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));

        // Load all programs when filters are reset (featured first, then others)
        fetchPrograms(1, true);
    };

    const handleRetry = () => {
        // Retry with current state
        fetchPrograms(pagination.currentPage, true);
    };

    const sortOptions = [
        {
            value: "createdAt_desc",
            label: t("Newest First") || "Newest First",
            sortBy: "createdAt",
            sortOrder: "desc",
        },
        {
            value: "createdAt_asc",
            label: t("Oldest First") || "Oldest First",
            sortBy: "createdAt",
            sortOrder: "asc",
        },
        {
            value: "title_asc",
            label: t("Title A-Z") || "Title A-Z",
            sortBy: "title",
            sortOrder: "asc",
        },
        {
            value: "title_desc",
            label: t("Title Z-A") || "Title Z-A",
            sortBy: "title",
            sortOrder: "desc",
        },
        {
            value: "scholarship_desc",
            label: t("Highest Scholarship") || "Highest Scholarship",
            sortBy: "scholarship",
            sortOrder: "desc",
        },
        {
            value: "scholarship_asc",
            label: t("Lowest Scholarship") || "Lowest Scholarship",
            sortBy: "scholarship",
            sortOrder: "asc",
        },
    ];

    if (loading && programs.length === 0) {
        return (
            <div className="min-h-screen flex items-col justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {t("TrouverUnProgramme") || "Find a Program"}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t("TrouverUnProgrammeDes") ||
                                "Discover amazing scholarship opportunities from universities worldwide"}
                        </p>
                    </div>
                    {/* Stats Overview */}
                    <StatsOverview
                        totalPrograms={stats.total}
                        openPrograms={stats.published}
                        featuredPrograms={stats.featured}
                        totalOrganizations={stats.organizations}
                    />

                    {/* Search Bar */}
                    <div className="max-w-2xl mt-3 mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <input
                            type="text"
                            placeholder={
                                t("Search programs...") || "Search programs..."
                            }
                            value={searchQuery}
                            onChange={(e) =>
                                handleFilterChange("search", e.target.value)
                            }
                            onKeyPress={handleSearchKeyPress}
                            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                        {searchLoading && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <span className="text-sm text-gray-500">
                                    {t("Searching...") || "Searching..."}
                                </span>
                            </div>
                        )}
                        {filters.search && !searchLoading && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                                    {t("Press Enter or wait...") ||
                                        "Press Enter or wait..."}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div
                        className={`lg:w-80 ${
                            showFilters ? "block" : "hidden lg:block"
                        }`}
                    >
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            categories={categories}
                            organizations={organizations}
                            onReset={resetFilters}
                        />
                    </div>

                    {/* Programs Content */}
                    <div className="flex-1">
                        {/* Controls Bar */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            {/* All Programs Header with Featured Note */}
                            {!showingFeatured &&
                                pagination.currentPage === 1 && (
                                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-3">
                                            <Star className="w-6 h-6 text-blue-600 fill-blue-600" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-blue-800">
                                                    {t("All Programs") ||
                                                        "All Programs"}
                                                </h3>
                                                <p className="text-sm text-blue-700">
                                                    {t(
                                                        "Featured programs shown first, followed by all others"
                                                    ) ||
                                                        "Featured programs shown first, followed by all others"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                {/* Results Info */}
                                <div className="flex items-center gap-4">
                                    {searchLoading && (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                            <span className="text-sm text-blue-600">
                                                {t("Updating...") ||
                                                    "Updating..."}
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-gray-600">
                                        {debouncedSearch ||
                                        filters.category ||
                                        filters.organization ||
                                        filters.programType ||
                                        filters.featured ||
                                        filters.location ||
                                        filters.isRemote ? (
                                            <>
                                                {programs.length}{" "}
                                                {t("program") || "program"}
                                                {programs.length !== 1
                                                    ? "s"
                                                    : ""}{" "}
                                                {t("found") || "found"}
                                                {debouncedSearch && (
                                                    <span className="ml-1">
                                                        {t("for") || "for"}{" "}
                                                        <span className="font-medium text-gray-800">
                                                            &ldquo;
                                                            {debouncedSearch}
                                                            &rdquo;
                                                        </span>
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {t("Showing") || "Showing"}{" "}
                                                {programs.length}{" "}
                                                {t("of") || "of"}{" "}
                                                {pagination.totalPrograms}{" "}
                                                programs
                                            </>
                                        )}
                                    </p>
                                </div>

                                {/* View and Sort Controls */}
                                <div className="flex items-center gap-4">
                                    {/* Mobile Filter Toggle */}
                                    <button
                                        onClick={() =>
                                            setShowFilters(!showFilters)
                                        }
                                        className="lg:hidden px-4 py-2 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-50"
                                    >
                                        <Filter className="w-5 h-5" />
                                        {t("Filters") || "Filters"}
                                    </button>

                                    {/* View Mode Toggle */}
                                    <div className="flex border border-gray-200 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-lg transition-colors ${
                                                viewMode === "grid"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <Grid className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded-lg transition-colors ${
                                                viewMode === "list"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <List className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setShowSortMenu(!showSortMenu)
                                            }
                                            className="px-4 py-2 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-50"
                                        >
                                            {t("Sort by") || "Sort by"}
                                            <ChevronDown className="w-4 h-4" />
                                        </button>

                                        {showSortMenu && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                                                {sortOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() =>
                                                            handleSortChange(
                                                                option.sortBy,
                                                                option.sortOrder
                                                            )
                                                        }
                                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                                                            sortBy ===
                                                                option.sortBy &&
                                                            sortOrder ===
                                                                option.sortOrder
                                                                ? "bg-blue-50 text-blue-600"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Programs Grid/List */}
                        {error ? (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                                <p className="text-red-600 text-lg">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                                >
                                    {t("Try Again") || "Try Again"}
                                </button>
                            </div>
                        ) : programs.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-12 h-12 text-gray-400" />
                                </div>

                                {/* Dynamic message based on search and filters */}
                                {debouncedSearch ||
                                filters.category ||
                                filters.organization ||
                                filters.programType ||
                                filters.featured ||
                                filters.location ||
                                filters.isRemote ? (
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                            {t(
                                                "No programs match your criteria"
                                            ) ||
                                                "No programs match your criteria"}
                                        </h3>
                                        <div className="text-gray-600 mb-6">
                                            {debouncedSearch && (
                                                <p className="mb-2">
                                                    {t(
                                                        "No results found for"
                                                    ) || "No results found for"}
                                                    :{" "}
                                                    <span className="font-semibold text-gray-800">
                                                        &ldquo;{debouncedSearch}
                                                        &rdquo;
                                                    </span>
                                                </p>
                                            )}

                                            <p className="text-gray-600">
                                                {t(
                                                    "Try adjusting your search criteria or filters"
                                                ) ||
                                                    "Try adjusting your search criteria or filters"}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                            {t("No programs available") ||
                                                "No programs available"}
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            {t(
                                                "There are currently no programs available. Please check back later."
                                            ) ||
                                                "There are currently no programs available. Please check back later."}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    {t("Reset Filters") || "Reset Filters"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Filter loading indicator - subtle overlay */}
                                {searchLoading && (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-2xl z-10 flex items-center justify-center">
                                            <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                                <span className="text-sm text-gray-600">
                                                    {t("Updating results...") ||
                                                        "Updating results..."}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {viewMode === "grid" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {programs.map((program) => (
                                            <ProgramCard
                                                key={program.id}
                                                program={program}
                                                onClick={() =>
                                                    handleProgramClick(
                                                        program.id
                                                    )
                                                }
                                                language={i18n.language}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <ProgramsList
                                        programs={programs}
                                        onProgramClick={handleProgramClick}
                                        language={i18n.language}
                                    />
                                )}

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <Pagination
                                        currentPage={pagination.currentPage}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Programs;
