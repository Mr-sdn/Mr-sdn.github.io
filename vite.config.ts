import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { seo } from "./scripts/seo-plugin";

// base "./" keeps the build working from any folder or sub-path (GitHub Pages, Liara, a plain host…)
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), seo()],
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
  },
});
