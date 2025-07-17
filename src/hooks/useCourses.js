import { useState, useEffect, useCallback } from "react";
import { courseService } from "../services/courseService";
import { useAppContext } from "../AppContext";

export const useCourses = (initialParams = {}) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCourses: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        category: "",
        search: "",
        sortBy: "createdAt",
        order: "DESC",
        price: "free",
        certificate: "with",
        date: "latest",
        ...initialParams,
    });

    const fetchCourses = useCallback(
        async (params = filters) => {
            setLoading(true);
            setError(null);

            try {
                const response = await courseService.getCourses(params);
                setCourses(response.courses || []);
                setPagination(response.pagination || {});
                setIsAuthenticated(response.isAuthenticated || false);
            } catch (err) {
                setError(err.message || "Failed to fetch courses");
                setCourses([]);
                // If there's an error, treat as guest user
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        },
        [filters] // Remove userId dependency since it's not needed
    );

    const updateFilters = useCallback((newFilters) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1, // Reset to page 1 when filters change
        }));
    }, []); // function will be created once and never change across re-renders.

    const searchCourses = useCallback(
        (searchTerm) => {
            updateFilters({ search: searchTerm, page: 1 });
        },
        [updateFilters]
    );

    const changePage = useCallback(
        (page) => {
            updateFilters({ page });
        },
        [updateFilters]
    );

    const applyFilters = useCallback(
        (filterData) => {
            updateFilters({ ...filterData, page: 1 });
        },
        [updateFilters]
    );

    const resetFilters = useCallback(() => {
        setFilters({
            page: 1,
            limit: 12,
            category: "",
            search: "",
            sortBy: "createdAt",
            order: "DESC",
            price: "free",
            certificate: "with",
            date: "latest",
        });
    }, []);

    useEffect(() => {
        fetchCourses(filters);
    }, [filters, fetchCourses]);

    return {
        courses,
        loading,
        error,
        pagination,
        filters,
        isAuthenticated,
        searchCourses,
        changePage,
        applyFilters,
        updateFilters,
        resetFilters,
        refetch: () => fetchCourses(filters),
    };
};

export const useCourse = (courseId) => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchCourse = useCallback(async () => {
        if (!courseId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await courseService.getCourse(courseId);
            setCourse(response.course || response);
            setIsAuthenticated(response.course?.isAuthenticated || false);
        } catch (err) {
            setError(err.message || "Failed to fetch course");
            setCourse(null);
            // If there's an error, treat as guest user
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    return {
        course,
        loading,
        error,
        isAuthenticated,
        refetch: fetchCourse,
    };
};

export const useCourseApplication = () => {
    const { userId } = useAppContext();
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState(null);

    const applyCourse = useCallback(
        async (courseData) => {
            if (!userId) {
                throw new Error("User not authenticated");
            }

            setApplying(true);
            setError(null);

            try {
                const response = await courseService.applyCourse(courseData);
                return response;
            } catch (err) {
                setError(err.message || "Failed to apply for course");
                throw err;
            } finally {
                setApplying(false);
            }
        },
        [userId]
    );

    return {
        applyCourse,
        applying,
        error,
    };
};
