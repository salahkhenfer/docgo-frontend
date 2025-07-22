import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import courseService from "../services/courseService";
import { useAuth } from "./useAuth";

export const useCourse = (courseId) => {
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState(null);
    const [refetching, setRefetching] = useState(false);

    const navigate = useNavigate();
    const { isAuth, user } = useAuth();
    const abortControllerRef = useRef(null);

    // Memoized fetch function to prevent unnecessary re-renders
    const fetchCourseData = useCallback(
        async (showRefetching = false) => {
            if (!courseId) return;

            try {
                // Cancel previous request if it exists
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }

                // Create new abort controller
                abortControllerRef.current = new AbortController();

                if (showRefetching) {
                    setRefetching(true);
                } else {
                    setLoading(true);
                }

                setError(null);

                const response = await courseService.getCourse(courseId, {
                    signal: abortControllerRef.current.signal,
                });

                console.log("Fetched course data:", response);
                setCourseData(response);
            } catch (err) {
                // Don't set error if request was aborted
                if (err.name === "AbortError") {
                    console.log("Request was aborted");
                    return;
                }

                console.error("Error fetching course:", err);

                // More specific error messages
                let errorMessage =
                    "Failed to load course details. Please try again.";
                if (err.response?.status === 404) {
                    errorMessage =
                        "Course not found. It may have been removed or doesn't exist.";
                } else if (err.response?.status === 403) {
                    errorMessage =
                        "You don't have permission to access this course.";
                } else if (!navigator.onLine) {
                    errorMessage =
                        "No internet connection. Please check your network and try again.";
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
                setRefetching(false);
                abortControllerRef.current = null;
            }
        },
        [courseId]
    );

    // Initial fetch effect
    useEffect(() => {
        fetchCourseData();

        // Cleanup function to abort ongoing requests
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchCourseData]);

    // Separate function for paid course enrollment
    const handlePaidCourseEnrollment = useCallback(() => {
        navigate(`/payment/course/${courseId}`, {
            state: {
                course: courseData?.course,
                enrollmentType: "course",
            },
        });
    }, [navigate, courseId, courseData]);

    // Separate function for free course enrollment
    const handleFreeCourseEnrollment = useCallback(async () => {
        try {
            setEnrolling(true);
            console.log("Enrolling in free course...");

            await courseService.enrollFreeCourse(courseId);

            // Refresh course data to show enrolled status
            await fetchCourseData(true);

            // Show success message with better UX
            await Swal.fire({
                title: "Enrollment Successful! 🎉",
                text: "You have successfully enrolled in this course. You can now access all content.",
                icon: "success",
                confirmButtonColor: "#10b981",
                confirmButtonText: "Start Learning",
                customClass: {
                    popup: "rounded-lg shadow-xl",
                    title: "text-lg font-semibold text-gray-900",
                    content: "text-gray-600",
                },
            });

            // Navigate to course videos
            navigate(`/coursedetails/${courseId}/videos`);
        } catch (error) {
            console.error("Free enrollment error:", error);

            let errorMessage =
                "Failed to enroll in the course. Please try again.";

            // Handle specific error cases
            if (error.response?.status === 409) {
                errorMessage = "You are already enrolled in this course.";
            } else if (error.response?.status === 403) {
                errorMessage =
                    "You don't have permission to enroll in this course.";
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            await Swal.fire({
                title: "Enrollment Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#ef4444",
                customClass: {
                    popup: "rounded-lg shadow-xl",
                    title: "text-lg font-semibold text-gray-900",
                    content: "text-gray-600",
                },
            });
        } finally {
            setEnrolling(false);
        }
    }, [courseId, fetchCourseData, navigate]);

    // Enhanced enrollment handler with better error handling and UX
    const handleEnrollClick = useCallback(async () => {
        // Check authentication first
        if (!isAuth || !user) {
            const result = await Swal.fire({
                title: "Authentication Required",
                text: "You need to log in to enroll in this course.",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3b82f6",
                cancelButtonColor: "#6b7280",
                confirmButtonText: "Go to Login",
                cancelButtonText: "Cancel",
                customClass: {
                    popup: "rounded-lg shadow-xl",
                    title: "text-lg font-semibold text-gray-900",
                    content: "text-gray-600",
                    confirmButton: "font-medium",
                    cancelButton: "font-medium",
                },
            });

            if (result.isConfirmed) {
                navigate(
                    `/login?from=${encodeURIComponent(
                        window.location.pathname
                    )}`
                );
            }
            return;
        }

        // Check if already enrolled
        if (courseData?.userStatus?.isEnrolled) {
            navigate(`/coursedetails/${courseId}/videos`);
            return;
        }

        // Get course price
        const coursePrice = parseFloat(
            courseData?.course?.discountPrice || courseData?.course?.Price || 0
        );

        if (coursePrice === 0) {
            // Handle free course enrollment
            await handleFreeCourseEnrollment();
        } else {
            // Handle paid course - redirect to payment
            handlePaidCourseEnrollment();
        }
    }, [
        isAuth,
        user,
        courseData,
        courseId,
        navigate,
        handleFreeCourseEnrollment,
        handlePaidCourseEnrollment,
    ]);

    // Retry function for error states
    const retry = useCallback(() => {
        setError(null);
        fetchCourseData();
    }, [fetchCourseData]);

    // Refresh function for manual refresh
    const refresh = useCallback(() => {
        fetchCourseData(true);
    }, [fetchCourseData]);

    // Computed values
    const isEnrolled = courseData?.userStatus?.isEnrolled || false;
    const isFree =
        (courseData?.course?.discountPrice ||
            courseData?.course?.Price ||
            0) === 0;
    const coursePrice =
        courseData?.course?.discountPrice || courseData?.course?.Price || 0;
    const currency = courseData?.course?.Currency || "DZD";
    const hasError = !!error;
    const hasData = !!courseData;

    return {
        // Data
        courseData,
        courseId,

        // Loading states
        loading,
        enrolling,
        refetching,

        // Error handling
        error,
        hasError,
        retry,

        // Actions
        handleEnrollClick,
        refresh,

        // Computed values
        isEnrolled,
        isFree,
        coursePrice,
        currency,
        hasData,

        // User status
        user,
        isAuth,
    };
};
