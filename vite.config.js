import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

const filesToExclude = [
  path.resolve(__dirname, "oneliners"),
  path.resolve(__dirname, "php-server"),
  path.resolve(__dirname, "sanskarApp"),
  path.resolve(__dirname, "mocks"),
  path.resolve(__dirname, "webapp"),
  path.resolve(__dirname, "docs"),
  path.resolve(__dirname, "next-test"),
  path.resolve(__dirname, "node-server"),
  path.resolve(__dirname, "payload-cms-test"),
  path.resolve(__dirname, "npm-express-redis"),
];

const createChunks = (id) => {
  if (id.includes("node_modules")) {
    return "vendor";
  }
  if (id.includes("src/microFrontends")) {
    return "microFrontends";
  }
  // default chunking
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    base: "/",
    root: path.join(__dirname, "src"),
    rollupOptions: {
      external: filesToExclude,
      output: {
        dir: "./dist",
        entryFileNames: "dpresume.js",
        assetFileNames: "dpresume.css",
        manualChunks: createChunks,
      }
    },
  }
});
