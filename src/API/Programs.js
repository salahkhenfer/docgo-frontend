// Client-side Programs API (for public access)
export const clientProgramsAPI = {
    // Get all programs for clients (public)
    getPrograms: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach((key) => {
                if (params[key] !== undefined && params[key] !== "") {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/Programs?${queryParams}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching programs:", error);
            throw error;
        }
    },

    // Get single program details for clients
    getProgramDetails: async (programId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/Programs/${programId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching program details:", error);
            throw error;
        }
    },

    // Get featured programs
    getFeaturedPrograms: async (limit = 6) => {
        try {
            const response = await fetch(
                `${
                    import.meta.env.VITE_SERVER_URL
                }/Programs/featured?limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching featured programs:", error);
            throw error;
        }
    },

    // Get program categories and organizations
    getProgramCategories: async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/Programs/categories`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching program categories:", error);
            throw error;
        }
    },

    // Alias methods for consistency
    getProgram: async (programId) => {
        return clientProgramsAPI.getProgramDetails(programId);
    },
};

export default clientProgramsAPI;
