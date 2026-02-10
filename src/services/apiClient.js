import axios from "axios";
import { getApiBaseUrl } from "../utils/apiBaseUrl";

const API_URL = getApiBaseUrl();

const DEV_AUTH_ENABLED =
    import.meta.env.DEV &&
    ["1", "true", "yes"].includes(
        String(
            import.meta.env.VITE_USER_AUTH_TRUE_WHILE_DEV || "",
        ).toLowerCase(),
    );
const DEV_USER_ID = Number(import.meta.env.VITE_DEV_USER_ID || 1);

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

if (DEV_AUTH_ENABLED) {
    api.defaults.headers.common["X-Dev-Auth-UserId"] = String(DEV_USER_ID);
}

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
