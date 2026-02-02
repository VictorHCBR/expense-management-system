import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Dev sem Docker:
 * proxy /api -> backend (localhost:8080), evitando CORS.
 *
 * Em Docker:
 * Nginx do container web proxy /api -> api:8080.
 */
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:8080"
        }
    }
});
