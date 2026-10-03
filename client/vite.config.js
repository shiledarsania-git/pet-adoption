// Vite = the tool that runs our React app in development and bundles it for production.
import { defineConfig } from "vite";
// This plugin teaches Vite to understand JSX (HTML-looking code inside JavaScript).
import react from "@vitejs/plugin-react";

// Export the configuration. The dev site opens on http://localhost:5173 by default.
export default defineConfig({
  plugins: [react()],
});
