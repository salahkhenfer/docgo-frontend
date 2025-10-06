import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import courseService from "../services/courseService";
import { useAppContext } from "../AppContext";
import axios from "../utils/axios";

export const useCourse = (courseId) => {
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState(null);
    const [refetching, setRefetching] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // pending, approved, rejected, null

    const navigate = useNavigate();
    const { isAuth, user } = useAppContext();
    const abortControllerRef = useRef(null);

    // Check payment application status
    const checkPaymentStatus = useCallback(async () => {
        if (!isAuth || !courseId) return;

        try {
            const response = await axios.get(
                `/user-payments/check-application/course/${courseId}`
            );

            if (response.data.success && response.data.hasApplication) {
                setPaymentStatus({
                    status: response.data.application.status,
                    rejectionReason: response.data.application.rejectionReason,
                    transactionId: response.data.application.transactionId,
                    createdAt: response.data.application.createdAt,
                });
            } else {
                setPaymentStatus(null);
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
            setPaymentStatus(null);
        }
    }, [isAuth, courseId]);

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

                // Normaliser les données pour s'assurer que objectives est un tableau
                if (response && response.course) {
                    if (response.course.objectives) {
                        if (typeof response.course.objectives === "string") {
                            try {
                                response.course.objectives = JSON.parse(
                                    response.course.objectives
                                );
                            } catch {
                                // Si le parsing JSON échoue, on traite comme un seul objectif
                                response.course.objectives = [
                                    response.course.objectives,
                                ];
                            }
                        }
                        // S'assurer que c'est un tableau
                        if (!Array.isArray(response.course.objectives)) {
                            response.course.objectives = [
                                response.course.objectives,
                            ];
                        }
                    } else {
                        response.course.objectives = [];
                    }
                }

                setCourseData(response);

                // Check payment status after loading course data
                await checkPaymentStatus();
            } catch (err) {
                // Don't set error if request was aborted
                if (err.name === "AbortError") {
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
        [courseId, checkPaymentStatus]
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

    // Separate function for free course enrollment
    const handleFreeCourseEnrollment = useCallback(async () => {
        try {
            setEnrolling(true);

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
            navigate(`/MyCourses/${courseId}`);
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
            navigate(`/MyCourses/${courseId}`);
            return;
        }

        // Check payment status
        if (paymentStatus) {
            if (paymentStatus.status === "pending") {
                await Swal.fire({
                    title: "Payment Pending",
                    html: `Your payment is currently under review by our admin team.<br/><br/>
                           <strong>Transaction ID:</strong> ${paymentStatus.transactionId}<br/><br/>
                           You will be notified once it's approved.`,
                    icon: "info",
                    confirmButtonColor: "#3b82f6",
                    confirmButtonText: "OK",
                });
                return;
            }

            if (paymentStatus.status === "rejected") {
                const result = await Swal.fire({
                    title: "Payment Rejected",
                    html: `Your previous payment was rejected.<br/><br/>
                           <strong>Reason:</strong> ${paymentStatus.rejectionReason}<br/><br/>
                           Would you like to resubmit your payment?`,
                    icon: "error",
                    showCancelButton: true,
                    confirmButtonColor: "#3b82f6",
                    cancelButtonColor: "#6b7280",
                    confirmButtonText: "Resubmit Payment",
                    cancelButtonText: "Cancel",
                });

                if (result.isConfirmed) {
                    navigate(`/payment/course/${courseId}`, {
                        state: {
                            course: courseData?.course,
                            enrollmentType: "course",
                            isResubmission: true,
                        },
                    });
                }
                return;
            }

            if (paymentStatus.status === "deleted") {
                const result = await Swal.fire({
                    title: "Payment Deleted",
                    html: `Your payment has been removed by the administrator.<br/><br/>
                           ${
                               paymentStatus.rejectionReason
                                   ? `<strong>Reason:</strong> ${paymentStatus.rejectionReason}<br/><br/>`
                                   : ""
                           }
                           Would you like to submit a new payment?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3b82f6",
                    cancelButtonColor: "#6b7280",
                    confirmButtonText: "Submit New Payment",
                    cancelButtonText: "Cancel",
                });

                if (result.isConfirmed) {
                    navigate(`/payment/course/${courseId}`, {
                        state: {
                            course: courseData?.course,
                            enrollmentType: "course",
                        },
                    });
                }
                return;
            }
        }

        // Get course price
        const coursePrice = parseFloat(
            courseData?.course?.discountPrice || courseData?.course?.Price || 0
        );

        if (coursePrice === 0) {
            // Handle free course enrollment
            await handleFreeCourseEnrollment();
        } else {
            navigate(`/payment/course/${courseId}`, {
                state: {
                    course: courseData?.course,
                    enrollmentType: "course",
                },
            });
        }
    }, [
        isAuth,
        user,
        courseData,
        courseId,
        navigate,
        handleFreeCourseEnrollment,
        paymentStatus,
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

        // Payment status
        paymentStatus,

        // User status
        user,
        isAuth,
    };
};
