import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Runs on its own port (5174), separate from the main student/institution/
// vendor/partner app on 5173 — a genuinely separate application, not a
// route inside the main one, per the original spec.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  build: {
    commonjsOptions: {
      include: [/shared/, /node_modules/],
    },
  },
  optimizeDeps: {
    include: ["shared"],
  },
});
