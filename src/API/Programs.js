import apiClient from "../services/apiClient";

// Client-side Programs API (for public access)
export const clientProgramsAPI = {
    // Get all programs for clients (public)
    getPrograms: async (params = {}) => {
        try {
            const response = await apiClient.get("/Programs", { params });
            console.log("Fetched programs:", response);

            // Server now returns programs directly
            return response.data;
        } catch (error) {
            console.error("Error fetching programs:", error);
            throw error;
        }
    },

    // Get single program details for clients
    getProgramDetails: async (programId) => {
        try {
            const response = await apiClient.get(`/Programs/${programId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching program details:", error);
            throw error;
        }
    },

    // Get featured programs
    getFeaturedPrograms: async (limit = 6) => {
        try {
            const response = await apiClient.get("/Programs/featured", {
                params: { limit },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching featured programs:", error);
            throw error;
        }
    },

    // Get program categories and organizations
    getProgramCategories: async () => {
        try {
            const response = await apiClient.get("/Programs/categories");
            return response.data;
        } catch (error) {
            console.error("Error fetching program categories:", error);
            throw error;
        }
    },

    // Search programs with filters
    Programss: async (params = {}) => {
        try {
            const response = await apiClient.get("/Programs/search", {
                params,
            });
            console.log("Search programs response:", response);
            return response.data;
        } catch (error) {
            console.error("Error searching programs:", error);
            throw error;
        }
    },

    // Alias methods for consistency
    getProgram: async (programId) => {
        return clientProgramsAPI.getProgramDetails(programId);
    },
};

export default clientProgramsAPI;
