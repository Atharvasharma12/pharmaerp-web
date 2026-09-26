import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";

// Read version from package.json at build time
const packageJson = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf-8"));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __APP_ENV__: JSON.stringify(process.env.VERCEL_ENV || "local"),
    __COMMIT_HASH__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || "dev-build"),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
