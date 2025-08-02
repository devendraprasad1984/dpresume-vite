import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    base: "/",
    root: "src",
    rollupOptions: {
      external: [
        "/SanskarApp/**",
        "/oneliners/**",
        "/webapps/**",
        "/php-server/**",
        "/__tests__/**"
      ],
      output: {
        dir: "./dist",
        entryFileNames: "dpresume.js",
        assetFileNames: "dpresume.css",
        manualChunks: undefined,
      }
    },
    optimizeDeps: {
      exclude: [
        "/SanskarApp/**",
        "/oneliners/**",
        "/webapps/**",
        "/php-server/**",
        "/__tests__/**"
      ]
    }
  }
});
