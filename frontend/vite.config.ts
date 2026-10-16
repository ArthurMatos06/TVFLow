import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@tanstack")) return "queries";
            if (id.includes("zustand")) return "state";
            return "vendor";
          }
          if (
            id.includes("/src/components/ui/") ||
            id.includes("\\src\\components\\ui\\")
          ) {
            return "ui";
          }
          return undefined;
        },
      },
    },
  },
});
