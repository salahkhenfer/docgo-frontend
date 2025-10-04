import api from "./apiClient";

const homeService = {
    // Get all home page data
    getHomePageData: async () => {
        try {
            const response = await api.get("/home");
            return response.data;
        } catch (error) {
            console.error("Error fetching home page data:", error);
            throw error;
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
