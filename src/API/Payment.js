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

            // Add form fields
            formData.append("itemType", itemData.itemType);
            formData.append("itemId", itemData.itemId);
            formData.append("ccpNumber", paymentForm.ccpNumber);
            formData.append(
                "description",
                itemData.description ||
                    `${itemData.itemType}: ${itemData.itemName}`
            );

            // Add additional form fields
            if (paymentForm.fullName) {
                formData.append("fullName", paymentForm.fullName);
            }
            if (paymentForm.transferReference) {
                formData.append(
                    "transferReference",
                    paymentForm.transferReference
                );
            }
            if (paymentForm.phoneNumber) {
                formData.append("phoneNumber", paymentForm.phoneNumber);
            }
            if (paymentForm.email) {
                formData.append("email", paymentForm.email);
            }

            // Add screenshot file
            if (screenshotFile) {
                formData.append("screenshot", screenshotFile);
            } else {
                throw new Error("Screenshot is required");
            }

            if (!paymentForm.ccpNumber) {
                throw new Error("CCP number is required");
            }

            const response = await apiClient.post(
                "/upload/Payment/CCP",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return {
                success: true,
                data: response.data.data,
                message: "CCP payment submitted successfully",
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
