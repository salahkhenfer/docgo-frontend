import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const next = `${window.location.pathname}${window.location.search}${window.location.hash || ""}`;
            if (next && !next.toLowerCase().startsWith("/login")) {
                try {
                    sessionStorage.setItem("postLoginRedirect", next);
                } catch {
                    // ignore
                }
            }

            // Import authService dynamically to avoid circular dependency
            const { default: authService } = await import("./authService");
            const safeNext = sessionStorage.getItem("postLoginRedirect");
            const nextParam = safeNext
                ? `?next=${encodeURIComponent(safeNext)}`
                : "";
            await authService.logout({ redirectTo: `/login${nextParam}` });
        }
        return Promise.reject(error);
    },
);

export default api;
