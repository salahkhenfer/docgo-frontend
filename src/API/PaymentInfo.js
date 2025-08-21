import axios from "../utils/axios";

// API for payment configuration
export const PaymentAPI = {
    // Get payment configuration (public)
    getPaymentInfo: async () => {
        try {
            const response = await axios.get("/payment/info");
            return response.data;
        } catch (error) {
            console.error("Error fetching payment info:", error);
            throw error;
        }
    },

    // Admin only: Get full payment configuration
    getAdminPaymentInfo: async () => {
        try {
            const response = await axios.get("/payment/admin/info");
            return response.data;
        } catch (error) {
            console.error("Error fetching admin payment info:", error);
            throw error;
        }
    },

    // Admin only: Update payment configuration
    updatePaymentInfo: async (configData) => {
        try {
            const response = await axios.put("/payment/admin/info", configData);
            return response.data;
        } catch (error) {
            console.error("Error updating payment info:", error);
            throw error;
        }
    },
};

export default PaymentAPI;
