// Centralized API base URL resolution for Vite dev/prod.
//
// In development, we prefer same-origin (""), so Vite's proxy can forward
// requests to the backend while keeping cookies first-party on localhost.
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

    // Dev: default to same-origin, unless explicitly pointing at a non-localhost backend.
    if (import.meta.env.DEV) {
        if (configured && !isLocalhostUrl(configured)) return configured;
        return "";
    }

    // Prod: use configured backend origin, with a safe fallback for local runs.
    return configured ?? "http://localhost:3000";
};
