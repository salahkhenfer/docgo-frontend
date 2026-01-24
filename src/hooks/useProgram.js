import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    const abortControllerRef = useRef(null);

    // Check payment application status
    const checkPaymentStatus = useCallback(async () => {
        if (!isAuth || !programId) return;

        try {
            const response = await axios.get(
                `/user-payments/check-application/program/${programId}`,
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

    // Check enrollment/application status for this program (if backend didn't include it)
    const checkEnrollmentStatus = useCallback(
        async (currentProgramData) => {
            if (!isAuth || !programId) return;

            try {
                // If programData already includes userStatus, respect it
                if (currentProgramData?.userStatus) return;

                const resp = await axios.get("/enrollment/my-applications");
                if (resp?.data?.data?.applications) {
                    const apps = resp.data.data.applications;

                    // Find program application by ProgramId or nested Program id
                    const app = apps.find((a) => {
                        if (
                            a.ProgramId &&
                            String(a.ProgramId) === String(programId)
                        )
                            return true;
                        if (
                            a.Program &&
                            a.Program.id &&
                            String(a.Program.id) === String(programId)
                        )
                            return true;
                        if (
                            a.applicationProgram &&
                            a.applicationProgram.id &&
                            String(a.applicationProgram.id) ===
                                String(programId)
                        )
                            return true;
                        return false;
                    });

                    if (app) {
                        // Mutate a shallow copy of programData to include userStatus
                        setProgramData((prev) => ({
                            ...prev,
                            userStatus: {
                                hasApplied: true,
                                applicationStatus:
                                    app.status ||
                                    app.applicationStatus ||
                                    "pending",
                                application: app,
                            },
                        }));
                    }
                }
            } catch (err) {
                console.error("Error checking enrollment status:", err);
            }
        },
        [isAuth, programId],
    );

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

                const response =
                    await clientProgramsAPI.getProgramDetails(programId);

                // Normalize program data structure
                if (response && response.program) {
                    // Ensure objectives is an array if it exists
                    if (response.program.objectives) {
                        if (typeof response.program.objectives === "string") {
                            try {
                                response.program.objectives = JSON.parse(
                                    response.program.objectives,
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
                                    response.program.benefits,
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
                                    response.program.requirements,
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

                // If backend didn't return userStatus, try fetching user's applications
                await checkEnrollmentStatus(response);
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
        [programId, checkPaymentStatus, checkEnrollmentStatus],
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

            const response = await axios.post(
                "/enrollment/programs/enroll-free",
                {
                    programId: programId,
                },
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to enroll");
            }

            // Refresh program data if needed
            await fetchProgramData(true);

            // Show success message
            await Swal.fire({
                title: t(
                    "alerts.application.successTitle",
                    "Application Submitted",
                ),
                text: t(
                    "alerts.application.successText",
                    "Your application has been submitted successfully",
                ),
                icon: "success",
                confirmButtonColor: "#10b981",
                confirmButtonText: t(
                    "alerts.application.viewApplications",
                    "View Applications",
                ),
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
                title: t(
                    "alerts.application.failedTitle",
                    "Application Failed",
                ),
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
                title: t(
                    "alerts.auth.authRequiredTitle",
                    "Authentication Required",
                ),
                text: t(
                    "alerts.auth.authRequiredText",
                    "Please log in to apply for this program",
                ),
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3b82f6",
                cancelButtonColor: "#6b7280",
                confirmButtonText: t("alerts.auth.goToLogin", "Go to Login"),
                cancelButtonText: t("common.cancel", "Cancel"),
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
                    `/login?from=${encodeURIComponent(window.location.pathname)}`,
                );
            }
            return;
        }

        // Check if already applied (you might want to add this check)
        if (programData?.userStatus?.hasApplied) {
            const status = programData.userStatus.applicationStatus;

            if (status === "approved") {
                await Swal.fire({
                    title: t(
                        "alerts.application.alreadyEnrolledTitle",
                        "Already Enrolled",
                    ),
                    text: t(
                        "alerts.application.alreadyEnrolledText",
                        "You are already enrolled in this program",
                    ),
                    icon: "info",
                    confirmButtonColor: "#3b82f6",
                    confirmButtonText: t(
                        "alerts.application.viewApplications",
                        "View Applications",
                    ),
                    customClass: {
                        popup: "rounded-lg shadow-xl",
                        title: "text-lg font-semibold text-gray-900",
                        content: "text-gray-600",
                    },
                });
            } else {
                await Swal.fire({
                    title: t(
                        "alerts.application.alreadyAppliedTitle",
                        "Already Applied",
                    ),
                    text: `${t("common.applicationStatus", "Your application status is:")} ${status}`,
                    icon: "info",
                    confirmButtonColor: "#3b82f6",
                    confirmButtonText: t(
                        "alerts.application.viewApplications",
                        "View Applications",
                    ),
                    customClass: {
                        popup: "rounded-lg shadow-xl",
                        title: "text-lg font-semibold text-gray-900",
                        content: "text-gray-600",
                    },
                });
            }

            navigate("/my-applications");
            return;
        }

        // Check payment status
        if (paymentStatus) {
            if (paymentStatus.status === "pending") {
                await Swal.fire({
                    title: t("alerts.payment.pendingTitle", "Payment Pending"),
                    html: `${t("alerts.payment.pendingText", "Your payment is pending approval")}<br/><br/>
                           <strong>${t("alerts.payment.transactionId", "Transaction ID:")}</strong> ${paymentStatus.transactionId}<br/><br/>
                           ${t("common.waitingForApproval", "You will be notified once it's approved.")}`,
                    icon: "info",
                    confirmButtonColor: "#3b82f6",
                    confirmButtonText: t("common.ok", "OK"),
                });
                return;
            }

            if (paymentStatus.status === "rejected") {
                const result = await Swal.fire({
                    title: t(
                        "alerts.payment.rejectedTitle",
                        "Payment Rejected",
                    ),
                    html: `${t("alerts.payment.rejectedText", "Your payment was rejected")}<br/><br/>
                           <strong>${t("alerts.payment.reason", "Reason:")}</strong> ${paymentStatus.rejectionReason}<br/><br/>
                           ${t("common.resubmitQuestion", "Would you like to resubmit your payment?")}`,
                    icon: "error",
                    showCancelButton: true,
                    confirmButtonColor: "#3b82f6",
                    cancelButtonColor: "#6b7280",
                    confirmButtonText: t("alerts.payment.resubmit", "Resubmit"),
                    cancelButtonText: t("common.cancel", "Cancel"),
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
                    title: t("alerts.payment.deletedTitle", "Payment Deleted"),
                    html: `${t("alerts.payment.deletedText", "Your payment was deleted")}<br/><br/>
                           ${
                               paymentStatus.rejectionReason
                                   ? `<strong>${t("alerts.payment.reason", "Reason:")}</strong> ${paymentStatus.rejectionReason}<br/><br/>`
                                   : ""
                           }
                           ${t("common.submitNewQuestion", "Would you like to submit a new payment?")}`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3b82f6",
                    cancelButtonColor: "#6b7280",
                    confirmButtonText: t("alerts.payment.submitNew"),
                    cancelButtonText: t("common.cancel", "Cancel"),
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
                0,
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
