// Centralized API base URL resolution for Vite dev/prod.
//
// In development, use same-origin ("") so Vite's proxy forwards API calls
// to the backend while keeping cookies first-party on localhost.
// The spaFallbackPlugin in vite.config.js ensures browser navigations to
// /Courses/* and /Programs/* are served as index.html (React SPA) instead
// of being proxied to the backend.
//
// In production, VITE_API_URL should point to the backend origin.

const isLocalhostUrl = (value) => {
    if (!value) return false;
    try {
        const url = new URL(value);
        return url.hostname === "localhost" || url.hostname === "127.0.0.1";
    } catch {
        return false;
    }
};

export const getApiBaseUrl = () => {
    const configured = import.meta.env.VITE_API_URL;

    // Dev: default to same-origin so Vite proxy handles routing.
    if (import.meta.env.DEV) {
        if (configured && !isLocalhostUrl(configured)) return configured;
        return "";
    }

    // Prod: use configured backend origin, with a safe fallback for local runs.
    return configured ?? "http://localhost:3000";
};
