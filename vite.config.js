import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend SPA routes that share a prefix with backend proxy paths.
// On refresh the browser sends Accept: text/html — intercept before the proxy
// and serve index.html so React Router handles the route client-side.
// API calls (fetch/axios with Accept: application/json) are NOT intercepted.
const SPA_ROUTE_PREFIXES = [
    "/Courses",
    "/Programs",
    "/Login",
    "/login",
    "/Register",
    "/register",
    "/Favorites",
    "/favorites",
    "/notifications",
    "/payments",
    "/payment",
    "/home",
    "/faqs",
    "/faq",
    "/contact",
    "/dashboard",
    "/profile",
    "/myapplications",
    "/my-applications",
    "/media",
    "/forgot-password",
];

const spaFallbackPlugin = {
    name: "spa-fallback-for-shared-routes",
    configureServer(server) {
        server.middlewares.use((req, _res, next) => {
            const url = req.url?.split("?")[0] ?? "";
            const isSpaRoute = SPA_ROUTE_PREFIXES.some(
                (p) =>
                    url.toLowerCase() === p.toLowerCase() ||
                    url.toLowerCase().startsWith(p.toLowerCase() + "/"),
            );
            if (isSpaRoute) {
                const accept = req.headers["accept"] || "";
                const contentType = req.headers["content-type"] || "";
                const isApiCall =
                    accept.includes("application/json") ||
                    contentType.includes("application/json") ||
                    (req.headers["x-requested-with"] || "") ===
                        "XMLHttpRequest";
                if (!isApiCall) {
                    req.url = "/index.html";
                }
            }
            next();
        });
    },
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), spaFallbackPlugin],
    server: {
        // Dev proxy so cookies remain first-party (prevents SameSite issues on localhost)
        proxy: {
            "/Login": "http://localhost:3000",
            "/Register": "http://localhost:3000",
            "/register": "http://localhost:3000",
            "/Logout": "http://localhost:3000",
            "/check_Auth": "http://localhost:3000",
            "/forgot-password": "http://localhost:3000",

            "/Users": "http://localhost:3000",

            // API calls to /Courses and /Programs come here only when they carry
            // Accept: application/json (fetch/axios). Browser navigations are
            // intercepted by spaFallbackPlugin above and never reach the proxy.
            "/Courses": "http://localhost:3000",
            "/Programs": "http://localhost:3000",

            "/Favorites": "http://localhost:3000",
            "/notifications": "http://localhost:3000",
            "/enrollment": "http://localhost:3000",

            "/payments": "http://localhost:3000",
            "/user-payments": "http://localhost:3000",
            "/comprehensive-payments": "http://localhost:3000",
            "/payment": "http://localhost:3000",
            "/payment-status": "http://localhost:3000",

            "/media": "http://localhost:3000",
            "/public": "http://localhost:3000",
            "/home": "http://localhost:3000",
            "/faqs": "http://localhost:3000",
            "/contact": "http://localhost:3000",
            "/upload": "http://localhost:3000",
            "/visit": "http://localhost:3000",
        },
    },
});
