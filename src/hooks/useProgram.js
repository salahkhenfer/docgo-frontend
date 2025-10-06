import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { clientProgramsAPI } from "../API/Programs";
import { useAppContext } from "../AppContext";
import axios from "../utils/axios";

export const useProgram = (programId) => {
    const [programData, setProgramData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState(null);
    const [refetching, setRefetching] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null); // pending, approved, rejected, null

    const navigate = useNavigate();
    const { isAuth, user } = useAppContext();
    const abortControllerRef = useRef(null);

    // Check payment application status
    const checkPaymentStatus = useCallback(async () => {
        if (!isAuth || !programId) return;

        try {
            const response = await axios.get(
                `/user-payments/check-application/program/${programId}`
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
    }, [isAuth, programId]);

    // Memoized fetch function to prevent unnecessary re-renders
    const fetchProgramData = useCallback(
        async (showRefetching = false) => {
            if (!programId) return;

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

                const response = await clientProgramsAPI.getProgramDetails(
                    programId
                );

                // Normalize program data structure
                if (response && response.program) {
                    // Ensure objectives is an array if it exists
                    if (response.program.objectives) {
                        if (typeof response.program.objectives === "string") {
                            try {
                                response.program.objectives = JSON.parse(
                                    response.program.objectives
                                );
                            } catch {
                                response.program.objectives = [
                                    response.program.objectives,
                                ];
                            }
                        }
                        if (!Array.isArray(response.program.objectives)) {
                            response.program.objectives = [
                                response.program.objectives,
                            ];
                        }
                    } else {
                        response.program.objectives = [];
                    }

                    // Ensure benefits is an array if it exists
                    if (response.program.benefits) {
                        if (typeof response.program.benefits === "string") {
                            try {
                                response.program.benefits = JSON.parse(
                                    response.program.benefits
                                );
                            } catch {
                                response.program.benefits = [
                                    response.program.benefits,
                                ];
                            }
                        }
                        if (!Array.isArray(response.program.benefits)) {
                            response.program.benefits = [
                                response.program.benefits,
                            ];
                        }
                    } else {
                        response.program.benefits = [];
                    }

                    // Ensure requirements is an array if it exists
                    if (response.program.requirements) {
                        if (typeof response.program.requirements === "string") {
                            try {
                                response.program.requirements = JSON.parse(
                                    response.program.requirements
                                );
                            } catch {
                                response.program.requirements = [
                                    response.program.requirements,
                                ];
                            }
                        }
                        if (!Array.isArray(response.program.requirements)) {
                            response.program.requirements = [
                                response.program.requirements,
                            ];
                        }
                    } else {
                        response.program.requirements = [];
                    }
                }

                setProgramData(response);

                // Check payment status after loading program data
                await checkPaymentStatus();
            } catch (err) {
                // Don't set error if request was aborted
                if (err.name === "AbortError") {
                    return;
                }

                console.error("Error fetching program:", err);

                // More specific error messages
                let errorMessage =
                    "Failed to load program details. Please try again.";
                if (err.response?.status === 404) {
                    errorMessage =
                        "Program not found. It may have been removed or doesn't exist.";
                } else if (err.response?.status === 403) {
                    errorMessage =
                        "You don't have permission to access this program.";
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
        [programId, checkPaymentStatus]
    );

    // Initial fetch effect
    useEffect(() => {
        fetchProgramData();

        // Cleanup function to abort ongoing requests
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchProgramData]);

    // Separate function for paid program application
    const handlePaidProgramApplication = useCallback(() => {
        navigate(`/payment/program/${programId}`, {
            state: {
                program: programData?.program,
                enrollmentType: "program",
            },
        });
    }, [navigate, programId, programData]);

    // Separate function for free program application
    const handleFreeProgramApplication = useCallback(async () => {
        try {
            setApplying(true);

            await axios.post("/enrollment/program/apply", {
                programId: programId,
                paymentType: "free",
            });

            // Refresh program data if needed
            await fetchProgramData(true);

            // Show success message
            await Swal.fire({
                title: "Application Submitted! 🎉",
                text: "Your application for this free program has been submitted successfully. You will receive confirmation once approved.",
                icon: "success",
                confirmButtonColor: "#10b981",
                confirmButtonText: "View Applications",
                customClass: {
                    popup: "rounded-lg shadow-xl",
                    title: "text-lg font-semibold text-gray-900",
                    content: "text-gray-600",
                },
            });

            // Navigate to applications page
            navigate("/my-applications");
        } catch (error) {
            console.error("Free program application error:", error);

            let errorMessage =
                "Failed to submit application for the program. Please try again.";

            // Handle specific error cases
            if (error.response?.status === 409) {
                errorMessage = "You have already applied for this program.";
            } else if (error.response?.status === 403) {
                errorMessage =
                    "You don't have permission to apply for this program.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            await Swal.fire({
                title: "Application Failed",
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
            setApplying(false);
        }
    }, [programId, fetchProgramData, navigate]);

    // Enhanced application handler with better error handling and UX
    const handleApplyClick = useCallback(async () => {
        // Check authentication first
        if (!isAuth || !user) {
            const result = await Swal.fire({
                title: "Authentication Required",
                text: "You need to log in to apply for this program.",
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

        // Check if already applied (you might want to add this check)
        if (programData?.userStatus?.hasApplied) {
            navigate("/my-applications");
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
                    navigate(`/payment/program/${programId}`, {
                        state: {
                            program: programData?.program,
                            enrollmentType: "program",
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
                    navigate(`/payment/program/${programId}`, {
                        state: {
                            program: programData?.program,
                            enrollmentType: "program",
                        },
                    });
                }
                return;
            }
        }

        // Get program price
        const programPrice = parseFloat(
            programData?.program?.discountPrice ||
                programData?.program?.price ||
                programData?.program?.Price ||
                0
        );

        if (programPrice === 0) {
            // Handle free program application
            await handleFreeProgramApplication();
        } else {
            // Handle paid program - redirect to payment
            handlePaidProgramApplication();
        }
    }, [
        isAuth,
        user,
        programData,
        navigate,
        handleFreeProgramApplication,
        handlePaidProgramApplication,
        paymentStatus,
        programId,
    ]);

    // Retry function for error states
    const retry = useCallback(() => {
        setError(null);
        fetchProgramData();
    }, [fetchProgramData]);

    // Refresh function for manual refresh
    const refresh = useCallback(() => {
        fetchProgramData(true);
    }, [fetchProgramData]);

    // Computed values
    const hasApplied = programData?.userStatus?.hasApplied || false;
    const applicationStatus =
        programData?.userStatus?.applicationStatus || null;
    const isFree =
        (programData?.program?.discountPrice ||
            programData?.program?.price ||
            programData?.program?.Price ||
            0) === 0;
    const programPrice =
        programData?.program?.discountPrice ||
        programData?.program?.price ||
        programData?.program?.Price ||
        0;
    const currency =
        programData?.program?.Currency ||
        programData?.program?.currency ||
        "DZD";
    const hasError = !!error;
    const hasData = !!programData;

    return {
        // Data
        programData,
        programId,

        // Loading states
        loading,
        applying,
        refetching,

        // Error handling
        error,
        hasError,
        retry,

        // Actions
        handleApplyClick,
        refresh,

        // Computed values
        hasApplied,
        applicationStatus,
        isFree,
        programPrice,
        currency,
        hasData,

        // Payment status
        paymentStatus,

        // User status
        user,
        isAuth,
    };
};
