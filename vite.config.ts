import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" keeps the build working from any folder or sub-path (GitHub Pages, Liara, a plain host…)
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
  },
});
