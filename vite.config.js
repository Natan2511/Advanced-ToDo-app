import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base:
    mode === "production" && process.env.GITHUB_ACTIONS
      ? "/Advanced-ToDo-app/"
      : "/",
  define: {
    // Передаем режим в приложение
    __APP_MODE__: JSON.stringify(mode),
  },
  plugins: [
    react(),
    // Отключаем PWA в продакшене для избежания проблем с SSL
    ...(mode === "development"
      ? [
          VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
              "favicon.ico",
              "apple-touch-icon.png",
              "masked-icon.svg",
            ],
            manifest: {
              name: "To-Do Pro",
              short_name: "To-Do Pro",
              description: "Продвинутое приложение для управления задачами",
              theme_color: "#6366f1",
              background_color: "#ffffff",
              display: "standalone",
              orientation: "portrait",
              scope: "/",
              start_url: "/",
              icons: [
                {
                  src: "pwa-192x192.png",
                  sizes: "192x192",
                  type: "image/png",
                },
                {
                  src: "pwa-512x512.png",
                  sizes: "512x512",
                  type: "image/png",
                },
                {
                  src: "pwa-512x512.png",
                  sizes: "512x512",
                  type: "image/png",
                  purpose: "any maskable",
                },
              ],
            },
            workbox: {
              globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
          }),
        ]
      : []),
  ],
  server: {
    port: 3000,
    open: true,
  },
}));
