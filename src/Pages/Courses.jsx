import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Grid,
    List,
    Star,
    BookOpen,
    Award,
} from "lucide-react";
import { CourseGrid } from "../components/courses/CourseGrid";
import { CourseList } from "../components/courses/CourseList";
import FilterSidebar from "../components/courses/FilterSidebar";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { getCourses } from "../API/Courses";
import PropTypes from "prop-types";

// Stats Overview Component
function StatsOverview({ totalCourses, featuredCourses, totalCategories }) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm font-medium">
                            {t("Total Courses") || "Total Courses"}
                        </p>
                        <p className="text-3xl font-bold">
                            {totalCourses || 0}
                        </p>
                    </div>
                    <BookOpen className="w-12 h-12 text-blue-200" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-yellow-100 text-sm font-medium">
                            {t("Featured") || "Featured"}
                        </p>
                        <p className="text-3xl font-bold">
                            {featuredCourses || 0}
                        </p>
                    </div>
                    <Star className="w-12 h-12 text-yellow-200" />
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-100 text-sm font-medium">
                            {t("Categories") || "Categories"}
                        </p>
                        <p className="text-3xl font-bold">
                            {totalCategories || 0}
                        </p>
                    </div>
                    <Award className="w-12 h-12 text-purple-200" />
                </div>
            </div>
        </div>
    );
}

StatsOverview.propTypes = {
    totalCourses: PropTypes.number,
    featuredCourses: PropTypes.number,
    totalCategories: PropTypes.number,
};

