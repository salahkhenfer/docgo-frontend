import {
  ChevronDown,
  Filter,
  Grid,
  GraduationCap,
  List,
  Search,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { clientProgramsAPI } from "../API/Programs";
import { useAppContext } from "../AppContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import FilterSidebar from "../components/programs/FilterSidebar";
import Pagination from "../components/programs/Pagination";
import ProgramCard from "../components/programs/ProgramCard";
import ProgramsList from "../components/programs/ProgramsList";
import StatsOverview from "../components/programs/StatsOverview";
import apiClient from "../services/apiClient";
import ImageWithFallback from "../components/Common/ImageWithFallback";
import { buildApiUrl } from "../utils/apiBaseUrl";

export function Programs() {
  const { t, i18n } = useTranslation("", { keyPrefix: "programs" });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuth } = useAppContext();

  // State management
  const [programs, setPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]); // Store all programs for filtering
  const [enrolledProgramIds, setEnrolledProgramIds] = useState(new Set());
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [enrolledProgramsLoading, setEnrolledProgramsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchLoading, setSearchLoading] = useState(false);
  const [showingFeatured, setShowingFeatured] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    featured: 0,
    universities: 0,
  });
  // Debouncing state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || "",
  );

  // Timeout ref for debouncing
  const timeoutRef = useRef(null);

  // Filter and search state
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    featured: searchParams.get("featured") || "",
    programType: searchParams.get("programType") || "",
    priceRange: searchParams.get("priceRange") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    tags: searchParams.get("tags") || "",
    country: searchParams.get("country") || "",
    specialty: searchParams.get("specialty") || "",
    type: searchParams.get("type") || "",
  });

  // Sync filters from URL parameters whenever they change
  useEffect(() => {
    const newFilters = {
      search: searchParams.get("search") || "",
      featured: searchParams.get("featured") || "",
      programType: searchParams.get("programType") || "",
      priceRange: searchParams.get("priceRange") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      tags: searchParams.get("tags") || "",
      country: searchParams.get("country") || "",
      specialty: searchParams.get("specialty") || "",
      type: searchParams.get("type") || "",
    };

    setFilters(newFilters);

    // Also sync search query
    const urlSearch = searchParams.get("search") || "";
    setSearchQuery(urlSearch);
    setDebouncedSearch(urlSearch);

    // Sync pagination
    const page = parseInt(searchParams.get("page")) || 1;
    setPagination((prev) => ({ ...prev, currentPage: page }));

    // Sync sorting
    const urlSortBy = searchParams.get("sortBy") || "createdAt";
    const urlSortOrder = searchParams.get("sortOrder") || "desc";
    setSortBy(urlSortBy);
    setSortOrder(urlSortOrder);
  }, [searchParams]);
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
    searchParams.get("sortBy") || "createdAt",
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "desc",
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
          filters.programType ||
          filters.featured ||
          filters.priceRange ||
          filters.minPrice ||
          filters.maxPrice ||
          filters.tags ||
          filters.country ||
          filters.specialty ||
          filters.type;

        let response;

        if (hasSearch || hasFilters) {
          // Use search endpoint with all parameters
          const searchParams = {
            search: debouncedSearch?.trim() || "",
            programType: filters.programType || "",
            featured: filters.featured || "",
            priceRange: filters.priceRange || "",
            minPrice: filters.minPrice || "",
            maxPrice: filters.maxPrice || "",
            tags: filters.tags || "",
            country: filters.country || "",
            specialty: filters.specialty || "",
            type: filters.type || "",
            page,
            limit: pagination.limit,
            sortBy,
            sortOrder,
            includeUnpublished: true, // Show unpublished programs (for testing/admin)
          };

          // Remove empty parameters
          Object.keys(searchParams).forEach((key) => {
            if (!searchParams[key] && searchParams[key] !== 0) {
              delete searchParams[key];
            }
          });

          response = await clientProgramsAPI.searchPrograms(searchParams);
        } else {
          // Use regular getPrograms endpoint for all programs
          const getParams = {
            page,
            limit: pagination.limit,
            sortBy,
            sortOrder,
            featured: filters.featured || "",
            programType: filters.programType || "",
            priceRange: filters.priceRange || "",
            minPrice: filters.minPrice || "",
            maxPrice: filters.maxPrice || "",
            tags: filters.tags || "",
            country: filters.country || "",
            specialty: filters.specialty || "",
            type: filters.type || "",
            includeUnpublished: true, // Show unpublished programs (for testing/admin)
          };
          response = await clientProgramsAPI.getPrograms(getParams);
        }

        // Parse programs from response
        const programsData =
          response?.data?.programs ||
          response?.data?.data?.programs ||
          response?.programs ||
          (Array.isArray(response?.data) ? response.data : []) ||
          (Array.isArray(response) ? response : []);

        // No additional client-side filtering needed - backend handles it
        const filteredPrograms = programsData;

        // If first page and no search/filters, get featured programs too
        if (page === 1 && !hasSearch && !hasFilters) {
          try {
            const featuredResponse =
              await clientProgramsAPI.getFeaturedPrograms(6);

            const featuredPrograms =
              featuredResponse?.data?.programs ||
              featuredResponse?.programs ||
              [];

            // Combine featured first, then non-featured (avoid duplicates)
            const featuredIds = new Set(featuredPrograms.map((p) => p.id));
            const nonFeaturedPrograms = filteredPrograms.filter(
              (p) => !featuredIds.has(p.id),
            );
            const combinedPrograms = [
              ...featuredPrograms,
              ...nonFeaturedPrograms,
            ];

            setAllPrograms(combinedPrograms);
            setPrograms(combinedPrograms);
            setShowingFeatured(true);
            extractFiltersFromPrograms(combinedPrograms);
          } catch (featuredError) {
            // Fallback to regular programs if featured fetch fails
            setAllPrograms(filteredPrograms);
            setPrograms(filteredPrograms);
            setShowingFeatured(false);
            extractFiltersFromPrograms(filteredPrograms);
          }
        } else {
          // When filters are active, only update displayed programs
          setPrograms(filteredPrograms);
          setShowingFeatured(false);
        }

        setPagination((prev) => ({
          ...prev,
          totalPages: response.totalPages || 1,
          totalPrograms: response.totalPrograms || programsData.length,
          currentPage: page,
        }));

        // Update stats if provided in response
        if (response.stats) {
          setStats((prevStats) => ({
            total: response.stats.total || 0,
            published: response.stats.published || 0,
            featured: response.stats.featured || 0,
            universities:
              response.stats.universities || prevStats.universities || 0,
          }));
        }

        setError(null);
      } catch (error) {
        setError("Failed to load programs. Please try again.");
        toast.error(t("Failed to load programs", "Failed to load programs"));
        setPrograms([]);
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    },
    [
      debouncedSearch,
      filters,
      pagination.limit,
      sortBy,
      sortOrder,
      t,
      enrolledProgramIds,
    ],
  );

  // Extract filter options from program data
  const extractFiltersFromPrograms = useCallback((programsData) => {
    if (!Array.isArray(programsData) || programsData.length === 0) return;

    // Update stats based on program data
    const uniqueUniversities = [
      ...new Set(
        programsData.map((p) => p.university || p.University).filter(Boolean),
      ),
    ];

    setStats((prev) => ({
      ...prev,
      universities: uniqueUniversities.length,
    }));
  }, []);

  // Fetch categories and universities (no longer needed but kept for reference)
  // const fetchFiltersData = async () => {
  //   // This is now handled by the backend, no need to fetch separately
  // };

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
    [filters, pagination.currentPage, sortBy, sortOrder, setSearchParams],
  );

  // Fetch user's enrolled programs on mount
  useEffect(() => {
    const fetchEnrolledPrograms = async () => {
      if (!isAuth) return;
      setEnrolledProgramsLoading(true);
      try {
        const response = await apiClient.get("/Users/programs/my-applications");
        const apps = Array.isArray(response.data?.data)
          ? response.data.data
          : response.data?.data?.applications || [];
        const validApps = apps.filter(
          (app) =>
            app.status !== "rejected" && app.Program && !app.Program.isDeleted,
        );
        const enrolledIds = new Set(
          validApps
            .map((app) => app.ProgramId || app.Program?.id)
            .filter(Boolean),
        );
        setEnrolledProgramIds(enrolledIds);
        // Also store full program objects for the enrolled section
        const programs = validApps
          .map((app) => app.Program || null)
          .filter((p) => p && p.id);
        setEnrolledPrograms(programs);
      } catch (error) {
      } finally {
        setEnrolledProgramsLoading(false);
      }
    };

    fetchEnrolledPrograms();
  }, [isAuth]);

  // Effects - Filter data fetch no longer needed (handled by backend)
  // useEffect(() => {
  //   fetchFiltersData();
  // }, []);

  // Fetch programs whenever filters or pagination changes
  useEffect(() => {
    fetchPrograms(pagination.currentPage, false, true);
  }, [
    debouncedSearch,
    filters.featured,
    filters.programType,
    filters.priceRange,
    filters.minPrice,
    filters.maxPrice,
    filters.tags,
    filters.country,
    filters.specialty,
    filters.type,
    pagination.currentPage,
    sortBy,
    sortOrder,
    fetchPrograms,
  ]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
    // Only update URL when filters change from user interaction, not from URL sync
    if (filtersRef.current !== filters) {
      updateURLParams(false);
    }
  }, [filters, updateURLParams]);

  // Event handlers
  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));

    // Update URL params immediately
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    setSearchParams(params, { replace: true });

    // For search, use debounced handler
    if (key === "search") {
      handleSearch(value);
    }
  };

  // Handle applying all filters at once from FilterSidebar
  const handleApplyAllFilters = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));

    // Update URL params with all new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", "1"); // Reset to first page
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    setSearchParams(params, { replace: true });
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

    const cleared = {
      search: "",
      featured: "",
      programType: "",
      priceRange: "",
      minPrice: "",
      maxPrice: "",
      tags: "",
      country: "",
      specialty: "",
      type: "",
    };
    setFilters(cleared);
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
      label: t("Newest First", "Newest First") || "Newest First",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    {
      value: "createdAt_asc",
      label: t("Oldest First", "Oldest First") || "Oldest First",
      sortBy: "createdAt",
      sortOrder: "asc",
    },
    {
      value: "title_asc",
      label: t("Title A-Z", "Title A-Z") || "Title A-Z",
      sortBy: "title",
      sortOrder: "asc",
    },
    {
      value: "title_desc",
      label: t("Title Z-A", "Title Z-A") || "Title Z-A",
      sortBy: "title",
      sortOrder: "desc",
    },
    {
      value: "scholarship_desc",
      label:
        t("Highest Scholarship", "Highest Scholarship") ||
        "Highest Scholarship",
      sortBy: "scholarship",
      sortOrder: "desc",
    },
    {
      value: "scholarship_asc",
      label:
        t("Lowest Scholarship", "Lowest Scholarship") || "Lowest Scholarship",
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              {t("TrouverUnProgramme", "Find a Program") || "Find a Program"}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              {t(
                "TrouverUnProgrammeDes",
                "Choose country, specialty and search",
              ) ||
                "Discover amazing scholarship opportunities from universities worldwide"}
            </p>
          </div>
          {/* Stats Overview */}
          <StatsOverview
            totalPrograms={stats.total}
            openPrograms={stats.published}
            featuredPrograms={stats.featured}
            totalUniversities={stats.universities}
          />

          {/* Search Bar */}
          <div className="max-w-2xl mt-3 mx-auto relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 sm:w-6 h-5 sm:h-6" />
            <input
              type="text"
              placeholder={
                t("Search programs...", "Search programs...") ||
                "Search programs..."
              }
              value={searchQuery}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 text-base sm:text-lg border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            {searchLoading && (
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-blue-500"></div>
                <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
                  {t("Searching...", "Searching...") || "Searching..."}
                </span>
              </div>
            )}
            {filters.search && !searchLoading && (
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full hidden sm:inline-block">
                  {t("Press Enter or wait...", "Press Enter or wait...") ||
                    "Press Enter or wait..."}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* - Enrolled Programs Section - */}
      {isAuth && (enrolledProgramsLoading || enrolledPrograms.length > 0) && (
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 border-b border-indigo-800">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {t("My Programs", "My Programs") || "My Programs"}
                </h2>
                <p className="text-purple-200 text-xs sm:text-sm">
                  {enrolledPrograms.length}{" "}
                  {t("enrolled program", "Enrolled program") ||
                    "enrolled program"}
                  {enrolledPrograms.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {enrolledProgramsLoading ? (
              <div className="flex gap-3 sm:gap-4 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-72 sm:w-80 bg-white/20 rounded-lg sm:rounded-2xl h-24 sm:h-28 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2">
                {enrolledPrograms.map((program) => {
                  const programTitle =
                    i18n.language === "ar" && program.title_ar
                      ? program.title_ar
                      : program.title;
                  const orgText =
                    i18n.language === "ar" && program.university_ar
                      ? program.university_ar
                      : program.university;
                  return (
                    <div
                      key={program.id}
                      onClick={() => handleProgramClick(program.id)}
                      className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    >
                      {/* Image strip */}
                      <div className="h-20 sm:h-24 bg-gradient-to-br from-purple-400 to-indigo-500 relative overflow-hidden">
                        <ImageWithFallback
                          type="program"
                          src={buildApiUrl(program.Image)}
                          alt={programTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {/* Info */}
                      <div className="p-2 sm:p-3">
                        {orgText && (
                          <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide mb-0.5">
                            {orgText}
                          </p>
                        )}
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                          {programTitle}
                        </h4>
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            {" "}
                            {t("Enrolled", "Enrolled") || "Enrolled"}
                          </span>
                          {program.status && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                              {program.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filter Sidebar */}
          <div
            className={`${showFilters ? "block" : "hidden lg:block"} lg:w-80`}
          >
            <FilterSidebar
              filters={filters}
              onApplyFilters={handleApplyAllFilters}
              onReset={resetFilters}
            />
          </div>

          {/* Programs Content */}
          <div className="flex-1">
            {/* Show selected location if any */}
            {/* Controls Bar */}
            <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm p-3 sm:p-6 mb-4 sm:mb-6">
              {/* All Programs Header with Featured Note */}
              {!showingFeatured && pagination.currentPage === 1 && (
                <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Star className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 fill-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-blue-800">
                        {t("All Programs", "All Programs") || "All Programs"}
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-700">
                        {t(
                          "Featured programs shown first, followed by all others",
                        ) ||
                          "Featured programs shown first, followed by all others"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {/* Results Info */}
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    {searchLoading && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-blue-500"></div>
                        <span className="text-xs sm:text-sm text-blue-600 hidden sm:inline">
                          {t("Updating...", "Updating...") || "Updating..."}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {debouncedSearch ||
                    filters.programType ||
                    filters.featured ||
                    filters.country ||
                    filters.specialty ||
                    filters.type ? (
                      <>
                        {programs.length} {t("program", "Program") || "program"}
                        {programs.length !== 1 ? "s" : ""}{" "}
                        {t("found", "found") || "found"}
                        {debouncedSearch && (
                          <span className="ml-1">
                            {t("for", "for") || "for"}{" "}
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
                        {t("Showing", "Showing") || "Showing"} {programs.length}{" "}
                        {t("of", "of") || "of"} {pagination.totalPrograms}{" "}
                        programs
                      </>
                    )}
                  </p>
                </div>

                {/* View and Sort Controls */}
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-2 sm:px-3 py-2 border border-gray-200 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 hover:bg-gray-50 text-xs sm:text-base whitespace-nowrap flex-shrink-0"
                  >
                    <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="hidden sm:inline">
                      {t("Filters", "Filters") || "Filters"}
                    </span>
                    <span className="sm:hidden">F</span>
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-200 rounded-lg sm:rounded-xl p-1 flex-shrink-0">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 sm:p-2 rounded transition-colors ${
                        viewMode === "grid"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Grid className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 sm:p-2 rounded transition-colors ${
                        viewMode === "list"
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <List className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative flex-shrink-0 ml-auto">
                    <button
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="px-2 sm:px-4 py-2 border border-gray-200 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 hover:bg-gray-50 text-xs sm:text-base whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">
                        {t("Sort by", "Sort by") || "Sort by"}
                      </span>
                      <span className="sm:hidden">Sort</span>
                      <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>

                    {showSortMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-lg z-50">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleSortChange(option.sortBy, option.sortOrder)
                            }
                            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 first:rounded-t-lg sm:first:rounded-t-xl last:rounded-b-lg sm:last:rounded-b-xl text-xs sm:text-base ${
                              sortBy === option.sortBy &&
                              sortOrder === option.sortOrder
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
              <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center">
                <p className="text-red-600 text-lg">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  {t("Try Again", "Try Again") || "Try Again"}
                </button>
              </div>
            ) : programs.length === 0 ? (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-12 text-center">
                <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Search className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400" />
                </div>

                {/* Dynamic message based on search and filters */}
                {debouncedSearch ||
                filters.category ||
                filters.university ||
                filters.programType ||
                filters.featured ||
                filters.location ||
                filters.isRemote ? (
                  <div>
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      {t(
                        "No programs match your criteria",
                        "No programs match your criteria",
                      ) || "No programs match your criteria"}
                    </h3>
                    <div className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      {debouncedSearch && (
                        <p className="mb-2">
                          {t("No results found for", "No results found for") ||
                            "No results found for"}
                          :{" "}
                          <span className="font-semibold text-gray-800">
                            &ldquo;{debouncedSearch}
                            &rdquo;
                          </span>
                        </p>
                      )}

                      <p className="text-gray-600">
                        {t(
                          "Try adjusting your search criteria or filters",
                          "Try adjusting your search criteria or filters",
                        ) || "Try adjusting your search criteria or filters"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      {t("No programs available", "No programs available") ||
                        "No programs available"}
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      {t(
                        "There are currently no programs available. Please check back later.",
                      ) ||
                        "There are currently no programs available. Please check back later."}
                    </p>
                  </div>
                )}

                <button
                  onClick={resetFilters}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  {t("Reset Filters", "Reset Filters") || "Reset Filters"}
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
                          {t("Updating results...", "Updating results...") ||
                            "Updating results..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {programs.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        onClick={() => handleProgramClick(program.id)}
                        language={i18n.language}
                        isEnrolled={enrolledProgramIds.has(program.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <ProgramsList
                    programs={programs}
                    onProgramClick={handleProgramClick}
                    language={i18n.language}
                    enrolledProgramIds={enrolledProgramIds}
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
