import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["roompeer-logo.png", "favicon.ico"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
      },
      manifest: {
        name: "Roompeer - Find Your Perfect Flatmate",
        short_name: "Roompeer",
        description: "Making it simple, stress-free, and pleasant to locate a compatible flatmate.",
        theme_color: "#1F64ED",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/roompeer-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/roompeer-logo.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/roompeer-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