export default function Courses() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State management
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [searchLoading, setSearchLoading] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        featured: 0,
        categories: 0,
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
        specialty: searchParams.get("specialty") || "",
        status: searchParams.get("status") || "published",
        featured: searchParams.get("featured") || "",
        difficulty: searchParams.get("difficulty") || "",
        certificate: searchParams.get("certificate") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        language: searchParams.get("language") || "",
    });
    // Use ref to avoid dependency issues
    const filtersRef = useRef(filters);
    filtersRef.current = filters;

    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: parseInt(searchParams.get("page")) || 1,
        totalPages: 1,
        totalCourses: 0,
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

    // Fetch all courses with filters and search
    const fetchCourses = useCallback(
        async (page = 1, forceRefresh = false, isFilterChange = false) => {
            try {
                if (isFilterChange) {
                    setSearchLoading(true);
                } else if (!forceRefresh) {
                    setLoading(true);
                }

                const params = {
                    page,
                    limit: pagination.limit,
                    search: debouncedSearch,
                    ...filtersRef.current,
                    sortBy,
                    sortOrder,
                };

                // Clean up undefined/empty values
                Object.keys(params).forEach((key) => {
                    if (params[key] === "" || params[key] === undefined) {
                        delete params[key];
                    }
                });

                const response = await getCourses(params);

                if (response.success) {
                    const coursesData = response.data.courses || [];
                    setCourses(coursesData);

                    // Extract filter data and stats from courses
                    extractFiltersData(coursesData);

                    setPagination({
                        currentPage:
                            response.data.pagination?.currentPage || page,
                        totalPages: response.data.pagination?.totalPages || 1,
                        totalCourses:
                            response.data.pagination?.totalCourses || 0,
                        limit: pagination.limit,
                    });

                    // Update stats - count featured courses from current data
                    const featuredCount = coursesData.filter(
                        (course) => course.isFeatured
                    ).length;
                    setStats((prevStats) => ({
                        ...prevStats,
                        total: response.data.pagination?.totalCourses || 0,
                        featured: featuredCount,
                    }));

                    setError(null);
                } else {
                    throw new Error(
                        response.message || t("Failed to fetch courses")
                    );
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError(
                    err.message || t("An error occurred while fetching courses")
                );
                setCourses([]);
                setPagination((prev) => ({
                    ...prev,
                    totalCourses: 0,
                    totalPages: 1,
                }));
            } finally {
                setLoading(false);
                setSearchLoading(false);
            }
        },
        [debouncedSearch, filters, pagination.limit, sortBy, sortOrder, t]
    );

    // Extract categories and specialties from courses data
    const extractFiltersData = (coursesData) => {
        if (!coursesData || !Array.isArray(coursesData)) return;

        // Extract unique categories
        const uniqueCategories = [
            ...new Set(
                coursesData
                    .map((course) => course.Category)
                    .filter((category) => category && category.trim())
            ),
        ];

        // Extract unique specialties
        const uniqueSpecialties = [
            ...new Set(
                coursesData
                    .map((course) => course.Specialty)
                    .filter((specialty) => specialty && specialty.trim())
            ),
        ];

        setCategories(uniqueCategories);
        setSpecialties(uniqueSpecialties);

        // Update stats with categories count
        setStats((prevStats) => ({
            ...prevStats,
            categories: uniqueCategories.length,
        }));
    };

    // Update URL params when filters change
    const updateURLParams = useCallback(
        (isPagination = false) => {
            const params = new URLSearchParams();

            // Add search and filter params
            Object.entries(filtersRef.current).forEach(([key, value]) => {
                if (value && value !== "") {
                    params.set(key, value);
                }
            });

            // Add pagination
            if (pagination.currentPage > 1 && !isPagination) {
                params.set("page", pagination.currentPage);
            }

            // Add sorting
            if (sortBy !== "createdAt") params.set("sortBy", sortBy);
            if (sortOrder !== "desc") params.set("sortOrder", sortOrder);

            // Update URL without causing scroll restoration
            setSearchParams(params, { replace: true });
        },
        [filters, pagination.currentPage, sortBy, sortOrder, setSearchParams]
    );

    // Effects
    useEffect(() => {
        fetchCourses(1, false, false);
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
        fetchCourses(1, false, true);
    }, [
        debouncedSearch,
        filters.category,
        filters.specialty,
        filters.status,
        filters.featured,
        filters.difficulty,
        filters.certificate,
        filters.minPrice,
        filters.maxPrice,
        filters.language,
        sortBy,
        sortOrder,
        fetchCourses,
    ]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle search with debouncing
    const handleSearch = useCallback((value) => {
        setSearchQuery(value);
        setSearchLoading(true);

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debouncing
        timeoutRef.current = setTimeout(() => {
            setDebouncedSearch(value);
            setSearchLoading(false);
        }, 500);
    }, []);

    // Handle enter key press for immediate search
    const handleSearchKeyPress = (e) => {
        if (e.key === "Enter") {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setDebouncedSearch(searchQuery);
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        updateURLParams();
    }, [updateURLParams]);

    // Event handlers
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));

        // For search, use debounced handler
        if (key === "search") {
            handleSearch(value);
            return;
        }

        // Reset to first page when filters change (except search)
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage,
        }));
        fetchCourses(newPage, false, false);
    };

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    const handleSortChange = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    };

    const resetFilters = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const resetFilters = {
            search: "",
            category: "",
            specialty: "",
            status: "published",
            featured: "",
            difficulty: "",
            certificate: "",
            minPrice: "",
            maxPrice: "",
            language: "",
        };

        setFilters(resetFilters);
        setSearchQuery("");
        setDebouncedSearch("");
        setSearchLoading(false);
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    };

    const handleRetry = () => {
        setError(null);
        fetchCourses(pagination.currentPage, true, false);
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
            value: "Title_asc",
            label: t("Title A-Z") || "Title A-Z",
            sortBy: "Title",
            sortOrder: "asc",
        },
        {
            value: "Title_desc",
            label: t("Title Z-A") || "Title Z-A",
            sortBy: "Title",
            sortOrder: "desc",
        },
        {
            value: "Price_desc",
            label: t("Highest Price") || "Highest Price",
            sortBy: "Price",
            sortOrder: "desc",
        },
        {
            value: "Price_asc",
            label: t("Lowest Price") || "Lowest Price",
            sortBy: "Price",
            sortOrder: "asc",
        },
    ];

    if (loading && courses.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <LoadingSpinner />
            </div>
        );
    }

    if (error && courses.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-red-800 mb-2">
                            {t("Error Loading Courses") ||
                                "Error Loading Courses"}
                        </h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            {t("Try Again") || "Try Again"}
                        </button>
                    </div>
                </div>
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
                            {t("TousLesCours") || "All Courses"}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t("ExploreCoursesDescription") ||
                                "Explore our comprehensive collection of courses to enhance your skills and knowledge"}
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <StatsOverview
                        totalCourses={stats.total}
                        featuredCourses={stats.featured}
                        totalCategories={stats.categories}
                    />

                    {/* Search Bar */}
                    <div className="max-w-2xl mt-3 mx-auto relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <input
                            type="text"
                            placeholder={
                                t("Search courses...") || "Search courses..."
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
                            categories={categories || []}
                            specialties={specialties || []}
                            onReset={resetFilters}
                        />
                    </div>

                    {/* Courses Content */}
                    <div className="flex-1">
                        {/* Controls Bar */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                {/* Results Info */}
                                <div className="flex items-center gap-4">
                                    <p className="text-gray-600">
                                        {filters.search ||
                                        filters.category ||
                                        filters.specialty ||
                                        filters.difficulty ||
                                        filters.featured ||
                                        filters.certificate ? (
                                            <>
                                                {courses.length}{" "}
                                                {t("course") || "course"}
                                                {courses.length !== 1
                                                    ? "s"
                                                    : ""}{" "}
                                                {t("found") || "found"}
                                                {filters.search && (
                                                    <span className="ml-1">
                                                        {t("for") || "for"}{" "}
                                                        <span className="font-medium text-gray-800">
                                                            &ldquo;
                                                            {filters.search}
                                                            &rdquo;
                                                        </span>
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {t("Showing") || "Showing"}{" "}
                                                {courses.length}{" "}
                                                {t("of") || "of"}{" "}
                                                {pagination?.totalCourses || 0}{" "}
                                                {t("courses") || "courses"}
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
                                </div>
                            </div>
                        </div>

                        {/* Courses Display */}
                        {viewMode === "grid" ? (
                            <CourseGrid
                                courses={courses}
                                loading={loading}
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onCourseClick={handleCourseClick}
                            />
                        ) : (
                            <CourseList
                                courses={courses}
                                loading={loading}
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onCourseClick={handleCourseClick}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
