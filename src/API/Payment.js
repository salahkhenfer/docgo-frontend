import apiClient from "../services/apiClient";

// Payment API for handling PayPal and CCP payments
export const PaymentAPI = {
    // =================================================================
    // PAYPAL PAYMENT METHODS
    // =================================================================

    // Create PayPal payment order
    createPayPalPayment: async (itemData) => {
        try {
            const response = await apiClient.post("/payment/paypal/create", {
                itemType: itemData.itemType,
                itemId: itemData.itemId,
                description:
                    itemData.description ||
                    `${itemData.itemType}: ${itemData.itemName}`,
                returnUrl: `${window.location.origin}/payment/success`,
                cancelUrl: `${window.location.origin}/payment/cancel`,
            });

            return {
                success: true,
                data: response.data.data,
                message: "PayPal order created successfully",
            };
        } catch (error) {
            console.error("Create PayPal payment error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to create PayPal payment",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Capture PayPal payment after approval
    capturePayPalPayment: async (orderId) => {
        try {
            const response = await apiClient.post(
                `/payment/paypal/capture/${orderId}`
            );

            return {
                success: true,
                data: response.data.data,
                message: "Payment captured successfully",
            };
        } catch (error) {
            console.error("Capture PayPal payment error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to capture PayPal payment",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // =================================================================
    // CCP PAYMENT METHODS
    // =================================================================

    // Create CCP payment with screenshot upload
    createCCPPayment: async (itemData, paymentForm, screenshotFile) => {
        try {
            const formData = new FormData();

            // Backend expects these exact field names:
            // - CCP_number (not ccpNumber)
            // - Image (not screenshot)

            formData.append("CCP_number", paymentForm.ccpNumber);

            // Add screenshot file with correct field name
            if (screenshotFile) {
                formData.append("Image", screenshotFile);
            } else {
                throw new Error("Screenshot is required");
            }

            // Validation
            if (!paymentForm.ccpNumber) {
                throw new Error("CCP number is required");
            }
            if (!screenshotFile) {
                throw new Error("Screenshot is required");
            }

            let response;
            if (itemData.itemType === "course") {
                response = await apiClient.post(
                    "/upload/Payment/Courses/" + itemData.itemId,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else if (itemData.itemType === "program") {
                response = await apiClient.post(
                    "/upload/Payment/Programs/" + itemData.itemId,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                throw new Error("Invalid item type");
            }


            return {
                success: true,
                data: response.data.data || response.data,
                message:
                    response.data.message ||
                    "CCP payment submitted successfully",
            };
        } catch (error) {
            console.error("Create CCP payment error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to create CCP payment",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // =================================================================
    // CCP PAYMENT CLEANUP (Error/Cancellation Handling)
    // =================================================================

    // Clean up CCP payment screenshot after error or cancellation
    cleanupCCPPayment: async (itemData) => {
        try {
            let response;
            if (itemData.itemType === "course") {
                response = await apiClient.delete(
                    "/upload/Payment/Courses/" + itemData.itemId
                );
            } else if (itemData.itemType === "program") {
                response = await apiClient.delete(
                    "/upload/Payment/Programs/" + itemData.itemId
                );
            } else {
                throw new Error("Invalid item type");
            }

            return {
                success: true,
                data: response.data.data || response.data,
                message: response.data.message || "Payment cleanup successful",
            };
        } catch (error) {
            console.error("CCP payment cleanup error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to cleanup payment",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // =================================================================
    // PAYMENT HISTORY AND STATUS
    // =================================================================

    // Get user payment history
    getUserPayments: async (params = {}) => {
        try {
            const response = await apiClient.get("/payment/my-payments", {
                params,
            });

            return {
                success: true,
                data: response.data.data,
                message: "Payment history fetched successfully",
            };
        } catch (error) {
            console.error("Get user payments error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch payment history",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Get specific payment details
    getPaymentDetails: async (paymentId) => {
        try {
            const response = await apiClient.get(`/payment/${paymentId}`);

            return {
                success: true,
                data: response.data.data,
                message: "Payment details fetched successfully",
            };
        } catch (error) {
            console.error("Get payment details error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch payment details",
                error: error.response?.data?.error || error.message,
            };
        }
    },

    // Cancel payment
    cancelPayment: async (paymentId) => {
        try {
            const response = await apiClient.post(
                `/payment/${paymentId}/cancel`
            );

            return {
                success: true,
                data: response.data.data,
                message: "Payment cancelled successfully",
            };
        } catch (error) {
            console.error("Cancel payment error:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message || "Failed to cancel payment",
                error: error.response?.data?.error || error.message,
            };
        }
    },
};

export default PaymentAPI;
