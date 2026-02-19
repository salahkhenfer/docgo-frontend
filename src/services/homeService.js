import api from "./apiClient";
import defaultHomeData from "../data/defaultHomeData";

const homeService = {
    // Get all home page data — always resolves (falls back to static defaults on error)
    getHomePageData: async () => {
        try {
            const response = await api.get("/home");
            return response.data;
        } catch (error) {
            console.warn(
                "[homeService] Server unreachable or API error – using static default data.",
                error?.message,
            );
            return defaultHomeData;
        }
    },

    // Submit contact message from landing page
    submitContactMessage: async (contactData) => {
        try {
            const response = await api.post("/home/contact", contactData);
            return response.data;
        } catch (error) {
            console.error("Error submitting contact message:", error);
            throw error;
        }
    },
};

export default homeService;
