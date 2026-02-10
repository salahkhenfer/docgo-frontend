import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Dev proxy so cookies remain first-party (prevents SameSite issues on localhost)
        proxy: {
            "/Login": "http://localhost:3000",
            "/Register": "http://localhost:3000",
            "/Logout": "http://localhost:3000",
            "/check_Auth": "http://localhost:3000",

            "/Users": "http://localhost:3000",
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
