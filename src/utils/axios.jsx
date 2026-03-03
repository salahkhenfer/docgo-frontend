import axios from "axios";

// Set base URL if needed
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Enable credentials for all requests
axios.defaults.withCredentials = true;

// Global 401 handler — fires only when the server returns 401 AND the call was
// NOT made with validateStatus:()=>true (which is used for intentional error
// handling like checkAuthStatus).
// A 401 here means BOTH the access token AND the refresh token have expired
// (the server middleware already refreshes silently when only the access token
// is expired and the refresh token is still valid).
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath =
                window.location.pathname +
                window.location.search +
                (window.location.hash || "");

            // Save where the user was so we can redirect back after re-login
            if (!currentPath.toLowerCase().startsWith("/login")) {
                try {
                    sessionStorage.setItem("postLoginRedirect", currentPath);
                } catch {}
            }

            // Clear stale user data
            try {
                localStorage.removeItem("user");
                sessionStorage.removeItem("user");
            } catch {}

            // Only redirect if not already on the login page
            if (!window.location.pathname.toLowerCase().startsWith("/login")) {
                window.location.href = "/Login";
            }
        }
        return Promise.reject(error);
    },
);

export default axios;
